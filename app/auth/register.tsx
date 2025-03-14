import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('parent'); // 'parent' or 'teacher'

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // TODO: Implement actual registration
    // For now, just navigate to home
    router.replace('/(tabs)');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <FontAwesome name="user-plus" size={64} color="#4A90E2" />
          <Text style={styles.title}>Create Account</Text>
        </View>
        
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <View style={styles.roleSelector}>
            <TouchableOpacity 
              style={[styles.roleButton, role === 'parent' && styles.roleButtonActive]}
              onPress={() => setRole('parent')}
            >
              <Text style={[styles.roleText, role === 'parent' && styles.roleTextActive]}>Parent</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.roleButton, role === 'teacher' && styles.roleButtonActive]}
              onPress={() => setRole('teacher')}
            >
              <Text style={[styles.roleText, role === 'teacher' && styles.roleTextActive]}>Teacher</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.linkText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  roleSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  roleButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#4A90E2',
  },
  roleText: {
    fontSize: 16,
    color: '#666',
  },
  roleTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#4A90E2',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 14,
  },
}); 