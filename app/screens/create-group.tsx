import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../src/components/CustomButton";
import { useAuth } from "../../src/context/AuthContext";

interface Contact {
  id: number;
  contact: {
    id: number;
    fullName: string;
    username: string;
    avatarUrl?: string;
  };
}

interface CreateGroupForm {
  name: string;
  description: string;
  selectedContacts: string[];
}

export default function CreateGroupScreen() {
  const [form, setForm] = useState<CreateGroupForm>({
    name: "",
    description: "",
    selectedContacts: []
  });
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [contactsLoading, setContactsLoading] = useState(true);
  const { user, getContacts, createGroup } = useAuth();

  useEffect(() => {
    if (user) {
      loadContacts();
    }
  }, [user]);

  const loadContacts = async () => {
    if (!user) return;
    
    setContactsLoading(true);
    try {
      const response = await getContacts();
      if (response.success && response.data) {
        setContacts(response.data);
      } else {
        Alert.alert("Error", response.error || "Failed to load contacts");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load contacts");
      console.error(error);
    } finally {
      setContactsLoading(false);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleCreateGroup = async () => {
    if (!form.name.trim()) {
      Alert.alert("Error", "Group name is required");
      return;
    }

    if (form.selectedContacts.length === 0) {
      Alert.alert("Error", "Please select at least one member");
      return;
    }

    setLoading(true);
    try {
      const response = await createGroup({
        name: form.name.trim(),
        description: form.description.trim(),
        memberUsernames: form.selectedContacts
      });

      if (response.success && response.data) {
        Alert.alert(
          "Success", 
          "Group created successfully!", 
          [
            {
              text: "OK",
              onPress: () => router.back()
            }
          ]
        );
      } else {
        Alert.alert("Error", response.error || "Failed to create group");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to create group");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleContactSelection = (username: string) => {
    setForm(prev => ({
      ...prev,
      selectedContacts: prev.selectedContacts.includes(username)
        ? prev.selectedContacts.filter(u => u !== username)
        : [...prev.selectedContacts, username]
    }));
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const renderContact = ({ item }: { item: Contact }) => {
    const isSelected = form.selectedContacts.includes(item.contact.username);
    
    return (
      <TouchableOpacity 
        style={[styles.contactItem, isSelected && styles.selectedContact]}
        onPress={() => toggleContactSelection(item.contact.username)}
      >
        {item.contact.avatarUrl ? (
          <Image source={{ uri: item.contact.avatarUrl }} style={styles.contactAvatar} />
        ) : (
          <View style={styles.defaultAvatar}>
            <Text style={styles.avatarText}>{getInitials(item.contact.fullName)}</Text>
          </View>
        )}
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.contact.fullName}</Text>
          <Text style={styles.contactUsername}>@{item.contact.username}</Text>
        </View>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Group</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Group Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Group Details</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Group Name *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter group name"
              value={form.name}
              onChangeText={(text) => setForm(prev => ({ ...prev, name: text }))}
              maxLength={50}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Enter group description"
              value={form.description}
              onChangeText={(text) => setForm(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={3}
              maxLength={500}
            />
          </View>
        </View>

        {/* Select Members */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Select Members ({form.selectedContacts.length} selected)
          </Text>
          
          {contactsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#07C160" />
              <Text style={styles.loadingText}>Loading contacts...</Text>
            </View>
          ) : contacts.length > 0 ? (
            <FlatList
              data={contacts}
              renderItem={renderContact}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              style={styles.contactsList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color="#C6C6C8" />
              <Text style={styles.emptyTitle}>No contacts found</Text>
              <Text style={styles.emptySubtitle}>Add some contacts first to create a group</Text>
            </View>
          )}
        </View>

        {/* Create Button */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title={loading ? "Creating..." : "Create Group"}
            onPress={handleCreateGroup}
            variant="primary"
            disabled={loading || !form.name.trim() || form.selectedContacts.length === 0}
          />
        </View>
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
    backgroundColor: "white",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  contactsList: {
    maxHeight: 300,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F0F0F0",
  },
  selectedContact: {
    backgroundColor: "#F0F8F0",
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  defaultAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#07C160",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  contactUsername: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#C6C6C8",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: "#07C160",
    borderColor: "#07C160",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#8E8E93",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 30,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginTop: 15,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#8E8E93",
    marginTop: 5,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    marginTop: "auto",
    paddingTop: 16,
  },
}); 