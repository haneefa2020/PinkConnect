import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/Colors';
import { UserData } from '../../lib/supabase';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp, loading, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'parent' | 'teacher'>('parent');
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const maxWidth = isWeb ? 400 : undefined;

  // Clear error when component unmounts or when navigating away
  useEffect(() => {
    return () => {
      clearError();
    };
  }, []);

  const handleInputChange = (setter: (text: string) => void) => (text: string) => {
    setter(text);
    if (error) clearError();
  };

  const handleRoleChange = (newRole: 'parent' | 'teacher') => {
    setRole(newRole);
    if (error) clearError();
  };

  const handleNavigation = (route: string) => {
    clearError();
    router.push(route as any);
  };

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const userData: Partial<UserData> = {
        full_name: name,
        email,
        role,
      };

      const result = await signUp(email, password, userData);
      
      if (result && 'user' in result) {
        Alert.alert(
          'Success',
          'Registration successful! Please check your email to verify your account before logging in.',
          [{ text: 'OK', onPress: () => handleNavigation('/auth/login') }]
        );
      } else {
        Alert.alert(
          'Error',
          'Registration failed. Please try again.'
        );
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error?.message?.includes('User already registered')) {
        errorMessage = 'This email is already registered. Please try logging in.';
      } else if (error?.message?.includes('Failed to create user profile')) {
        errorMessage = 'Failed to create user profile. Please try again or contact support.';
      } else if (error?.message?.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (error?.message?.includes('Password')) {
        errorMessage = error.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Registration Error', errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.form, { maxWidth }]}>
          <Text style={styles.title}>Create Account</Text>
          
          {error && <Text style={styles.error}>{error}</Text>}
          
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={handleInputChange(setName)}
            editable={!loading}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={handleInputChange(setEmail)}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={handleInputChange(setPassword)}
            secureTextEntry
            editable={!loading}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={handleInputChange(setConfirmPassword)}
            secureTextEntry
            editable={!loading}
          />

          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>I am a:</Text>
            <View style={styles.roleButtons}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === 'parent' && styles.roleButtonActive,
                ]}
                onPress={() => handleRoleChange('parent')}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    role === 'parent' && styles.roleButtonTextActive,
                  ]}
                >
                  Parent
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === 'teacher' && styles.roleButtonActive,
                ]}
                onPress={() => handleRoleChange('teacher')}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    role === 'teacher' && styles.roleButtonTextActive,
                  ]}
                >
                  Teacher
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => handleNavigation('/auth/login')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    gap: 15,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.light.tint,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    width: '100%',
  },
  roleContainer: {
    marginVertical: 10,
    width: '100%',
  },
  roleLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  roleButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.tint,
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: Colors.light.tint,
  },
  roleButtonText: {
    color: Colors.light.tint,
    fontSize: 16,
    fontWeight: '600',
  },
  roleButtonTextActive: {
    color: '#fff',
  },
  button: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 10,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#666',
  },
  loginLink: {
    color: Colors.light.tint,
    fontWeight: '600',
  },
}); 