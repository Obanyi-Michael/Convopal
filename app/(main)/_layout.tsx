import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

const ChatIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="chatbubbles" size={size} color={color} />
);

const ContactsIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="people" size={size} color={color} />
);

const DiscoverIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="compass" size={size} color={color} />
);

const MeIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="person" size={size} color={color} />
);

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#07C160",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 88 : 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
        headerStyle: {
          backgroundColor: "#FFFFFF",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: 3,
        },
        headerTitleStyle: {
          color: "#000000",
          fontWeight: "700",
          fontSize: 18,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="(chat)"
        options={{
          title: "Chats",
          tabBarIcon: ChatIcon,
          tabBarBadge: 2, // Show unread count
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: "Contacts",
          tabBarIcon: ContactsIcon,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: DiscoverIcon,
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: "Me",
          tabBarIcon: MeIcon,
        }}
      />
    </Tabs>
  );
} 