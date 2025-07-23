import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

interface Moment {
  id: string;
  user: {
    name: string;
    avatar: any;
    id: string;
  };
  content: string;
  images?: string[];
  timestamp: string;
  likes: string[];
  comments: {
    id: string;
    user: string;
    text: string;
    timestamp: string;
  }[];
  location?: string;
}

const mockMoments: Moment[] = [
  {
    id: "1",
    user: {
      name: "Alice Johnson",
      avatar: "https://via.placeholder.com/50",
      id: "alice",
    },
    content: "Beautiful sunset at the beach today! 🌅 Perfect end to a wonderful weekend.",
    images: [
      "https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Beach+Sunset",
      "https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Ocean+View",
      "https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=Evening+Sky",
    ],
    timestamp: "2 hours ago",
    likes: ["bob", "carol", "david"],
    comments: [
      {
        id: "1",
        user: "Bob Smith",
        text: "Gorgeous! 😍",
        timestamp: "1 hour ago",
      },
      {
        id: "2",
        user: "Carol Davis",
        text: "I wish I was there!",
        timestamp: "45 minutes ago",
      },
    ],
    location: "Malibu Beach, CA",
  },
  {
    id: "2",
    user: {
      name: "Bob Smith",
      avatar: "https://via.placeholder.com/50",
      id: "bob",
    },
    content: "Just finished reading this amazing book! 📚 Highly recommend it to anyone interested in personal growth.",
    images: ["https://via.placeholder.com/300x400/96CEB4/FFFFFF?text=Book+Cover"],
    timestamp: "4 hours ago",
    likes: ["alice", "emma"],
    comments: [
      {
        id: "1",
        user: "Emma Brown",
        text: "Added to my reading list!",
        timestamp: "3 hours ago",
      },
    ],
  },
  {
    id: "3",
    user: {
      name: "Carol Davis",
      avatar: "https://via.placeholder.com/50",
      id: "carol",
    },
    content: "Coffee time ☕ Working on some exciting new projects. Can't wait to share more details soon!",
    timestamp: "6 hours ago",
    likes: ["alice", "bob", "emma", "frank"],
    comments: [],
    location: "Downtown Coffee Co.",
  },
  {
    id: "4",
    user: {
      name: "David Wilson",
      avatar: "https://via.placeholder.com/50",
      id: "david",
    },
    content: "Amazing concert last night! The energy was incredible 🎸🔥",
    images: [
      "https://via.placeholder.com/300x200/DDA0DD/FFFFFF?text=Concert+Stage",
      "https://via.placeholder.com/300x200/FF8C42/FFFFFF?text=Crowd",
    ],
    timestamp: "8 hours ago",
    likes: ["alice", "grace"],
    comments: [
      {
        id: "1",
        user: "Grace Lee",
        text: "So jealous! Love this band 🎵",
        timestamp: "7 hours ago",
      },
    ],
    location: "Madison Square Garden",
  },
];

const { width } = Dimensions.get('window');

export default function MomentsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [moments, setMoments] = useState(mockMoments);
  const [likedMoments, setLikedMoments] = useState<Set<string>>(new Set());

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const toggleLike = (momentId: string) => {
    const newLikedMoments = new Set(likedMoments);
    if (likedMoments.has(momentId)) {
      newLikedMoments.delete(momentId);
    } else {
      newLikedMoments.add(momentId);
    }
    setLikedMoments(newLikedMoments);

    // Update the moment's likes
    setMoments(prev => prev.map(moment => {
      if (moment.id === momentId) {
        const isLiked = likedMoments.has(momentId);
        return {
          ...moment,
          likes: isLiked 
            ? moment.likes.filter(id => id !== "currentUser")
            : [...moment.likes, "currentUser"]
        };
      }
      return moment;
    }));
  };

  const renderImageGrid = (images: string[]) => {
    if (!images || images.length === 0) return null;

    const imageSize = images.length === 1 ? width - 100 : (width - 120) / 3;
    
    return (
      <View style={styles.imageGrid}>
        {images.slice(0, 9).map((image, index) => (
          <TouchableOpacity key={index} style={[
            styles.imageContainer,
            { 
              width: imageSize, 
              height: imageSize,
              marginRight: index % 3 !== 2 ? 4 : 0,
              marginBottom: 4,
            }
          ]}>
            <Image source={{ uri: image }} style={styles.momentImage} />
            {images.length > 9 && index === 8 && (
              <View style={styles.moreImagesOverlay}>
                <Text style={styles.moreImagesText}>+{images.length - 9}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderMoment = ({ item }: { item: Moment }) => (
    <View style={styles.momentContainer}>
      <View style={styles.momentHeader}>
        <Image source={{ uri: item.user.avatar }} style={styles.userAvatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.user.name}</Text>
          <View style={styles.timestampContainer}>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
            {item.location && (
              <>
                <Text style={styles.locationDot}>•</Text>
                <Ionicons name="location-outline" size={12} color="#666" />
                <Text style={styles.location}>{item.location}</Text>
              </>
            )}
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <Text style={styles.momentContent}>{item.content}</Text>
      
      {renderImageGrid(item.images)}

      <View style={styles.momentActions}>
        <TouchableOpacity 
          onPress={() => toggleLike(item.id)}
          style={styles.actionButton}
        >
          <Ionicons 
            name={likedMoments.has(item.id) ? "heart" : "heart-outline"} 
            size={20} 
            color={likedMoments.has(item.id) ? "#FF3B30" : "#666"} 
          />
          <Text style={[
            styles.actionText,
            likedMoments.has(item.id) && styles.likedText
          ]}>
            {item.likes.length}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={20} color="#666" />
          <Text style={styles.actionText}>{item.comments.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {item.comments.length > 0 && (
        <View style={styles.commentsSection}>
          {item.comments.slice(0, 2).map(comment => (
            <View key={comment.id} style={styles.comment}>
              <Text style={styles.commentUser}>{comment.user}</Text>
              <Text style={styles.commentText}>{comment.text}</Text>
              <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
            </View>
          ))}
          {item.comments.length > 2 && (
            <TouchableOpacity>
              <Text style={styles.viewMoreComments}>
                View all {item.comments.length} comments
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  const renderHeader = () => (
    <LinearGradient
      colors={['#07C160', '#06A84E']}
      style={styles.headerGradient}
    >
      <View style={styles.profileSection}>
        <Image 
          source={{ uri: "https://via.placeholder.com/80" }} 
          style={styles.profileAvatar} 
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>My Moments</Text>
          <Text style={styles.profileSubtitle}>Share your life with friends</Text>
        </View>
        <TouchableOpacity style={styles.cameraButton}>
          <Ionicons name="camera" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={moments}
        renderItem={renderMoment}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
      
      <TouchableOpacity style={styles.fabButton}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  listContainer: {
    paddingBottom: 80,
  },
  headerGradient: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  profileSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  cameraButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  momentContainer: {
    backgroundColor: "#fff",
    marginVertical: 4,
    paddingVertical: 16,
  },
  momentHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
  },
  locationDot: {
    fontSize: 12,
    color: "#666",
    marginHorizontal: 4,
  },
  location: {
    fontSize: 12,
    color: "#666",
    marginLeft: 2,
  },
  moreButton: {
    padding: 8,
  },
  momentContent: {
    fontSize: 16,
    lineHeight: 22,
    color: "#333",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  imageContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  momentImage: {
    width: '100%',
    height: '100%',
  },
  moreImagesOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreImagesText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  momentActions: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  actionText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  likedText: {
    color: "#FF3B30",
  },
  commentsSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  comment: {
    marginBottom: 8,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  commentText: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  commentTimestamp: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  viewMoreComments: {
    fontSize: 14,
    color: "#07C160",
    fontWeight: "500",
  },
  fabButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#07C160',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});