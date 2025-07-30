import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    RefreshControl,
    TextInput,
    Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../src/context/ThemeContext";
import { discoveryApiService, TrendingTopic, Category, GroupRecommendation, LocalEvent, DiscoveryData } from "../../../src/services/discoveryApi";

interface FeaturedCardProps {
  item: TrendingTopic;
  onPress: () => void;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ item, onPress }) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity style={[styles.featuredCard, { backgroundColor: item.color }]} onPress={onPress}>
      <View style={styles.featuredContent}>
        <View style={styles.featuredIcon}>
          <Ionicons name={item.icon as any} size={32} color="white" />
        </View>
        <View style={styles.featuredText}>
          <Text style={styles.featuredTitle}>{item.title}</Text>
          <Text style={styles.featuredSubtitle}>{item.subtitle}</Text>
          <Text style={styles.featuredSource}>{item.source}</Text>
        </View>
      </View>
      <View style={styles.featuredOverlay} />
    </TouchableOpacity>
  );
};

interface CategoryItemProps {
  item: Category;
  onPress: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ item, onPress }) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity style={styles.categoryItem} onPress={onPress}>
      <View style={[styles.categoryIcon, { backgroundColor: `${item.color}15` }]}>
        <Ionicons name={item.icon as any} size={24} color={item.color} />
      </View>
      <Text style={[styles.categoryName, { color: colors.textPrimary }]}>{item.name}</Text>
      <Text style={[styles.categoryMemberCount, { color: colors.textSecondary }]}>{item.memberCount} members</Text>
    </TouchableOpacity>
  );
};

interface RecommendationCardProps {
  item: GroupRecommendation;
  onPress: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ item, onPress }) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity style={[styles.recommendationCard, { backgroundColor: colors.card }]} onPress={onPress}>
      <Image source={{ uri: item.image }} style={styles.recommendationImage} />
      <View style={styles.recommendationContent}>
        <View style={styles.recommendationHeader}>
          <Text style={[styles.recommendationTitle, { color: colors.textPrimary }]}>{item.title}</Text>
          {item.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}
        </View>
        <Text style={[styles.recommendationDescription, { color: colors.textSecondary }]}>{item.description}</Text>
        <View style={styles.recommendationFooter}>
          <View style={styles.recommendationMeta}>
            <Ionicons name="people" size={16} color={colors.textSecondary} />
            <Text style={[styles.memberCount, { color: colors.textSecondary }]}>{item.members} members</Text>
            <Text style={[styles.categoryTag, { color: colors.textSecondary }]}>{item.category}</Text>
          </View>
          <TouchableOpacity style={[styles.joinButton, { backgroundColor: colors.success }]}>
            <Text style={[styles.joinButtonText, { color: colors.textLight }]}>Join</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

interface LocalEventCardProps {
  item: LocalEvent;
  onPress: () => void;
}

const LocalEventCard: React.FC<LocalEventCardProps> = ({ item, onPress }) => {
  const { colors } = useTheme();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <TouchableOpacity style={[styles.eventCard, { backgroundColor: colors.card }]} onPress={onPress}>
      <Image source={{ uri: item.image }} style={styles.eventImage} />
      <View style={styles.eventContent}>
        <Text style={[styles.eventTitle, { color: colors.textPrimary }]}>{item.title}</Text>
        <Text style={[styles.eventDescription, { color: colors.textSecondary }]}>{item.description}</Text>
        <View style={styles.eventMeta}>
          <Ionicons name="location" size={14} color={colors.textSecondary} />
          <Text style={[styles.eventLocation, { color: colors.textSecondary }]}>{item.location}</Text>
        </View>
        <View style={styles.eventMeta}>
          <Ionicons name="time" size={14} color={colors.textSecondary} />
          <Text style={[styles.eventDate, { color: colors.textSecondary }]}>{formatDate(item.date)}</Text>
        </View>
        <View style={styles.eventFooter}>
          <Text style={[styles.eventAttendees, { color: colors.textSecondary }]}>{item.attendees} attending</Text>
          <TouchableOpacity style={[styles.attendButton, { backgroundColor: colors.success }]}>
            <Text style={[styles.attendButtonText, { color: colors.textLight }]}>Attend</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function DiscoverScreen() {
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [discoveryData, setDiscoveryData] = useState<DiscoveryData>({
    trendingTopics: [],
    categories: [],
    recommendations: [],
    localEvents: []
  });

  useEffect(() => {
    loadDiscoveryData();
  }, []);

  const loadDiscoveryData = async () => {
    try {
      setLoading(true);
      const data = await discoveryApiService.getDiscoveryData();
      setDiscoveryData(data);
    } catch (error) {
      console.error('Error loading discovery data:', error);
      Alert.alert("Error", "Failed to load discovery data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDiscoveryData();
    setRefreshing(false);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const searchResults = await discoveryApiService.searchDiscovery(query);
        setDiscoveryData(searchResults);
      } catch (error) {
        console.error('Error searching:', error);
      }
    } else {
      await loadDiscoveryData();
    }
  };

  const handleFeaturedPress = (item: TrendingTopic) => {
    Alert.alert("Featured", `You selected: ${item.title}`);
  };

  const handleCategoryPress = (item: Category) => {
    setSelectedCategory(item.id);
    loadCategoryNews(item.name);
    Alert.alert("Category", `You selected: ${item.name}`);
  };

  const loadCategoryNews = async (categoryName: string) => {
    try {
      const categoryNews = await discoveryApiService.getNewsByCategory(categoryName.toLowerCase());
      if (categoryNews.length > 0) {
        // Update trending topics with category-specific news
        setDiscoveryData(prev => ({
          ...prev,
          trendingTopics: [...categoryNews, ...prev.trendingTopics.slice(categoryNews.length)]
        }));
      }
    } catch (error) {
      console.error('Error loading category news:', error);
    }
  };

  const handleRecommendationPress = (item: GroupRecommendation) => {
    Alert.alert("Join Group", `Join ${item.title}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Join", onPress: () => console.log("Joined group:", item.title) }
    ]);
  };

  const handleEventPress = (item: LocalEvent) => {
    Alert.alert("Event", `Attend ${item.title}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Attend", onPress: () => console.log("Attending event:", item.title) }
    ]);
  };

  const renderFeaturedItem = ({ item }: { item: TrendingTopic }) => (
    <FeaturedCard item={item} onPress={() => handleFeaturedPress(item)} />
  );

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <CategoryItem item={item} onPress={() => handleCategoryPress(item)} />
  );

  const renderRecommendationItem = ({ item }: { item: GroupRecommendation }) => (
    <RecommendationCard item={item} onPress={() => handleRecommendationPress(item)} />
  );

  const renderEventItem = ({ item }: { item: LocalEvent }) => (
    <LocalEventCard item={item} onPress={() => handleEventPress(item)} />
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.success} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading discovery...</Text>
        </View>
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

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <TextInput
          style={[styles.searchInput, { 
            backgroundColor: colors.inputBackground,
            color: colors.textPrimary,
            borderColor: colors.inputBorder
          }]}
          placeholder="Search topics, groups, events..."
          placeholderTextColor={colors.inputPlaceholder}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Featured Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Trending</Text>
          <FlatList
            data={discoveryData.trendingTopics}
            renderItem={renderFeaturedItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
          />
        </View>

        {/* Categories Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {discoveryData.categories.map((category) => (
              <CategoryItem
                key={category.id}
                item={category}
                onPress={() => handleCategoryPress(category)}
              />
            ))}
          </View>
        </View>

        {/* Local Events Section */}
        {discoveryData.localEvents.length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Local Events</Text>
              <TouchableOpacity>
                <Text style={[styles.seeAllText, { color: colors.success }]}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={discoveryData.localEvents}
              renderItem={renderEventItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.eventsList}
            />
          </View>
        )}

        {/* Recommendations Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Recommended for You</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.success }]}>See All</Text>
            </TouchableOpacity>
          </View>
          {discoveryData.recommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.id}
              item={recommendation}
              onPress={() => handleRecommendationPress(recommendation)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  searchButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInput: {
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
  },
  featuredList: {
    paddingRight: 16,
  },
  featuredCard: {
    width: 280,
    height: 120,
    borderRadius: 12,
    marginRight: 12,
    position: "relative",
    overflow: "hidden",
  },
  featuredContent: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    zIndex: 2,
  },
  featuredIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  featuredText: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  featuredSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
  },
  featuredSource: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
  },
  featuredOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryItem: {
    width: "48%",
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
    textAlign: "center",
    marginBottom: 2,
  },
  categoryMemberCount: {
    fontSize: 12,
    textAlign: "center",
  },
  eventsList: {
    paddingRight: 16,
  },
  eventCard: {
    width: 250,
    borderRadius: 12,
    marginRight: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  eventImage: {
    width: "100%",
    height: 120,
  },
  eventContent: {
    padding: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  eventMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 12,
    marginLeft: 4,
  },
  eventDate: {
    fontSize: 12,
    marginLeft: 4,
  },
  eventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  eventAttendees: {
    fontSize: 12,
  },
  attendButton: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  attendButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  recommendationCard: {
    flexDirection: "row",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  recommendationImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  recommendationContent: {
    flex: 1,
    padding: 12,
  },
  recommendationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  newBadge: {
    backgroundColor: "#07C160",
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  newBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  recommendationDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  recommendationFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  recommendationMeta: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  memberCount: {
    fontSize: 14,
    marginLeft: 4,
    marginRight: 8,
  },
  categoryTag: {
    fontSize: 12,
    backgroundColor: "rgba(0,0,0,0.1)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  joinButton: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
}); 