import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image, TextInput, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface Post {
  id: string;
  author: string;
  authorRole: 'student' | 'teacher' | 'admin';
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Mock data - replace with actual data from backend
const mockPosts: Post[] = [
  {
    id: '1',
    author: 'Alice Johnson',
    authorRole: 'student',
    content: 'Had a great time at the science fair today! Learned so much about renewable energy.',
    images: ['https://example.com/science-fair.jpg'],
    likes: 12,
    comments: 3,
    timestamp: '2h ago',
    status: 'approved',
  },
  {
    id: '2',
    author: 'Teacher Sarah',
    authorRole: 'teacher',
    content: 'Important announcement: Parent-teacher meeting next week. Please check your emails for details.',
    likes: 8,
    comments: 5,
    timestamp: '1d ago',
    status: 'approved',
  },
  {
    id: '3',
    author: 'Bob Smith',
    authorRole: 'student',
    content: 'Check out my art project!',
    images: ['https://example.com/art-project.jpg'],
    likes: 15,
    comments: 7,
    timestamp: '2d ago',
    status: 'pending',
  },
];

export default function ContentScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [isTeacher, setIsTeacher] = useState(false);

  useEffect(() => {
    // Initialize posts and teacher status after component mounts
    setPosts(mockPosts);
    setIsTeacher(true); // TODO: Get from user role
  }, []);

  const handleCreatePost = () => {
    if (!newPost.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      author: 'Current User',
      authorRole: isTeacher ? 'teacher' : 'student',
      content: newPost.trim(),
      likes: 0,
      comments: 0,
      timestamp: 'Just now',
      status: isTeacher ? 'approved' : 'pending',
    };

    setPosts([post, ...posts]);
    setNewPost('');
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const handleApprove = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, status: 'approved' }
        : post
    ));
  };

  const handleReject = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, status: 'rejected' }
        : post
    ));
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.authorInfo}>
          <FontAwesome name="user-circle" size={40} color="#4A90E2" />
          <View style={styles.authorDetails}>
            <Text style={styles.authorName}>{item.author}</Text>
            <Text style={styles.authorRole}>{item.authorRole}</Text>
          </View>
        </View>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>

      <Text style={styles.content}>{item.content}</Text>

      {item.images && item.images.length > 0 && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.images[0] }}
            style={styles.postImage}
            resizeMode="cover"
          />
        </View>
      )}

      <View style={styles.postFooter}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLike(item.id)}
        >
          <FontAwesome name="heart" size={20} color="#666" />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome name="comment" size={20} color="#666" />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>

        {isTeacher && item.status === 'pending' && (
          <View style={styles.moderationButtons}>
            <TouchableOpacity
              style={[styles.modButton, styles.approveButton]}
              onPress={() => handleApprove(item.id)}
            >
              <Text style={styles.modButtonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modButton, styles.rejectButton]}
              onPress={() => handleReject(item.id)}
            >
              <Text style={styles.modButtonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>School Content</Text>
      </View>

      <View style={styles.createPostContainer}>
        <TextInput
          style={styles.input}
          placeholder="Share something..."
          value={newPost}
          onChangeText={setNewPost}
          multiline
        />
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreatePost}
        >
          <FontAwesome name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.postList}
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
  createPostContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postList: {
    padding: 15,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorDetails: {
    marginLeft: 10,
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  authorRole: {
    fontSize: 12,
    color: '#666',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  content: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  imageContainer: {
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  moderationButtons: {
    flexDirection: 'row',
    marginLeft: 'auto',
    gap: 10,
  },
  modButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  modButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
}); 