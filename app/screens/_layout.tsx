import { Stack } from "expo-router";

export default function ScreensLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="moments" />
      <Stack.Screen name="group-chats" />
      <Stack.Screen name="new-friends" />
      <Stack.Screen name="profile-edit" />
      <Stack.Screen name="settings/index" />
    </Stack>
  );
} 