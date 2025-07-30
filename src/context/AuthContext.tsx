import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { apiService, AuthResponse, SignupRequest, LoginRequest } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SignupData {
  fullName: string;
  username: string;
  country: string;
  phone: string;
  password: string;
}

interface User {
  id: number;
  fullName: string;
  username: string;
  phone: string;
  email: string | null;
  avatarUrl: string | null;
  isVerified: boolean;
}

interface AuthContextType {
  signupData: SignupData;
  setSignupData: (data: SignupData) => void;
  clearSignupData: () => void;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  login: (usernameOrPhone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  // Contact Management
  sendContactRequest: (username: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  getContacts: () => Promise<{ success: boolean; data?: any; error?: string }>;
  getPendingRequests: () => Promise<{ success: boolean; data?: any; error?: string }>;
  getSentRequests: () => Promise<{ success: boolean; data?: any; error?: string }>;
  acceptContactRequest: (contactId: number) => Promise<{ success: boolean; data?: any; error?: string }>;
  rejectContactRequest: (contactId: number) => Promise<{ success: boolean; data?: any; error?: string }>;
  removeContact: (contactId: number) => Promise<{ success: boolean; data?: any; error?: string }>;
  searchUsers: (query: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  // Chat Methods
  sendMessage: (receiverUsername: string, content: string, type: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  getConversation: (username: string, page: number, size: number) => Promise<{ success: boolean; data?: any; error?: string }>;
  markMessagesAsRead: (username: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  getUnreadCount: (username: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  getUnreadMessages: () => Promise<{ success: boolean; data?: any; error?: string }>;

  // Group Chat methods
  createGroup: (groupData: { name: string; description?: string; avatarUrl?: string; memberUsernames: string[] }) => Promise<{ success: boolean; data?: any; error?: string }>;
  getUserGroups: () => Promise<{ success: boolean; data?: any; error?: string }>;
  getGroupById: (groupId: number) => Promise<{ success: boolean; data?: any; error?: string }>;
  sendGroupMessage: (groupId: number, content: string, type?: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  getGroupMessages: (groupId: number, page?: number, size?: number) => Promise<{ success: boolean; data?: any; error?: string }>;
  markGroupMessagesAsRead: (groupId: number) => Promise<{ success: boolean; data?: any; error?: string }>;
  getGroupUnreadCount: (groupId: number) => Promise<{ success: boolean; data?: any; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [signupData, setSignupDataState] = useState<SignupData>({
    fullName: '',
    username: '',
    country: '',
    phone: '',
    password: '',
  });
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setSignupData = (data: SignupData) => {
    setSignupDataState(data);
  };

  const clearSignupData = () => {
    setSignupDataState({
      fullName: '',
      username: '',
      country: '',
      phone: '',
      password: '',
    });
  };

  const signup = async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    try {
      const request: SignupRequest = {
        fullName: data.fullName,
        username: data.username,
        country: data.country,
        phone: data.phone,
        password: data.password,
      };

      const response = await apiService.signup(request);
      
      if (response.success && response.data) {
        // Mark user as verified since we're skipping verification
        const verifiedUser = {
          ...response.data.user,
          isVerified: true
        };
        setUser(verifiedUser);
        setIsAuthenticated(true);
        // Store both accessToken and refreshToken
        await AsyncStorage.setItem('authToken', response.data.accessToken);
        await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const request: LoginRequest = {
        usernameOrPhone: username,
        password,
      };

      const response = await apiService.login(request);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        // Store the accessToken, not refreshToken
        await AsyncStorage.setItem('authToken', response.data.accessToken);
        await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('refreshToken');
    }
  };

  const checkAuthStatus = async (): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const response = await apiService.getCurrentUser();
        if (response.success && response.data) {
          setUser(response.data);
          setIsAuthenticated(true);
        } else {
          // Token might be expired, try to refresh
          const refreshResponse = await apiService.refreshToken();
          if (refreshResponse.success && refreshResponse.data) {
            setUser(refreshResponse.data.user);
            setIsAuthenticated(true);
          } else {
            // Clear invalid tokens
            await logout();
          }
        }
      }
    } catch (error) {
      console.error('Auth status check error:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  // Contact Management
  const sendContactRequest = async (username: string) => {
    try {
      const response = await apiService.sendContactRequest(username);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Send contact request error:', error);
      return { success: false, error: 'Failed to send contact request' };
    }
  };

  const getContacts = async () => {
    try {
      const response = await apiService.getContacts();
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Get contacts error:', error);
      return { success: false, error: 'Failed to get contacts' };
    }
  };

  const getPendingRequests = async () => {
    try {
      const response = await apiService.getPendingRequests();
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Get pending requests error:', error);
      return { success: false, error: 'Failed to get pending requests' };
    }
  };

  const getSentRequests = async () => {
    try {
      const response = await apiService.getSentRequests();
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Get sent requests error:', error);
      return { success: false, error: 'Failed to get sent requests' };
    }
  };

  const acceptContactRequest = async (contactId: number) => {
    try {
      const response = await apiService.acceptContactRequest(contactId);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Accept contact request error:', error);
      return { success: false, error: 'Failed to accept contact request' };
    }
  };

  const rejectContactRequest = async (contactId: number) => {
    try {
      const response = await apiService.rejectContactRequest(contactId);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Reject contact request error:', error);
      return { success: false, error: 'Failed to reject contact request' };
    }
  };

  const removeContact = async (contactId: number) => {
    try {
      const response = await apiService.removeContact(contactId);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Remove contact error:', error);
      return { success: false, error: 'Failed to remove contact' };
    }
  };

  const searchUsers = async (query: string) => {
    try {
      const response = await apiService.searchUsers(query);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Search users error:', error);
      return { success: false, error: 'Failed to search users' };
    }
  };

  // Chat Methods
  const sendMessage = async (receiverUsername: string, content: string, type: string = 'TEXT') => {
    try {
      const response = await apiService.sendMessage(receiverUsername, content, type);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Send message error:', error);
      return { success: false, error: 'Failed to send message' };
    }
  };

  const getConversation = async (username: string, page: number = 0, size: number = 50) => {
    try {
      const response = await apiService.getConversation(username, page, size);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Get conversation error:', error);
      return { success: false, error: 'Failed to get conversation' };
    }
  };

  const markMessagesAsRead = async (username: string) => {
    try {
      const response = await apiService.markMessagesAsRead(username);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Mark messages as read error:', error);
      return { success: false, error: 'Failed to mark messages as read' };
    }
  };

  const getUnreadCount = async (username: string) => {
    try {
      const response = await apiService.getUnreadCount(username);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Get unread count error:', error);
      return { success: false, error: 'Failed to get unread count' };
    }
  };

  const getUnreadMessages = async () => {
    try {
      const response = await apiService.getUnreadMessages();
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Get unread messages error:', error);
      return { success: false, error: 'Failed to get unread messages' };
    }
  };

  // Group Chat methods
  const createGroup = async (groupData: { name: string; description?: string; avatarUrl?: string; memberUsernames: string[] }) => {
    try {
      const response = await apiService.createGroup(groupData);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Create group error:', error);
      return { success: false, error: 'Failed to create group' };
    }
  };

  const getUserGroups = async () => {
    try {
      const response = await apiService.getUserGroups();
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Get user groups error:', error);
      return { success: false, error: 'Failed to get user groups' };
    }
  };

  const getGroupById = async (groupId: number) => {
    try {
      const response = await apiService.getGroupById(groupId);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Get group by ID error:', error);
      return { success: false, error: 'Failed to get group by ID' };
    }
  };

  const sendGroupMessage = async (groupId: number, content: string, type?: string) => {
    try {
      const response = await apiService.sendGroupMessage(groupId, content, type);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Send group message error:', error);
      return { success: false, error: 'Failed to send group message' };
    }
  };

  const getGroupMessages = async (groupId: number, page?: number, size?: number) => {
    try {
      const response = await apiService.getGroupMessages(groupId, page, size);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Get group messages error:', error);
      return { success: false, error: 'Failed to get group messages' };
    }
  };

  const markGroupMessagesAsRead = async (groupId: number) => {
    try {
      const response = await apiService.markGroupMessagesAsRead(groupId);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Mark group messages as read error:', error);
      return { success: false, error: 'Failed to mark group messages as read' };
    }
  };

  const getGroupUnreadCount = async (groupId: number) => {
    try {
      const response = await apiService.getGroupUnreadCount(groupId);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Get group unread count error:', error);
      return { success: false, error: 'Failed to get group unread count' };
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = {
    signupData,
    setSignupData,
    clearSignupData,
    user,
    isAuthenticated,
    isLoading,
    signup,
    login,
    logout,
    checkAuthStatus,
    sendContactRequest,
    getContacts,
    getPendingRequests,
    getSentRequests,
    acceptContactRequest,
    rejectContactRequest,
    removeContact,
    searchUsers,
    sendMessage,
    getConversation,
    markMessagesAsRead,
    getUnreadCount,
    getUnreadMessages,
    createGroup,
    getUserGroups,
    getGroupById,
    sendGroupMessage,
    getGroupMessages,
    markGroupMessagesAsRead,
    getGroupUnreadCount,
  };

  return (
    <AuthContext.Provider 
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}; 