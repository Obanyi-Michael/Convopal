import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../src/components/CustomButton";

interface Group {
  id: string;
  name: string;
  memberCount: number;
  avatar?: any;
  isOfficial?: boolean;
}

// Mock groups data
const mockGroups: Group[] = [
  {
    id: "1",
    name: "ConvoPal Community",
    memberCount: 1250,
    avatar: require("../../assets/images/Convopal_logo.jpg"),
    isOfficial: true,
  },
  {
    id: "2",
    name: "Tech Enthusiasts",
    memberCount: 89,
  },
  {
    id: "3",
    name: "Travel Buddies",
    memberCount: 156,
  },
];

interface GroupItemProps {
  group: Group;
  onPress: (group: Group) => void;
}

const GroupItem: React.FC<GroupItemProps> = ({ group, onPress }) => (
  <TouchableOpacity style={styles.groupItem} onPress={() => onPress(group)}>
    {group.avatar ? (
      <Image source={group.avatar} style={styles.groupAvatar} />
    ) : (
      <View style={styles.groupIcon}>
        <Ionicons name="people" size={24} color="#07C160" />
      </View>
    )}
    <View style={styles.groupInfo}>
      <Text style={styles.groupName}>{group.name}</Text>
      <Text style={styles.groupMembers}>{group.memberCount} members</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#C6C6C8" />
  </TouchableOpacity>
);

export default function GroupChatsScreen() {
  const [groups] = useState<Group[]>(mockGroups);

  const handleBackPress = () => {
    router.back();
  };

  const handleGroupPress = (group: Group) => {
    Alert.alert("Join Group", `Joining ${group.name}...`);
  };

  const handleCreateGroup = () => {
    Alert.alert("Create Group", "Opening group creation...");
  };

  const handleDiscoverGroups = () => {
    Alert.alert("Discover Groups", "Opening group discovery...");
  };

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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
          <Text style={styles.sectionTitle}>My Groups</Text>
          {groups.map((group) => (
            <GroupItem key={group.id} group={group} onPress={handleGroupPress} />
          ))}
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
          
          <TouchableOpacity style={styles.quickAction} onPress={() => Alert.alert("Group Invites", "Checking for group invites...")}>
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
}); 