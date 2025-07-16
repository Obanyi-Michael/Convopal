import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../src/context/AuthContext";

const { width } = Dimensions.get('window');

export default function VerificationScreen() {
  const insets = useSafeAreaInsets();
  const { clearSignupData } = useAuth();
  const [code, setCode] = useState([
    { id: 0, value: "" },
    { id: 1, value: "" },
    { id: 2, value: "" },
    { id: 3, value: "" },
    { id: 4, value: "" },
    { id: 5, value: "" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const inputRefs = useRef<TextInput[]>([]);
  
  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [progressAnim] = useState(new Animated.Value(0));
  const [shakeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Progress animation (separate to avoid useNativeDriver issues)
    Animated.timing(progressAnim, {
      toValue: 0.66,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [fadeAnim, slideAnim, progressAnim]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = { ...newCode[index], value: text };
    setCode(newCode);

    // Auto-focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (_e: any, index: number) => {
    // Handle backspace
    if (_e.nativeEvent?.key === "Backspace" && !code[index].value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleContinue = async () => {
    const fullCode = code.map(item => item.value).join("");
    if (fullCode.length === 6) {
      setIsLoading(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Verify code with backend
        console.log("Verification code:", fullCode);
        
        // Simulate verification success
        if (Math.random() > 0.3) { // 70% success rate for demo
          router.replace("/(auth)/welcome");
          clearSignupData(); // Clear signup data on successful verification
        } else {
          setAttempts(attempts + 1);
          if (attempts >= 2) {
            Alert.alert("Too Many Attempts", "Please request a new code.");
            setAttempts(0);
          } else {
            // Shake animation for error
            Animated.sequence([
              Animated.timing(shakeAnim, {
                toValue: 10,
                duration: 100,
                useNativeDriver: true,
              }),
              Animated.timing(shakeAnim, {
                toValue: -10,
                duration: 100,
                useNativeDriver: true,
              }),
              Animated.timing(shakeAnim, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
              }),
            ]).start();
            Alert.alert("Invalid Code", "Please check your code and try again.");
          }
        }
      } catch (error) {
        Alert.alert("Verification Failed", "Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResendCode = () => {
    if (resendTimer > 0) return;
    
    setResendTimer(60);
    Alert.alert("Code Sent", "A new verification code has been sent to your phone.");
    console.log("Resend code");
  };

  const handleVoiceCall = () => {
    Alert.alert("Voice Call", "You will receive a call with the verification code.");
    console.log("Voice call requested");
  };

  const handleBack = () => {
    router.push("/(auth)/signup");
  };

  const isCodeComplete = code.every((item) => item.value !== "");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill,
                  { 
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%']
                    })
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>Step 2 of 3</Text>
          </View>
          <View style={styles.headerRight} />
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Animated.View 
            style={[
              styles.contentContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            {/* Title Section */}
            <View style={styles.titleSection}>
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={['#07C160', '#00A854']}
                  style={styles.logoGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="shield-checkmark" size={32} color="white" />
                </LinearGradient>
              </View>
              <Text style={styles.title}>Verify Your Phone</Text>
                             <Text style={styles.subtitle}>We&apos;ve sent a 6-digit code to</Text>
              <Text style={styles.phoneNumber}>+233 54*****758</Text>
            </View>

            {/* Code Input */}
            <Animated.View 
              style={[
                styles.codeContainer,
                {
                  transform: [{ translateX: shakeAnim }],
                }
              ]}
            >
              {code.map((item, index) => (
                <TextInput
                  key={`code-input-${item.id}`}
                  ref={(ref) => {
                    if (ref) inputRefs.current[index] = ref;
                  }}
                  style={[
                    styles.codeInput, 
                    item.value && styles.codeInputFilled
                  ]}
                  value={item.value}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  onFocus={() => {
                    // Simple focus handling - no complex logic
                  }}
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                  placeholder="•"
                  placeholderTextColor="#C6C6C8"
                  autoComplete="one-time-code"
                  textContentType="oneTimeCode"
                />
              ))}
            </Animated.View>

            {/* Error Message */}
            {attempts > 0 && (
              <View style={styles.errorContainer}>
                <Ionicons name="warning" size={16} color="#FF3B30" />
                <Text style={styles.errorText}>
                  Invalid code. {3 - attempts} attempts remaining
                </Text>
              </View>
            )}

                         {/* Action Links */}
             <View style={styles.actionLinks}>
               <TouchableOpacity 
                 onPress={handleResendCode}
                 disabled={resendTimer > 0}
               >
                 <Text style={[styles.resendText, resendTimer > 0 && styles.resendTextDisabled]}>
                   {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
                 </Text>
               </TouchableOpacity>

               <TouchableOpacity onPress={handleVoiceCall}>
                 <Text style={styles.voiceText}>Call me instead</Text>
               </TouchableOpacity>
             </View>
          </Animated.View>
        </View>

        {/* Bottom Button */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              isCodeComplete && styles.continueButtonActive,
              isLoading && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!isCodeComplete || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark" size={20} color={isCodeComplete ? "white" : "#8E8E93"} />
                <Text style={[
                  styles.continueButtonText,
                  isCodeComplete && styles.continueButtonTextActive,
                ]}>
                  Verify & Continue
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    padding: 8,
  },
  progressContainer: {
    alignItems: "center",
    flex: 1,
  },
  progressBar: {
    width: "80%",
    height: 8,
    backgroundColor: "#E5E5EA",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#07C160",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#8E8E93",
  },
  headerRight: {
    width: 40,
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  contentContainer: {
    alignItems: "center",
    width: "100%",
    maxWidth: 300,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E5E5EA",
    marginBottom: 15,
  },
  logoGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
    marginBottom: 5,
  },
  phoneNumber: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
  },
  codeContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 40,
  },
  codeInput: {
    width: 40,
    height: 50,
    borderWidth: 2,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    fontSize: 20,
    fontWeight: "600",
    backgroundColor: "white",
  },
  codeInputFilled: {
    borderColor: "#07C160",
    backgroundColor: "#F0FFF0",
  },
  codeInputFocused: {
    borderColor: "#07C160",
    backgroundColor: "#F0FFF0",
    borderWidth: 2,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBE6",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 14,
    color: "#FF3B30",
    marginLeft: 8,
  },
     actionLinks: {
     flexDirection: "row",
     justifyContent: "space-between",
     width: "100%",
     marginTop: 20,
   },
   resendText: {
     color: "#07C160",
     fontSize: 16,
     textDecorationLine: "underline",
   },
   voiceText: {
     color: "#007AFF",
     fontSize: 16,
     textDecorationLine: "underline",
   },
   resendTextDisabled: {
     color: "#C6C6C8",
     textDecorationLine: "none",
   },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#E5E5EA",
  },
  continueButtonActive: {
    backgroundColor: "#07C160",
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8E8E93",
  },
  continueButtonTextActive: {
    color: "white",
  },
}); 