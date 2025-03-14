import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function HomeScreen() {
  // Mock data - replace with actual data from backend
  const user = {
    name: 'John Doe',
    role: 'parent',
    children: [
      { name: 'Alice', grade: 'Grade 1', attendance: 'present' },
      { name: 'Bob', grade: 'Grade 2', attendance: 'absent' }
    ]
  };

  const recentMessages = [
    { sender: 'Teacher Sarah', message: 'Upcoming parent-teacher meeting', time: '2h ago' },
    { sender: 'School Admin', message: 'School holiday notice', time: '1d ago' }
  ];

  const upcomingEvents = [
    { title: 'Parent-Teacher Meeting', date: 'Mar 20, 2024', time: '2:00 PM' },
    { title: 'School Sports Day', date: 'Mar 25, 2024', time: '9:00 AM' }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.nameText}>{user.name}</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <FontAwesome name="user-circle" size={40} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Children's Status</Text>
        {user.children.map((child, index) => (
          <View key={index} style={styles.childCard}>
            <View style={styles.childInfo}>
              <FontAwesome name="child" size={24} color="#4A90E2" />
              <View style={styles.childDetails}>
                <Text style={styles.childName}>{child.name}</Text>
                <Text style={styles.childGrade}>{child.grade}</Text>
              </View>
            </View>
            <View style={[
              styles.attendanceBadge,
              { backgroundColor: child.attendance === 'present' ? '#4CAF50' : '#F44336' }
            ]}>
              <Text style={styles.attendanceText}>
                {child.attendance.charAt(0).toUpperCase() + child.attendance.slice(1)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Messages</Text>
        {recentMessages.map((message, index) => (
          <TouchableOpacity key={index} style={styles.messageCard}>
            <View style={styles.messageContent}>
              <Text style={styles.messageSender}>{message.sender}</Text>
              <Text style={styles.messageText}>{message.message}</Text>
            </View>
            <Text style={styles.messageTime}>{message.time}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        {upcomingEvents.map((event, index) => (
          <View key={index} style={styles.eventCard}>
            <View style={styles.eventIcon}>
              <FontAwesome name="calendar" size={20} color="#4A90E2" />
            </View>
            <View style={styles.eventDetails}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDateTime}>{event.date} at {event.time}</Text>
            </View>
          </View>
        ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileButton: {
    padding: 5,
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  childCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  childInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  childDetails: {
    marginLeft: 10,
  },
  childName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  childGrade: {
    fontSize: 14,
    color: '#666',
  },
  attendanceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  attendanceText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  messageCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  messageContent: {
    flex: 1,
  },
  messageSender: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  messageText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
    marginLeft: 10,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  eventDateTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});
