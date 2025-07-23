import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface Message {
  id: string;
  text?: string;
  timestamp: string;
  isFromMe: boolean;
  avatar?: any;
  type: 'text' | 'image' | 'voice' | 'location' | 'system';
  imageUrl?: string;
  voiceDuration?: number;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  isRead?: boolean;
}

interface MessageBubbleProps {
  message: Message;
  onLongPress?: () => void;
  onImagePress?: () => void;
  onVoicePress?: () => void;
  onLocationPress?: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onLongPress,
  onImagePress,
  onVoicePress,
  onLocationPress,
}) => {
  const renderMessageContent = () => {
    switch (message.type) {
      case 'text':
        return (
          <Text style={[
            styles.messageText,
            message.isFromMe ? styles.myMessageText : styles.otherMessageText
          ]}>
            {message.text}
          </Text>
        );
      
      case 'image':
        return (
          <TouchableOpacity onPress={onImagePress} style={styles.imageContainer}>
            <Image source={{ uri: message.imageUrl }} style={styles.messageImage} />
          </TouchableOpacity>
        );
      
      case 'voice':
        return (
          <TouchableOpacity onPress={onVoicePress} style={styles.voiceContainer}>
            <Ionicons 
              name="mic" 
              size={20} 
              color={message.isFromMe ? '#fff' : '#333'} 
            />
            <Text style={[
              styles.voiceText,
              message.isFromMe ? styles.myMessageText : styles.otherMessageText
            ]}>
              {message.voiceDuration}"
            </Text>
            <View style={styles.voiceWave}>
              {[1, 2, 3, 4, 5].map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.waveBar,
                    { backgroundColor: message.isFromMe ? '#fff' : '#333' }
                  ]} 
                />
              ))}
            </View>
          </TouchableOpacity>
        );
      
      case 'location':
        return (
          <TouchableOpacity onPress={onLocationPress} style={styles.locationContainer}>
            <View style={styles.locationIcon}>
              <Ionicons name="location" size={24} color="#FF6B6B" />
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.locationTitle}>Location</Text>
              <Text style={styles.locationAddress}>{message.location?.address}</Text>
            </View>
          </TouchableOpacity>
        );
      
      case 'system':
        return (
          <Text style={styles.systemMessage}>
            {message.text}
          </Text>
        );
      
      default:
        return (
          <Text style={[
            styles.messageText,
            message.isFromMe ? styles.myMessageText : styles.otherMessageText
          ]}>
            {message.text}
          </Text>
        );
    }
  };

  if (message.type === 'system') {
    return (
      <View style={styles.systemContainer}>
        {renderMessageContent()}
      </View>
    );
  }

  return (
    <View style={[
      styles.messageContainer,
      message.isFromMe ? styles.myMessage : styles.otherMessage
    ]}>
      {!message.isFromMe && message.avatar && (
        <Image source={message.avatar} style={styles.avatar} />
      )}
      
      <TouchableOpacity
        onLongPress={onLongPress}
        style={[
          styles.messageBubble,
          message.isFromMe ? styles.myMessageBubble : styles.otherMessageBubble,
          message.type === 'image' && styles.imageBubble,
        ]}
      >
        {renderMessageContent()}
        <Text style={[
          styles.timestamp,
          message.isFromMe ? styles.myTimestamp : styles.otherTimestamp
        ]}>
          {message.timestamp}
        </Text>
      </TouchableOpacity>
      
      {message.isFromMe && (
        <View style={styles.readStatus}>
          <Ionicons 
            name={message.isRead ? "checkmark-done" : "checkmark"} 
            size={12} 
            color={message.isRead ? "#07C160" : "#999"} 
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    marginHorizontal: 16,
    alignItems: 'flex-end',
  },
  myMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '70%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    minHeight: 36,
    justifyContent: 'center',
  },
  myMessageBubble: {
    backgroundColor: '#07C160',
    marginLeft: 'auto',
  },
  otherMessageBubble: {
    backgroundColor: '#F0F0F0',
  },
  imageBubble: {
    padding: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  myTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherTimestamp: {
    color: '#999',
  },
  readStatus: {
    marginLeft: 4,
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
  },
  voiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  voiceText: {
    marginLeft: 8,
    fontSize: 14,
  },
  voiceWave: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  waveBar: {
    width: 2,
    height: 12,
    marginHorizontal: 1,
    borderRadius: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  locationIcon: {
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  systemContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  systemMessage: {
    fontSize: 12,
    color: '#999',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
});