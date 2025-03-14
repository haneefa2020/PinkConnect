import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface AdminStats {
  totalStudents: number;
  presentToday: number;
  pendingPosts: number;
  unreadMessages: number;
}

// Mock data - replace with actual data from backend
const mockStats: AdminStats = {
  totalStudents: 150,
  presentToday: 142,
  pendingPosts: 5,
  unreadMessages: 8,
};

type FontAwesomeIconName = keyof typeof FontAwesome.glyphMap;

export default function AdminScreen() {
  const [stats, setStats] = useState<AdminStats>({
    totalStudents: 0,
    presentToday: 0,
    pendingPosts: 0,
    unreadMessages: 0,
  });

  useEffect(() => {
    // Initialize stats after component mounts
    setStats(mockStats);
  }, []);

  const handleAction = (action: string) => {
    // TODO: Implement admin actions
    Alert.alert('Admin Action', `${action} functionality will be implemented`);
  };

  const renderStatCard = (title: string, value: number, icon: FontAwesomeIconName, color: string) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color }]}>
        <FontAwesome name={icon} size={24} color="#fff" />
      </View>
      <View style={styles.statInfo}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  const renderActionButton = (title: string, icon: FontAwesomeIconName, action: string) => (
    <TouchableOpacity
      style={styles.actionButton}
      onPress={() => handleAction(action)}
    >
      <FontAwesome name={icon} size={24} color="#4A90E2" />
      <Text style={styles.actionButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
      </View>

      <View style={styles.statsContainer}>
        {renderStatCard('Total Students', stats.totalStudents, 'users', '#4A90E2')}
        {renderStatCard('Present Today', stats.presentToday, 'check-circle', '#4CAF50')}
        {renderStatCard('Pending Posts', stats.pendingPosts, 'file-text', '#FFC107')}
        {renderStatCard('Unread Messages', stats.unreadMessages, 'envelope', '#F44336')}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          {renderActionButton('Manage Students', 'user-plus', 'manage_students')}
          {renderActionButton('Attendance', 'calendar-check-o', 'attendance')}
          {renderActionButton('Content Moderation', 'check-square-o', 'moderation')}
          {renderActionButton('Messages', 'comments', 'messages')}
          {renderActionButton('Reports', 'bar-chart', 'reports')}
          {renderActionButton('Settings', 'cog', 'settings')}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <FontAwesome name="user-plus" size={20} color="#4A90E2" />
            <View style={styles.activityInfo}>
              <Text style={styles.activityText}>New student registration</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <FontAwesome name="file-text" size={20} color="#FFC107" />
            <View style={styles.activityInfo}>
              <Text style={styles.activityText}>New post pending approval</Text>
              <Text style={styles.activityTime}>3 hours ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <FontAwesome name="envelope" size={20} color="#F44336" />
            <View style={styles.activityInfo}>
              <Text style={styles.activityText}>New message from parent</Text>
              <Text style={styles.activityTime}>4 hours ago</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    gap: 15,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 15,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  actionButton: {
    width: '45%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  actionButtonText: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  activityList: {
    gap: 15,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  activityInfo: {
    marginLeft: 10,
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#333',
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
}); 