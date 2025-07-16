import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
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

interface ValidationErrors {
  fullName?: string;
  country?: string;
  phone?: string;
  password?: string;
}

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const { signupData, setSignupData, clearSignupData } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [progressAnim] = useState(new Animated.Value(0));

  // Helper functions to update context
  const updateSignupData = (field: keyof typeof signupData, value: string) => {
    setSignupData({
      ...signupData,
      [field]: value,
    });
  };

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
      Animated.timing(progressAnim, {
        toValue: 0.33,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!signupData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (signupData.fullName.length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    if (!signupData.country.trim()) {
      newErrors.country = "Country is required";
    }

    if (!signupData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-()]{10,}$/.test(signupData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!signupData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (signupData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(signupData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
    }

    if (!agreeToTerms) {
      Alert.alert("Terms Required", "Please agree to the Terms of Service and Privacy Policy.");
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = (): { strength: string; color: string; progress: number } => {
    if (signupData.password.length === 0) return { strength: "", color: "#8E8E93", progress: 0 };
    if (signupData.password.length < 6) return { strength: "Weak", color: "#FF3B30", progress: 0.25 };
    if (signupData.password.length < 8) return { strength: "Fair", color: "#FF9500", progress: 0.5 };
    if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(signupData.password)) {
      return { strength: "Strong", color: "#07C160", progress: 1 };
    }
    return { strength: "Good", color: "#007AFF", progress: 0.75 };
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Implement signup logic
      console.log("Signup:", { 
        fullName: signupData.fullName, 
        country: signupData.country, 
        phone: signupData.phone, 
        password: signupData.password 
      });
      
      router.push("/(auth)/verification");
    } catch (error) {
      Alert.alert("Signup Failed", "Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/(auth)");
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert(`${provider} Signup`, `${provider} signup functionality will be implemented.`);
  };

  const passwordStrength = getPasswordStrength();

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
            <Text style={styles.progressText}>Step 1 of 3</Text>
          </View>
          <View style={styles.headerRight} />
        </View>

        {/* Form */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title Section */}
          <Animated.View 
            style={[
              styles.titleSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#07C160', '#00A854']}
                style={styles.logoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="person-add" size={32} color="white" />
              </LinearGradient>
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join ConvoPal and connect with friends</Text>
          </Animated.View>

          {/* Social Login Options */}
          <Animated.View 
            style={[
              styles.socialContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleSocialLogin('Google')}
            >
              <Ionicons name="logo-google" size={20} color="#DB4437" />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleSocialLogin('Apple')}
            >
              <Ionicons name="logo-apple" size={20} color="#000" />
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or sign up with email</Text>
            <View style={styles.divider} />
          </View>

          {/* Form Fields */}
          <Animated.View 
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            {/* Full Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={[styles.inputContainer, errors.fullName && styles.inputError]}>
                <Ionicons name="person" size={20} color="#8E8E93" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  value={signupData.fullName}
                  onChangeText={(text) => {
                    updateSignupData('fullName', text);
                    if (errors.fullName) {
                      setErrors({ ...errors, fullName: undefined });
                    }
                  }}
                  placeholderTextColor="#8E8E93"
                  autoCapitalize="words"
                />
              </View>
              {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
            </View>

            {/* Country Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Country</Text>
              <View style={[styles.inputContainer, errors.country && styles.inputError]}>
                <Ionicons name="location" size={20} color="#8E8E93" />
                <TextInput
                  style={styles.input}
                  placeholder="Select your country"
                  value={signupData.country}
                  onChangeText={(text) => {
                    updateSignupData('country', text);
                    if (errors.country) {
                      setErrors({ ...errors, country: undefined });
                    }
                  }}
                  placeholderTextColor="#8E8E93"
                />
                <TouchableOpacity style={styles.infoButton} onPress={() => {
                  Alert.alert("Country Selection", "Please select your country for better service.");
                }}>
                  <Ionicons name="chevron-down" size={20} color="#8E8E93" />
                </TouchableOpacity>
              </View>
              {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}
            </View>

            {/* Phone Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={[styles.inputContainer, errors.phone && styles.inputError]}>
                <Ionicons name="call" size={20} color="#8E8E93" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  value={signupData.phone}
                  onChangeText={(text) => {
                    updateSignupData('phone', text);
                    if (errors.phone) {
                      setErrors({ ...errors, phone: undefined });
                    }
                  }}
                  keyboardType="phone-pad"
                  placeholderTextColor="#8E8E93"
                />
              </View>
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[styles.inputContainer, errors.password && styles.inputError]}>
                <Ionicons name="lock-closed" size={20} color="#8E8E93" />
                <TextInput
                  style={styles.input}
                  placeholder="Create a strong password"
                  value={signupData.password}
                  onChangeText={(text) => {
                    updateSignupData('password', text);
                    if (errors.password) {
                      setErrors({ ...errors, password: undefined });
                    }
                  }}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#8E8E93"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#8E8E93"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              
              {/* Simple Password Strength */}
              {signupData.password.length > 0 && (
                <View style={styles.passwordStrengthContainer}>
                  <Text style={[styles.passwordStrengthText, { color: passwordStrength.color }]}>
                    {passwordStrength.strength}
                  </Text>
                </View>
              )}
            </View>

            {/* Terms Agreement */}
            <TouchableOpacity 
              style={styles.termsContainer}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
            >
              <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
                {agreeToTerms && <Ionicons name="checkmark" size={14} color="white" />}
              </View>
              <Text style={styles.termsText}>
                I agree to the{" "}
                <Text style={styles.linkText}>Terms of Service</Text> and{" "}
                <Text style={styles.linkText}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>

            {/* Signup Button */}
            <TouchableOpacity
              style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
              onPress={handleSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Ionicons name="person-add" size={20} color="white" style={styles.buttonIcon} />
                  <Text style={styles.signupButtonText}>Create Account</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
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
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    padding: 2,
  },
  progressContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  progressBar: {
    width: "80%",
    height: 8,
    backgroundColor: "#E5E5EA",
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#07C160",
  },
  progressText: {
    fontSize: 12,
    color: "#8E8E93",
  },
  headerRight: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    marginBottom: 10,
  },
  logoGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
  },
  socialContainer: {
    marginTop: 20,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 10,
  },
  socialButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E5EA",
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: "#8E8E93",
  },
  formContainer: {
    marginTop: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#000",
  },
  infoButton: {
    padding: 4,
  },
  eyeButton: {
    padding: 4,
  },
  signupButton: {
    backgroundColor: "#07C160",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    alignSelf: "center",
    flexDirection: "row",
    shadowColor: '#07C160',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  signupButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 48,
  },
  passwordStrengthContainer: {
    marginTop: 4,
    marginLeft: 48,
  },
  passwordStrengthText: {
    fontSize: 12,
    fontWeight: "500",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 16,
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#C6C6C8",
    marginRight: 8,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#07C160",
    borderColor: "#07C160",
  },
  termsText: {
    fontSize: 14,
    color: "#8E8E93",
    flex: 1,
    lineHeight: 20,
  },
  linkText: {
    color: "#07C160",
    textDecorationLine: "underline",
  },
  signupButtonDisabled: {
    opacity: 0.6,
  },
}); 