import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Animated,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface FeatureItemProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  description?: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ title, icon, iconColor, description }) => (
  <View style={styles.featureItem}>
    <View style={styles.featureContent}>
      <Text style={styles.featureText}>{title}</Text>
      {description && <Text style={styles.featureDescription}>{description}</Text>}
    </View>
    <View style={[styles.featureIcon, { backgroundColor: iconColor }]}>
      <Ionicons name={icon} size={20} color="white" />
    </View>
  </View>
);

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleSkip = () => {
    // Skip the welcome screen and go directly to chat
    router.replace("/(main)/(chat)");
  };

  const handleGetStarted = () => {
    // Navigate to main app
    router.replace("/(main)/(chat)");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <Text style={styles.headerTitle}>ConvoPal Team</Text>
        <TouchableOpacity style={styles.personButton} onPress={() => {
          console.log("Person button pressed");
        }}>
          <Ionicons name="person" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Message */}
        <View style={styles.messageContainer}>
          <View style={styles.avatarContainer}>
            <Image 
              source={require("../../assets/images/Convopal_logo.jpg")}
              style={styles.avatar}
              resizeMode="contain"
            />
          </View>
          <View style={styles.messageBubble}>
            <Text style={styles.messageText}>
              Welcome to ConvoPal! Here are some features you can quickly explore:
            </Text>
          </View>
        </View>

        {/* Feature List */}
        <Animated.View 
          style={[
            styles.featuresContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <FeatureItem
            title="Secure Messaging"
            description="End-to-end encryption for all your conversations"
            icon="lock-closed"
            iconColor="#07C160"
          />
          <View style={styles.separator} />
          
          <FeatureItem
            title="Voice & Video Calls"
            description="High-quality calls with friends and family"
            icon="call"
            iconColor="#007AFF"
          />
          <View style={styles.separator} />
          
          <FeatureItem
            title="Moments & Stories"
            description="Share your life with photos and videos"
            icon="camera"
            iconColor="#FF9500"
          />
          <View style={styles.separator} />
          
          <FeatureItem
            title="Payment & Wallet"
            description="Send money and make payments securely"
            icon="card"
            iconColor="#FF2D92"
          />
          <View style={styles.separator} />
          
          <FeatureItem
            title="Group Chats"
            description="Create groups for work, family, and friends"
            icon="people"
            iconColor="#5856D6"
          />
        </Animated.View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "white",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  personButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingTop: 60,
  },
  messageContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  messageBubble: {
    flex: 1,
    backgroundColor: "#E8E8FF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: "80%",
  },
  messageText: {
    fontSize: 16,
    color: "#000",
    lineHeight: 22,
  },
  featuresContainer: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    marginRight: 16,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    height: 0.5,
    backgroundColor: "#E5E5EA",
    marginHorizontal: 16,
  },
  skipButton: {
    alignSelf: "flex-end",
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "400",
  },
  featureContent: {
    flex: 1,
    marginRight: 16,
  },
  featureDescription: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 4,
  },
  getStartedButton: {
    backgroundColor: "#07C160",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 20,
  },
  getStartedText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  actionButtons: {
    paddingTop: 20,
  },
}); 