import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
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
    isVerified: boolean;
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
  private baseURL = 'https://back-6lbs.onrender.com/api/v1';
  private timeout = 10000; // 10 seconds

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

      console.log('Making API request to:', url);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers as Record<string, string>,
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        
        let errorMessage = `HTTP ${response.status}`;
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('API response data:', data);
      return { success: true, data };
    } catch (error) {
      console.error('API request failed:', error);
      console.error('Request URL:', `${this.baseURL}${endpoint}`);
      console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
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

  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    return await this.makeRequest<AuthResponse>('/auth/refresh', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<ApiResponse<any>> {
    return await this.makeRequest<any>('/auth/validate');
  }

  // Profile Management Methods
  async getCurrentUserProfile(): Promise<ApiResponse<any>> {
    return await this.makeRequest<any>('/profile/me');
  }

  async getUserProfileById(userId: number): Promise<ApiResponse<any>> {
    return await this.makeRequest<any>(`/profile/${userId}`);
  }

  async getUserProfileByUsername(username: string): Promise<ApiResponse<any>> {
    return await this.makeRequest<any>(`/profile/username/${username}`);
  }

  async updateProfile(profileData: {
    fullName?: string;
    bio?: string;
    status?: string;
    avatarUrl?: string;
  }): Promise<ApiResponse<any>> {
    return await this.makeRequest<any>('/profile/update', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async searchUsers(query: string): Promise<ApiResponse<any[]>> {
    return await this.makeRequest<any[]>(`/profile/search?query=${encodeURIComponent(query)}`);
  }

  async updateOnlineStatus(isOnline: boolean): Promise<ApiResponse<any>> {
    return await this.makeRequest<any>('/profile/online-status', {
      method: 'POST',
      body: JSON.stringify({ isOnline }),
    });
  }

  // Contact Management Methods
  async sendContactRequest(username: string): Promise<ApiResponse<any>> {
    return await this.makeRequest<any>('/contacts/request', {
      method: 'POST',
      body: JSON.stringify({ username }),
    });
  }

  async getContacts(): Promise<ApiResponse<any[]>> {
    return await this.makeRequest<any[]>('/contacts');
  }

  async getPendingRequests(): Promise<ApiResponse<any[]>> {
    return await this.makeRequest<any[]>('/contacts/pending');
  }

  async getSentRequests(): Promise<ApiResponse<any[]>> {
    return await this.makeRequest<any[]>('/contacts/sent');
  }

  async acceptContactRequest(contactId: number): Promise<ApiResponse<any>> {
    return await this.makeRequest<any>(`/contacts/${contactId}/accept`, {
      method: 'POST',
    });
  }

  async rejectContactRequest(contactId: number): Promise<ApiResponse<any>> {
    return await this.makeRequest<any>(`/contacts/${contactId}/reject`, {
      method: 'POST',
    });
  }

  async removeContact(contactId: number): Promise<ApiResponse<any>> {
    return await this.makeRequest<any>(`/contacts/${contactId}`, {
      method: 'DELETE',
    });
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse<any>> {
    return await this.makeRequest<any>('/auth/health');
  }

  // Test connectivity
  async testConnectivity(): Promise<ApiResponse<any>> {
    return await this.makeRequest<any>('/auth/test');
  }

  // Simple connectivity test
  async testBackendConnection(): Promise<boolean> {
    try {
      console.log('Testing backend connection...');
      
      const healthResponse = await this.makeRequest<any>('/auth/health');
      console.log('Health check response:', healthResponse);
      
      return healthResponse.success;
    } catch (error) {
      console.error('Backend connection test failed:', error);
      return false;
    }
  }

  // Update API base URL
  updateBaseURL(newBaseURL: string): void {
    this.baseURL = newBaseURL;
    console.log('Updated API base URL to:', newBaseURL);
  }

  // Chat Methods
  async sendMessage(receiverUsername: string, content: string, type: string = 'TEXT'): Promise<ApiResponse<any>> {
    return this.makeRequest('/chat/messages', {
      method: 'POST',
      body: JSON.stringify({ receiverUsername, content, type })
    });
  }

  async getConversation(username: string, page: number = 0, size: number = 50): Promise<ApiResponse<any>> {
    return this.makeRequest(`/chat/conversation/${username}?page=${page}&size=${size}`);
  }

  async markMessagesAsRead(username: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/chat/messages/read/${username}`, {
      method: 'POST'
    });
  }

  async getUnreadCount(username: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/chat/unread-count/${username}`);
  }

  async getUnreadMessages(): Promise<ApiResponse<any>> {
    return this.makeRequest('/chat/unread-messages');
  }

  // Group Chat Methods
  async createGroup(groupData: { name: string; description?: string; avatarUrl?: string; memberUsernames: string[] }): Promise<ApiResponse<any>> {
    return this.makeRequest('/groups', {
      method: 'POST',
      body: JSON.stringify(groupData)
    });
  }

  async getUserGroups(): Promise<ApiResponse<any>> {
    return this.makeRequest('/groups');
  }

  async getGroupById(groupId: number): Promise<ApiResponse<any>> {
    return this.makeRequest(`/groups/${groupId}`);
  }

  async sendGroupMessage(groupId: number, content: string, type: string = 'TEXT'): Promise<ApiResponse<any>> {
    return this.makeRequest('/groups/messages', {
      method: 'POST',
      body: JSON.stringify({ groupId, content, type })
    });
  }

  async getGroupMessages(groupId: number, page: number = 0, size: number = 50): Promise<ApiResponse<any>> {
    return this.makeRequest(`/groups/${groupId}/messages?page=${page}&size=${size}`);
  }

  async markGroupMessagesAsRead(groupId: number): Promise<ApiResponse<any>> {
    return this.makeRequest(`/groups/${groupId}/messages/read`, {
      method: 'POST'
    });
  }

  async getGroupUnreadCount(groupId: number): Promise<ApiResponse<any>> {
    return this.makeRequest(`/groups/${groupId}/unread-count`);
  }
}

// Export singleton instance
export const apiService = new ApiService(); 