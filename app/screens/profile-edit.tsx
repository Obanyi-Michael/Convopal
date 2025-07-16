import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileEditScreen() {
  const [name, setName] = useState("John Doe");
  const [status, setStatus] = useState("Online");
  const [bio, setBio] = useState("Hello! I'm using ConvoPal.");
  const [phone, setPhone] = useState("+1 (555) 123-4567");

  const handleBackPress = () => {
    router.back();
  };

  const handleSavePress = () => {
    Alert.alert("Success", "Profile updated successfully!");
    router.back();
  };

  const handleChangeAvatar = () => {
    Alert.alert("Change Avatar", "Opening photo picker...");
  };

  const handleChangeQR = () => {
    Alert.alert("QR Code", "Showing your QR code...");
  };

  const handleChangePhone = () => {
    Alert.alert("Change Phone", "Opening phone number settings...");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSavePress}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Photo</Text>
          <TouchableOpacity style={styles.avatarSection} onPress={handleChangeAvatar}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: "https://via.placeholder.com/100" }}
                style={styles.avatar}
              />
              <View style={styles.avatarEdit}>
                <Ionicons name="camera" size={16} color="white" />
              </View>
            </View>
            <View style={styles.avatarInfo}>
              <Text style={styles.avatarTitle}>Change Photo</Text>
              <Text style={styles.avatarSubtitle}>Tap to update your profile picture</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#C6C6C8" />
          </TouchableOpacity>
        </View>

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#8E8E93"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Status</Text>
            <TextInput
              style={styles.textInput}
              value={status}
              onChangeText={setStatus}
              placeholder="What's on your mind?"
              placeholderTextColor="#8E8E93"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              style={[styles.textInput, styles.bioInput]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself"
              placeholderTextColor="#8E8E93"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <TouchableOpacity style={styles.contactItem} onPress={handleChangePhone}>
            <View style={styles.contactIcon}>
              <Ionicons name="call" size={20} color="#07C160" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Phone Number</Text>
              <Text style={styles.contactValue}>{phone}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#C6C6C8" />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.contactItem} onPress={handleChangeQR}>
            <View style={styles.contactIcon}>
              <Ionicons name="qr-code" size={20} color="#07C160" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>ConvoPal ID</Text>
              <Text style={styles.contactValue}>johndoe123</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#C6C6C8" />
          </TouchableOpacity>
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          
          <TouchableOpacity style={styles.privacyItem}>
            <View style={styles.privacyIcon}>
              <Ionicons name="eye" size={20} color="#07C160" />
            </View>
            <View style={styles.privacyInfo}>
              <Text style={styles.privacyLabel}>Profile Visibility</Text>
              <Text style={styles.privacyValue}>Everyone</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#C6C6C8" />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.privacyItem}>
            <View style={styles.privacyIcon}>
              <Ionicons name="location" size={20} color="#07C160" />
            </View>
            <View style={styles.privacyInfo}>
              <Text style={styles.privacyLabel}>Location Sharing</Text>
              <Text style={styles.privacyValue}>Friends only</Text>
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
  saveButton: {
    width: 40,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#07C160",
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
    marginBottom: 16,
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarEdit: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#07C160",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInfo: {
    flex: 1,
  },
  avatarTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  avatarSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#F9F9F9",
  },
  bioInput: {
    height: 80,
    textAlignVertical: "top",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  contactValue: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 2,
  },
  privacyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  privacyIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  privacyInfo: {
    flex: 1,
  },
  privacyLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  privacyValue: {
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