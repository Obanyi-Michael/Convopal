import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Colors';

export interface ThemeColors {
  // Background Colors
  background: string;
  backgroundLight: string;
  backgroundDark: string;
  
  // Surface Colors
  surface: string;
  surfaceLight: string;
  surfaceDark: string;
  
  // Text Colors
  textPrimary: string;
  textSecondary: string;
  textLight: string;
  
  // Border Colors
  border: string;
  borderLight: string;
  
  // Card Colors
  card: string;
  cardShadow: string;
  
  // Input Colors
  inputBackground: string;
  inputBorder: string;
  inputPlaceholder: string;
  
  // Status Colors
  success: string;
  error: string;
  warning: string;
  info: string;
  
  // Tab Bar Colors
  tabBarActive: string;
  tabBarInactive: string;
  tabBarBackground: string;
}

const lightTheme: ThemeColors = {
  background: "#F2F2F7",
  backgroundLight: "#FFFFFF",
  backgroundDark: "#EDEDED",
  surface: "#FFFFFF",
  surfaceLight: "#F8F8F8",
  surfaceDark: "#E5E5EA",
  textPrimary: "#000000",
  textSecondary: "#8E8E93",
  textLight: "#FFFFFF",
  border: "#C6C6C8",
  borderLight: "#E5E5EA",
  card: "#FFFFFF",
  cardShadow: "rgba(0, 0, 0, 0.1)",
  inputBackground: "#FFFFFF",
  inputBorder: "#E5E5EA",
  inputPlaceholder: "#8E8E93",
  success: "#07C160",
  error: "#FF3B30",
  warning: "#FF9500",
  info: "#007AFF",
  tabBarActive: "#07C160",
  tabBarInactive: "#8E8E93",
  tabBarBackground: "#F2F2F7",
};

const darkTheme: ThemeColors = {
  background: "#000000",
  backgroundLight: "#1C1C1E",
  backgroundDark: "#0C0C0E",
  surface: "#1C1C1E",
  surfaceLight: "#2C2C2E",
  surfaceDark: "#0C0C0E",
  textPrimary: "#FFFFFF",
  textSecondary: "#8E8E93",
  textLight: "#FFFFFF",
  border: "#38383A",
  borderLight: "#48484A",
  card: "#1C1C1E",
  cardShadow: "rgba(0, 0, 0, 0.3)",
  inputBackground: "#2C2C2E",
  inputBorder: "#38383A",
  inputPlaceholder: "#8E8E93",
  success: "#30D158",
  error: "#FF453A",
  warning: "#FF9F0A",
  info: "#0A84FF",
  tabBarActive: "#30D158",
  tabBarInactive: "#8E8E93",
  tabBarBackground: "#000000",
};

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const saveThemePreference = async (isDark: boolean) => {
    try {
      await AsyncStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    saveThemePreference(newTheme);
  };

  const setTheme = (isDark: boolean) => {
    setIsDarkMode(isDark);
    saveThemePreference(isDark);
  };

  const colors = isDarkMode ? darkTheme : lightTheme;

  const value = {
    isDarkMode,
    toggleTheme,
    setTheme,
    colors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 