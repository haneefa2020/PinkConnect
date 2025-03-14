import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface Student {
  id: string;
  name: string;
  grade: string;
  status: 'present' | 'absent' | 'late';
  date: string;
}

// Mock data - replace with actual data from backend
const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    grade: 'Grade 1',
    status: 'present',
    date: '2024-03-13',
  },
  {
    id: '2',
    name: 'Bob Smith',
    grade: 'Grade 2',
    status: 'absent',
    date: '2024-03-13',
  },
  {
    id: '3',
    name: 'Charlie Brown',
    grade: 'Grade 1',
    status: 'late',
    date: '2024-03-13',
  },
];

export default function AttendanceScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    // Initialize students after component mounts
    setStudents(mockStudents);
  }, []);

  const updateAttendance = (studentId: string, newStatus: Student['status']) => {
    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, status: newStatus }
        : student
    ));
  };

  const getStatusColor = (status: Student['status']) => {
    switch (status) {
      case 'present':
        return '#4CAF50';
      case 'absent':
        return '#F44336';
      case 'late':
        return '#FFC107';
      default:
        return '#999';
    }
  };

  const renderStudentItem = ({ item }: { item: Student }) => (
    <View style={styles.studentCard}>
      <View style={styles.studentInfo}>
        <View style={styles.avatarContainer}>
          <FontAwesome name="user-circle" size={40} color="#4A90E2" />
        </View>
        <View style={styles.studentDetails}>
          <Text style={styles.studentName}>{item.name}</Text>
          <Text style={styles.studentGrade}>{item.grade}</Text>
        </View>
      </View>
      
      <View style={styles.statusContainer}>
        <TouchableOpacity
          style={[
            styles.statusButton,
            item.status === 'present' && styles.statusButtonActive,
            { backgroundColor: item.status === 'present' ? '#4CAF50' : '#f5f5f5' }
          ]}
          onPress={() => updateAttendance(item.id, 'present')}
        >
          <Text style={[
            styles.statusText,
            item.status === 'present' && styles.statusTextActive
          ]}>Present</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.statusButton,
            item.status === 'late' && styles.statusButtonActive,
            { backgroundColor: item.status === 'late' ? '#FFC107' : '#f5f5f5' }
          ]}
          onPress={() => updateAttendance(item.id, 'late')}
        >
          <Text style={[
            styles.statusText,
            item.status === 'late' && styles.statusTextActive
          ]}>Late</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.statusButton,
            item.status === 'absent' && styles.statusButtonActive,
            { backgroundColor: item.status === 'absent' ? '#F44336' : '#f5f5f5' }
          ]}
          onPress={() => updateAttendance(item.id, 'absent')}
        >
          <Text style={[
            styles.statusText,
            item.status === 'absent' && styles.statusTextActive
          ]}>Absent</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Attendance</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => {
            // TODO: Implement date picker
            Alert.alert('Date Picker', 'Date picker functionality will be implemented');
          }}
        >
          <FontAwesome name="calendar" size={20} color="#4A90E2" />
          <Text style={styles.dateText}>
            {selectedDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>
            {students.filter(s => s.status === 'present').length}
          </Text>
          <Text style={styles.summaryLabel}>Present</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>
            {students.filter(s => s.status === 'late').length}
          </Text>
          <Text style={styles.summaryLabel}>Late</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>
            {students.filter(s => s.status === 'absent').length}
          </Text>
          <Text style={styles.summaryLabel}>Absent</Text>
        </View>
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
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  dateText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4A90E2',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  studentList: {
    padding: 15,
  },
  studentCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarContainer: {
    marginRight: 15,
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  studentGrade: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  statusButton: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusButtonActive: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  statusTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
}); 