import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: ((value: boolean) => void) | null;
  showBadge?: boolean;
  iconColor?: string;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  showSwitch = false, 
  switchValue = false, 
  onSwitchChange = null,
  showBadge = false,
  iconColor = "#07C160"
}) => (
  <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
    <View style={styles.itemLeft}>
      <View style={[styles.iconContainer, { backgroundColor: "#F0F0F0" }]}>
        <Ionicons name={icon} size={24} color={iconColor} />
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

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoReply, setAutoReply] = useState(false);
  const [readReceipts, setReadReceipts] = useState(true);

  const handleBackPress = () => {
    router.back();
  };

  const handlePrivacyPress = () => {
    Alert.alert("Privacy", "Opening privacy settings...");
  };

  const handleSecurityPress = () => {
    Alert.alert("Security", "Opening security settings...");
  };

  const handleVisibilityPress = () => {
    Alert.alert("Visibility", "Opening visibility settings...");
  };

  const handleLanguagePress = () => {
    Alert.alert("Language", "Opening language settings...");
  };

  const handleHelpPress = () => {
    Alert.alert("Help & Feedback", "Opening help center...");
  };

  const handleAboutPress = () => {
    Alert.alert("About ConvoPal", "Version 1.0.0\n\nConvoPal is a modern messaging app designed for seamless communication.");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Appearance */}
        <SectionHeader title="Appearance" />
        <View style={styles.section}>
          <SettingsItem
            icon="moon"
            title="Dark Mode"
            subtitle="Switch to dark theme"
            showSwitch={true}
            switchValue={darkMode}
            onSwitchChange={setDarkMode}
            iconColor="#8B5CF6"
          />
        </View>

        {/* Notifications */}
        <SectionHeader title="Notifications" />
        <View style={styles.section}>
          <SettingsItem
            icon="notifications"
            title="Push Notifications"
            subtitle="Receive notifications for new messages"
            showSwitch={true}
            switchValue={notifications}
            onSwitchChange={setNotifications}
            iconColor="#FF9500"
          />
          <View style={styles.separator} />
          <SettingsItem
            icon="chatbubble"
            title="Message Notifications"
            subtitle="Notify for new messages"
            showSwitch={true}
            switchValue={notifications}
            onSwitchChange={setNotifications}
            iconColor="#07C160"
          />
          <View style={styles.separator} />
          <SettingsItem
            icon="people"
            title="Group Notifications"
            subtitle="Notify for group activities"
            showSwitch={true}
            switchValue={notifications}
            onSwitchChange={setNotifications}
            iconColor="#007AFF"
          />
        </View>

        {/* Privacy & Security */}
        <SectionHeader title="Privacy & Security" />
        <View style={styles.section}>
          <SettingsItem
            icon="shield-checkmark"
            title="Privacy"
            subtitle="Control your data and privacy"
            onPress={handlePrivacyPress}
            iconColor="#34C759"
          />
          <View style={styles.separator} />
          <SettingsItem
            icon="lock-closed"
            title="Security"
            subtitle="Password and verification settings"
            onPress={handleSecurityPress}
            iconColor="#FF3B30"
          />
          <View style={styles.separator} />
          <SettingsItem
            icon="eye"
            title="Visibility"
            subtitle="Who can see your profile"
            onPress={handleVisibilityPress}
            iconColor="#007AFF"
          />
          <View style={styles.separator} />
          <SettingsItem
            icon="checkmark-circle"
            title="Read Receipts"
            subtitle="Show when you've read messages"
            showSwitch={true}
            switchValue={readReceipts}
            onSwitchChange={setReadReceipts}
            iconColor="#07C160"
          />
        </View>

        {/* Chat Settings */}
        <SectionHeader title="Chat Settings" />
        <View style={styles.section}>
          <SettingsItem
            icon="chatbubble-ellipses"
            title="Auto Reply"
            subtitle="Automatically reply when busy"
            showSwitch={true}
            switchValue={autoReply}
            onSwitchChange={setAutoReply}
            iconColor="#FF6B9D"
          />
          <View style={styles.separator} />
          <SettingsItem
            icon="language"
            title="Language"
            subtitle="English"
            onPress={handleLanguagePress}
            iconColor="#8B5CF6"
          />
        </View>

        {/* Support */}
        <SectionHeader title="Support" />
        <View style={styles.section}>
          <SettingsItem
            icon="help-circle"
            title="Help & Feedback"
            subtitle="Get support and send feedback"
            onPress={handleHelpPress}
            iconColor="#007AFF"
          />
          <View style={styles.separator} />
          <SettingsItem
            icon="information-circle"
            title="About ConvoPal"
            subtitle="Version 1.0.0"
            onPress={handleAboutPress}
            iconColor="#8E8E93"
          />
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
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
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
  settingsItem: {
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
  separator: {
    height: 0.5,
    backgroundColor: "#C6C6C8",
    marginLeft: 68,
  },
  bottomSpacing: {
    height: 20,
  },
}); 