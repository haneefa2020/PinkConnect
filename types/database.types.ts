export type UserRole = 'parent' | 'teacher';
export type AttendanceStatus = 'present' | 'absent' | 'late';
export type ContentType = 'text' | 'image' | 'file' | 'video';
export type NotificationType = 'message' | 'announcement' | 'attendance' | 'activity';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  grade: string;
  medical_info: string | null;
  emergency_contact: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ParentStudentRelation {
  id: string;
  parent_id: string;
  student_id: string;
  relation_type: string;
  is_primary_contact: boolean;
  created_at: string;
}

export interface Attendance {
  id: string;
  student_id: string;
  date: string;
  status: AttendanceStatus;
  marked_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Content {
  id: string;
  author_id: string | null;
  title: string;
  content: string;
  type: ContentType;
  status: string;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface GroupMessage {
  id: string;
  sender_id: string | null;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface GroupMessageRecipient {
  id: string;
  message_id: string;
  recipient_id: string;
  is_read: boolean;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string | null;
  recipient_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      students: {
        Row: Student;
        Insert: Omit<Student, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Student, 'id' | 'created_at' | 'updated_at'>>;
      };
      parent_student_relations: {
        Row: ParentStudentRelation;
        Insert: Omit<ParentStudentRelation, 'id' | 'created_at'>;
        Update: Partial<Omit<ParentStudentRelation, 'id' | 'created_at'>>;
      };
      attendance: {
        Row: Attendance;
        Insert: Omit<Attendance, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Attendance, 'id' | 'created_at' | 'updated_at'>>;
      };
      content: {
        Row: Content;
        Insert: Omit<Content, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Content, 'id' | 'created_at' | 'updated_at'>>;
      };
      group_messages: {
        Row: GroupMessage;
        Insert: Omit<GroupMessage, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<GroupMessage, 'id' | 'created_at' | 'updated_at'>>;
      };
      group_message_recipients: {
        Row: GroupMessageRecipient;
        Insert: Omit<GroupMessageRecipient, 'id' | 'created_at'>;
        Update: Partial<Omit<GroupMessageRecipient, 'id' | 'created_at'>>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Message, 'id' | 'created_at' | 'updated_at'>>;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Notification, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
    Functions: {
      get_parent_students: {
        Args: { parent_uuid: string };
        Returns: Student[];
      };
      get_student_parents: {
        Args: { student_uuid: string };
        Returns: Profile[];
      };
    };
  };
} 