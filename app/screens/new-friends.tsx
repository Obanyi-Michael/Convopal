import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../src/components/CustomButton";
import { useAuth } from "../../src/context/AuthContext";

export default function NewFriendsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const { sendContactRequest, searchUsers } = useAuth();

  const handleBackPress = () => {
    router.back();
  };

  const handleSearchPress = async () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      Alert.alert("Error", "Please enter a username to search");
      return;
    }

    setSearching(true);
    try {
      const response = await searchUsers(trimmedQuery);
      if (response.success && response.data) {
        setSearchResults(response.data);
      } else {
        Alert.alert("Error", response.error || "Failed to search users");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to search users");
      console.error(error);
    } finally {
      setSearching(false);
    }
  };

  const handleAddContact = async (username: string) => {
    try {
      const response = await sendContactRequest(username);
      if (response.success) {
        Alert.alert("Success", "Contact request sent successfully!");
        setSearchResults([]); // Clear search results
        setSearchQuery(""); // Clear search query
      } else {
        Alert.alert("Error", response.error || "Failed to send contact request");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to send contact request");
      console.error(error);
    }
  };

  const handleAddByPhone = () => {
    const trimmedPhone = phoneNumber.trim();
    if (trimmedPhone) {
      Alert.alert("Add Friend", `Adding friend with phone: ${trimmedPhone}`);
    }
  };

  const handleScanQR = () => {
    Alert.alert("Scan QR", "Opening QR scanner...");
  };

  const handleMyQR = () => {
    Alert.alert("My QR Code", "Showing your QR code...");
  };

  const handleInviteFriends = () => {
    Alert.alert("Invite Friends", "Opening share dialog...");
  };

  const renderSearchResult = (user: any) => (
    <View key={user.id} style={styles.searchResult}>
      <View style={styles.userInfo}>
        <View style={styles.avatarContainer}>
          {user.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.defaultAvatar}>
              <Text style={styles.avatarText}>
                {user.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{user.fullName}</Text>
          <Text style={styles.userUsername}>@{user.username}</Text>
        </View>
      </View>
      <CustomButton
        title="Add"
        onPress={() => handleAddContact(user.username)}
        variant="primary"
        size="sm"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Friends</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search by ConvoPal ID */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Search by ConvoPal ID</Text>
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#8E8E93" />
              <TextInput
                style={styles.searchInput}
                placeholder="Enter ConvoPal ID"
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#8E8E93"
              />
            </View>
            <CustomButton
              title={searching ? "Searching..." : "Search"}
              onPress={handleSearchPress}
              variant="primary"
              size="sm"
              style={styles.searchButton}
              disabled={searching}
            />
          </View>
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <View style={styles.searchResults}>
              <Text style={styles.resultsTitle}>Search Results</Text>
              {searchResults.map(renderSearchResult)}
            </View>
          )}
        </View>

        {/* Add by Phone Number */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add by Phone Number</Text>
          <View style={styles.phoneContainer}>
            <View style={styles.phoneInput}>
              <Ionicons name="call" size={20} color="#8E8E93" />
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                placeholderTextColor="#8E8E93"
              />
            </View>
            <CustomButton
              title="Add"
              onPress={handleAddByPhone}
              variant="primary"
              size="sm"
              style={styles.addButton}
            />
          </View>
        </View>

        {/* QR Code Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>QR Code</Text>
          <TouchableOpacity style={styles.optionItem} onPress={handleScanQR}>
            <View style={styles.optionIcon}>
              <Ionicons name="qr-code" size={24} color="#07C160" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Scan QR Code</Text>
              <Text style={styles.optionSubtitle}>Scan friend's QR code</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#C6C6C8" />
          </TouchableOpacity>
          
          <View style={styles.separator} />
          
          <TouchableOpacity style={styles.optionItem} onPress={handleMyQR}>
            <View style={styles.optionIcon}>
              <Ionicons name="qr-code-outline" size={24} color="#07C160" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>My QR Code</Text>
              <Text style={styles.optionSubtitle}>Show your QR code</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#C6C6C8" />
          </TouchableOpacity>
        </View>

        {/* Invite Friends */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Invite Friends</Text>
          <TouchableOpacity style={styles.optionItem} onPress={handleInviteFriends}>
            <View style={styles.optionIcon}>
              <Ionicons name="share-social" size={24} color="#07C160" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Invite Friends</Text>
              <Text style={styles.optionSubtitle}>Share ConvoPal with friends</Text>
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
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
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
  searchButton: {
    minWidth: 80,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  phoneInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#000",
  },
  addButton: {
    minWidth: 80,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  optionSubtitle: {
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
  searchResult: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E0E0E0",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  defaultAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  userUsername: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 2,
  },
  searchResults: {
    marginTop: 16,
    backgroundColor: "#F2F2F7",
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
  resultsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
}); 