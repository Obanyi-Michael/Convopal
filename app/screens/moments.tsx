import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../src/components/CustomButton";

interface Moment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  time: string;
}

// Mock moments data
const mockMoments: Moment[] = [
  {
    id: "1",
    user: {
      name: "ConvoPal Team",
      avatar: "https://via.placeholder.com/50",
    },
    content: "Welcome to ConvoPal! Share your moments with friends and family.",
    image: "https://via.placeholder.com/300x200",
    likes: 45,
    comments: 12,
    time: "2 hours ago",
  },
  {
    id: "2",
    user: {
      name: "John Doe",
      avatar: "https://via.placeholder.com/50",
    },
    content: "Beautiful sunset today! 🌅",
    likes: 23,
    comments: 5,
    time: "4 hours ago",
  },
  {
    id: "3",
    user: {
      name: "Jane Smith",
      avatar: "https://via.placeholder.com/50",
    },
    content: "Just finished a great workout! 💪",
    image: "https://via.placeholder.com/300x200",
    likes: 67,
    comments: 8,
    time: "6 hours ago",
  },
];

interface MomentItemProps {
  moment: Moment;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
}

const MomentItem: React.FC<MomentItemProps> = ({ moment, onLike, onComment }) => (
  <View style={styles.momentItem}>
    <View style={styles.momentHeader}>
      <Image source={{ uri: moment.user.avatar }} style={styles.userAvatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{moment.user.name}</Text>
        <Text style={styles.momentTime}>{moment.time}</Text>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Ionicons name="ellipsis-horizontal" size={20} color="#8E8E93" />
      </TouchableOpacity>
    </View>
    
    <Text style={styles.momentContent}>{moment.content}</Text>
    
    {moment.image && (
      <Image source={{ uri: moment.image }} style={styles.momentImage} />
    )}
    
    <View style={styles.momentActions}>
      <TouchableOpacity style={styles.actionButton} onPress={() => onLike(moment.id)}>
        <Ionicons name="heart-outline" size={20} color="#8E8E93" />
        <Text style={styles.actionText}>{moment.likes}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton} onPress={() => onComment(moment.id)}>
        <Ionicons name="chatbubble-outline" size={20} color="#8E8E93" />
        <Text style={styles.actionText}>{moment.comments}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="share-outline" size={20} color="#8E8E93" />
        <Text style={styles.actionText}>Share</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function MomentsScreen() {
  const [moments, setMoments] = useState<Moment[]>(mockMoments);

  const handleBackPress = () => {
    router.back();
  };

  const handleCreateMoment = () => {
    Alert.alert("Create Moment", "Opening camera to create a new moment...");
  };

  const handleLike = (id: string) => {
    setMoments(prev => prev.map(moment => 
      moment.id === id 
        ? { ...moment, likes: moment.likes + 1 }
        : moment
    ));
  };

  const handleComment = (id: string) => {
    Alert.alert("Comment", "Opening comment section...");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Moments</Text>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateMoment}>
          <Ionicons name="add" size={24} color="#07C160" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Create Moment Button */}
        <View style={styles.createSection}>
          <CustomButton
            title="Create New Moment"
            onPress={handleCreateMoment}
            variant="primary"
            style={styles.createMomentButton}
          />
        </View>

        {/* Moments Feed */}
        <View style={styles.momentsSection}>
          {moments.map((moment) => (
            <MomentItem
              key={moment.id}
              moment={moment}
              onLike={handleLike}
              onComment={handleComment}
            />
          ))}
        </View>

        <View style={styles.bottomSpacing} />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 0.5,
    borderBottomColor: "#C6C6C8",
  },
  backButton: {
    width: 40,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  createButton: {
    width: 40,
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  createSection: {
    padding: 16,
  },
  createMomentButton: {
    marginBottom: 8,
  },
  momentsSection: {
    paddingHorizontal: 16,
  },
  momentItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  momentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  momentTime: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  momentContent: {
    fontSize: 16,
    color: "#000",
    lineHeight: 22,
    marginBottom: 12,
  },
  momentImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  momentActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 0.5,
    borderTopColor: "#E5E5EA",
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionText: {
    fontSize: 14,
    color: "#8E8E93",
    marginLeft: 4,
  },
  bottomSpacing: {
    height: 20,
  },
}); 