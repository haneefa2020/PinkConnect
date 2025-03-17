import 'react-native-url-polyfill/auto';
import 'cross-fetch/polyfill';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Replace these with your Supabase project URL and anon key
const supabaseUrl = 'https://kuobcumlyabdghabnfnu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1b2JjdW1seWFiZGdoYWJuZm51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwMjQ2NDksImV4cCI6MjA1NzYwMDY0OX0.XQlt3KCtgln744l9M2CfhG8f46e_tX0vQvsbkwyWeyA';

const createSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: Platform.OS === 'web' ? localStorage : AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    global: {
      fetch: fetch,
    },
  });
};

export const supabase = createSupabaseClient();

// Types for user data
export interface UserData {
  id: string;
  email: string;
  name: string | null;
  role: 'parent' | 'teacher';
  avatar_url?: string;
}

// Auth helper functions
export const auth = {
  // Sign up new user
  signUp: async (email: string, password: string, userData: Partial<UserData>) => {
    if (!supabase) return null;

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    if (signUpError) throw signUpError;

    // Create user profile in profiles table
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            email: authData.user.email,
            name: userData.name,
            role: userData.role,
          },
        ]);

      if (profileError) throw profileError;
    }

    return authData;
  },

  // Sign in user
  signIn: async (email: string, password: string) => {
    if (!supabase) return null;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Sign out user
  signOut: async () => {
    if (!supabase) return;

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Reset password
  resetPassword: async (email: string) => {
    if (!supabase) return;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'pinkconnect://reset-password',
    });
    if (error) throw error;
  },

  // Update password
  updatePassword: async (newPassword: string) => {
    if (!supabase) return;

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  },

  // Get current session
  getSession: async () => {
    if (!supabase) return null;

    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  // Get current user
  getCurrentUser: async () => {
    if (!supabase) return null;

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },
}; 