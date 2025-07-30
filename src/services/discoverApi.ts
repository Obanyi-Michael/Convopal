// Discover API Service for real-time content
const GNEWS_API_KEY = 'YOUR_GNEWS_API_KEY'; // You'll need to get a free API key from https://gnews.io/
const GNEWS_BASE_URL = 'https://gnews.io/api/v4';

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

export interface FeaturedContent {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  color: string;
  icon: string;
  url?: string;
  type: 'news' | 'event' | 'trending';
}

export interface LocalEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  category: string;
  attendees: number;
}

export interface Recommendation {
  id: string;
  title: string;
  members: number;
  description: string;
  image: string;
  isNew: boolean;
  category: string;
  trending: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

class DiscoverApiService {
  private async makeRequest<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get trending news for featured content
  async getTrendingNews(): Promise<NewsArticle[]> {
    try {
      // For demo purposes, we'll use a fallback if no API key is provided
      if (!GNEWS_API_KEY || GNEWS_API_KEY === 'YOUR_GNEWS_API_KEY') {
        return this.getFallbackNews();
      }

      const url = `${GNEWS_BASE_URL}/top-headlines?country=gh&lang=en&max=10&apikey=${GNEWS_API_KEY}`;
      const response = await this.makeRequest<{ articles: NewsArticle[] }>(url);
      return response.articles || [];
    } catch (error) {
      console.error('Failed to fetch trending news:', error);
      return this.getFallbackNews();
    }
  }

  // Fallback news data when API is not available
  private getFallbackNews(): NewsArticle[] {
    return [
      {
        id: '1',
        title: 'Ghana Tech Startup Raises $2M in Funding',
        description: 'Local startup focused on mobile payments secures major investment',
        content: 'A Ghanaian tech startup has successfully raised $2 million in seed funding...',
        url: 'https://example.com/news1',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
        publishedAt: new Date().toISOString(),
        source: { name: 'Tech Ghana', url: 'https://techghana.com' }
      },
      {
        id: '2',
        title: 'New Music Festival Announced for Accra',
        description: 'Major international artists to perform in Ghana\'s capital',
        content: 'The city of Accra will host a major music festival featuring international artists...',
        url: 'https://example.com/news2',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop',
        publishedAt: new Date().toISOString(),
        source: { name: 'Entertainment Weekly', url: 'https://entertainment.com' }
      },
      {
        id: '3',
        title: 'Ghana's Digital Economy Grows 15%',
        description: 'E-commerce and fintech sectors lead the growth',
        content: 'Ghana\'s digital economy has shown remarkable growth with a 15% increase...',
        url: 'https://example.com/news3',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
        publishedAt: new Date().toISOString(),
        source: { name: 'Business Daily', url: 'https://businessdaily.com' }
      }
    ];
  }

  // Get featured content (trending news + events)
  async getFeaturedContent(): Promise<FeaturedContent[]> {
    try {
      const news = await this.getTrendingNews();
      
      return news.slice(0, 3).map((article, index) => ({
        id: article.id,
        title: this.getFeaturedTitle(article.title),
        subtitle: article.description.substring(0, 60) + '...',
        image: article.image,
        color: this.getFeaturedColor(index),
        icon: this.getFeaturedIcon(article.title),
        url: article.url,
        type: 'news' as const
      }));
    } catch (error) {
      console.error('Failed to get featured content:', error);
      return this.getFallbackFeaturedContent();
    }
  }

  private getFeaturedTitle(title: string): string {
    if (title.toLowerCase().includes('tech') || title.toLowerCase().includes('startup')) {
      return 'Tech Trends';
    } else if (title.toLowerCase().includes('music') || title.toLowerCase().includes('festival')) {
      return 'Local Events';
    } else if (title.toLowerCase().includes('digital') || title.toLowerCase().includes('economy')) {
      return 'Business News';
    }
    return 'Trending Now';
  }

  private getFeaturedColor(index: number): string {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
    return colors[index % colors.length];
  }

  private getFeaturedIcon(title: string): string {
    if (title.toLowerCase().includes('tech') || title.toLowerCase().includes('startup')) {
      return 'trending-up';
    } else if (title.toLowerCase().includes('music') || title.toLowerCase().includes('festival')) {
      return 'location';
    } else if (title.toLowerCase().includes('digital') || title.toLowerCase().includes('economy')) {
      return 'business';
    }
    return 'trending-up';
  }

  private getFallbackFeaturedContent(): FeaturedContent[] {
    return [
      {
        id: '1',
        title: 'Tech Trends',
        subtitle: 'Latest in technology and innovation',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
        color: '#FF6B6B',
        icon: 'trending-up',
        type: 'news'
      },
      {
        id: '2',
        title: 'Local Events',
        subtitle: 'Discover events near you',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop',
        color: '#4ECDC4',
        icon: 'location',
        type: 'event'
      },
      {
        id: '3',
        title: 'Business News',
        subtitle: 'Stay updated with market trends',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
        color: '#45B7D1',
        icon: 'business',
        type: 'trending'
      }
    ];
  }

  // Get local events (simulated for now)
  async getLocalEvents(): Promise<LocalEvent[]> {
    // Simulate local events based on current trends
    const events = [
      {
        id: '1',
        title: 'Accra Tech Meetup',
        description: 'Join fellow developers and tech enthusiasts for networking and knowledge sharing',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        location: 'Accra Digital Center',
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=200&fit=crop',
        category: 'Technology',
        attendees: 156
      },
      {
        id: '2',
        title: 'Ghana Music Awards',
        description: 'Celebrate the best of Ghanaian music with live performances',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        location: 'National Theatre, Accra',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop',
        category: 'Music',
        attendees: 1200
      },
      {
        id: '3',
        title: 'Food Festival Ghana',
        description: 'Taste the best of Ghanaian cuisine and international dishes',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
        location: 'Independence Square',
        image: 'https://images.unsplash.com/photo-1504674900240-894d0b5e6c8b?w=400&h=200&fit=crop',
        category: 'Food',
        attendees: 450
      }
    ];

    return events;
  }

  // Get dynamic recommendations based on trending topics
  async getRecommendations(): Promise<Recommendation[]> {
    try {
      const news = await this.getTrendingNews();
      const categories = this.extractCategoriesFromNews(news);
      
      return categories.map((category, index) => ({
        id: `rec-${index + 1}`,
        title: this.generateGroupTitle(category),
        members: Math.floor(Math.random() * 2000) + 100,
        description: this.generateGroupDescription(category),
        image: this.getCategoryImage(category),
        isNew: Math.random() > 0.7, // 30% chance of being new
        category: category,
        trending: Math.random() > 0.5 // 50% chance of trending
      }));
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      return this.getFallbackRecommendations();
    }
  }

  private extractCategoriesFromNews(news: NewsArticle[]): string[] {
    const categories = new Set<string>();
    
    news.forEach(article => {
      const title = article.title.toLowerCase();
      if (title.includes('tech') || title.includes('startup') || title.includes('digital')) {
        categories.add('Technology');
      }
      if (title.includes('music') || title.includes('festival') || title.includes('concert')) {
        categories.add('Music');
      }
      if (title.includes('food') || title.includes('restaurant') || title.includes('cuisine')) {
        categories.add('Food');
      }
      if (title.includes('sport') || title.includes('football') || title.includes('fitness')) {
        categories.add('Sports');
      }
      if (title.includes('art') || title.includes('design') || title.includes('creative')) {
        categories.add('Art');
      }
    });

    // Add default categories if none found
    if (categories.size === 0) {
      categories.add('Technology');
      categories.add('Music');
      categories.add('Food');
    }

    return Array.from(categories);
  }

  private generateGroupTitle(category: string): string {
    const titles = {
      'Technology': ['Tech Enthusiasts', 'Digital Innovators', 'Code Community'],
      'Music': ['Music Lovers', 'Ghanaian Music', 'Sound Collective'],
      'Food': ['Food Explorers', 'Ghanaian Cuisine', 'Culinary Adventures'],
      'Sports': ['Sports Fans', 'Fitness Community', 'Active Lifestyle'],
      'Art': ['Creative Minds', 'Art Collectors', 'Design Community']
    };

    const categoryTitles = titles[category as keyof typeof titles] || ['Community'];
    return categoryTitles[Math.floor(Math.random() * categoryTitles.length)];
  }

  private generateGroupDescription(category: string): string {
    const descriptions = {
      'Technology': 'Discuss the latest in technology, share projects, and connect with fellow developers',
      'Music': 'Share your favorite music, discover new artists, and discuss the Ghanaian music scene',
      'Food': 'Explore Ghanaian cuisine, share recipes, and discover the best local restaurants',
      'Sports': 'Stay active together, share fitness tips, and support local sports teams',
      'Art': 'Showcase your creativity, share artwork, and connect with fellow artists'
    };

    return descriptions[category as keyof typeof descriptions] || 'Connect with like-minded people';
  }

  private getCategoryImage(category: string): string {
    const images = {
      'Technology': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop',
      'Music': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
      'Food': 'https://images.unsplash.com/photo-1504674900240-894d0b5e6c8b?w=100&h=100&fit=crop',
      'Sports': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
      'Art': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8a?w=100&h=100&fit=crop'
    };

    return images[category as keyof typeof images] || 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop';
  }

  private getFallbackRecommendations(): Recommendation[] {
    return [
      {
        id: '1',
        title: 'Tech Enthusiasts',
        members: 1247,
        description: 'Discuss the latest in technology and innovation',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop',
        isNew: true,
        category: 'Technology',
        trending: true
      },
      {
        id: '2',
        title: 'Music Lovers',
        members: 892,
        description: 'Share your favorite music and discover new artists',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
        isNew: false,
        category: 'Music',
        trending: true
      },
      {
        id: '3',
        title: 'Food Explorers',
        members: 2156,
        description: 'Explore Ghanaian cuisine and share recipes',
        image: 'https://images.unsplash.com/photo-1504674900240-894d0b5e6c8b?w=100&h=100&fit=crop',
        isNew: true,
        category: 'Food',
        trending: false
      }
    ];
  }

  // Get categories with dynamic counts
  async getCategories(): Promise<Category[]> {
    const categories = [
      { id: "1", name: "Technology", icon: "laptop", color: "#FF6B6B" },
      { id: "2", name: "Sports", icon: "football", color: "#4ECDC4" },
      { id: "3", name: "Music", icon: "musical-notes", color: "#45B7D1" },
      { id: "4", name: "Food", icon: "restaurant", color: "#96CEB4" },
      { id: "5", name: "Travel", icon: "airplane", color: "#FFEAA7" },
      { id: "6", name: "Gaming", icon: "game-controller", color: "#DDA0DD" },
      { id: "7", name: "Fitness", icon: "fitness", color: "#FF8C42" },
      { id: "8", name: "Art", icon: "color-palette", color: "#A8E6CF" }
    ];

    // Add dynamic counts based on trending topics
    return categories.map(category => ({
      ...category,
      count: Math.floor(Math.random() * 500) + 50
    }));
  }
}

export const discoverApiService = new DiscoverApiService(); 