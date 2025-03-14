import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
}

interface Message {
  id: string;
  sender: string;
  message: string;
  time: string;
  isMe: boolean;
}

// Mock data - replace with actual data from backend
const mockChats: Chat[] = [
  {
    id: '1',
    name: 'Teacher Sarah',
    lastMessage: 'Upcoming parent-teacher meeting',
    time: '2h ago',
    unread: 2,
  },
  {
    id: '2',
    name: 'School Admin',
    lastMessage: 'School holiday notice',
    time: '1d ago',
    unread: 0,
  },
  {
    id: '3',
    name: 'Parent Group',
    lastMessage: 'Sports day preparation',
    time: '2d ago',
    unread: 5,
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'Teacher Sarah',
    message: 'Hello! I wanted to discuss the upcoming parent-teacher meeting.',
    time: '10:30 AM',
    isMe: false,
  },
  {
    id: '2',
    sender: 'Me',
    message: 'Yes, I would love to discuss that.',
    time: '10:31 AM',
    isMe: true,
  },
];

export default function MessagesScreen() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'Me',
      message: message.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => setSelectedChat(item)}
    >
      <View style={styles.chatAvatar}>
        <FontAwesome name="user-circle" size={40} color="#4A90E2" />
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        <View style={styles.chatFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isMe ? styles.messageRight : styles.messageLeft
    ]}>
      <View style={[
        styles.messageBubble,
        item.isMe ? styles.messageBubbleRight : styles.messageBubbleLeft
      ]}>
        <Text style={styles.messageText}>{item.message}</Text>
        <Text style={styles.messageTime}>{item.time}</Text>
      </View>
    </View>
  );

  if (!selectedChat) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
        </View>
        <FlatList
          data={mockChats}
          renderItem={renderChatItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.chatList}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelectedChat(null)}
        >
          <FontAwesome name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{selectedChat.name}</Text>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessage}
        >
          <FontAwesome name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chatList: {
    padding: 15,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  chatAvatar: {
    marginRight: 15,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  chatTime: {
    fontSize: 12,
    color: '#999',
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginRight: 10,
  },
  unreadBadge: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  messageList: {
    padding: 15,
  },
  messageContainer: {
    marginBottom: 15,
    maxWidth: '80%',
  },
  messageLeft: {
    alignSelf: 'flex-start',
  },
  messageRight: {
    alignSelf: 'flex-end',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 15,
  },
  messageBubbleLeft: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 5,
  },
  messageBubbleRight: {
    backgroundColor: '#4A90E2',
    borderBottomRightRadius: 5,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'flex-end',
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
  sendButton: {
    backgroundColor: '#4A90E2',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 