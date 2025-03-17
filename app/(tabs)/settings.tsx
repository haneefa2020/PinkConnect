import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { colorScheme, isDarkMode, toggleTheme } = useTheme();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/auth/login');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>Appearance</Text>
        <TouchableOpacity
          style={[styles.settingButton, { backgroundColor: Colors[colorScheme].tint + '20' }]}
          onPress={toggleTheme}
        >
          <View style={styles.settingContent}>
            <FontAwesome
              name={isDarkMode ? 'sun-o' : 'moon-o'}
              size={20}
              color={Colors[colorScheme].tint}
              style={styles.settingIcon}
            />
            <Text style={[styles.settingText, { color: Colors[colorScheme].text }]}>
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </Text>
          </View>
          <FontAwesome
            name="chevron-right"
            size={16}
            color={Colors[colorScheme].text}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>Account</Text>
        <TouchableOpacity
          style={[styles.logoutButton]}
          onPress={handleLogout}
        >
          <View style={styles.settingContent}>
            <FontAwesome
              name="sign-out"
              size={20}
              color="#fff"
              style={styles.settingIcon}
            />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Platform.OS === 'web' ? 15 : 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: Platform.OS === 'web' ? 16 : 14,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    padding: Platform.OS === 'web' ? 15 : 12,
    borderRadius: 8,
    marginTop: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: Platform.OS === 'web' ? 16 : 14,
    fontWeight: '600',
  },
}); 