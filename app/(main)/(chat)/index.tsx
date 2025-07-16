import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Type definitions
interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  avatar: any;
  isOfficial?: boolean;
}

// Mock data for chats
const mockChats: Chat[] = [
  {
    id: "1",
    name: "ConvoPal Team",
    lastMessage: "Welcome to Convopal! Here are some features you can quic...",
    time: "5:23",
    unreadCount: 0,
    avatar: require("../../../assets/images/Convopal_logo.jpg"),
    isOfficial: true,
  },
];

interface ChatItemProps {
  item: Chat;
  onPress: (chat: Chat) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ item, onPress }) => (
  <TouchableOpacity style={styles.chatItem} onPress={() => onPress(item)}>
    <Image source={item.avatar} style={styles.avatar} />
    <View style={styles.chatInfo}>
      <View style={styles.chatHeader}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.chatTime}>{item.time}</Text>
      </View>
      <View style={styles.chatFooter}>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

const InviteFriendsItem = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.inviteItem} onPress={onPress}>
    <Text style={styles.inviteText}>Invite friends to register</Text>
    <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
  </TouchableOpacity>
);

export default function ChatsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [chats] = useState<Chat[]>(mockChats);

  const handleChatPress = (chat: Chat) => {
    // Navigate to chat screen
    console.log("Chat pressed:", chat.name);
  };

  const handleInvitePress = () => {
    // Navigate to invite screen
    console.log("Invite friends pressed");
  };

  const handleAddPress = () => {
    // Add new chat or contact
    console.log("Add pressed");
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
          <Ionicons name="add" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#8E8E93" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#8E8E93"
          />
        </View>
      </View>

      {/* Chat List */}
      <View style={styles.chatList}>
        {/* ConvoPal Team Chat */}
        {filteredChats.map((chat) => (
          <ChatItem key={chat.id} item={chat} onPress={handleChatPress} />
        ))}
        
        <View style={styles.separator} />
        
        {/* Invite Friends Section */}
        <InviteFriendsItem onPress={handleInvitePress} />
        
        <View style={styles.separator} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    flexDirection: "column",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 20,
    gap: 12,
    width: "100%",
  },
  searchBar: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addButton: {
    padding: 1,
    alignSelf: "flex-end",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#000",
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "white",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  chatTime: {
    fontSize: 12,
    color: "#8E8E93",
  },
  chatFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: "#8E8E93",
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  inviteItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "white",
  },
  inviteText: {
    fontSize: 16,
    color: "#000",
  },
  separator: {
    height: 0.5,
    backgroundColor: "#C6C6C8",
  },
});
