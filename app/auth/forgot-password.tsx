import React, { useState } from 'react';
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
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/Colors';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const isWeb = Platform.OS === 'web';

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (error) clearError();
  };

  const handleNavigation = (route: string) => {
    clearError();
    router.push(route as any);
  };

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      await resetPassword(email);
      Alert.alert(
        'Success',
        'Password reset instructions have been sent to your email.',
        [{ text: 'OK', onPress: () => router.push('/auth/login') }]
      );
    } catch (error) {
      console.error('Reset password error:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={[styles.form]}>
          <Text style={styles.title}>Reset Password</Text>
          
          {error && <Text style={styles.error}>{error}</Text>}
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={handleEmailChange}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
          
          <TouchableOpacity
            style={styles.button}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Reset Password</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => handleNavigation('/auth/login')}
            style={styles.link}
          >
            <Text style={styles.linkText}>Back to Login</Text>
          </TouchableOpacity>
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
    marginBottom: Platform.OS === 'web' ? 20 : 16,
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
}); 