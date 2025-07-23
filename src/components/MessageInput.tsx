import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onSendImage: (imageUri: string) => void;
  onSendVoice: (voiceUri: string, duration: number) => void;
  onSendLocation: (location: { latitude: number; longitude: number; address: string }) => void;
  placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onSendImage,
  onSendVoice,
  onSendLocation,
  placeholder = "Type a message...",
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  const recordingAnimation = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const requestPermissions = async () => {
    const { status: audioStatus } = await Audio.requestPermissionsAsync();
    const { status: imageStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    
    return {
      audio: audioStatus === 'granted',
      image: imageStatus === 'granted',
      camera: cameraStatus === 'granted',
    };
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const startRecording = async () => {
    try {
      const permissions = await requestPermissions();
      if (!permissions.audio) {
        Alert.alert('Permission needed', 'Please allow microphone access to record voice messages');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(recordingAnimation, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(recordingAnimation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Start duration counter
      intervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      Vibration.vibrate(50);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      recordingAnimation.stopAnimation();
      recordingAnimation.setValue(1);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      if (uri && recordingDuration > 0) {
        onSendVoice(uri, recordingDuration);
      }
      
      setRecording(null);
      setRecordingDuration(0);
      Vibration.vibrate(50);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const cancelRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      recordingAnimation.stopAnimation();
      recordingAnimation.setValue(1);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      await recording.stopAndUnloadAsync();
      setRecording(null);
      setRecordingDuration(0);
      Vibration.vibrate([50, 50, 50]);
    } catch (err) {
      console.error('Failed to cancel recording', err);
    }
  };

  const pickImage = async () => {
    const permissions = await requestPermissions();
    if (!permissions.image) {
      Alert.alert('Permission needed', 'Please allow photo library access to send images');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onSendImage(result.assets[0].uri);
    }
    setShowMoreOptions(false);
  };

  const takePhoto = async () => {
    const permissions = await requestPermissions();
    if (!permissions.camera) {
      Alert.alert('Permission needed', 'Please allow camera access to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onSendImage(result.assets[0].uri);
    }
    setShowMoreOptions(false);
  };

  const shareLocation = () => {
    // Mock location for demo
    const mockLocation = {
      latitude: 37.7749,
      longitude: -122.4194,
      address: "San Francisco, CA, USA"
    };
    onSendLocation(mockLocation);
    setShowMoreOptions(false);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isRecording) {
    return (
      <View style={styles.recordingContainer}>
        <TouchableOpacity onPress={cancelRecording} style={styles.cancelButton}>
          <Ionicons name="close" size={24} color="#FF3B30" />
        </TouchableOpacity>
        
        <View style={styles.recordingInfo}>
          <Animated.View style={[
            styles.recordingIndicator,
            { transform: [{ scale: recordingAnimation }] }
          ]}>
            <Ionicons name="mic" size={20} color="#fff" />
          </Animated.View>
          <Text style={styles.recordingText}>
            Recording... {formatDuration(recordingDuration)}
          </Text>
        </View>
        
        <TouchableOpacity onPress={stopRecording} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showMoreOptions && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity onPress={takePhoto} style={styles.optionButton}>
            <Ionicons name="camera" size={24} color="#fff" />
            <Text style={styles.optionText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImage} style={styles.optionButton}>
            <Ionicons name="image" size={24} color="#fff" />
            <Text style={styles.optionText}>Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={shareLocation} style={styles.optionButton}>
            <Ionicons name="location" size={24} color="#fff" />
            <Text style={styles.optionText}>Location</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.inputContainer}>
        <TouchableOpacity
          onPress={() => setShowMoreOptions(!showMoreOptions)}
          style={styles.moreButton}
        >
          <Ionicons 
            name={showMoreOptions ? "close" : "add"} 
            size={24} 
            color="#999" 
          />
        </TouchableOpacity>
        
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder={placeholder}
          placeholderTextColor="#999"
          multiline
          maxLength={1000}
          returnKeyType="send"
          onSubmitEditing={handleSendMessage}
        />
        
        {message.trim() ? (
          <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPressIn={startRecording}
            onPressOut={stopRecording}
            style={styles.voiceButton}
          >
            <Ionicons name="mic" size={24} color="#999" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F8F8F8',
  },
  optionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#07C160',
  },
  optionText: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  moreButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: '#F8F8F8',
  },
  voiceButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#07C160',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  recordingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F8F8',
  },
  cancelButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recordingInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recordingText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});