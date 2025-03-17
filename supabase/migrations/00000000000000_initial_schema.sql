-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create enum types
create type user_role as enum ('parent', 'teacher');
create type attendance_status as enum ('present', 'absent', 'late');
create type content_type as enum ('text', 'image', 'file', 'video');
create type notification_type as enum ('message', 'announcement', 'attendance', 'activity');

-- Create profiles table (extends Supabase auth.users)
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    email text unique not null,
    full_name text,
    role user_role not null,
    avatar_url text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create students table
create table if not exists public.students (
    id uuid default uuid_generate_v4() primary key,
    first_name text not null,
    last_name text not null,
    date_of_birth date not null,
    grade text not null,
    medical_info text,
    emergency_contact text,
    photo_url text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create parent_student_relations table
create table if not exists public.parent_student_relations (
    id uuid default uuid_generate_v4() primary key,
    parent_id uuid references public.profiles(id) on delete cascade,
    student_id uuid references public.students(id) on delete cascade,
    relation_type text not null,
    is_primary_contact boolean default false,
    created_at timestamptz default now(),
    unique(parent_id, student_id)
);

-- Create attendance table
create table if not exists public.attendance (
    id uuid default uuid_generate_v4() primary key,
    student_id uuid references public.students(id) on delete cascade,
    date date not null,
    status attendance_status not null,
    marked_by uuid references public.profiles(id),
    notes text,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(student_id, date)
);

-- Create content table for shared content
create table if not exists public.content (
    id uuid default uuid_generate_v4() primary key,
    author_id uuid references public.profiles(id) on delete set null,
    title text not null,
    content text not null,
    type content_type not null default 'text',
    status text default 'draft',
    reviewed_by uuid references public.profiles(id),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create group_messages table
create table if not exists public.group_messages (
    id uuid default uuid_generate_v4() primary key,
    sender_id uuid references public.profiles(id) on delete set null,
    title text not null,
    content text not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create group_message_recipients table
create table if not exists public.group_message_recipients (
    id uuid default uuid_generate_v4() primary key,
    message_id uuid references public.group_messages(id) on delete cascade,
    recipient_id uuid references public.profiles(id) on delete cascade,
    is_read boolean default false,
    created_at timestamptz default now(),
    unique(message_id, recipient_id)
);

-- Create direct messages table
create table if not exists public.messages (
    id uuid default uuid_generate_v4() primary key,
    sender_id uuid references public.profiles(id) on delete set null,
    recipient_id uuid references public.profiles(id) on delete cascade,
    content text not null,
    is_read boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create notifications table
create table if not exists public.notifications (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade,
    title text not null,
    message text not null,
    type notification_type not null,
    is_read boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.parent_student_relations enable row level security;
alter table public.attendance enable row level security;
alter table public.content enable row level security;
alter table public.group_messages enable row level security;
alter table public.group_message_recipients enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;

-- Create policies
-- Profiles: Users can read all profiles but only update their own
create policy "Public profiles are viewable by everyone" on public.profiles
    for select using (true);

create policy "Users can update their own profile" on public.profiles
    for update using (auth.uid() = id);

create policy "Users can insert their own profile" on public.profiles
    for insert with check (auth.uid() = id);

-- Students: Teachers can manage all students, parents can only view their related students
create policy "Teachers can manage students" on public.students
    for all using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'teacher'
        )
    );

create policy "Parents can view their related students" on public.students
    for select using (
        exists (
            select 1 from public.parent_student_relations
            where parent_id = auth.uid() and student_id = students.id
        )
    );

-- Parent-Student Relations: Teachers can manage all relations, parents can view their own
create policy "Teachers can manage relations" on public.parent_student_relations
    for all using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'teacher'
        )
    );

create policy "Parents can view their relations" on public.parent_student_relations
    for select using (parent_id = auth.uid());

-- Messages: Users can manage their own messages and read messages sent to them
create policy "Users can manage their own messages" on public.messages
    for all using (auth.uid() = sender_id);

create policy "Users can read messages sent to them" on public.messages
    for select using (auth.uid() = recipient_id);

-- Create functions
-- Function to get all students related to a parent
create or replace function get_parent_students(parent_uuid uuid)
returns setof public.students
language sql
security definer
as $$
    select s.*
    from public.students s
    inner join public.parent_student_relations psr
    on s.id = psr.student_id
    where psr.parent_id = parent_uuid;
$$;

-- Function to get all parents of a student
create or replace function get_student_parents(student_uuid uuid)
returns setof public.profiles
language sql
security definer
as $$
    select p.*
    from public.profiles p
    inner join public.parent_student_relations psr
    on p.id = psr.parent_id
    where psr.student_id = student_uuid;
$$;

-- Triggers for updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create triggers for all tables with updated_at
create trigger update_profiles_updated_at
    before update on public.profiles
    for each row execute function update_updated_at_column();

create trigger update_students_updated_at
    before update on public.students
    for each row execute function update_updated_at_column();

-- Add more similar triggers for other tables

-- Create indexes for better performance
create index if not exists parent_student_relations_parent_id_idx on public.parent_student_relations(parent_id);
create index if not exists parent_student_relations_student_id_idx on public.parent_student_relations(student_id);
create index if not exists attendance_student_id_date_idx on public.attendance(student_id, date);
create index if not exists messages_recipient_id_idx on public.messages(recipient_id);
create index if not exists notifications_user_id_idx on public.notifications(user_id); 