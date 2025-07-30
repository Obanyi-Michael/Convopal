import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import {
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    ActivityIndicator,
    RefreshControl
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../src/context/AuthContext";
import { Colors } from "../../../src/constants/Colors";

interface Message {
  id: number;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE' | 'LOCATION' | 'STICKER';
  isRead: boolean;
  createdAt: string;
  sender: {
    id: number;
    fullName: string;
    username: string;
    avatarUrl?: string;
  };
  receiver: {
    id: number;
    fullName: string;
    username: string;
    avatarUrl?: string;
  };
}

interface MessageItemProps {
  message: Message;
  isFromMe: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isFromMe }) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <View style={[styles.messageContainer, isFromMe ? styles.myMessage : styles.otherMessage]}>
      {!isFromMe && (
        <View style={styles.avatarContainer}>
          {message.sender.avatarUrl ? (
            <Image source={{ uri: message.sender.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.defaultAvatar}>
              <Text style={styles.avatarText}>{getInitials(message.sender.fullName)}</Text>
            </View>
          )}
        </View>
      )}
      <View style={[styles.messageBubble, isFromMe ? styles.myBubble : styles.otherBubble]}>
        <Text style={[styles.messageText, isFromMe ? styles.myMessageText : styles.otherMessageText]}>
          {message.content}
        </Text>
        <Text style={[styles.timestamp, isFromMe ? styles.myTimestamp : styles.otherTimestamp]}>
          {formatTime(message.createdAt)}
        </Text>
      </View>
    </View>
  );
};

export default function ChatDetailScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const { user, getConversation, sendMessage, markMessagesAsRead } = useAuth();

  // Get the username from the contact ID (assuming the ID is the username)
  const otherUsername = id;

  useEffect(() => {
    if (user && otherUsername) {
      loadMessages();
      // Mark messages as read when entering the chat
      markMessagesAsRead(otherUsername);
    }
  }, [user, otherUsername]);

  const loadMessages = async () => {
    if (!user || !otherUsername) return;
    
    setLoading(true);
    try {
      console.log('Loading messages for conversation with:', otherUsername);
      const response = await getConversation(otherUsername, 0, 50);
      console.log('Load messages response:', response);
      
      if (response.success && response.data) {
        setMessages(response.data);
      } else {
        console.error('Load messages failed:', response.error);
        Alert.alert("Error", response.error || "Failed to load messages");
      }
    } catch (error) {
      console.error('Load messages error:', error);
      Alert.alert("Error", "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !otherUsername) return;
    
    setSending(true);
    try {
      console.log('Sending message to:', otherUsername);
      console.log('Message content:', newMessage.trim());
      
      const response = await sendMessage(otherUsername, newMessage.trim(), 'TEXT');
      console.log('Send message response:', response);
      
      if (response.success && response.data) {
        // Add the new message to the list
        setMessages(prev => [...prev, response.data]);
        setNewMessage("");
        // Scroll to bottom
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      } else {
        console.error('Send message failed:', response.error);
        Alert.alert("Error", response.error || "Failed to send message");
      }
    } catch (error) {
      console.error('Send message error:', error);
      Alert.alert("Error", "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleMorePress = () => {
    // Show chat options
    console.log("More options pressed");
  };

  const isFromMe = (message: Message) => {
    return message.sender.username === user?.username;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#07C160" />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>
              {name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
            </Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerName}>{name || "User"}</Text>
            <Text style={styles.headerStatus}>Online</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton} onPress={handleMorePress}>
          <Ionicons name="ellipsis-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MessageItem message={item} isFromMe={isFromMe(item)} />}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadMessages} />
        }
      />

      {/* Input */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={500}
            placeholderTextColor="#8E8E93"
            editable={!sending}
          />
          <TouchableOpacity 
            style={[styles.sendButton, (!newMessage.trim() || sending) && styles.sendButtonDisabled]} 
            onPress={handleSendMessage}
            disabled={!newMessage.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color={Colors.backgroundLight} />
            ) : (
              <Ionicons 
                name="send" 
                size={18} 
                color={newMessage.trim() ? Colors.backgroundLight : Colors.textSecondary} 
              />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 0.5,
    borderBottomColor: "#C6C6C8",
  },
  backButton: {
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#07C160", // Placeholder for avatar background
    justifyContent: "center",
    alignItems: "center",
  },
  headerAvatarText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerText: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  headerStatus: {
    fontSize: 12,
    color: "#07C160",
  },
  moreButton: {
    marginLeft: 12,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginVertical: 4,
  },
  myMessage: {
    justifyContent: "flex-end",
  },
  otherMessage: {
    justifyContent: "flex-start",
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  defaultAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#07C160",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  myBubble: {
    backgroundColor: "#07C160",
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: "white",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: "white",
  },
  otherMessageText: {
    color: "#000",
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  myTimestamp: {
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "right",
  },
  otherTimestamp: {
    color: "#8E8E93",
  },
  inputContainer: {
    backgroundColor: Colors.backgroundLight,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: Colors.backgroundLight,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    maxHeight: 100,
    paddingVertical: 6,
    paddingHorizontal: 0,
    lineHeight: 20,
  },
  sendButton: {
    marginLeft: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.borderLight,
    shadowOpacity: 0,
    elevation: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#8E8E93",
  },
}); 