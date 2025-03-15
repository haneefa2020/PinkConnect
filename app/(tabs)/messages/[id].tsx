import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Keyboard, Platform, View, StyleSheet, KeyboardAvoidingView, TextInput, TouchableOpacity, Animated } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { Colors } from '../../../constants/Colors';
import { useTheme } from '../../../context/ThemeContext';
import { FontAwesome } from '@expo/vector-icons';

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: boolean;
}

// Mock data for demonstration
const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    lastMessage: 'How is Tommy doing in class?',
    time: '10:30 AM',
    unread: true,
  },
  {
    id: '2',
    name: 'Mike Peterson',
    lastMessage: 'Thank you for the update',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: '3',
    name: 'Emma Williams',
    lastMessage: 'Will Lisa be attending tomorrow?',
    time: 'Yesterday',
    unread: true,
  },
];

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { colorScheme } = useTheme();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [message, setMessage] = useState('');
  const inputRef = useRef<TextInput>(null);
  const sendButtonScale = useRef(new Animated.Value(1)).current;

  const currentColors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    // Set conversation name in header
    navigation.setOptions({
      headerTitle: mockConversations.find((c: Conversation) => c.id === id)?.name || 'Conversation',
    });
  }, [id, navigation]);

  const animateSendButton = () => {
    Animated.sequence([
      Animated.timing(sendButtonScale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(sendButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSend = () => {
    if (message.trim()) {
      animateSendButton();
      // TODO: Implement send message logic here
      setMessage('');
      if (inputRef.current) {
        inputRef.current.clear();
      }
    }
  };

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.keyboardView]}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <View style={[
          styles.messagesContainer,
          Platform.OS === 'android' && { marginBottom: keyboardHeight }
        ]}>
          {/* TODO: Add message list component */}
        </View>
        
        <View style={[
          styles.inputContainer,
          {
            borderTopColor: currentColors.border,
            backgroundColor: currentColors.background
          },
          Platform.OS === 'android' && {
            position: 'absolute',
            bottom: keyboardHeight,
            left: 0,
            right: 0,
          }
        ]}>
          <TouchableOpacity
            style={styles.emojiButton}
            onPress={() => {
              // TODO: Implement emoji picker
            }}
          >
            <FontAwesome 
              name="smile-o" 
              size={24} 
              color={currentColors.face}
            />
          </TouchableOpacity>

          <TextInput
            ref={inputRef}
            style={[
              styles.input,
              { 
                color: currentColors.text,
                backgroundColor: currentColors.tabIconDefault + '20',
              }
            ]}
            placeholder="Type a message..."
            placeholderTextColor={currentColors.tabIconDefault}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={1000}
            autoCapitalize="sentences"
            autoCorrect
            autoComplete="off"
          />

          <Animated.View style={{ transform: [{ scale: sendButtonScale }] }}>
            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: message.trim() ? currentColors.tint : currentColors.tabIconDefault }
              ]}
              onPress={handleSend}
              disabled={!message.trim()}
            >
              <FontAwesome 
                name="send" 
                size={16} 
                color={currentColors.background}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  inputContainer: {
    borderTopWidth: 1,
    padding: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  emojiButton: {
    padding: 8,
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 16,
    minHeight: 40,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
}); 