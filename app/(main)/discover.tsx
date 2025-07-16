import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data for discover content
const featuredContent = [
  {
    id: "1",
    title: "Trending Topics",
    subtitle: "What's happening now",
    image: "https://via.placeholder.com/300x200",
    color: "#FF6B6B",
    icon: "trending-up"
  },
  {
    id: "2",
    title: "Local Events",
    subtitle: "Discover events near you",
    image: "https://via.placeholder.com/300x200",
    color: "#4ECDC4",
    icon: "location"
  },
  {
    id: "3",
    title: "New Groups",
    subtitle: "Join exciting communities",
    image: "https://via.placeholder.com/300x200",
    color: "#45B7D1",
    icon: "people"
  }
];

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

const recommendations = [
  {
    id: "1",
    title: "Tech Enthusiasts",
    members: 1247,
    description: "Discuss the latest in technology and innovation",
    image: "https://via.placeholder.com/100x100",
    isNew: true
  },
  {
    id: "2",
    title: "Coffee Lovers",
    members: 892,
    description: "Share your favorite coffee spots and recipes",
    image: "https://via.placeholder.com/100x100",
    isNew: false
  },
  {
    id: "3",
    title: "Photography Club",
    members: 2156,
    description: "Showcase your photography skills",
    image: "https://via.placeholder.com/100x100",
    isNew: true
  }
];

interface FeaturedCardProps {
  item: typeof featuredContent[0];
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
  item: typeof categories[0];
  onPress: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ item, onPress }) => (
  <TouchableOpacity style={styles.categoryItem} onPress={onPress}>
    <View style={[styles.categoryIcon, { backgroundColor: `${item.color}15` }]}>
      <Ionicons name={item.icon as any} size={24} color={item.color} />
    </View>
    <Text style={styles.categoryName}>{item.name}</Text>
  </TouchableOpacity>
);

interface RecommendationCardProps {
  item: typeof recommendations[0];
  onPress: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ item, onPress }) => (
  <TouchableOpacity style={styles.recommendationCard} onPress={onPress}>
    <Image source={{ uri: item.image }} style={styles.recommendationImage} />
    <View style={styles.recommendationContent}>
      <View style={styles.recommendationHeader}>
        <Text style={styles.recommendationTitle}>{item.title}</Text>
        {item.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        )}
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleFeaturedPress = (item: typeof featuredContent[0]) => {
    console.log("Featured item pressed:", item.title);
  };

  const handleCategoryPress = (item: typeof categories[0]) => {
    setSelectedCategory(item.id);
    console.log("Category pressed:", item.name);
  };

  const handleRecommendationPress = (item: typeof recommendations[0]) => {
    console.log("Recommendation pressed:", item.title);
  };

  const renderFeaturedItem = ({ item }: { item: typeof featuredContent[0] }) => (
    <FeaturedCard item={item} onPress={() => handleFeaturedPress(item)} />
  );

  const renderCategoryItem = ({ item }: { item: typeof categories[0] }) => (
    <CategoryItem item={item} onPress={() => handleCategoryPress(item)} />
  );

  const renderRecommendationItem = ({ item }: { item: typeof recommendations[0] }) => (
    <RecommendationCard item={item} onPress={() => handleRecommendationPress(item)} />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#07C160" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Featured Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured</Text>
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
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

        {/* Recommendations Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
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
}); 