import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface DiscoverItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
  iconColor?: string;
}

const DiscoverItem: React.FC<DiscoverItemProps> = ({ icon, title, onPress, iconColor = "#07C160" }) => (
  <TouchableOpacity style={styles.discoverItem} onPress={onPress}>
    <View style={styles.itemLeft}>
      <View style={[styles.iconContainer, { backgroundColor: "#F0F0F0" }]}>
        <Ionicons name={icon} size={24} color={iconColor} />
      </View>
      <Text style={styles.itemTitle}>{title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#C6C6C8" />
  </TouchableOpacity>
);

export default function DiscoverScreen() {
  const handleMomentsPress = () => {
    console.log("Moments pressed");
  };

  const handleChannelsPress = () => {
    console.log("Channels pressed");
  };

  const handleScanPress = () => {
    console.log("Scan pressed");
  };

  const handleShakePress = () => {
    console.log("Shake pressed");
  };

  const handleSearchPress = () => {
    console.log("Search pressed");
  };

  const handlePeopleNearbyPress = () => {
    console.log("People Nearby pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
      </View>

      {/* Discover Items */}
      <View style={styles.content}>
        <DiscoverItem
          icon="camera"
          title="Moments"
          onPress={handleMomentsPress}
          iconColor="#FF9500"
        />
        
        <View style={styles.separator} />
        
        <DiscoverItem
          icon="tv"
          title="Channels"
          onPress={handleChannelsPress}
          iconColor="#007AFF"
        />
        
        <View style={styles.separator} />
        
        <DiscoverItem
          icon="qr-code"
          title="Scan"
          onPress={handleScanPress}
          iconColor="#007AFF"
        />
        
        <View style={styles.separator} />
        
        <DiscoverItem
          icon="phone-portrait"
          title="Shake"
          onPress={handleShakePress}
          iconColor="#000"
        />
        
        <View style={styles.separator} />
        
        <DiscoverItem
          icon="search"
          title="Search"
          onPress={handleSearchPress}
          iconColor="#FF2D92"
        />
        
        <View style={styles.separator} />
        
        <DiscoverItem
          icon="people"
          title="People Nearby"
          onPress={handlePeopleNearbyPress}
          iconColor="#000"
        />
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingTop: 20,
    gap: 8,
  },
  headerLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  content: {
    backgroundColor: "white",
  },
  discoverItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "white",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },

  separator: {
    height: 0.5,
    backgroundColor: "#C6C6C8",
  },
}); 