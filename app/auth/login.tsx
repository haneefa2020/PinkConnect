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
  Image,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/Colors';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const maxWidth = isWeb ? 400 : undefined;

  // Clear error when component unmounts or when navigating away
  useEffect(() => {
    return () => {
      clearError();
    };
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text.trim());
    if (error) clearError();
    if (validationError) setValidationError(null);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (error) clearError();
    if (validationError) setValidationError(null);
  };

  const handleNavigation = (route: string) => {
    clearError();
    setValidationError(null);
    router.push(route as any);
  };

  const handleLogin = async () => {
    try {
      // Clear any existing errors
      clearError();
      setValidationError(null);

      // Validate required fields
      if (!email || !password) {
        setValidationError('Please fill in all fields');
        return;
      }

      // Validate email format
      if (!validateEmail(email)) {
        setValidationError('Please enter a valid email address');
        return;
      }

      // Validate password length
      if (password.length < 6) {
        setValidationError('Password must be at least 6 characters long');
        return;
      }

      await signIn(email.trim(), password);
      router.replace('/(tabs)');
    } catch (error) {
      // Error is already handled by AuthContext
      console.error('Login error:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={styles.logoContainer}>
          <Text style={styles.title}>Welcome to PinkConnect</Text>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        <View style={[styles.form]}>
          {(error || validationError) && (
            <Text style={styles.error}>{validationError || error}</Text>
          )}
          
          <TextInput
            style={[
              styles.input,
              validationError && email === '' && { borderColor: '#dc3545' }
            ]}
            placeholder="Email"
            value={email}
            onChangeText={handleEmailChange}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
          
          <TextInput
            style={[
              styles.input,
              validationError && password === '' && { borderColor: '#dc3545' }
            ]}
            placeholder="Password"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry
            editable={!loading}
          />
          
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => handleNavigation('/auth/forgot-password')}
            style={styles.link}
          >
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>
          
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => handleNavigation('/auth/register')}>
              <Text style={styles.registerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Platform.OS === 'web' ? 0 : 30,
  },
  logo: {
    width: Platform.OS === 'web' ? 200 : 100,
    height: Platform.OS === 'web' ? 200 : 100,
  },
  form: {
    alignSelf: 'center',
    width: '100%',
    padding: Platform.OS === 'web' ? 20 : 16,
    gap: 16,
    maxWidth: Platform.OS === 'web' ? 400 : '90%',
  },
  title: {
    fontSize: Platform.OS === 'web' ? 28 : 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.light.tint,
    marginBottom: Platform.OS === 'web' ? 10 : 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: Platform.OS === 'web' ? 15 : 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    width: '100%',
    fontSize: Platform.OS === 'web' ? 16 : 14,
  },
  button: {
    backgroundColor: Colors.light.tint,
    padding: Platform.OS === 'web' ? 15 : 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: Platform.OS === 'web' ? 16 : 15,
    fontWeight: '600',
  },
  error: {
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: Platform.OS === 'web' ? 14 : 13,
  },
  link: {
    alignItems: 'center',
    marginTop: 16,
  },
  linkText: {
    color: Colors.light.tint,
    fontSize: Platform.OS === 'web' ? 14 : 13,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#666',
    fontSize: Platform.OS === 'web' ? 14 : 13,
  },
  registerLink: {
    color: Colors.light.tint,
    fontWeight: '600',
    fontSize: Platform.OS === 'web' ? 14 : 13,
  },
}); 