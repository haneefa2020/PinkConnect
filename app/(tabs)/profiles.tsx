import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface Student {
  id: string;
  name: string;
  grade: string;
  photo: string | null;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address: string;
}

// Mock data - replace with actual data from backend
const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    grade: 'Grade 1',
    photo: null,
    parentName: 'John Johnson',
    parentEmail: 'john@example.com',
    parentPhone: '+1 234 567 8900',
    address: '123 Main St, City, Country',
  },
  {
    id: '2',
    name: 'Bob Smith',
    grade: 'Grade 2',
    photo: null,
    parentName: 'Jane Smith',
    parentEmail: 'jane@example.com',
    parentPhone: '+1 234 567 8901',
    address: '456 Oak St, City, Country',
  },
  {
    id: '3',
    name: 'Charlie Brown',
    grade: 'Grade 1',
    photo: null,
    parentName: 'Mary Brown',
    parentEmail: 'mary@example.com',
    parentPhone: '+1 234 567 8902',
    address: '789 Pine St, City, Country',
  },
];

export default function ProfilesScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    // Initialize students after component mounts
    setStudents(mockStudents);
  }, []);

  const handleEditProfile = (student: Student) => {
    // TODO: Implement profile editing
    Alert.alert('Edit Profile', 'Profile editing functionality will be implemented');
  };

  const handleUploadPhoto = (student: Student) => {
    // TODO: Implement photo upload
    Alert.alert('Upload Photo', 'Photo upload functionality will be implemented');
  };

  const renderStudentItem = ({ item }: { item: Student }) => (
    <TouchableOpacity
      style={styles.studentCard}
      onPress={() => setSelectedStudent(item)}
    >
      <View style={styles.studentHeader}>
        <View style={styles.photoContainer}>
          {item.photo ? (
            <Image
              source={{ uri: item.photo }}
              style={styles.studentPhoto}
            />
          ) : (
            <FontAwesome name="user-circle" size={60} color="#4A90E2" />
          )}
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => handleUploadPhoto(item)}
          >
            <FontAwesome name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{item.name}</Text>
          <Text style={styles.studentGrade}>{item.grade}</Text>
        </View>
      </View>

      <View style={styles.parentInfo}>
        <View style={styles.infoRow}>
          <FontAwesome name="user" size={16} color="#666" />
          <Text style={styles.infoText}>{item.parentName}</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome name="envelope" size={16} color="#666" />
          <Text style={styles.infoText}>{item.parentEmail}</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome name="phone" size={16} color="#666" />
          <Text style={styles.infoText}>{item.parentPhone}</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome name="map-marker" size={16} color="#666" />
          <Text style={styles.infoText}>{item.address}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => handleEditProfile(item)}
      >
        <FontAwesome name="edit" size={16} color="#4A90E2" />
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Student Profiles</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            // TODO: Implement add student
            Alert.alert('Add Student', 'Add student functionality will be implemented');
          }}
        >
          <FontAwesome name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={students}
        renderItem={renderStudentItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.studentList}
      />
    </View>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  studentList: {
    padding: 15,
  },
  studentCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  photoContainer: {
    position: 'relative',
    marginRight: 15,
  },
  studentPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  uploadButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  studentGrade: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  parentInfo: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  editButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
}); 