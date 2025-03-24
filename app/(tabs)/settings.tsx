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
    if (Platform.OS === 'web') {
      // For web, don't show the Alert dialog
      try {
        await signOut();
        router.replace('/auth/login');
      } catch (error) {
        console.error('Logout error:', error);
        Alert.alert('Error', 'Failed to logout. Please try again.');
      }
    } else {
      // For mobile platforms, show the confirmation dialog
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
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>Appearance</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors[colorScheme].tint + '20' }]}
            onPress={toggleTheme}
          >
            <View style={styles.buttonContent}>
              <FontAwesome
                name={isDarkMode ? 'sun-o' : 'moon-o'}
                size={20}
                color={Colors[colorScheme].tint}
                style={styles.buttonIcon}
              />
              <Text style={[styles.buttonText, { color: Colors[colorScheme].text }]}>
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>Account</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#dc3545' }]}
            onPress={handleLogout}
            accessibilityLabel="Logout"
            accessibilityRole="button"
            accessibilityHint="Double tap to log out of your account"
          >
            <View style={styles.buttonContent}>
              <FontAwesome
                name="sign-out"
                size={20}
                color="#fff"
                style={styles.buttonIcon}
              />
              <Text style={[styles.buttonText, { color: '#fff' }]}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Platform.OS === 'web' ? 20 : 16,
    maxWidth: Platform.OS === 'web' ? 600 : undefined,
    width: '100%',
    alignSelf: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
  },
  button: {
    padding: Platform.OS === 'web' ? 15 : 12,
    borderRadius: 8,
    width: '100%',
    marginTop: 8,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as const } : {}),
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
    width: 20,
  },
  buttonText: {
    fontSize: Platform.OS === 'web' ? 16 : 15,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 