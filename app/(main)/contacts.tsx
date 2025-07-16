import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data for contacts
const mockContacts = [
  { id: "1", name: "ConvoPal Team", avatar: require("../../assets/images/Convopal_logo.jpg"), isOfficial: true },
  { id: "2", name: "Deborah Apobona", avatar: "https://via.placeholder.com/50" },
  { id: "3", name: "File Transfer", avatar: "https://via.placeholder.com/50", isSystem: true },
];

interface ContactItemProps {
  item: {
    id: string;
    name: string;
    avatar: any;
    isOfficial?: boolean;
    isSystem?: boolean;
  };
  onPress: () => void;
}

const ContactItem = ({ item, onPress }: ContactItemProps) => {
  const renderAvatar = () => {
    if (item.isOfficial) {
      return (
        <View style={styles.officialAvatar}>
          <Image source={item.avatar} style={styles.officialAvatarImage} />
        </View>
      );
    }
    if (item.isSystem) {
      return (
        <View style={styles.systemIcon}>
          <Ionicons name="arrow-up-circle" size={24} color="#07C160" />
        </View>
      );
    }
    return (
      <View style={styles.contactIcon}>
        <Ionicons name="people" size={24} color="#07C160" />
      </View>
    );
  };

  return (
    <TouchableOpacity style={styles.contactItem} onPress={onPress}>
      {renderAvatar()}
      <Text style={styles.contactName}>{item.name}</Text>
      <Ionicons name="chevron-forward" size={20} color="#C6C6C8" />
    </TouchableOpacity>
  );
};

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const Separator = () => <View style={styles.separator} />;

export default function ContactsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts] = useState(mockContacts);

  const handleContactPress = (contact: typeof mockContacts[0]) => {
    // Navigate to contact detail or start chat
    console.log("Contact pressed:", contact.name);
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group contacts by first letter
  const groupedContacts = filteredContacts.reduce((groups: { [key: string]: typeof mockContacts }, contact) => {
    const firstLetter = contact.name.charAt(0).toUpperCase();
    if (!groups[firstLetter]) {
      groups[firstLetter] = [];
    }
    groups[firstLetter].push(contact);
    return groups;
  }, {});

  // Convert to array format for FlatList
  const sections = Object.keys(groupedContacts)
    .sort((a, b) => a.localeCompare(b))
    .map((letter) => ({
      title: letter,
      data: groupedContacts[letter],
    }));

  const renderSection = ({ item }: { item: { title: string; data: typeof mockContacts } }) => (
    <View>
      <SectionHeader title={item.title} />
      {item.data.map((contact) => (
        <ContactItem
          key={contact.id}
          item={contact}
          onPress={() => handleContactPress(contact)}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.addButton} onPress={() => {
          console.log("Add contact pressed");
        }}>
          <Ionicons name="person-add" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contacts</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#8E8E93"
          />
          <Ionicons name="search" size={20} color="#8E8E93" />
        </View>
      </View>

      {/* New Friends */}
      <TouchableOpacity style={styles.specialItem} onPress={() => {
        console.log("New Friends pressed");
      }}>
        <View style={styles.specialIcon}>
          <Ionicons name="person-add" size={24} color="#07C160" />
        </View>
        <Text style={styles.specialText}>New Friends</Text>
        <Ionicons name="chevron-forward" size={20} color="#C6C6C8" />
      </TouchableOpacity>

      <View style={styles.separator} />

      {/* Group Chats */}
      <TouchableOpacity style={styles.specialItem} onPress={() => {
        console.log("Group Chats pressed");
      }}>
        <View style={styles.specialIcon}>
          <Ionicons name="chatbubbles" size={24} color="#07C160" />
        </View>
        <Text style={styles.specialText}>Group Chats</Text>
        <Ionicons name="chevron-forward" size={20} color="#C6C6C8" />
      </TouchableOpacity>

      <View style={styles.separator} />

      {/* Tags */}
      <TouchableOpacity style={styles.specialItem} onPress={() => {
        console.log("Tags pressed");
      }}>
        <View style={styles.specialIcon}>
          <Ionicons name="pricetag" size={24} color="#07C160" />
        </View>
        <Text style={styles.specialText}>Tags</Text>
        <Ionicons name="chevron-forward" size={20} color="#C6C6C8" />
      </TouchableOpacity>

      <View style={styles.separator} />

      {/* Contacts List */}
      <FlatList
        data={sections}
        keyExtractor={(item) => item.title}
        renderItem={renderSection}
        ItemSeparatorComponent={Separator}
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
  separator: {
    height: 0.5,
    backgroundColor: "#C6C6C8",
  },
}); 