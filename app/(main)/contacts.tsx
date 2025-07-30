import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  RefreshControl
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/context/AuthContext";

interface Contact {
  id: number;
  contact: {
    id: number;
    fullName: string;
    username: string;
    avatarUrl?: string;
    isOnline: boolean;
    status?: string;
  };
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'BLOCKED';
  createdAt: string;
}

interface ContactItemProps {
  item: Contact;
  onPress: () => void;
  onAccept?: () => void;
  onReject?: () => void;
  showActions?: boolean;
}

const ContactItem = ({ item, onPress, onAccept, onReject, showActions = false }: ContactItemProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const renderAvatar = () => {
    if (item.contact.avatarUrl) {
      return (
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.contact.avatarUrl }} style={styles.avatar} />
          {item.contact.isOnline && <View style={styles.onlineIndicator} />}
        </View>
      );
    }
    
    return (
      <View style={styles.avatarContainer}>
        <View style={styles.defaultAvatar}>
          <Text style={styles.avatarText}>{getInitials(item.contact.fullName)}</Text>
        </View>
        {item.contact.isOnline && <View style={styles.onlineIndicator} />}
      </View>
    );
  };

  return (
    <TouchableOpacity style={styles.contactItem} onPress={onPress}>
      {renderAvatar()}
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.contact.fullName}</Text>
        <Text style={styles.contactStatus}>
          {item.contact.isOnline ? 'Online' : 'Offline'}
          {item.contact.status && ` • ${item.contact.status}`}
        </Text>
      </View>
      {showActions && item.status === 'PENDING' ? (
        <View style={styles.contactActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.acceptButton]} 
            onPress={onAccept}
          >
            <Ionicons name="checkmark" size={20} color="#07C160" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.rejectButton]} 
            onPress={onReject}
          >
            <Ionicons name="close" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.contactActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="call" size={20} color="#07C160" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="videocam" size={20} color="#07C160" />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

interface QuickActionProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
  color?: string;
}

const QuickAction: React.FC<QuickActionProps> = ({ icon, title, subtitle, onPress, color = "#07C160" }) => (
  <TouchableOpacity style={styles.quickAction} onPress={onPress}>
    <View style={[styles.quickActionIcon, { backgroundColor: `${color}15` }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <View style={styles.quickActionContent}>
      <Text style={styles.quickActionTitle}>{title}</Text>
      <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#C6C6C8" />
  </TouchableOpacity>
);

interface SectionHeaderProps {
  title: string;
  count?: number;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, count }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {count !== undefined && (
      <Text style={styles.sectionCount}>{count}</Text>
    )}
  </View>
);

export default function ContactsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, getContacts, getPendingRequests, acceptContactRequest, rejectContactRequest } = useAuth();

  const fetchContacts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [contactsResponse, pendingResponse] = await Promise.all([
        getContacts(),
        getPendingRequests()
      ]);
      
      if (contactsResponse.success && contactsResponse.data) {
        setContacts(contactsResponse.data);
      }
      
      if (pendingResponse.success && pendingResponse.data) {
        setPendingRequests(pendingResponse.data);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch contacts.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [user]);

  const handleContactPress = (contact: Contact) => {
    router.push({
      pathname: "/(main)/(chat)/[id]",
      params: { id: contact.contact.username, name: contact.contact.fullName }
    });
  };

  const handleAcceptContact = async (contact: Contact) => {
    if (!user) return;
    try {
      const response = await acceptContactRequest(contact.id);
      if (response.success) {
        Alert.alert("Success", "Contact accepted!");
        fetchContacts(); // Refresh the list
      } else {
        Alert.alert("Error", response.error || "Failed to accept contact.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to accept contact.");
      console.error(error);
    }
  };

  const handleRejectContact = async (contact: Contact) => {
    if (!user) return;
    try {
      const response = await rejectContactRequest(contact.id);
      if (response.success) {
        Alert.alert("Success", "Contact rejected!");
        fetchContacts(); // Refresh the list
      } else {
        Alert.alert("Error", response.error || "Failed to reject contact.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to reject contact.");
      console.error(error);
    }
  };

  const handleNewFriendsPress = () => {
    router.push("/screens/new-friends");
  };

  const handleGroupChatsPress = () => {
    router.push("/screens/group-chats");
  };

  const handleImportContactsPress = () => {
    console.log("Import contacts pressed");
  };

  const handleAddContactPress = () => {
    router.push("/screens/new-friends");
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.contact.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPendingRequests = pendingRequests.filter((contact) =>
    contact.contact.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineContacts = filteredContacts.filter(contact => contact.contact.isOnline);
  const offlineContacts = filteredContacts.filter(contact => !contact.contact.isOnline);

  const renderContactItem = ({ item }: { item: Contact }) => (
    <ContactItem
      item={item}
      onPress={() => handleContactPress(item)}
      onAccept={() => handleAcceptContact(item)}
      onReject={() => handleRejectContact(item)}
      showActions={item.status === 'PENDING'}
    />
  );

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchContacts();
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#8E8E93" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#8E8E93"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={[
          { type: 'quickActions', data: [] },
          ...(filteredPendingRequests.length > 0 ? [{ type: 'pending', data: filteredPendingRequests }] : []),
          ...(onlineContacts.length > 0 ? [{ type: 'online', data: onlineContacts }] : []),
          ...(offlineContacts.length > 0 ? [{ type: 'offline', data: offlineContacts }] : [])
        ]}
        renderItem={({ item }) => {
          if (item.type === 'quickActions') {
            return (
              <View style={styles.quickActionsSection}>
                <QuickAction
                  icon="person-add"
                  title="New Friends"
                  subtitle="Add new contacts"
                  onPress={handleNewFriendsPress}
                  color="#07C160"
                />
                <View style={styles.separator} />
                <QuickAction
                  icon="chatbubbles"
                  title="Group Chats"
                  subtitle="Create or join groups"
                  onPress={handleGroupChatsPress}
                  color="#007AFF"
                />
                <View style={styles.separator} />
                <QuickAction
                  icon="download"
                  title="Import Contacts"
                  subtitle="Sync with phone contacts"
                  onPress={handleImportContactsPress}
                  color="#FF9500"
                />
              </View>
            );
          }
          
          if (item.data.length > 0) {
            return (
              <View>
                <SectionHeader 
                  title={
                    item.type === 'pending' ? 'Pending Requests' :
                    item.type === 'online' ? 'Online' : 'All Contacts'
                  } 
                  count={item.data.length}
                />
                {item.data.map((contact) => (
                  <ContactItem
                    key={contact.id}
                    item={contact}
                    onPress={() => handleContactPress(contact)}
                    onAccept={() => handleAcceptContact(contact)}
                    onReject={() => handleRejectContact(contact)}
                    showActions={contact.status === 'PENDING'}
                  />
                ))}
              </View>
            );
          }
          
          return null;
        }}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
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
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  headerRight: {
    width: 40,
  },
  addButton: {
    width: 40,
    alignItems: "center",
  },
  searchContainer: {
    padding: 16,
    paddingTop: 20,
    backgroundColor: "#F2F2F7",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  specialItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
  },
  specialIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  specialText: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
  },
  officialAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    overflow: "hidden",
  },
  officialAvatarImage: {
    width: "100%",
    height: "100%",
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  systemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contactName: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  contactInfo: {
    flex: 1,
  },
  sectionHeader: {
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
  },
  sectionCount: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
  },
  contactStatus: {
    fontSize: 12,
    color: "#8E8E93",
  },
  contactActions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  actionButton: {
    marginLeft: 12,
  },
  acceptButton: {
    backgroundColor: "#07C16015",
    borderRadius: 8,
    padding: 8,
  },
  rejectButton: {
    backgroundColor: "#FF3B3015",
    borderRadius: 8,
    padding: 8,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    overflow: "hidden",
    position: "relative",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  defaultAvatar: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#07C160",
  },
  quickActionsSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  quickAction: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 8,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
  },
  separator: {
    height: 0.5,
    backgroundColor: "#C6C6C8",
  },
});