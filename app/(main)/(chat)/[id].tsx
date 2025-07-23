import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MessageBubble, Message } from "../../../src/components/MessageBubble";
import { MessageInput } from "../../../src/components/MessageInput";

// Mock messages data
const mockMessages: Message[] = [
  {
    id: "1",
    text: "Welcome to ConvoPal! How can I help you today?",
    timestamp: "10:30 AM",
    isFromMe: false,
    avatar: require("../../../assets/images/Convopal_logo.jpg"),
    type: "text",
    isRead: true,
  },
  {
    id: "2",
    text: "Hi! I'm excited to try out the new features!",
    timestamp: "10:32 AM",
    isFromMe: true,
    type: "text",
    isRead: true,
  },
  {
    id: "3",
    text: "Great! You can start by exploring the different tabs. The Chat tab shows your conversations, Contacts helps you manage your friends, Discover has fun features, and Me is your profile.",
    timestamp: "10:33 AM",
    isFromMe: false,
    avatar: require("../../../assets/images/Convopal_logo.jpg"),
    type: "text",
    isRead: true,
  },
  {
    id: "4",
    text: "That sounds amazing! Can I customize my profile?",
    timestamp: "10:35 AM",
    isFromMe: true,
    type: "text",
    isRead: true,
  },
  {
    id: "5",
    text: "Absolutely! Go to the Me tab and tap on your profile card to edit your information, change your avatar, and customize your settings.",
    timestamp: "10:36 AM",
    isFromMe: false,
    avatar: require("../../../assets/images/Convopal_logo.jpg"),
    type: "text",
    isRead: true,
  },
  {
    id: "6",
    imageUrl: "https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Sample+Image",
    timestamp: "10:38 AM",
    isFromMe: false,
    avatar: require("../../../assets/images/Convopal_logo.jpg"),
    type: "image",
    isRead: true,
  },
  {
    id: "7",
    voiceDuration: 15,
    timestamp: "10:40 AM",
    isFromMe: true,
    type: "voice",
    isRead: false,
  },
  {
    id: "8",
    text: "Welcome John!",
    timestamp: "10:42 AM",
    type: "system",
    isRead: true,
  },
];



export default function ChatDetailScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const handleSendMessage = (text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isFromMe: true,
      type: "text",
      isRead: false,
    };
    setMessages(prev => [...prev, message]);
    
    // Simulate reply after 1 second
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! I'll get back to you soon.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFromMe: false,
        type: "text",
        isRead: true,
        avatar: require("../../../assets/images/Convopal_logo.jpg"),
      };
      setMessages(prev => [...prev, reply]);
    }, 1000);
  };

  const handleSendImage = (imageUri: string) => {
    const message: Message = {
      id: Date.now().toString(),
      imageUrl: imageUri,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isFromMe: true,
      type: "image",
      isRead: false,
    };
    setMessages(prev => [...prev, message]);
  };

  const handleSendVoice = (voiceUri: string, duration: number) => {
    const message: Message = {
      id: Date.now().toString(),
      voiceDuration: duration,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isFromMe: true,
      type: "voice",
      isRead: false,
    };
    setMessages(prev => [...prev, message]);
  };

  const handleSendLocation = (location: { latitude: number; longitude: number; address: string }) => {
    const message: Message = {
      id: Date.now().toString(),
      location: location,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isFromMe: true,
      type: "location",
      isRead: false,
    };
    setMessages(prev => [...prev, message]);
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
        renderItem={({ item }) => (
          <MessageBubble 
            message={item}
            onLongPress={() => console.log("Long press on message:", item.id)}
            onImagePress={() => console.log("Image pressed:", item.imageUrl)}
            onVoicePress={() => console.log("Voice pressed:", item.id)}
            onLocationPress={() => console.log("Location pressed:", item.location)}
          />
        )}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Input */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <MessageInput
          onSendMessage={handleSendMessage}
          onSendImage={handleSendImage}
          onSendVoice={handleSendVoice}
          onSendLocation={handleSendLocation}
        />
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

}); 