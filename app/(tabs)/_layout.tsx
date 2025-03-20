import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';

export default function TabLayout() {
  const { isDarkMode, toggleTheme, colorScheme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors[colorScheme].background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: Colors[colorScheme].text,
        headerTitle: () => (
          <View style={styles.headerContainer}>
            <View style={styles.schoolInfo}>
              <View style={[styles.iconContainer, { backgroundColor: Colors[colorScheme].tint + '20' }]}>
                <FontAwesome name="graduation-cap" size={24} color={Colors[colorScheme].tint} />
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.schoolName, { color: Colors[colorScheme].tint }]}>
                  PinkTowerMontessori
                </Text>
                <Text style={[styles.schoolTagline, { color: Colors[colorScheme].text }]}>
                  Nurturing Minds, Shaping Futures
                </Text>
              </View>
            </View>
          </View>
        ),
        headerRight: () => (
          Platform.OS === 'web' && (
            <TouchableOpacity
              onPress={toggleTheme}
              style={[styles.themeButton, { backgroundColor: Colors[colorScheme].tint + '20' }]}
            >
              <FontAwesome
                name={isDarkMode ? 'sun-o' : 'moon-o'}
                size={20}
                color={Colors[colorScheme].tint}
              />
            </TouchableOpacity>
          )
        ),
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#000000' : Colors[colorScheme].background,
          borderTopColor: Colors[colorScheme].tabIconDefault + '20',
          borderTopWidth: 1,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color }) => <FontAwesome name="comments" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: 'Attendance',
          tabBarIcon: ({ color }) => <FontAwesome name="calendar-check-o" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profiles"
        options={{
          title: 'Profiles',
          tabBarIcon: ({ color }) => <FontAwesome name="users" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="content"
        options={{
          title: 'Content',
          tabBarIcon: ({ color }) => <FontAwesome name="newspaper-o" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Admin',
          tabBarIcon: ({ color }) => <FontAwesome name="shield" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <FontAwesome name="cog" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  schoolInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flexDirection: 'column',
  },
  schoolName: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'web' ? 'Arial' : undefined,
    marginBottom: 2,
  },
  schoolTagline: {
    fontSize: 12,
    opacity: 0.8,
    fontFamily: Platform.OS === 'web' ? 'Arial' : undefined,
  },
  themeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
});
