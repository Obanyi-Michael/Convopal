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
    Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { discoverApiService, FeaturedContent, LocalEvent, Recommendation, Category } from "../../../src/services/discoverApi";
import { useTheme } from "../../../src/context/ThemeContext";

interface FeaturedCardProps {
  item: FeaturedContent;
  onPress: () => void;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ item, onPress }) => (
  <TouchableOpacity style={[styles.featuredCard, { backgroundColor: item.color }]} onPress={onPress}>
    <View style={styles.featuredContent}>
      <View style={styles.featuredIcon}>
        <Ionicons name={item.icon as any} size={32} color="white" />
      </View>
      <View style={styles.featuredText}>
        <Text style={styles.featuredTitle}>{item.title}</Text>
        <Text style={styles.featuredSubtitle}>{item.subtitle}</Text>
      </View>
    </View>
    <View style={styles.featuredOverlay} />
  </TouchableOpacity>
);

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
    <Text style={styles.categoryCount}>{item.count} topics</Text>
  </TouchableOpacity>
);

interface RecommendationCardProps {
  item: Recommendation;
  onPress: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ item, onPress }) => (
  <TouchableOpacity style={styles.recommendationCard} onPress={onPress}>
    <Image source={{ uri: item.image }} style={styles.recommendationImage} />
    <View style={styles.recommendationContent}>
      <View style={styles.recommendationHeader}>
        <Text style={styles.recommendationTitle}>{item.title}</Text>
        <View style={styles.badgeContainer}>
          {item.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}
          {item.trending && (
            <View style={styles.trendingBadge}>
              <Text style={styles.trendingBadgeText}>🔥</Text>
            </View>
          )}
        </View>
      </View>
      <Text style={styles.recommendationDescription}>{item.description}</Text>
      <View style={styles.recommendationFooter}>
        <Ionicons name="people" size={16} color="#8E8E93" />
        <Text style={styles.memberCount}>{item.members} members</Text>
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

export default function DiscoverScreen() {
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [featuredContent, setFeaturedContent] = useState<FeaturedContent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [localEvents, setLocalEvents] = useState<LocalEvent[]>([]);

  useEffect(() => {
    loadDiscoverData();
  }, []);

  const loadDiscoverData = async () => {
    try {
      setLoading(true);
      const [featured, cats, recs, events] = await Promise.all([
        discoverApiService.getFeaturedContent(),
        discoverApiService.getCategories(),
        discoverApiService.getRecommendations(),
        discoverApiService.getLocalEvents()
      ]);

      setFeaturedContent(featured);
      setCategories(cats);
      setRecommendations(recs);
      setLocalEvents(events);
    } catch (error) {
      console.error('Failed to load discover data:', error);
      Alert.alert('Error', 'Failed to load discover content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDiscoverData();
    setRefreshing(false);
  };

  const handleFeaturedPress = (item: FeaturedContent) => {
    console.log("Featured item pressed:", item.title);
    if (item.url) {
      // In a real app, you might open the URL or navigate to a detail screen
      Alert.alert('Featured Content', `Opening: ${item.title}`);
    }
  };

  const handleCategoryPress = (item: Category) => {
    setSelectedCategory(item.id);
    console.log("Category pressed:", item.name);
    Alert.alert('Category', `Selected: ${item.name} (${item.count} topics)`);
  };

  const handleRecommendationPress = (item: Recommendation) => {
    console.log("Recommendation pressed:", item.title);
    Alert.alert('Join Group', `Joining: ${item.title}`);
  };

  const handleEventPress = (event: LocalEvent) => {
    console.log("Event pressed:", event.title);
    Alert.alert('Event Details', `${event.title}\n\n${event.description}\n\nDate: ${new Date(event.date).toLocaleDateString()}\nLocation: ${event.location}\nAttendees: ${event.attendees}`);
  };

  const renderFeaturedItem = ({ item }: { item: FeaturedContent }) => (
    <FeaturedCard item={item} onPress={() => handleFeaturedPress(item)} />
  );

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <CategoryItem item={item} onPress={() => handleCategoryPress(item)} />
  );

  const renderRecommendationItem = ({ item }: { item: Recommendation }) => (
    <RecommendationCard item={item} onPress={() => handleRecommendationPress(item)} />
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.success} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading discover content...</Text>
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

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Featured Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Featured</Text>
          <FlatList
            data={featuredContent}
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
            {categories.map((category) => (
              <CategoryItem
                key={category.id}
                item={category}
                onPress={() => handleCategoryPress(category)}
              />
            ))}
          </View>
        </View>

        {/* Local Events Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Local Events</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.success }]}>See All</Text>
            </TouchableOpacity>
          </View>
          {localEvents.map((event) => (
            <TouchableOpacity 
              key={event.id} 
              style={styles.eventCard}
              onPress={() => handleEventPress(event)}
            >
              <Image source={{ uri: event.image }} style={styles.eventImage} />
              <View style={styles.eventContent}>
                <Text style={[styles.eventTitle, { color: colors.textPrimary }]}>{event.title}</Text>
                <Text style={[styles.eventDescription, { color: colors.textSecondary }]}>{event.description}</Text>
                <View style={styles.eventFooter}>
                  <Ionicons name="location" size={14} color={colors.textSecondary} />
                  <Text style={[styles.eventLocation, { color: colors.textSecondary }]}>{event.location}</Text>
                  <Ionicons name="people" size={14} color={colors.textSecondary} />
                  <Text style={[styles.eventAttendees, { color: colors.textSecondary }]}>{event.attendees} attending</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recommendations Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Recommended for You</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.success }]}>See All</Text>
            </TouchableOpacity>
          </View>
          {recommendations.map((recommendation) => (
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
  headerLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  searchButton: {
    padding: 8,
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    color: "#07C160",
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
  recommendationCard: {
    flexDirection: "row",
    backgroundColor: "white",
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
    color: "#000",
  },
  badgeContainer: {
    flexDirection: "row",
  },
  newBadge: {
    backgroundColor: "#07C160",
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  newBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  trendingBadge: {
    backgroundColor: "#FFD700", // Gold color for trending
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  trendingBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  recommendationDescription: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 8,
  },
  recommendationFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  memberCount: {
    fontSize: 14,
    color: "#8E8E93",
  },
  joinButton: {
    backgroundColor: "#07C160",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  eventCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  eventImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  eventContent: {
    flex: 1,
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
  eventFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventLocation: {
    marginLeft: 8,
    marginRight: 8,
  },
  eventAttendees: {
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
}); 