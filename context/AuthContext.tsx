import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, auth, UserData } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Platform } from 'react-native';

interface AuthContextType {
  user: UserData | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, userData: Partial<UserData>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web') {
      setLoading(false);
      return;
    }

    checkUser();
    const { data: { subscription } } = supabase?.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
      }
    }) || { data: { subscription: null } };

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const session = await auth.getSession();
      setSession(session);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const value = {
    user,
    session,
    loading,
    error,
    signUp: async (email: string, password: string, userData: Partial<UserData>) => {
      try {
        setLoading(true);
        setError(null);
        await auth.signUp(email, password, userData);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Sign up failed');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    signIn: async (email: string, password: string) => {
      try {
        setLoading(true);
        setError(null);
        await auth.signIn(email, password);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Invalid credentials');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    signOut: async () => {
      try {
        setLoading(true);
        setError(null);
        await auth.signOut();
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Sign out failed');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    resetPassword: async (email: string) => {
      try {
        setLoading(true);
        setError(null);
        await auth.resetPassword(email);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Password reset failed');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    updatePassword: async (newPassword: string) => {
      try {
        setLoading(true);
        setError(null);
        await auth.updatePassword(newPassword);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Password update failed');
        throw error;
      } finally {
        setLoading(false);
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 