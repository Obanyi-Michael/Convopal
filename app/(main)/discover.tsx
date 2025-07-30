import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../src/context/ThemeContext";

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  news: NewsItem[];
}

interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  source: string;
}

const hardcodedCategories: Category[] = [
  {
    id: 'technology',
    name: 'Technology',
    icon: 'laptop',
    color: '#007AFF',
    news: [
      {
        id: 'tech-1',
        title: 'New AI Breakthrough in Machine Learning',
        content: 'Researchers have developed a new neural network architecture that significantly improves performance on complex tasks while reducing computational requirements.',
        date: '2024-01-15',
        source: 'Tech Daily'
      },
      {
        id: 'tech-2',
        title: 'Quantum Computing Milestone Achieved',
        content: 'Scientists have successfully demonstrated quantum supremacy in a practical application, marking a major step forward in quantum computing technology.',
        date: '2024-01-14',
        source: 'Quantum Weekly'
      },
      {
        id: 'tech-3',
        title: '5G Network Expansion Accelerates',
        content: 'Major telecom companies announce rapid expansion of 5G infrastructure, promising faster internet speeds and improved connectivity nationwide.',
        date: '2024-01-13',
        source: 'Connectivity News'
      }
    ]
  },
  {
    id: 'business',
    name: 'Business',
    icon: 'briefcase',
    color: '#34C759',
    news: [
      {
        id: 'business-1',
        title: 'Global Markets Show Strong Recovery',
        content: 'Stock markets worldwide have shown remarkable resilience, with major indices reaching new highs as economic indicators improve.',
        date: '2024-01-15',
        source: 'Financial Times'
      },
      {
        id: 'business-2',
        title: 'Startup Funding Reaches Record Levels',
        content: 'Venture capital investment in startups has reached unprecedented levels, with technology companies leading the surge in funding.',
        date: '2024-01-14',
        source: 'Venture Capital Daily'
      },
      {
        id: 'business-3',
        title: 'Remote Work Revolution Continues',
        content: 'Companies worldwide are permanently adopting hybrid work models, reshaping office culture and real estate markets.',
        date: '2024-01-13',
        source: 'Workplace Weekly'
      }
    ]
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: 'football',
    color: '#FF9500',
    news: [
      {
        id: 'sports-1',
        title: 'Championship Finals Set for Next Week',
        content: 'The highly anticipated championship finals have been scheduled, with both teams showing exceptional form throughout the season.',
        date: '2024-01-15',
        source: 'Sports Central'
      },
      {
        id: 'sports-2',
        title: 'Olympic Preparations Enter Final Phase',
        content: 'Host cities are putting finishing touches on Olympic venues as athletes arrive for final training sessions before the games begin.',
        date: '2024-01-14',
        source: 'Olympic News'
      },
      {
        id: 'sports-3',
        title: 'Record-Breaking Performance in Athletics',
        content: 'A young athlete has shattered multiple world records in track and field events, drawing attention from scouts worldwide.',
        date: '2024-01-13',
        source: 'Athletics Today'
      }
    ]
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: 'film',
    color: '#FF2D92',
    news: [
      {
        id: 'entertainment-1',
        title: 'Blockbuster Movie Breaks Box Office Records',
        content: 'The latest superhero film has shattered previous box office records, becoming the highest-grossing movie of the year.',
        date: '2024-01-15',
        source: 'Movie News'
      },
      {
        id: 'entertainment-2',
        title: 'Music Festival Announces Star-Studded Lineup',
        content: 'One of the biggest music festivals has revealed its lineup, featuring top artists from around the world.',
        date: '2024-01-14',
        source: 'Music Weekly'
      },
      {
        id: 'entertainment-3',
        title: 'Streaming Platform Hits New Subscriber Milestone',
        content: 'A major streaming service has reached a new subscriber milestone, solidifying its position in the competitive market.',
        date: '2024-01-13',
        source: 'Streaming News'
      }
    ]
  },
  {
    id: 'health',
    name: 'Health',
    icon: 'medical',
    color: '#FF3B30',
    news: [
      {
        id: 'health-1',
        title: 'Breakthrough in Medical Research',
        content: 'Scientists have made significant progress in developing new treatments for chronic diseases, offering hope to millions of patients.',
        date: '2024-01-15',
        source: 'Medical Research Today'
      },
      {
        id: 'health-2',
        title: 'Global Health Initiative Launched',
        content: 'A new international health initiative aims to improve healthcare access in developing countries through innovative partnerships.',
        date: '2024-01-14',
        source: 'Global Health News'
      },
      {
        id: 'health-3',
        title: 'Mental Health Awareness Campaign',
        content: 'A comprehensive mental health awareness campaign has been launched to reduce stigma and improve access to mental health services.',
        date: '2024-01-13',
        source: 'Mental Health Weekly'
      }
    ]
  },
  {
    id: 'science',
    name: 'Science',
    icon: 'flask',
    color: '#AF52DE',
    news: [
      {
        id: 'science-1',
        title: 'New Species Discovered in Amazon',
        content: 'Biologists have discovered several new species in the Amazon rainforest, highlighting the region\'s incredible biodiversity.',
        date: '2024-01-15',
        source: 'Science Daily'
      },
      {
        id: 'science-2',
        title: 'Climate Change Research Findings',
        content: 'New research provides compelling evidence about the impact of climate change on global ecosystems and weather patterns.',
        date: '2024-01-14',
        source: 'Climate Science Journal'
      },
      {
        id: 'science-3',
        title: 'Space Exploration Mission Success',
        content: 'A space exploration mission has successfully collected valuable data about distant planets, advancing our understanding of the universe.',
        date: '2024-01-13',
        source: 'Space News'
      }
    ]
  }
];

interface CategoryItemProps {
  item: Category;
  onPress: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ item, onPress }) => (
  <TouchableOpacity style={styles.categoryItem} onPress={onPress}>
    <View style={[styles.categoryIcon, { backgroundColor: `${item.color}15` }]}>
      <Ionicons name={item.icon as any} size={24} color={item.color} />
    </View>
    <Text style={styles.categoryName}>{item.name}</Text>
    <Text style={styles.categoryCount}>{item.news.length} articles</Text>
  </TouchableOpacity>
);

interface NewsItemProps {
  item: NewsItem;
}

const NewsItem: React.FC<NewsItemProps> = ({ item }) => (
  <View style={styles.newsItem}>
    <Text style={styles.newsTitle}>{item.title}</Text>
    <Text style={styles.newsContent}>{item.content}</Text>
    <View style={styles.newsFooter}>
      <Text style={styles.newsDate}>{item.date}</Text>
      <Text style={styles.newsSource}>{item.source}</Text>
    </View>
  </View>
);

export default function DiscoverScreen() {
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleCategoryPress = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleBackPress = () => {
    setSelectedCategory(null);
  };

  if (selectedCategory) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>{selectedCategory.name}</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Latest News</Text>
            {selectedCategory.news.map((newsItem) => (
              <NewsItem key={newsItem.id} item={newsItem} />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Discover</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color={colors.success} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Categories Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>News Categories</Text>
          <View style={styles.categoriesGrid}>
            {hardcodedCategories.map((category) => (
              <CategoryItem
                key={category.id}
                item={category}
                onPress={() => handleCategoryPress(category)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingTop: 20,
    paddingHorizontal: 16,
    backgroundColor: "white",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  searchButton: {
    padding: 8,
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryItem: {
    width: "48%", // Two items per row
    alignItems: "center",
    marginBottom: 12,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
  categoryCount: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
  },
  newsItem: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  newsContent: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  newsFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  newsDate: {
    fontSize: 12,
    color: "#8E8E93",
  },
  newsSource: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
  },
}); 