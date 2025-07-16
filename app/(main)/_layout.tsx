import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const ChatIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="chatbubbles-outline" size={size} color={color} />
);

const ContactsIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="people-outline" size={size} color={color} />
);

const DiscoverIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="compass-outline" size={size} color={color} />
);

const MeIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="person-outline" size={size} color={color} />
);

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#07C160",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          backgroundColor: "#F2F2F7",
          borderTopWidth: 0.5,
          borderTopColor: "#C6C6C8",
          paddingBottom: 20,
          paddingTop: 5,
          height: 70,
        },
        headerStyle: {
          backgroundColor: "#EDEDED",
        },
        headerTitleStyle: {
          color: "#000000",
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="(chat)"
        options={{
          title: "Chats",
          tabBarIcon: ChatIcon,
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