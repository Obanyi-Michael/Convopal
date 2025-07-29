import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
// Hosted backend on Render
const API_BASE_URL = 'https://back-6lbs.onrender.com/api/v1'; 
const API_TIMEOUT = 10000; // 10 seconds

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    fullName: string;
    username: string;
    phone: string;
    email?: string;
    avatarUrl?: string;
    isVerified: Boolean;
  };
}

export interface SignupRequest {
  fullName: string;
  username: string;
  country: string;
  phone: string;
  password: string;
}

export interface LoginRequest {
  usernameOrPhone: string;
  password: string;
}

export interface VerificationRequest {
  phone: string;
  code: string;
}

// API Service Class
class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  // Get auth token from storage
  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  // Set auth token in storage
  private async setAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Error setting auth token:', error);
    }
  }

  // Remove auth token from storage
  private async removeAuthToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('authToken');
    } catch (error) {
      console.error('Error removing auth token:', error);
    }
  }

  // Make HTTP request
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = await this.getAuthToken();
      const url = `${this.baseURL}${endpoint}`;

      console.log('🔍 Making API request to:', url);
      console.log('🔍 Request method:', options.method || 'GET');
      console.log('🔍 Request headers:', options.headers);
      console.log('🔍 Request body:', options.body);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers as Record<string, string>,
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
        console.log('🔍 Added Authorization header');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('⏰ Request timeout after', this.timeout, 'ms');
        controller.abort();
      }, this.timeout);

      console.log('📤 Sending request...');
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('📥 Response received:');
      console.log('📥 Status:', response.status);
      console.log('📥 Status text:', response.statusText);
      console.log('📥 Headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error Response:', errorData);
        
        let errorMessage = `HTTP ${response.status}`;
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log('✅ API response data:', responseData);
      
      // Handle the backend response format
      if (responseData.success) {
        return { 
          success: true, 
          data: responseData.data,
          message: responseData.message,
          error: responseData.error
        };
      } else {
        return {
          success: false,
          error: responseData.error || responseData.message || 'Request failed'
        };
      }
    } catch (error) {
      console.error('❌ API request failed:', error);
      console.error('❌ Request URL:', `${this.baseURL}${endpoint}`);
      console.error('❌ Error details:', error instanceof Error ? error.message : 'Unknown error');
      
      // Log more details about the error
      if (error instanceof TypeError) {
        console.error('❌ Network error - check if device can reach the server');
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Authentication Methods
  async signup(request: SignupRequest): Promise<ApiResponse<AuthResponse>> {
    console.log('Making signup request with data:', {
      fullName: request.fullName,
      username: request.username,
      country: request.country,
      phone: request.phone,
      password: '***' // Don't log password
    }); 
    
    const response = await this.makeRequest<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    console.log('Signup response:', response);

    if (response.success && response.data) {
      await this.setAuthToken(response.data.accessToken);
    }

    return response;
  }

  async login(request: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.makeRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    if (response.success && response.data) {
      await this.setAuthToken(response.data.accessToken);
    }

    return response;
  }

  async logout(): Promise<ApiResponse<void>> {
    await this.removeAuthToken();
    return { success: true };
  }

  async validateToken(): Promise<ApiResponse<any>> {
    return await this.makeRequest<any>('/auth/validate');
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse<any>> {
    return await this.makeRequest<any>('/auth/health');
  }

  // Test connectivity
  async testConnectivity(): Promise<ApiResponse<any>> {
    return await this.makeRequest<any>('/auth/test');
  }

  // Simple test method for debugging
  async testConnection(): Promise<{ success: boolean; message: string }> {
    console.log('🧪 Testing connection to backend...');
    console.log('🧪 Base URL:', this.baseURL);
    
    try {
      const response = await this.makeRequest<any>('/auth/health');
      console.log('🧪 Test response:', response);
      
      if (response.success) {
        return { success: true, message: 'Connection successful!' };
      } else {
        return { success: false, message: response.error || 'Connection failed' };
      }
    } catch (error) {
      console.error('🧪 Test failed:', error);
      return { success: false, message: 'Network error occurred' };
    }
  }

  // Test connectivity with multiple URLs
  async testBasicConnectivity(): Promise<{ success: boolean; details?: { workingURL?: string } }> {
    const testURLs = [
      'https://back-6lbs.onrender.com/api/v1/auth/test',
      'http://10.132.96.164:8080/api/v1/auth/health',
      'http://192.168.56.1:8080/api/v1/auth/health',
      'http://192.168.137.1:8080/api/v1/auth/health',
      'http://localhost:8080/api/v1/auth/health',
      'http://10.0.2.2:8080/api/v1/auth/health'
    ];
    
    
      try {
        // console.log('Testing URL:', url);
        const response = await fetch("https://back-6lbs.onrender.com/api/v1/auth/test", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        
        if (response.ok) {
          console.log('✅ Working URL found:');
          return { success: true};
        }
      } catch (error) {
        console.log('❌ Failed URL:', error);
      }
    }
    

  }

  


// Export singleton instance
export const apiService = new ApiService(); 