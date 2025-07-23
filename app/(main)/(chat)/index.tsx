import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GroupChatCard } from "../../../src/components/GroupChatCard";

// Type definitions
interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  avatar: any;
  isOfficial?: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
  status?: 'online' | 'offline' | 'typing';
  isGroup?: boolean;
  members?: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
}

// Mock data for chats
const mockChats: Chat[] = [
  {
    id: "1",
    name: "ConvoPal Team",
    lastMessage: "Welcome to Convopal! Here are some features you can explore...",
    time: "5:23",
    unreadCount: 0,
    avatar: require("../../../assets/images/Convopal_logo.jpg"),
    isOfficial: true,
    isPinned: true,
    status: 'online',
  },
  {
    id: "group1",
    name: "Family Group 👨‍👩‍👧‍👦",
    lastMessage: "Mom: Don't forget about dinner tomorrow!",
    time: "4:45",
    unreadCount: 5,
    avatar: "group",
    isGroup: true,
    isPinned: true,
    members: [
      { id: "mom", name: "Mom", avatar: "https://via.placeholder.com/50" },
      { id: "dad", name: "Dad", avatar: "https://via.placeholder.com/50" },
      { id: "sister", name: "Sarah", avatar: "https://via.placeholder.com/50" },
      { id: "me", name: "Me", avatar: "https://via.placeholder.com/50" },
    ],
  },
  {
    id: "2",
    name: "John Smith",
    lastMessage: "Hey, how are you doing?",
    time: "2:15",
    unreadCount: 3,
    avatar: "https://via.placeholder.com/50",
    status: 'typing',
  },
  {
    id: "3",
    name: "Alice Johnson",
    lastMessage: "Thanks for the help! 😊",
    time: "Yesterday",
    unreadCount: 0,
    avatar: "https://via.placeholder.com/50",
    status: 'online',
  },
  {
    id: "group2",
    name: "Work Team 💼",
    lastMessage: "Alice: Meeting rescheduled to 3 PM",
    time: "1:45",
    unreadCount: 2,
    avatar: "group",
    isGroup: true,
    isOfficial: true,
    isMuted: true,
    members: [
      { id: "alice", name: "Alice", avatar: "https://via.placeholder.com/50" },
      { id: "bob", name: "Bob", avatar: "https://via.placeholder.com/50" },
      { id: "carol", name: "Carol", avatar: "https://via.placeholder.com/50" },
      { id: "david", name: "David", avatar: "https://via.placeholder.com/50" },
      { id: "emma", name: "Emma", avatar: "https://via.placeholder.com/50" },
    ],
  },
  {
    id: "group3",
    name: "Weekend Plans 🎉",
    lastMessage: "Sarah: Who's up for hiking this Saturday?",
    time: "12:30",
    unreadCount: 8,
    avatar: "group",
    isGroup: true,
    members: [
      { id: "sarah", name: "Sarah", avatar: "https://via.placeholder.com/50" },
      { id: "mike", name: "Mike", avatar: "https://via.placeholder.com/50" },
      { id: "jenny", name: "Jenny", avatar: "https://via.placeholder.com/50" },
      { id: "alex", name: "Alex", avatar: "https://via.placeholder.com/50" },
    ],
  },
];

interface ChatItemProps {
  item: Chat;
  onPress: (chat: Chat) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ item, onPress }) => {
  if (item.isGroup && item.members) {
    return (
      <GroupChatCard
        id={item.id}
        name={item.name}
        lastMessage={item.lastMessage}
        time={item.time}
        unreadCount={item.unreadCount}
        members={item.members}
        isOfficial={item.isOfficial}
        isPinned={item.isPinned}
        isMuted={item.isMuted}
        onPress={() => onPress(item)}
      />
    );
  }

  return (
    <TouchableOpacity style={styles.chatItem} onPress={() => onPress(item)}>
      <View style={styles.avatarContainer}>
      <Image source={item.avatar} style={styles.avatar} />
      {item.status === 'online' && <View style={styles.onlineIndicator} />}
      {item.status === 'typing' && (
        <View style={styles.typingIndicator}>
          <Text style={styles.typingText}>typing...</Text>
        </View>
      )}
    </View>
    
    <View style={styles.chatInfo}>
      <View style={styles.chatHeader}>
        <View style={styles.nameContainer}>
          <Text style={[styles.chatName, item.isPinned && styles.pinnedChat]}>
            {item.name}
          </Text>
          {item.isPinned && <Ionicons name="pin" size={12} color="#07C160" />}
          {item.isMuted && <Ionicons name="volume-mute" size={12} color="#8E8E93" />}
        </View>
        <Text style={styles.chatTime}>{item.time}</Text>
      </View>
      
      <View style={styles.chatFooter}>
        <Text style={[styles.lastMessage, item.isMuted && styles.mutedMessage]} numberOfLines={1}>
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

const EmptyState = () => (
  <View style={styles.emptyState}>
    <View style={styles.emptyIcon}>
      <Ionicons name="chatbubbles-outline" size={64} color="#C6C6C8" />
    </View>
    <Text style={styles.emptyTitle}>No chats yet</Text>
    <Text style={styles.emptySubtitle}>Start a conversation with friends and family</Text>
    <TouchableOpacity style={styles.emptyButton}>
      <Text style={styles.emptyButtonText}>Start Chatting</Text>
    </TouchableOpacity>
  </View>
);

export default function ChatsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [refreshing, setRefreshing] = useState(false);

  const handleChatPress = (chat: Chat) => {
    router.push({
      pathname: "/(main)/(chat)/[id]",
      params: { id: chat.id, name: chat.name }
    });
  };

  const handleAddPress = () => {
    console.log("Add new chat pressed");
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderChatItem = ({ item }: { item: Chat }) => (
    <ChatItem item={item} onPress={handleChatPress} />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#8E8E93" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search chats"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#8E8E93"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Chat List */}
      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        style={styles.chatList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={EmptyState}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddPress}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 20,
    width: "100%",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
  },
  addButton: {
    padding: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 16,
    backgroundColor: "#F2F2F7",
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
  avatarContainer: {
    position: "relative",
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#34C759",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  typingIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    borderRadius: 5,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  typingText: {
    color: "white",
    fontSize: 10,
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
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  pinnedChat: {
    marginLeft: 4,
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
  mutedMessage: {
    color: "#8E8E93",
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
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F2F2F7",
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: "#07C160",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  emptyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  separator: {
    height: 0.5,
    backgroundColor: "#C6C6C8",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#07C160",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
