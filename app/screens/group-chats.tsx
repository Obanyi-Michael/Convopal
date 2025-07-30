import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    RefreshControl
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../src/components/CustomButton";
import { useAuth } from "../../src/context/AuthContext";

interface Group {
  id: number;
  name: string;
  description?: string;
  avatarUrl?: string;
  memberCount: number;
  createdBy: {
    id: number;
    fullName: string;
    username: string;
  };
  lastMessage?: {
    content: string;
    sender: {
      fullName: string;
    };
    createdAt: string;
  };
  isActive: boolean;
}

interface GroupItemProps {
  group: Group;
  onPress: (group: Group) => void;
}

const GroupItem: React.FC<GroupItemProps> = ({ group, onPress }) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatLastMessage = (lastMessage?: Group['lastMessage']) => {
    if (!lastMessage) return "No messages yet";
    const date = new Date(lastMessage.createdAt);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return `${lastMessage.sender.fullName}: ${lastMessage.content}`;
    if (diffInHours < 24) return `${lastMessage.sender.fullName}: ${lastMessage.content}`;
    return `${lastMessage.sender.fullName}: ${lastMessage.content}`;
  };

  return (
    <TouchableOpacity style={styles.groupItem} onPress={() => onPress(group)}>
      {group.avatarUrl ? (
        <Image source={{ uri: group.avatarUrl }} style={styles.groupAvatar} />
      ) : (
        <View style={styles.groupIcon}>
          <Text style={styles.groupIconText}>{getInitials(group.name)}</Text>
        </View>
      )}
      <View style={styles.groupInfo}>
        <Text style={styles.groupName}>{group.name}</Text>
        <Text style={styles.groupMembers}>{group.memberCount} members</Text>
        {group.lastMessage && (
          <Text style={styles.lastMessage} numberOfLines={1}>
            {formatLastMessage(group.lastMessage)}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#C6C6C8" />
    </TouchableOpacity>
  );
};

export default function GroupChatsScreen() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, getUserGroups, createGroup } = useAuth();

  useEffect(() => {
    if (user) {
      loadGroups();
    }
  }, [user]);

  const loadGroups = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await getUserGroups();
      if (response.success && response.data) {
        setGroups(response.data);
      } else {
        Alert.alert("Error", response.error || "Failed to load groups");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load groups");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadGroups();
    setRefreshing(false);
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleGroupPress = (group: Group) => {
    // Navigate to group chat detail screen
    router.push({
      pathname: "/screens/group-chat-detail",
      params: { groupId: group.id.toString(), groupName: group.name }
    });
  };

  const handleCreateGroup = () => {
    router.push("/screens/create-group");
  };

  const handleDiscoverGroups = () => {
    Alert.alert("Discover Groups", "This feature is coming soon!");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#07C160" />
          <Text style={styles.loadingText}>Loading groups...</Text>
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
        <Text style={styles.headerTitle}>Group Chats</Text>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateGroup}>
          <Ionicons name="add" size={24} color="#07C160" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <CustomButton
            title="Create New Group"
            onPress={handleCreateGroup}
            variant="primary"
            style={styles.createGroupButton}
          />
          <CustomButton
            title="Discover Groups"
            onPress={handleDiscoverGroups}
            variant="outline"
            style={styles.discoverButton}
          />
        </View>

        {/* My Groups */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Groups ({groups.length})</Text>
          {groups.length > 0 ? (
            groups.map((group) => (
              <GroupItem key={group.id} group={group} onPress={handleGroupPress} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color="#C6C6C8" />
              <Text style={styles.emptyTitle}>No groups yet</Text>
              <Text style={styles.emptySubtitle}>Create your first group to get started</Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity style={styles.quickAction} onPress={handleCreateGroup}>
            <View style={styles.quickActionIcon}>
              <Ionicons name="add-circle" size={24} color="#07C160" />
            </View>
            <View style={styles.quickActionContent}>
              <Text style={styles.quickActionTitle}>Create Group</Text>
              <Text style={styles.quickActionSubtitle}>Start a new group chat</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#C6C6C8" />
          </TouchableOpacity>
          
          <View style={styles.separator} />
          
          <TouchableOpacity style={styles.quickAction} onPress={handleDiscoverGroups}>
            <View style={styles.quickActionIcon}>
              <Ionicons name="compass" size={24} color="#07C160" />
            </View>
            <View style={styles.quickActionContent}>
              <Text style={styles.quickActionTitle}>Discover Groups</Text>
              <Text style={styles.quickActionSubtitle}>Find interesting groups</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#C6C6C8" />
          </TouchableOpacity>
          
          <View style={styles.separator} />
          
          <TouchableOpacity style={styles.quickAction} onPress={() => Alert.alert("Group Invites", "This feature is coming soon!")}>
            <View style={styles.quickActionIcon}>
              <Ionicons name="mail" size={24} color="#07C160" />
            </View>
            <View style={styles.quickActionContent}>
              <Text style={styles.quickActionTitle}>Group Invites</Text>
              <Text style={styles.quickActionSubtitle}>View pending invitations</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#C6C6C8" />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 0.5,
    borderBottomColor: "#C6C6C8",
  },
  backButton: {
    width: 40,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  createButton: {
    width: 40,
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  actionSection: {
    padding: 16,
    gap: 12,
  },
  createGroupButton: {
    marginBottom: 8,
  },
  discoverButton: {
    marginBottom: 8,
  },
  section: {
    backgroundColor: "white",
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  groupItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  groupAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  groupIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  groupIconText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#07C160",
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  groupMembers: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 2,
  },
  lastMessage: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 4,
  },
  quickAction: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  quickActionSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 2,
  },
  separator: {
    height: 0.5,
    backgroundColor: "#C6C6C8",
    marginLeft: 52,
  },
  bottomSpacing: {
    height: 20,
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
  emptyState: {
    alignItems: "center",
    paddingVertical: 30,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginTop: 15,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#8E8E93",
    marginTop: 5,
    textAlign: "center",
    paddingHorizontal: 20,
  },
}); 