import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function VerificationScreen() {
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
        } else {
          setAttempts(attempts + 1);
          if (attempts >= 2) {
            Alert.alert("Too Many Attempts", "Please request a new code.");
            setAttempts(0);
          } else {
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

  const handleBack = () => {
    router.push("/(auth)");
  };

  const isCodeComplete = code.every((item) => item.value !== "");

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Centered Content Container */}
          <View style={styles.contentContainer}>
            {/* White Container */}
            <View style={styles.whiteContainer}>
              {/* Title */}
              <View style={styles.titleSection}>
                <Text style={styles.title}>VERIFICATION</Text>
              </View>

              <Text style={styles.instruction}>
                Enter the 6-digit code sent to +233 54*****758
              </Text>

              {/* Code Input */}
              <View style={styles.codeContainer}>
                {code.map((item, index) => (
                  <TextInput
                    key={`code-input-${item.id}`}
                    ref={(ref) => {
                      if (ref) inputRefs.current[index] = ref;
                    }}
                    style={[styles.codeInput, item.value && styles.codeInputFilled]}
                    value={item.value}
                    onChangeText={(text) => handleCodeChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    textAlign="center"
                    placeholder="•"
                    placeholderTextColor="#C6C6C8"
                  />
                ))}
              </View>

              {/* Resend Code */}
              <TouchableOpacity 
                style={[styles.resendContainer, resendTimer > 0 && styles.resendDisabled]} 
                onPress={handleResendCode}
                disabled={resendTimer > 0}
              >
                <Ionicons 
                  name="refresh" 
                  size={16} 
                  color={resendTimer > 0 ? "#C6C6C8" : "#007AFF"} 
                  style={styles.resendIcon}
                />
                <Text style={[styles.resendText, resendTimer > 0 && styles.resendTextDisabled]}>
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
                </Text>
              </TouchableOpacity>

              {/* Attempts Warning */}
              {attempts > 0 && (
                <View style={styles.attemptsContainer}>
                  <Ionicons name="warning" size={16} color="#FF9500" />
                  <Text style={styles.attemptsText}>
                    {3 - attempts} attempts remaining
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Bottom Buttons */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.continueButton,
              isCodeComplete && styles.continueButtonActive,
            ]}
            onPress={handleContinue}
            disabled={!isCodeComplete}
          >
            <Text
              style={[
                styles.continueButtonText,
                isCodeComplete && styles.continueButtonTextActive,
              ]}
            >
              Continue
            </Text>
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
  whiteContainer: {
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
    width: "100%",
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginBottom: 20,
  },
  instruction: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
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
  resendContainer: {
    marginBottom: 40,
  },
  resendText: {
    color: "#007AFF",
    fontSize: 16,
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 50,
    gap: 40,
  },
  backButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#E5E5EA",
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8E8E93",
  },
  continueButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#E5E5EA",
  },
  continueButtonActive: {
    backgroundColor: "#07C160",
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8E8E93",
  },
  continueButtonTextActive: {
    color: "white",
  },
  codeInputFilled: {
    borderColor: "#07C160",
    backgroundColor: "#F0FFF0",
  },
  resendDisabled: {
    opacity: 0.5,
  },
  resendIcon: {
    marginRight: 8,
  },
  resendTextDisabled: {
    color: "#C6C6C8",
  },
  attemptsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  attemptsText: {
    fontSize: 14,
    color: "#FF9500",
    marginLeft: 8,
  },
}); 