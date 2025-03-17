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
import { Picker } from '@react-native-picker/picker';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<'parent' | 'teacher'>('parent');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setError] = useState('');
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
    setSelectedRole(newRole);
    if (error) clearError();
  };

  const handleNavigation = (route: string) => {
    clearError();
    router.push(route as any);
  };

  const validateForm = () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
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
      setLoading(true);
      const result = await signUp(email, password, {
        full_name: fullName,
        role: selectedRole,
      });

      if (result?.user) {
        Alert.alert(
          'Registration Successful',
          'Please check your email to confirm your account. Click the confirmation link in the email to complete your registration.',
          [
            {
              text: 'OK',
              onPress: () => {
                clearError();
                router.push('/auth/login');
              },
            },
          ]
        );
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
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
            value={fullName}
            onChangeText={handleInputChange(setFullName)}
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
          
          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>I am a:</Text>
            <View style={styles.roleButtons}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  selectedRole === 'parent' && styles.roleButtonActive,
                ]}
                onPress={() => handleRoleChange('parent')}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    selectedRole === 'parent' && styles.roleButtonTextActive,
                  ]}
                >
                  Parent
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  selectedRole === 'teacher' && styles.roleButtonActive,
                ]}
                onPress={() => handleRoleChange('teacher')}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    selectedRole === 'teacher' && styles.roleButtonTextActive,
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