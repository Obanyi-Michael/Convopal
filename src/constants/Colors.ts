export const Colors = {
  // Primary Colors
  primary: "#07C160",
  primaryDark: "#05A050",
  primaryLight: "#4CD964",
  
  // Secondary Colors
  secondary: "#FF6B9D",
  secondaryDark: "#E55A8A",
  secondaryLight: "#FF8AB3",
  
  // Gradient Colors
  gradientStart: "#FF6B9D",
  gradientMiddle: "#C44569",
  gradientEnd: "#8B5CF6",
  
  // Background Colors
  background: "#F2F2F7",
  backgroundLight: "#FFFFFF",
  backgroundDark: "#EDEDED",
  
  // Text Colors
  textPrimary: "#000000",
  textSecondary: "#8E8E93",
  textLight: "#FFFFFF",
  
  // Border Colors
  border: "#C6C6C8",
  borderLight: "#E5E5EA",
  
  // Status Colors
  success: "#07C160",
  error: "#FF3B30",
  warning: "#FF9500",
  info: "#007AFF",
  
  // Tab Bar Colors
  tabBarActive: "#07C160",
  tabBarInactive: "#8E8E93",
  tabBarBackground: "#F2F2F7",
  
  // Button Colors
  buttonPrimary: "#07C160",
  buttonSecondary: "#FF3B30",
  buttonDisabled: "#E5E5EA",
  
  // Input Colors
  inputBackground: "#FFFFFF",
  inputBorder: "#E5E5EA",
  inputPlaceholder: "#8E8E93",
  
  // Badge Colors
  badge: "#FF3B30",
  badgeText: "#FFFFFF",
  
  // Shadow Colors
  shadow: "rgba(0, 0, 0, 0.1)",
  shadowDark: "rgba(0, 0, 0, 0.3)",
} as const;

export type ColorKey = keyof typeof Colors; 