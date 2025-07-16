import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

interface ValidationErrors {
  fullName?: string;
  country?: string;
  phone?: string;
  password?: string;
}

export default function SignupScreen() {
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (fullName.length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    if (!country.trim()) {
      newErrors.country = "Country is required";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-()]{10,}$/.test(phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
    }

    if (!agreeToTerms) {
      Alert.alert("Terms Required", "Please agree to the Terms of Service and Privacy Policy.");
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = (): { strength: string; color: string } => {
    if (password.length === 0) return { strength: "", color: "#8E8E93" };
    if (password.length < 6) return { strength: "Weak", color: "#FF3B30" };
    if (password.length < 8) return { strength: "Fair", color: "#FF9500" };
    if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { strength: "Strong", color: "#07C160" };
    }
    return { strength: "Good", color: "#007AFF" };
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
      console.log("Signup:", { fullName, country, phone, password });
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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Form */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title and Icon */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>SIGNUP</Text>
            <View style={styles.iconContainer}>
              <Ionicons name="person" size={40} color="#000" />
              <Ionicons name="add" size={24} color="#000" style={styles.addIcon} />
            </View>
          </View>

          {/* Full Name Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} color="#8E8E93" />
            <TextInput
              style={[styles.input, errors.fullName && styles.inputError]}
              placeholder="Full Name"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (errors.fullName) {
                  setErrors({ ...errors, fullName: undefined });
                }
              }}
              placeholderTextColor="#8E8E93"
              autoCapitalize="words"
            />
          </View>
          {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

          {/* Country Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="location" size={20} color="#8E8E93" />
            <TextInput
              style={[styles.input, errors.country && styles.inputError]}
              placeholder="Country"
              value={country}
              onChangeText={(text) => {
                setCountry(text);
                if (errors.country) {
                  setErrors({ ...errors, country: undefined });
                }
              }}
              placeholderTextColor="#8E8E93"
            />
            <TouchableOpacity style={styles.infoButton} onPress={() => {
              Alert.alert("Country Selection", "Please select your country for better service.");
            }}>
              <Ionicons name="ellipsis-vertical" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>
          {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}

          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="call" size={20} color="#8E8E93" />
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              placeholder="Phone Number"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (errors.phone) {
                  setErrors({ ...errors, phone: undefined });
                }
              }}
              keyboardType="phone-pad"
              placeholderTextColor="#8E8E93"
            />
          </View>
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#8E8E93" />
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
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

          {/* Password Strength */}
          {password.length > 0 && (
            <View style={styles.passwordStrengthContainer}>
              <Text style={styles.passwordStrengthLabel}>Password strength:</Text>
              <Text style={[styles.passwordStrengthText, { color: getPasswordStrength().color }]}>
                {getPasswordStrength().strength}
              </Text>
            </View>
          )}

          {/* Terms Agreement */}
          <TouchableOpacity 
            style={styles.termsContainer}
            onPress={() => setAgreeToTerms(!agreeToTerms)}
          >
            <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
              {agreeToTerms && <Ionicons name="checkmark" size={16} color="white" />}
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
              <Text style={styles.signupButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>
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
    paddingVertical: 16,
    paddingTop: 50,
  },
  backButton: {
    padding: 2,
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
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 20,
  },
  iconContainer: {
    position: "relative",
    alignItems: "center",
  },
  addIcon: {
    position: "absolute",
    right: -10,
    top: -5,
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
    backgroundColor: "#FF3B30",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    alignSelf: "center",
  },
  signupButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
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
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginLeft: 48,
  },
  passwordStrengthLabel: {
    fontSize: 12,
    color: "#8E8E93",
    marginRight: 8,
  },
  passwordStrengthText: {
    fontSize: 12,
    fontWeight: "600",
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