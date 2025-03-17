import 'react-native-url-polyfill/auto';
import 'cross-fetch/polyfill';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Replace these with your Supabase project URL and anon key
const supabaseUrl = 'https://uanicwkcohardrzhqggm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhbmljd2tjb2hhcmRyemhxZ2dtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMDMyNTQsImV4cCI6MjA1NzY3OTI1NH0.sNW3zlyO6tctRtYuEm__Rx6RMVRazKGgjBwQfKXG88Q';

// Create a dummy storage for SSR
const dummyStorage = {
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
};

const getStorage = () => {
  if (Platform.OS === 'web') {
    try {
      if (typeof window !== 'undefined') {
        return window.localStorage;
      }
    } catch (error) {
      console.warn('localStorage not available:', error);
    }
  }
  return AsyncStorage;
};

const createSupabaseClient = () => {
  // Use dummy storage during SSR
  const storage = typeof window === 'undefined' ? dummyStorage : getStorage();

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage,
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
  full_name: string | null;
  role: 'parent' | 'teacher';
  avatar_url?: string;
}

// Auth helper functions
export const auth = {
  // Sign up new user
  signUp: async (email: string, password: string, userData: Partial<UserData>) => {
    if (!supabase) return null;

    try {
      console.log('=== Starting Signup Process ===');
      console.log('Auth Request Data:', {
        email,
        password: '********' // masked for security
      });

      // Basic signup without metadata first
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        console.error('Auth signup error:', signUpError);
        // Check for rate limit
        if (signUpError.message?.includes('rate limit')) {
          throw new Error('You have exceeded the signup limit. Please try again in an hour.');
        }
        throw signUpError;
      }

      console.log('Auth Response:', {
        user: authData?.user ? {
          id: authData.user.id,
          email: authData.user.email,
          emailConfirmed: authData.user.confirmed_at,
          createdAt: authData.user.created_at
        } : null,
        session: authData?.session ? 'Session Created' : 'No Session (Email confirmation required)'
      });

      if (!authData.user) {
        throw new Error('No user data returned from auth signup');
      }

      // Don't try to create profile immediately if email confirmation is required
      if (authData.session === null) {
        console.log('Email confirmation required - Profile creation deferred');
        return { user: authData.user };
      }

      try {
        console.log('Profile Creation Request:', {
          id: authData.user.id,
          email: email,
          full_name: userData.full_name,
          role: userData.role
        });

        // Create profile only if email confirmation is not required
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: email,
            full_name: userData.full_name,
            role: userData.role
          })
          .single();

        if (profileError) {
          console.error('Profile creation error:', profileError);
          return { user: authData.user }; // Return success even if profile creation fails
        }

        console.log('Profile created successfully');
        console.log('=== Signup Process Completed ===');

        return { user: authData.user };
      } catch (profileError) {
        console.error('Profile creation exception:', profileError);
        return { user: authData.user }; // Return success even if profile creation fails
      }
    } catch (error) {
      console.error('Signup process error:', error);
      throw error;
    }
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

