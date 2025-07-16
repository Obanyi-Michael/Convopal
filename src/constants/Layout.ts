import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const Layout = {
  // Screen Dimensions
  screenWidth: width,
  screenHeight: height,
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Border Radius
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 50,
  },
  
  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  // Icon Sizes
  iconSize: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
    xxl: 48,
  },
  
  // Button Heights
  buttonHeight: {
    sm: 40,
    md: 48,
    lg: 56,
  },
  
  // Input Heights
  inputHeight: {
    sm: 40,
    md: 48,
    lg: 56,
  },
  
  // Header Heights
  headerHeight: 56,
  tabBarHeight: 83,
  
  // Avatar Sizes
  avatarSize: {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 50,
    xl: 60,
    xxl: 80,
  },
  
  // Shadow
  shadow: {
    sm: {
      shadowColor: "rgba(0, 0, 0, 0.1)",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: "rgba(0, 0, 0, 0.1)",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: "rgba(0, 0, 0, 0.1)",
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
} as const;

export type LayoutKey = keyof typeof Layout; 