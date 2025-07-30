import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
    ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/context/AuthContext";
import { useTheme } from "../../src/context/ThemeContext";

interface StatItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: string | number;
  label: string;
  color?: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, value, label, color = "#07C160" }) => {
  const { colors } = useTheme();
  
  return (
    <View style={styles.statItem}>
      <View style={[styles.statIcon, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.textPrimary }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
};

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
}) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.borderLight }]} onPress={onPress}>
      <View style={[styles.menuIcon, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>{title}</Text>
        {subtitle && <Text style={[styles.menuSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
      </View>
      <View style={styles.menuRight}>
        {showBadge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeText}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );
};

export default function MeScreen() {
  const { user, getContacts, getUserGroups, logout } = useAuth();
  const { colors } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    friends: 0,
    groups: 0
  });

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load contacts count
      const contactsResponse = await getContacts();
      const friendsCount = contactsResponse.success && contactsResponse.data ? contactsResponse.data.length : 0;
      
      // Load groups count
      const groupsResponse = await getUserGroups();
      const groupsCount = groupsResponse.success && groupsResponse.data ? groupsResponse.data.length : 0;
      
      setStats({
        friends: friendsCount,
        groups: groupsCount
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/(auth)");
          }
        }
      ]
    );
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.success} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={[styles.profileHeader, { 
          backgroundColor: colors.card,
          shadowColor: colors.cardShadow
        }]}>
          <View style={styles.profileInfo}>
            {user.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.defaultAvatar, { backgroundColor: colors.success }]}>
                <Text style={[styles.avatarText, { color: colors.textLight }]}>
                  {getInitials(user.fullName)}
                </Text>
              </View>
            )}
            <View style={styles.profileText}>
              <Text style={[styles.profileName, { color: colors.textPrimary }]}>{user.fullName}</Text>
              <Text style={[styles.profileUsername, { color: colors.textSecondary }]}>@{user.username}</Text>
              <Text style={[styles.profileBio, { color: colors.textSecondary }]}>
                {user.email || "No bio available"}
              </Text>
            </View>
            <TouchableOpacity style={[styles.editButton, { backgroundColor: colors.surfaceLight }]} onPress={handleProfileEdit}>
              <Ionicons name="pencil" size={16} color={colors.success} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section */}
        <View style={[styles.section, { 
          backgroundColor: colors.card,
          shadowColor: colors.cardShadow
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Your Stats</Text>
          {loading ? (
            <View style={styles.statsLoading}>
              <ActivityIndicator size="small" color={colors.success} />
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading stats...</Text>
            </View>
          ) : (
            <View style={styles.statsGrid}>
              <StatItem 
                icon="people" 
                value={stats.friends} 
                label="Friends" 
                color="#4ECDC4"
              />
              <StatItem 
                icon="chatbubbles" 
                value={stats.groups} 
                label="Groups" 
                color="#45B7D1"
              />
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={[styles.section, { 
          backgroundColor: colors.card,
          shadowColor: colors.cardShadow
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction}>
              <Ionicons name="qr-code" size={24} color={colors.success} />
              <Text style={[styles.quickActionText, { color: colors.textPrimary }]}>My QR Code</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Ionicons name="share" size={24} color="#4ECDC4" />
              <Text style={[styles.quickActionText, { color: colors.textPrimary }]}>Invite Friends</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Ionicons name="bookmark" size={24} color="#45B7D1" />
              <Text style={[styles.quickActionText, { color: colors.textPrimary }]}>Saved Messages</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Menu */}
        <View style={[styles.section, { 
          backgroundColor: colors.card,
          shadowColor: colors.cardShadow
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Settings</Text>
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
          <TouchableOpacity style={[styles.logoutButton, { 
            backgroundColor: colors.error,
            shadowColor: colors.error
          }]} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color={colors.textLight} />
            <Text style={[styles.logoutText, { color: colors.textLight }]}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
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
  defaultAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
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
  },
  profileUsername: {
    fontSize: 16,
    marginBottom: 4,
  },
  profileBio: {
    fontSize: 14,
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
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
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  statsLoading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
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
  },
  statLabel: {
    fontSize: 14,
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
  },
  menuSubtitle: {
    fontSize: 14,
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
    borderRadius: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
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