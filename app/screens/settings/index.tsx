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
import { useTheme } from "../../../src/context/ThemeContext";

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
}) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity style={[styles.settingsItem, { borderBottomColor: colors.borderLight }]} onPress={onPress}>
      <View style={styles.itemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.surfaceLight }]}>
          <Ionicons name={icon} size={24} color={iconColor} />
        </View>
        <View style={styles.itemContent}>
          <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>{title}</Text>
          {subtitle && <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.itemRight}>
        {showBadge && <View style={[styles.badge, { backgroundColor: colors.error }]} />}
        {showSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: colors.borderLight, true: colors.success }}
            thumbColor={colors.textLight}
          />
        ) : (
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );
};

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  const { colors } = useTheme();
  
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{title}</Text>
    </View>
  );
};

export default function SettingsScreen() {
  const { colors, isDarkMode, setTheme } = useTheme();
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

  const handleDarkModeToggle = (value: boolean) => {
    setTheme(value);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { 
        backgroundColor: colors.card,
        borderBottomColor: colors.borderLight
      }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Settings</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Appearance */}
        <SectionHeader title="Appearance" />
        <View style={[styles.section, { 
          backgroundColor: colors.card,
          shadowColor: colors.cardShadow
        }]}>
          <SettingsItem
            icon="moon"
            title="Dark Mode"
            subtitle="Switch to dark theme"
            showSwitch={true}
            switchValue={isDarkMode}
            onSwitchChange={handleDarkModeToggle}
            iconColor="#8B5CF6"
          />
        </View>

        {/* Notifications */}
        <SectionHeader title="Notifications" />
        <View style={[styles.section, { 
          backgroundColor: colors.card,
          shadowColor: colors.cardShadow
        }]}>
          <SettingsItem
            icon="notifications"
            title="Push Notifications"
            subtitle="Receive notifications for new messages"
            showSwitch={true}
            switchValue={notifications}
            onSwitchChange={setNotifications}
            iconColor="#FF9500"
          />
          <View style={[styles.separator, { backgroundColor: colors.borderLight }]} />
          <SettingsItem
            icon="chatbubble"
            title="Message Notifications"
            subtitle="Notify for new messages"
            showSwitch={true}
            switchValue={notifications}
            onSwitchChange={setNotifications}
            iconColor="#07C160"
          />
          <View style={[styles.separator, { backgroundColor: colors.borderLight }]} />
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
        <View style={[styles.section, { 
          backgroundColor: colors.card,
          shadowColor: colors.cardShadow
        }]}>
          <SettingsItem
            icon="shield-checkmark"
            title="Privacy"
            subtitle="Control your data and privacy"
            onPress={handlePrivacyPress}
            iconColor="#34C759"
          />
          <View style={[styles.separator, { backgroundColor: colors.borderLight }]} />
          <SettingsItem
            icon="lock-closed"
            title="Security"
            subtitle="Password and verification settings"
            onPress={handleSecurityPress}
            iconColor="#FF3B30"
          />
          <View style={[styles.separator, { backgroundColor: colors.borderLight }]} />
          <SettingsItem
            icon="eye"
            title="Visibility"
            subtitle="Who can see your profile"
            onPress={handleVisibilityPress}
            iconColor="#007AFF"
          />
          <View style={[styles.separator, { backgroundColor: colors.borderLight }]} />
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
        <View style={[styles.section, { 
          backgroundColor: colors.card,
          shadowColor: colors.cardShadow
        }]}>
          <SettingsItem
            icon="chatbubble-ellipses"
            title="Auto Reply"
            subtitle="Automatically reply when busy"
            showSwitch={true}
            switchValue={autoReply}
            onSwitchChange={setAutoReply}
            iconColor="#FF6B9D"
          />
          <View style={[styles.separator, { backgroundColor: colors.borderLight }]} />
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
        <View style={[styles.section, { 
          backgroundColor: colors.card,
          shadowColor: colors.cardShadow
        }]}>
          <SettingsItem
            icon="help-circle"
            title="Help & Feedback"
            subtitle="Get support and send feedback"
            onPress={handleHelpPress}
            iconColor="#007AFF"
          />
          <View style={[styles.separator, { backgroundColor: colors.borderLight }]} />
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  backButton: {
    width: 40,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
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
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  section: {
    marginHorizontal: 16,
    borderRadius: 12,
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
    borderBottomWidth: 0.5,
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
  },
  itemSubtitle: {
    fontSize: 14,
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
    marginRight: 8,
  },
  separator: {
    height: 0.5,
    marginLeft: 68,
  },
  bottomSpacing: {
    height: 20,
  },
}); 