import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PerformanceOptimizer } from '../utils/PerformanceOptimizer';

interface SmartChatProps {
  messages: any[];
  onSendMessage: (message: string) => void;
  isTyping: boolean;
  onTypingChange: (isTyping: boolean) => void;
}

interface SmartSuggestion {
  id: string;
  text: string;
  confidence: number;
  type: 'reply' | 'question' | 'reaction' | 'followup';
}

export const SmartChat: React.FC<SmartChatProps> = ({
  messages,
  onSendMessage,
  isTyping,
  onTypingChange,
}) => {
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const fadeAnim = useMemo(() => new Animated.Value(0), []);

  // Analyze conversation context and generate smart suggestions
  const analyzeConversation = useCallback(async () => {
    if (messages.length === 0) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis (in real app, call AI service)
    PerformanceOptimizer.deferHeavyOperation(async () => {
      try {
        const lastMessage = messages[messages.length - 1];
        const context = messages.slice(-5); // Last 5 messages for context
        
        // Generate smart suggestions based on context
        const newSuggestions: SmartSuggestion[] = [
          {
            id: '1',
            text: 'That sounds great! 👍',
            confidence: 0.9,
            type: 'reply',
          },
          {
            id: '2',
            text: 'Can you tell me more?',
            confidence: 0.8,
            type: 'question',
          },
          {
            id: '3',
            text: 'I understand completely',
            confidence: 0.7,
            type: 'reply',
          },
          {
            id: '4',
            text: 'What do you think about that?',
            confidence: 0.6,
            type: 'followup',
          },
        ];

        // Filter suggestions based on confidence
        const filteredSuggestions = newSuggestions.filter(s => s.confidence > 0.5);
        
        setSuggestions(filteredSuggestions);
        setShowSuggestions(true);
        
        // Animate suggestions in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
        
      } catch (error) {
        console.error('Error analyzing conversation:', error);
      } finally {
        setIsAnalyzing(false);
      }
    });
  }, [messages, fadeAnim]);

  // Auto-analyze when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        analyzeConversation();
      }, 1000); // Wait 1 second after new message
      
      return () => clearTimeout(timer);
    }
  }, [messages, analyzeConversation]);

  // Handle suggestion selection
  const handleSuggestionPress = useCallback((suggestion: SmartSuggestion) => {
    onSendMessage(suggestion.text);
    setShowSuggestions(false);
    fadeAnim.setValue(0);
  }, [onSendMessage, fadeAnim]);

  // Smart typing indicator with context
  const renderSmartTypingIndicator = useCallback(() => {
    if (!isTyping) return null;

    return (
      <View style={styles.typingContainer}>
        <View style={styles.typingBubble}>
          <View style={styles.typingDots}>
            <Animated.View style={[styles.dot, { opacity: fadeAnim }]} />
            <Animated.View style={[styles.dot, { opacity: fadeAnim }]} />
            <Animated.View style={[styles.dot, { opacity: fadeAnim }]} />
          </View>
          <Text style={styles.typingText}>AI is thinking...</Text>
        </View>
      </View>
    );
  }, [isTyping, fadeAnim]);

  // Render smart suggestions
  const renderSuggestions = useCallback(() => {
    if (!showSuggestions || suggestions.length === 0) return null;

    return (
      <Animated.View style={[styles.suggestionsContainer, { opacity: fadeAnim }]}>
        <View style={styles.suggestionsHeader}>
          <Ionicons name="bulb" size={16} color="#07C160" />
          <Text style={styles.suggestionsTitle}>Smart Suggestions</Text>
        </View>
        <View style={styles.suggestionsList}>
          {suggestions.map((suggestion) => (
            <TouchableOpacity
              key={suggestion.id}
              style={styles.suggestionButton}
              onPress={() => handleSuggestionPress(suggestion)}
            >
              <Text style={styles.suggestionText}>{suggestion.text}</Text>
              <View style={styles.confidenceIndicator}>
                <View 
                  style={[
                    styles.confidenceBar, 
                    { width: `${suggestion.confidence * 100}%` }
                  ]} 
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    );
  }, [showSuggestions, suggestions, fadeAnim, handleSuggestionPress]);

  // Conversation insights
  const conversationInsights = useMemo(() => {
    if (messages.length === 0) return null;

    const totalMessages = messages.length;
    const myMessages = messages.filter(m => m.isFromMe).length;
    const responseTime = messages.length > 1 ? 
      new Date(messages[messages.length - 1].createdAt).getTime() - 
      new Date(messages[messages.length - 2].createdAt).getTime() : 0;

    return {
      totalMessages,
      myMessages,
      responseTime,
      engagement: myMessages / totalMessages,
    };
  }, [messages]);

  return (
    <View style={styles.container}>
      {/* Smart Typing Indicator */}
      {renderSmartTypingIndicator()}
      
      {/* Smart Suggestions */}
      {renderSuggestions()}
      
      {/* Conversation Insights (Optional) */}
      {conversationInsights && (
        <View style={styles.insightsContainer}>
          <Text style={styles.insightsTitle}>Conversation Insights</Text>
          <View style={styles.insightsRow}>
            <Text style={styles.insightText}>
              Messages: {conversationInsights.totalMessages}
            </Text>
            <Text style={styles.insightText}>
              Engagement: {Math.round(conversationInsights.engagement * 100)}%
            </Text>
          </View>
        </View>
      )}
      
      {/* Analysis Loading */}
      {isAnalyzing && (
        <View style={styles.analyzingContainer}>
          <ActivityIndicator size="small" color="#07C160" />
          <Text style={styles.analyzingText}>Analyzing conversation...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  typingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingBubble: {
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 200,
  },
  typingDots: {
    flexDirection: 'row',
    marginRight: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#07C160',
    marginHorizontal: 2,
  },
  typingText: {
    fontSize: 12,
    color: '#666',
  },
  suggestionsContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingVertical: 12,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#07C160',
    marginLeft: 4,
  },
  suggestionsList: {
    paddingHorizontal: 16,
  },
  suggestionButton: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  confidenceIndicator: {
    height: 2,
    backgroundColor: '#E5E5EA',
    borderRadius: 1,
    overflow: 'hidden',
  },
  confidenceBar: {
    height: '100%',
    backgroundColor: '#07C160',
    borderRadius: 1,
  },
  insightsContainer: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  insightsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  insightsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  insightText: {
    fontSize: 11,
    color: '#999',
  },
  analyzingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8F9FA',
  },
  analyzingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
}); 