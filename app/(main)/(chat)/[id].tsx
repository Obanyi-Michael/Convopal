import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
    RefreshControl,
    Keyboard,
    KeyboardEvent,
    Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../src/context/AuthContext";
import { useTheme } from "../../../src/context/ThemeContext";
import { PerformanceOptimizer } from "../../../src/utils/PerformanceOptimizer";
import { MemoryManager } from "../../../src/utils/MemoryManager";
import { ErrorBoundary } from "../../../src/utils/ErrorBoundary";


interface Message {
  id: number;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE' | 'LOCATION' | 'STICKER';
  isRead: boolean;
  createdAt: string;
  reactions?: { [key: string]: string[] }; // emoji: [usernames]
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
  const { colors } = useTheme();
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getMessageStatus = () => {
    if (isFromMe) {
      return message.isRead ? '✓✓' : '✓';
    }
    return null;
  };

  const handleLongPress = () => {
    Alert.alert(
      "Message Options",
      "What would you like to do?",
      [
        {
          text: "Copy",
          onPress: () => {
            // Copy message to clipboard
            console.log("Copy message:", message.content);
          }
        },
        {
          text: "Reply",
          onPress: () => {
            // Reply to this message
            console.log("Reply to message:", message.id);
          }
        },
        {
          text: "Forward",
          onPress: () => {
            // Forward message
            console.log("Forward message:", message.id);
          }
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };

  return (
    <TouchableOpacity 
      style={[styles.messageContainer, isFromMe ? styles.myMessage : styles.otherMessage]}
      onLongPress={handleLongPress}
      activeOpacity={0.8}
    >
      {!isFromMe && (
        <View style={styles.avatarContainer}>
          {message.sender.avatarUrl ? (
            <Image source={{ uri: message.sender.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.defaultAvatar, { backgroundColor: colors.success }]}>
              <Text style={[styles.avatarText, { color: colors.textLight }]}>{getInitials(message.sender.fullName)}</Text>
            </View>
          )}
        </View>
      )}
      <View style={[styles.messageBubble, isFromMe ? styles.myBubble : styles.otherBubble, 
        isFromMe ? { backgroundColor: colors.success } : { backgroundColor: colors.card }
      ]}>
        <Text style={[styles.messageText, isFromMe ? styles.myMessageText : styles.otherMessageText, 
          isFromMe ? { color: colors.textLight } : { color: colors.textPrimary }
        ]}>
          {message.content}
        </Text>
        <View style={[styles.messageFooter, isFromMe ? styles.myMessageFooter : styles.otherMessageFooter]}>
          <Text style={[styles.timestamp, isFromMe ? styles.myTimestamp : styles.otherTimestamp, 
            isFromMe ? { color: 'rgba(255, 255, 255, 0.7)' } : { color: colors.textSecondary }
          ]}>
            {formatTime(message.createdAt)}
          </Text>
          {getMessageStatus() && (
            <Text style={[styles.messageStatus, { color: 'rgba(255, 255, 255, 0.7)' }]}>
              {getMessageStatus()}
            </Text>
          )}
        </View>
        <MessageReactions 
          reactions={message.reactions}
          onReaction={(emoji) => {
            console.log("Reacted with:", emoji);
            // TODO: Implement reaction API call
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

const MessageReactions: React.FC<{ reactions?: { [key: string]: string[] }, onReaction: (emoji: string) => void }> = ({ reactions, onReaction }) => {
  const { colors } = useTheme();
  
  if (!reactions || Object.keys(reactions).length === 0) return null;
  
  const commonReactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];
  
  return (
    <View style={styles.reactionsContainer}>
      {commonReactions.map((emoji) => {
        const users = reactions[emoji] || [];
        if (users.length === 0) return null;
        
        return (
          <TouchableOpacity 
            key={emoji}
            style={[styles.reactionButton, { backgroundColor: colors.card }]}
            onPress={() => onReaction(emoji)}
          >
            <Text style={styles.reactionEmoji}>{emoji}</Text>
            <Text style={[styles.reactionCount, { color: colors.textSecondary }]}>
              {users.length}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const TypingIndicator: React.FC = () => {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.messageContainer, styles.otherMessage]}>
      <View style={styles.avatarContainer}>
        <View style={[styles.defaultAvatar, { backgroundColor: colors.success }]}>
          <Text style={[styles.avatarText, { color: colors.textLight }]}>
            U
          </Text>
        </View>
      </View>
      <View style={[styles.messageBubble, styles.otherBubble, { backgroundColor: colors.card }]}>
        <View style={styles.typingIndicator}>
          <View style={[styles.typingDot, { backgroundColor: colors.textSecondary }]} />
          <View style={[styles.typingDot, { backgroundColor: colors.textSecondary }]} />
          <View style={[styles.typingDot, { backgroundColor: colors.textSecondary }]} />
        </View>
      </View>
    </View>
  );
};

const QuickReplies: React.FC<{ onSelect: (reply: string) => void }> = ({ onSelect }) => {
  const { colors } = useTheme();
  
  const quickReplies = [
    "Hello! 👋",
    "How are you?",
    "Thanks! 👍",
    "See you later! 👋",
    "That's great! 😊",
    "I'll get back to you",
    "Can't talk now",
    "What's up?"
  ];
  
  return (
    <View style={[styles.quickRepliesContainer, { backgroundColor: colors.card }]}>
      <Text style={[styles.quickRepliesTitle, { color: colors.textSecondary }]}>
        Quick Replies
      </Text>
      <View style={styles.quickRepliesList}>
        {quickReplies.map((reply, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.quickReplyButton, { backgroundColor: colors.background }]}
            onPress={() => onSelect(reply)}
          >
            <Text style={[styles.quickReplyText, { color: colors.textPrimary }]}>
              {reply}
            </Text>
          </TouchableOpacity>
        ))}
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
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const textInputRef = useRef<TextInput>(null);
  const { user, getConversation, sendMessage, markMessagesAsRead } = useAuth();
  const { colors } = useTheme();

  // Initialize performance monitoring
  useEffect(() => {
    const performanceOptimizer = PerformanceOptimizer.getInstance();
    performanceOptimizer.startFrameRateMonitoring();
    
    const memoryManager = MemoryManager.getInstance();
    memoryManager.startMemoryMonitoring();
    
    return () => {
      performanceOptimizer.stopFrameRateMonitoring();
      memoryManager.stopMemoryMonitoring();
    };
  }, []);

  // Get screen dimensions for better keyboard handling
  const screenHeight = Dimensions.get('window').height;
  const isSmallDevice = screenHeight < 700;
  const isMediumDevice = screenHeight >= 700 && screenHeight < 800;
  const isLargeDevice = screenHeight >= 800;

  // Get the username from the contact ID (assuming the ID is the username)
  const otherUsername = id;

  // Polling interval for real-time updates (5 seconds)
  const POLLING_INTERVAL = 5000;
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (user && otherUsername) {
      loadMessages();
      // Mark messages as read when entering the chat
      markMessagesAsRead(otherUsername);
      
      // Start polling for new messages
      startPolling();
    }

    return () => {
      // Clean up polling when component unmounts
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [user, otherUsername]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e: KeyboardEvent) => {
        setKeyboardHeight(e.endCoordinates.height);
        // Scroll to bottom when keyboard appears with different delays for different devices
        const scrollDelay = isSmallDevice ? 50 : isMediumDevice ? 100 : 150;
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, scrollDelay);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      (e: KeyboardEvent) => {
        // Pre-emptively adjust for keyboard
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, [user, otherUsername, isSmallDevice, isMediumDevice]);

  // Add focus listener to refresh messages when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (user && otherUsername) {
        loadMessages(true);
        markMessagesAsRead(otherUsername);
      }
    }, [user, otherUsername])
  );

  const startPolling = () => {
    // Clear any existing polling
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }
    
    // Start new polling interval
    pollingRef.current = setInterval(() => {
      if (user && otherUsername) {
        loadMessages(false); // Don't show loading state for polling updates
      }
    }, POLLING_INTERVAL);
  };

  const loadMessages = useCallback(async (showLoading: boolean = true) => {
    if (!user || !otherUsername) return;
    
    if (showLoading) {
      setLoading(true);
    }
    
    try {
      const response = await getConversation(otherUsername, 0, 50);
      
      if (response.success && response.data) {
        // Use PerformanceOptimizer to defer heavy operations
        PerformanceOptimizer.deferHeavyOperation(() => {
          setMessages(prevMessages => {
            const newMessages = response.data;
            // Check if messages have actually changed
            if (JSON.stringify(prevMessages) !== JSON.stringify(newMessages)) {
              return newMessages;
            }
            return prevMessages;
          });
        });
      } else {
        if (showLoading) {
          Alert.alert("Error", response.error || "Failed to load messages");
        }
      }
    } catch (error) {
      if (showLoading) {
        Alert.alert("Error", "Failed to load messages");
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [user, otherUsername, getConversation]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !otherUsername) return;
    
    setSending(true);
    try {
      const response = await sendMessage(otherUsername, newMessage.trim(), 'TEXT');
      
      if (response.success && response.data) {
        // Add the new message to the list
        setMessages(prev => [...prev, response.data]);
        setNewMessage("");
        // Scroll to bottom
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      } else {
        Alert.alert("Error", response.error || "Failed to send message");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleMorePress = () => {
    Alert.alert(
      "Chat Options",
      "What would you like to do?",
      [
        {
          text: "Search Messages",
          onPress: () => {
            // TODO: Implement message search
            console.log("Search messages");
          }
        },
        {
          text: "View Contact Info",
          onPress: () => {
            // TODO: Show contact details
            console.log("View contact info");
          }
        },
        {
          text: "Clear Chat",
          onPress: () => {
            Alert.alert(
              "Clear Chat",
              "Are you sure you want to clear all messages?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Clear", style: "destructive", onPress: () => {
                  setMessages([]);
                }}
              ]
            );
          }
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };

  const isFromMe = (message: Message) => {
    return message.sender.username === user?.username;
  };

  const handleTextInputFocus = () => {
    // Scroll to bottom when input is focused
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleTextChange = useCallback(
    PerformanceOptimizer.debounce((text: string) => {
      setNewMessage(text);
      // Show quick replies when input is empty
      setShowQuickReplies(text.length === 0);
    }, 100),
    []
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.success} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading messages...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { 
        backgroundColor: colors.card,
        borderBottomColor: colors.borderLight
      }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={[styles.headerAvatar, { backgroundColor: colors.success }]}>
            <Text style={[styles.headerAvatarText, { color: colors.textLight }]}>
              {name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
            </Text>
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.headerName, { color: colors.textPrimary }]}>{name || "User"}</Text>
            <Text style={[styles.headerStatus, { color: colors.success }]}>Online</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton} onPress={handleMorePress}>
          <Ionicons name="ellipsis-vertical" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }: { item: Message }) => (
          <MessageItem message={item} isFromMe={isFromMe(item)} />
        )}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => {
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 50);
        }}
        onLayout={() => {
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 50);
        }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => loadMessages(true)} />
        }
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        {...MemoryManager.getOptimizedListConfig()}
      />

      {/* Input */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={
          Platform.OS === "ios" 
            ? (isSmallDevice ? 60 : isMediumDevice ? 80 : 100)
            : (isSmallDevice ? 0 : isMediumDevice ? 20 : 40)
        }
        style={[styles.inputContainer, { 
          backgroundColor: colors.card,
          borderTopColor: colors.borderLight
        }]}
        enabled={true}
      >
        <View style={[styles.inputWrapper, { 
          backgroundColor: colors.inputBackground,
          borderColor: colors.inputBorder
        }]}>
          <TouchableOpacity style={styles.attachmentButton}>
            <Ionicons name="add-circle-outline" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <TextInput
            ref={textInputRef}
            style={[styles.textInput, { color: colors.textPrimary }]}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={handleTextChange}
            multiline
            maxLength={500}
            placeholderTextColor={colors.inputPlaceholder}
            editable={!sending}
            onFocus={handleTextInputFocus}
            blurOnSubmit={false}
            returnKeyType="default"
          />
          <TouchableOpacity style={styles.emojiButton}>
            <Ionicons name="happy-outline" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sendButton, (!newMessage.trim() || sending) && styles.sendButtonDisabled, 
              { backgroundColor: newMessage.trim() ? colors.success : colors.borderLight }
            ]} 
            onPress={handleSendMessage}
            disabled={!newMessage.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color={colors.textLight} />
            ) : (
              <Ionicons 
                name="send" 
                size={18} 
                color={newMessage.trim() ? colors.textLight : colors.textSecondary} 
              />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      
      {/* Quick Replies */}
      {showQuickReplies && (
        <QuickReplies 
          onSelect={(reply) => {
            setNewMessage(reply);
            setShowQuickReplies(false);
          }}
        />
      )}



    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
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
    justifyContent: "center",
    alignItems: "center",
  },
  headerAvatarText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerText: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: "600",
  },
  headerStatus: {
    fontSize: 12,
  },
  moreButton: {
    marginLeft: 12,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
    paddingBottom: 20,
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
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
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
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
  },
  otherMessageText: {
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 4,
  },
  myMessageFooter: {
    justifyContent: "flex-end",
  },
  otherMessageFooter: {
    justifyContent: "flex-start",
  },
  timestamp: {
    fontSize: 11,
  },
  myTimestamp: {
    textAlign: "right",
  },
  otherTimestamp: {
  },
  messageStatus: {
    fontSize: 11,
    marginLeft: 4,
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 2,
    opacity: 0.6,
  },
  reactionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
    gap: 4,
  },
  reactionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  reactionEmoji: {
    fontSize: 14,
    marginRight: 2,
  },
  reactionCount: {
    fontSize: 10,
    fontWeight: "500",
  },
  quickRepliesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  quickRepliesTitle: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },
  quickRepliesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickReplyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  quickReplyText: {
    fontSize: 14,
  },
  inputContainer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === "ios" ? 12 : 16,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    minHeight: 60,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderWidth: 1,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 44,
    maxHeight: 120,
  },
  attachmentButton: {
    padding: 8,
    marginRight: 4,
  },
  emojiButton: {
    padding: 8,
    marginLeft: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    minHeight: 24,
    paddingVertical: 6,
    paddingHorizontal: 0,
    lineHeight: 20,
    textAlignVertical: "center",
    includeFontPadding: false,
  },
  sendButton: {
    marginLeft: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
}); 