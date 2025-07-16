import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock user data
const userData = {
  name: "John Doe",
  username: "@johndoe",
  avatar: "https://via.placeholder.com/100x100",
  bio: "Passionate about technology and connecting with people",
  friends: 156,
  groups: 12
};

interface StatItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: string | number;
  label: string;
  color?: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, value, label, color = "#07C160" }) => (
  <View style={styles.statItem}>
    <View style={[styles.statIcon, { backgroundColor: `${color}15` }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  color?: string;
  showBadge?: boolean;
  badgeText?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  color = "#07C160",
  showBadge = false,
  badgeText
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={[styles.menuIcon, { backgroundColor: `${color}15` }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <View style={styles.menuContent}>
      <Text style={styles.menuTitle}>{title}</Text>
      {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
    </View>
    <View style={styles.menuRight}>
      {showBadge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeText}</Text>
        </View>
      )}
      <Ionicons name="chevron-forward" size={20} color="#C6C6C8" />
    </View>
  </TouchableOpacity>
);

export default function MeScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleProfileEdit = () => {
    router.push("/screens/profile-edit");
  };

  const handleSettings = () => {
    router.push("/screens/settings");
  };

  const handlePrivacy = () => {
    console.log("Privacy settings pressed");
  };

  const handleHelp = () => {
    console.log("Help pressed");
  };

  const handleAbout = () => {
    console.log("About pressed");
  };

  const handleLogout = () => {
    console.log("Logout pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <Image source={{ uri: userData.avatar }} style={styles.avatar} />
            <View style={styles.profileText}>
              <Text style={styles.profileName}>{userData.name}</Text>
              <Text style={styles.profileUsername}>{userData.username}</Text>
              <Text style={styles.profileBio}>{userData.bio}</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={handleProfileEdit}>
              <Ionicons name="pencil" size={16} color="#07C160" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <StatItem 
              icon="people" 
              value={userData.friends} 
              label="Friends" 
              color="#4ECDC4"
            />
            <StatItem 
              icon="chatbubbles" 
              value={userData.groups} 
              label="Groups" 
              color="#45B7D1"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction}>
              <Ionicons name="qr-code" size={24} color="#07C160" />
              <Text style={styles.quickActionText}>My QR Code</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Ionicons name="share" size={24} color="#4ECDC4" />
              <Text style={styles.quickActionText}>Invite Friends</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Ionicons name="bookmark" size={24} color="#45B7D1" />
              <Text style={styles.quickActionText}>Saved Messages</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.menuList}>
            <MenuItem
              icon="settings"
              title="Settings"
              subtitle="App preferences and configuration"
              onPress={handleSettings}
              color="#8E8E93"
            />
            <MenuItem
              icon="shield-checkmark"
              title="Privacy & Security"
              subtitle="Manage your privacy settings"
              onPress={handlePrivacy}
              color="#FF6B6B"
            />
            <MenuItem
              icon="notifications"
              title="Notifications"
              subtitle="Manage notification preferences"
              onPress={() => setNotificationsEnabled(!notificationsEnabled)}
              color="#FF9500"
              showBadge={!notificationsEnabled}
              badgeText="OFF"
            />
            <MenuItem
              icon="help-circle"
              title="Help & Support"
              subtitle="Get help and contact support"
              onPress={handleHelp}
              color="#007AFF"
            />
            <MenuItem
              icon="information-circle"
              title="About ConvoPal"
              subtitle="App version and information"
              onPress={handleAbout}
              color="#8E8E93"
            />
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color="#FF3B30" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 20,
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profileText: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },
  profileUsername: {
    fontSize: 16,
    color: "#8E8E93",
    marginBottom: 4,
  },
  profileBio: {
    fontSize: 14,
    color: "#8E8E93",
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  levelSection: {
    width: "100%",
    marginTop: 16,
  },
  levelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  levelText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  experienceText: {
    fontSize: 14,
    color: "#8E8E93",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E5EA",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#07C160",
    borderRadius: 4,
  },
  section: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  statItem: {
    alignItems: "center",
    marginVertical: 8,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  statLabel: {
    fontSize: 14,
    color: "#8E8E93",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  quickAction: {
    alignItems: "center",
    width: "30%",
    paddingVertical: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: "#000",
    marginTop: 8,
    textAlign: "center",
    fontWeight: "500",
  },
  menuList: {
    marginTop: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5EA",
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  menuSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 2,
  },
  menuRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  badge: {
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    shadowColor: "#FF3B30",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
}); 