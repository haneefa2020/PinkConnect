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
  phone_number?: string;
  created_at?: string;
  updated_at?: string;
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
          role: userData.role,
          phone_number: userData.phone_number
        });

        // Create profile only if email confirmation is not required
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: email,
            full_name: userData.full_name,
            role: userData.role,
            phone_number: userData.phone_number
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

    try {
      console.log('=== Starting Login Process ===');
      
      // Basic validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      console.log('Auth Request:', { email, password: '********' });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        
        // Handle specific AuthApiError cases
        if ('name' in error && error.name === 'AuthApiError') {
          if (error.message?.includes('Invalid login credentials')) {
            throw new Error('The email or password you entered is incorrect');
          } else if (error.message?.includes('Email not confirmed')) {
            throw new Error('Please verify your email address before signing in');
          } else if (error.message?.includes('rate limit')) {
            throw new Error('Too many login attempts. Please try again in a few minutes');
          } else if (error.status === 400) {
            throw new Error('Invalid login attempt. Please check your credentials');
          } else if (error.status === 422) {
            throw new Error('Invalid email format');
          }
        }
        
        // For any other errors
        throw new Error('Unable to sign in. Please try again later');
      }

      if (!data?.user || !data?.session) {
        throw new Error('Login successful but no user data received');
      }

      console.log('Login successful:', {
        user: {
          id: data.user.id,
          email: data.user.email,
          lastSignIn: data.user.last_sign_in_at
        },
        session: 'Session Created'
      });

      console.log('=== Login Process Completed ===');
      return data;
    } catch (error) {
      console.error('Login process error:', error);
      throw error;
    }
  },

  // Sign out user
  signOut: async () => {
    if (!supabase) return;

    try {
      console.log('=== Starting Logout Process ===');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }

      // Clear any stored session data
      if (Platform.OS === 'web') {
        try {
          localStorage.removeItem('supabase.auth.token');
          localStorage.removeItem('supabase.auth.refreshToken');
        } catch (e) {
          console.warn('Error clearing local storage:', e);
        }
      } else {
        try {
          await AsyncStorage.removeItem('supabase.auth.token');
          await AsyncStorage.removeItem('supabase.auth.refreshToken');
        } catch (e) {
          console.warn('Error clearing async storage:', e);
        }
      }

      console.log('=== Logout Process Completed ===');
    } catch (error) {
      console.error('Logout process error:', error);
      throw error;
    }
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

