import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ProfileItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showBadge?: boolean;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: ((value: boolean) => void) | null;
}

const ProfileItem: React.FC<ProfileItemProps> = ({ icon, title, subtitle, onPress, showBadge = false, showSwitch = false, switchValue = false, onSwitchChange = null }) => (
  <TouchableOpacity style={styles.profileItem} onPress={onPress}>
    <View style={styles.itemLeft}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={24} color="#07C160" />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{title}</Text>
        {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <View style={styles.itemRight}>
      {showBadge && <View style={styles.badge} />}
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: "#E5E5EA", true: "#07C160" }}
          thumbColor="#FFFFFF"
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#C6C6C8" />
      )}
    </View>
  </TouchableOpacity>
);

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

export default function MeScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleProfilePress = () => {
    console.log("Profile pressed");
  };

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", style: "destructive", onPress: () => console.log("Logged out") }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Me</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <TouchableOpacity style={styles.profileHeader} onPress={handleProfilePress}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: "https://via.placeholder.com/80" }}
                style={styles.profileAvatar}
              />
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>John Doe</Text>
              <Text style={styles.profileStatus}>Online</Text>
              <Text style={styles.profileId}>ConvoPal ID: johndoe123</Text>
            </View>
            <View style={styles.profileActions}>
              <TouchableOpacity style={styles.qrButton} onPress={() => {
                console.log("QR code pressed");
              }}>
                <Ionicons name="qr-code" size={20} color="#07C160" />
              </TouchableOpacity>
              <Ionicons name="chevron-forward" size={20} color="#C6C6C8" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <SectionHeader title="Account" />
        <View style={styles.section}>
          <ProfileItem
            icon="wallet"
            title="Wallet"
            subtitle="Manage your money"
            onPress={() => console.log("Wallet pressed")}
          />
          <View style={styles.separator} />
          <ProfileItem
            icon="heart"
            title="Favorites"
            subtitle="Your saved items"
            onPress={() => console.log("Favorites pressed")}
          />
          <View style={styles.separator} />
          <ProfileItem
            icon="happy"
            title="Stickers"
            subtitle="Express yourself"
            onPress={() => console.log("Stickers pressed")}
          />
        </View>

        {/* Preferences Section */}
        <SectionHeader title="Preferences" />
        <View style={styles.section}>
          <ProfileItem
            icon="moon"
            title="Dark Mode"
            subtitle="Switch to dark theme"
            showSwitch={true}
            switchValue={darkMode}
            onSwitchChange={setDarkMode}
          />
          <View style={styles.separator} />
          <ProfileItem
            icon="notifications"
            title="Notifications"
            subtitle="Manage notifications"
            showSwitch={true}
            switchValue={notifications}
            onSwitchChange={setNotifications}
          />
          <View style={styles.separator} />
          <ProfileItem
            icon="language"
            title="Language"
            subtitle="English"
            onPress={() => console.log("Language pressed")}
          />
        </View>

        {/* Privacy & Security Section */}
        <SectionHeader title="Privacy & Security" />
        <View style={styles.section}>
          <ProfileItem
            icon="shield-checkmark"
            title="Privacy"
            subtitle="Control your data"
            onPress={() => console.log("Privacy pressed")}
          />
          <View style={styles.separator} />
          <ProfileItem
            icon="lock-closed"
            title="Security"
            subtitle="Password and verification"
            onPress={() => console.log("Security pressed")}
          />
          <View style={styles.separator} />
          <ProfileItem
            icon="eye"
            title="Visibility"
            subtitle="Who can see your profile"
            onPress={() => console.log("Visibility pressed")}
          />
        </View>

        {/* Support Section */}
        <SectionHeader title="Support" />
        <View style={styles.section}>
          <ProfileItem
            icon="help-circle"
            title="Help & Feedback"
            subtitle="Get support"
            onPress={() => console.log("Help pressed")}
          />
          <View style={styles.separator} />
          <ProfileItem
            icon="information-circle"
            title="About ConvoPal"
            subtitle="Version 1.0.0"
            onPress={() => console.log("About pressed")}
          />
        </View>

        {/* Logout Section */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
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
    alignItems: "center",
    paddingVertical: 12,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
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
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#07C160",
    borderWidth: 3,
    borderColor: "white",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: 14,
    color: "#07C160",
    fontWeight: "500",
    marginBottom: 4,
  },
  profileId: {
    fontSize: 14,
    color: "#8E8E93",
  },
  profileActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  qrButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  section: {
    backgroundColor: "white",
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  profileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  itemSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 2,
  },
  itemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
    marginRight: 8,
  },
  logoutSection: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
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
  },
  separator: {
    height: 0.5,
    backgroundColor: "#C6C6C8",
    marginLeft: 68,
  },
  bottomSpacing: {
    height: 20,
  },
}); 