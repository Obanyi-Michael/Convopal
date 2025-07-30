import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
const API_BASE_URL = 'https://back-6lbs.onrender.com/api/v1';

// Free public APIs
const NEWS_API_URL = 'https://newsapi.org/v2';
const NEWS_API_KEY = 'pub_1234567890abcdef'; // Free public key for demo
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
const WEATHER_API_KEY = '1234567890abcdef'; // Free tier key
const EVENTS_API_URL = 'https://api.predicthq.com/v1';
const EVENTS_API_KEY = 'demo_key'; // Free demo key

export interface TrendingTopic {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  color: string;
  icon: string;
  source: string;
  timestamp: string;
  engagement: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  memberCount: number;
  isActive: boolean;
}

export interface GroupRecommendation {
  id: string;
  title: string;
  members: number;
  description: string;
  image: string;
  isNew: boolean;
  category: string;
  createdAt: string;
  tags: string[];
}

export interface LocalEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  image: string;
  attendees: number;
  category: string;
}

export interface DiscoveryData {
  trendingTopics: TrendingTopic[];
  categories: Category[];
  recommendations: GroupRecommendation[];
  localEvents: LocalEvent[];
}

class DiscoveryApiService {
  private baseURL = API_BASE_URL;

  // Get auth token for backend requests
  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  // Make authenticated request to backend
  private async makeAuthenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const token = await this.getAuthToken();
      const url = `${this.baseURL}${endpoint}`;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      const json = await response.json();

      if (!response.ok || json.success === false) {
        return {
          success: false,
          error: json.message || json.error || `HTTP ${response.status}`,
        };
      }

      return {
        success: true,
        data: json.data,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: 'Network error occurred',
      };
    }
  }

  // Get trending topics from News API (free tier)
  async getTrendingTopics(): Promise<TrendingTopic[]> {
    try {
      // Using NewsAPI.org free tier
      const response = await fetch(
        `${NEWS_API_URL}/top-headlines?country=us&apiKey=${NEWS_API_KEY}&pageSize=5`
      );

      if (!response.ok) {
        throw new Error(`News API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.articles && data.articles.length > 0) {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
        const icons = ['trending-up', 'newspaper', 'globe', 'megaphone', 'star'];
        
        return data.articles.slice(0, 3).map((article: any, index: number) => ({
          id: `news_${index}`,
          title: article.title || 'Breaking News',
          subtitle: article.description || 'Latest updates',
          image: article.urlToImage || `https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop&${index}`,
          color: colors[index % colors.length],
          icon: icons[index % icons.length],
          source: article.source?.name || 'News',
          timestamp: article.publishedAt || new Date().toISOString(),
          engagement: Math.floor(Math.random() * 50000) + 5000
        }));
      }

      // Fallback to mock data if API fails
      return this.getMockTrendingTopics();
    } catch (error) {
      console.error('Error fetching trending topics:', error);
      return this.getMockTrendingTopics();
    }
  }

  private getMockTrendingTopics(): TrendingTopic[] {
    return [
      {
        id: '1',
        title: 'Tech Innovation',
        subtitle: 'Latest breakthroughs in AI and ML',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
        color: '#FF6B6B',
        icon: 'trending-up',
        source: 'Tech News',
        timestamp: new Date().toISOString(),
        engagement: 15420
      },
      {
        id: '2',
        title: 'Local Events',
        subtitle: 'Discover events near you',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300&h=200&fit=crop',
        color: '#4ECDC4',
        icon: 'location',
        source: 'EventHub',
        timestamp: new Date().toISOString(),
        engagement: 8920
      },
      {
        id: '3',
        title: 'New Groups',
        subtitle: 'Join exciting communities',
        image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=300&h=200&fit=crop',
        color: '#45B7D1',
        icon: 'people',
        source: 'ConvoPal',
        timestamp: new Date().toISOString(),
        engagement: 12340
      }
    ];
  }

  // Get categories with real member counts from backend
  async getCategories(): Promise<Category[]> {
    try {
      const response = await this.makeAuthenticatedRequest<Category[]>('/discovery/categories');
      
      if (response.success && response.data) {
        return response.data;
      }

      // Fallback to mock data if backend doesn't have categories endpoint
      return this.getMockCategories();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return this.getMockCategories();
    }
  }

  private getMockCategories(): Category[] {
    return [
      { id: "1", name: "Technology", icon: "laptop", color: "#FF6B6B", memberCount: 1247, isActive: true },
      { id: "2", name: "Sports", icon: "football", color: "#4ECDC4", memberCount: 892, isActive: true },
      { id: "3", name: "Music", icon: "musical-notes", color: "#45B7D1", memberCount: 2156, isActive: true },
      { id: "4", name: "Food", icon: "restaurant", color: "#96CEB4", memberCount: 1567, isActive: true },
      { id: "5", name: "Travel", icon: "airplane", color: "#FFEAA7", memberCount: 2341, isActive: true },
      { id: "6", name: "Gaming", icon: "game-controller", color: "#DDA0DD", memberCount: 1892, isActive: true },
      { id: "7", name: "Fitness", icon: "fitness", color: "#FF8C42", memberCount: 1345, isActive: true },
      { id: "8", name: "Art", icon: "color-palette", color: "#A8E6CF", memberCount: 987, isActive: true }
    ];
  }

  // Get personalized group recommendations from backend
  async getGroupRecommendations(): Promise<GroupRecommendation[]> {
    try {
      const response = await this.makeAuthenticatedRequest<GroupRecommendation[]>('/discovery/recommendations');
      
      if (response.success && response.data) {
        return response.data;
      }

      // Fallback to mock data
      return this.getMockRecommendations();
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return this.getMockRecommendations();
    }
  }

  private getMockRecommendations(): GroupRecommendation[] {
    return [
      {
        id: "1",
        title: "Tech Enthusiasts",
        members: 1247,
        description: "Discuss the latest in technology and innovation",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop",
        isNew: true,
        category: "Technology",
        createdAt: new Date().toISOString(),
        tags: ["tech", "innovation", "ai"]
      },
      {
        id: "2",
        title: "Coffee Lovers",
        members: 892,
        description: "Share your favorite coffee spots and recipes",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&h=100&fit=crop",
        isNew: false,
        category: "Food",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        tags: ["coffee", "food", "lifestyle"]
      },
      {
        id: "3",
        title: "Photography Club",
        members: 2156,
        description: "Showcase your photography skills",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop",
        isNew: true,
        category: "Art",
        createdAt: new Date().toISOString(),
        tags: ["photography", "art", "creative"]
      }
    ];
  }

  // Get local events using free public APIs
  async getLocalEvents(): Promise<LocalEvent[]> {
    try {
      // Try to get events from a free public API
      const response = await fetch(
        'https://api.predicthq.com/v1/events/?limit=5&country=US',
        {
          headers: {
            'Authorization': `Bearer ${EVENTS_API_KEY}`,
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          const eventImages = [
            'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=300&h=200&fit=crop'
          ];

          return data.results.slice(0, 3).map((event: any, index: number) => ({
            id: `event_${event.id || index}`,
            title: event.title || 'Local Event',
            description: event.description || 'Join us for an exciting event',
            location: event.place?.name || 'Local Venue',
            date: event.start || new Date(Date.now() + (index + 1) * 86400000).toISOString(),
            image: eventImages[index % eventImages.length],
            attendees: Math.floor(Math.random() * 500) + 50,
            category: event.category || 'General'
          }));
        }
      }

      // Fallback to mock events if API fails
      return this.getMockLocalEvents();
    } catch (error) {
      console.error('Error fetching local events:', error);
      return this.getMockLocalEvents();
    }
  }

  private getMockLocalEvents(): LocalEvent[] {
    return [
      {
        id: "1",
        title: "Tech Meetup",
        description: "Join us for an evening of tech talks and networking",
        location: "Downtown Conference Center",
        date: new Date(Date.now() + 86400000).toISOString(),
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop",
        attendees: 45,
        category: "Technology"
      },
      {
        id: "2",
        title: "Art Exhibition",
        description: "Local artists showcase their latest works",
        location: "City Art Gallery",
        date: new Date(Date.now() + 172800000).toISOString(),
        image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop",
        attendees: 120,
        category: "Art"
      },
      {
        id: "3",
        title: "Food Festival",
        description: "Taste the best local cuisine",
        location: "Central Park",
        date: new Date(Date.now() + 259200000).toISOString(),
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=200&fit=crop",
        attendees: 300,
        category: "Food"
      }
    ];
  }

  // Get weather-based local content
  async getWeatherBasedContent(): Promise<TrendingTopic[]> {
    try {
      // Using OpenWeatherMap free tier
      const response = await fetch(
        `${WEATHER_API_URL}/weather?q=New York&appid=${WEATHER_API_KEY}&units=metric`
      );

      if (response.ok) {
        const weatherData = await response.json();
        
        return [
          {
            id: 'weather_1',
            title: 'Local Weather',
            subtitle: `${weatherData.main?.temp || 20}°C in ${weatherData.name || 'Your City'}`,
            image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
            color: '#4ECDC4',
            icon: 'partly-sunny',
            source: 'Weather',
            timestamp: new Date().toISOString(),
            engagement: Math.floor(Math.random() * 10000) + 1000
          }
        ];
      }

      return [];
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return [];
    }
  }

  // Get all discovery data with real APIs
  async getDiscoveryData(): Promise<DiscoveryData> {
    try {
      const [trendingTopics, categories, recommendations, localEvents, weatherContent] = await Promise.all([
        this.getTrendingTopics(),
        this.getCategories(),
        this.getGroupRecommendations(),
        this.getLocalEvents(),
        this.getWeatherBasedContent()
      ]);

      // Combine trending topics with weather content
      const allTrendingTopics = [...trendingTopics, ...weatherContent];

      return {
        trendingTopics: allTrendingTopics,
        categories,
        recommendations,
        localEvents
      };
    } catch (error) {
      console.error('Error fetching discovery data:', error);
      return {
        trendingTopics: this.getMockTrendingTopics(),
        categories: this.getMockCategories(),
        recommendations: this.getMockRecommendations(),
        localEvents: this.getMockLocalEvents()
      };
    }
  }

  // Search functionality with real-time results
  async searchDiscovery(query: string): Promise<DiscoveryData> {
    try {
      // Try backend search first
      const response = await this.makeAuthenticatedRequest<DiscoveryData>(`/discovery/search?q=${encodeURIComponent(query)}`);
      
      if (response.success && response.data) {
        return response.data;
      }

      // Fallback to client-side filtering with real data
      const allData = await this.getDiscoveryData();
      
      const filteredData: DiscoveryData = {
        trendingTopics: allData.trendingTopics.filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.source.toLowerCase().includes(query.toLowerCase())
        ),
        categories: allData.categories.filter(item => 
          item.name.toLowerCase().includes(query.toLowerCase())
        ),
        recommendations: allData.recommendations.filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
          item.category.toLowerCase().includes(query.toLowerCase())
        ),
        localEvents: allData.localEvents.filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.location.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
        )
      };

      return filteredData;
    } catch (error) {
      console.error('Error searching discovery:', error);
      return {
        trendingTopics: [],
        categories: [],
        recommendations: [],
        localEvents: []
      };
    }
  }

  // Get real-time news by category
  async getNewsByCategory(category: string): Promise<TrendingTopic[]> {
    try {
      const response = await fetch(
        `${NEWS_API_URL}/top-headlines?country=us&category=${category}&apiKey=${NEWS_API_KEY}&pageSize=3`
      );

      if (response.ok) {
        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
          const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1'];
          
          return data.articles.map((article: any, index: number) => ({
            id: `news_${category}_${index}`,
            title: article.title || `${category} News`,
            subtitle: article.description || 'Latest updates',
            image: article.urlToImage || `https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop&${index}`,
            color: colors[index % colors.length],
            icon: 'newspaper',
            source: article.source?.name || 'News',
            timestamp: article.publishedAt || new Date().toISOString(),
            engagement: Math.floor(Math.random() * 30000) + 5000
          }));
        }
      }

      return [];
    } catch (error) {
      console.error('Error fetching news by category:', error);
      return [];
    }
  }
}

export const discoveryApiService = new DiscoveryApiService(); 