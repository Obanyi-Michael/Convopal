import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isFromMe: boolean;
  avatar?: any;
}

// Mock messages data
const mockMessages: Message[] = [
  {
    id: "1",
    text: "Welcome to ConvoPal! How can I help you today?",
    timestamp: "10:30 AM",
    isFromMe: false,
    avatar: require("../../../assets/images/Convopal_logo.jpg"),
  },
  {
    id: "2",
    text: "Hi! I'm excited to try out the new features!",
    timestamp: "10:32 AM",
    isFromMe: true,
  },
  {
    id: "3",
    text: "Great! You can start by exploring the different tabs. The Chat tab shows your conversations, Contacts helps you manage your friends, Discover has fun features, and Me is your profile.",
    timestamp: "10:33 AM",
    isFromMe: false,
    avatar: require("../../../assets/images/Convopal_logo.jpg"),
  },
  {
    id: "4",
    text: "That sounds amazing! Can I customize my profile?",
    timestamp: "10:35 AM",
    isFromMe: true,
  },
  {
    id: "5",
    text: "Absolutely! Go to the Me tab and tap on your profile card to edit your information, change your avatar, and customize your settings.",
    timestamp: "10:36 AM",
    isFromMe: false,
    avatar: require("../../../assets/images/Convopal_logo.jpg"),
  },
];

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => (
  <View style={[styles.messageContainer, message.isFromMe ? styles.myMessage : styles.otherMessage]}>
    {!message.isFromMe && message.avatar && (
      <Image source={message.avatar} style={styles.avatar} />
    )}
    <View style={[styles.messageBubble, message.isFromMe ? styles.myBubble : styles.otherBubble]}>
      <Text style={[styles.messageText, message.isFromMe ? styles.myMessageText : styles.otherMessageText]}>
        {message.text}
      </Text>
      <Text style={[styles.timestamp, message.isFromMe ? styles.myTimestamp : styles.otherTimestamp]}>
        {message.timestamp}
      </Text>
    </View>
  </View>
);

export default function ChatDetailScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFromMe: true,
      };
      setMessages(prev => [...prev, message]);
      setNewMessage("");
      
      // Simulate reply after 1 second
      setTimeout(() => {
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          text: "Thanks for your message! I'll get back to you soon.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isFromMe: false,
          avatar: require("../../../assets/images/Convopal_logo.jpg"),
        };
        setMessages(prev => [...prev, reply]);
      }, 1000);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleMorePress = () => {
    // Show chat options
    console.log("More options pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Image 
            source={require("../../../assets/images/Convopal_logo.jpg")} 
            style={styles.headerAvatar} 
          />
          <View style={styles.headerText}>
            <Text style={styles.headerName}>{name || "ConvoPal Team"}</Text>
            <Text style={styles.headerStatus}>Online</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton} onPress={handleMorePress}>
          <Ionicons name="ellipsis-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageItem message={item} />}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
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
          />
          <TouchableOpacity 
            style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]} 
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={newMessage.trim() ? "#07C160" : "#C6C6C8"} 
            />
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
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    alignSelf: "flex-end",
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
    backgroundColor: "white",
    borderTopWidth: 0.5,
    borderTopColor: "#C6C6C8",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#F2F2F7",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    maxHeight: 100,
    paddingVertical: 4,
  },
  sendButton: {
    marginLeft: 8,
    padding: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
}); 