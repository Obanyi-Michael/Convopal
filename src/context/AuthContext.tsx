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
  email?: string;
  avatarUrl?: string;
  isVerified: Boolean;
}

interface AuthContextType {
  signupData: SignupData;
  setSignupData: (data: SignupData) => void;
  clearSignupData: () => void;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
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
        // The backend returns the user data in response.data
        const userData = response.data.user;
        setUser(userData);
        setIsAuthenticated(true);
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
        // The backend returns the user data in response.data
        const userData = response.data.user;
        setUser(userData);
        setIsAuthenticated(true);
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
      await AsyncStorage.removeItem('refreshToken');
    }
  };

  const checkAuthStatus = async (): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        // For now, just check if we have a token
        // In a real app, you'd validate the token with the backend
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth status check error:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        signupData, 
        setSignupData, 
        clearSignupData,
        user,
        isLoading,
        isAuthenticated,
        signup,
        login,
        logout,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 