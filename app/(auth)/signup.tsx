import { Ionicons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
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
import { apiService } from "../../src/services/api";

const { width } = Dimensions.get('window');

interface ValidationErrors {
  fullName?: string;
  username?: string;
  country?: string;
  phone?: string;
  password?: string;
}

// Replace the countries array with a comprehensive list
const countries = [
  { name: 'Afghanistan', code: '+93' },
  { name: 'Albania', code: '+355' },
  { name: 'Algeria', code: '+213' },
  { name: 'Andorra', code: '+376' },
  { name: 'Angola', code: '+244' },
  { name: 'Antigua and Barbuda', code: '+1-268' },
  { name: 'Argentina', code: '+54' },
  { name: 'Armenia', code: '+374' },
  { name: 'Australia', code: '+61' },
  { name: 'Austria', code: '+43' },
  { name: 'Azerbaijan', code: '+994' },
  { name: 'Bahamas', code: '+1-242' },
  { name: 'Bahrain', code: '+973' },
  { name: 'Bangladesh', code: '+880' },
  { name: 'Barbados', code: '+1-246' },
  { name: 'Belarus', code: '+375' },
  { name: 'Belgium', code: '+32' },
  { name: 'Belize', code: '+501' },
  { name: 'Benin', code: '+229' },
  { name: 'Bhutan', code: '+975' },
  { name: 'Bolivia', code: '+591' },
  { name: 'Bosnia and Herzegovina', code: '+387' },
  { name: 'Botswana', code: '+267' },
  { name: 'Brazil', code: '+55' },
  { name: 'Brunei', code: '+673' },
  { name: 'Bulgaria', code: '+359' },
  { name: 'Burkina Faso', code: '+226' },
  { name: 'Burundi', code: '+257' },
  { name: 'Cabo Verde', code: '+238' },
  { name: 'Cambodia', code: '+855' },
  { name: 'Cameroon', code: '+237' },
  { name: 'Canada', code: '+1' },
  { name: 'Central African Republic', code: '+236' },
  { name: 'Chad', code: '+235' },
  { name: 'Chile', code: '+56' },
  { name: 'China', code: '+86' },
  { name: 'Colombia', code: '+57' },
  { name: 'Comoros', code: '+269' },
  { name: 'Congo', code: '+242' },
  { name: 'Congo (DRC)', code: '+243' },
  { name: 'Costa Rica', code: '+506' },
  { name: 'Croatia', code: '+385' },
  { name: 'Cuba', code: '+53' },
  { name: 'Cyprus', code: '+357' },
  { name: 'Czechia', code: '+420' },
  { name: 'Denmark', code: '+45' },
  { name: 'Djibouti', code: '+253' },
  { name: 'Dominica', code: '+1-767' },
  { name: 'Dominican Republic', code: '+1-809' },
  { name: 'Ecuador', code: '+593' },
  { name: 'Egypt', code: '+20' },
  { name: 'El Salvador', code: '+503' },
  { name: 'Equatorial Guinea', code: '+240' },
  { name: 'Eritrea', code: '+291' },
  { name: 'Estonia', code: '+372' },
  { name: 'Eswatini', code: '+268' },
  { name: 'Ethiopia', code: '+251' },
  { name: 'Fiji', code: '+679' },
  { name: 'Finland', code: '+358' },
  { name: 'France', code: '+33' },
  { name: 'Gabon', code: '+241' },
  { name: 'Gambia', code: '+220' },
  { name: 'Georgia', code: '+995' },
  { name: 'Germany', code: '+49' },
  { name: 'Ghana', code: '+233' },
  { name: 'Greece', code: '+30' },
  { name: 'Grenada', code: '+1-473' },
  { name: 'Guatemala', code: '+502' },
  { name: 'Guinea', code: '+224' },
  { name: 'Guinea-Bissau', code: '+245' },
  { name: 'Guyana', code: '+592' },
  { name: 'Haiti', code: '+509' },
  { name: 'Honduras', code: '+504' },
  { name: 'Hungary', code: '+36' },
  { name: 'Iceland', code: '+354' },
  { name: 'India', code: '+91' },
  { name: 'Indonesia', code: '+62' },
  { name: 'Iran', code: '+98' },
  { name: 'Iraq', code: '+964' },
  { name: 'Ireland', code: '+353' },
  { name: 'Israel', code: '+972' },
  { name: 'Italy', code: '+39' },
  { name: 'Jamaica', code: '+1-876' },
  { name: 'Japan', code: '+81' },
  { name: 'Jordan', code: '+962' },
  { name: 'Kazakhstan', code: '+7' },
  { name: 'Kenya', code: '+254' },
  { name: 'Kiribati', code: '+686' },
  { name: 'Kuwait', code: '+965' },
  { name: 'Kyrgyzstan', code: '+996' },
  { name: 'Laos', code: '+856' },
  { name: 'Latvia', code: '+371' },
  { name: 'Lebanon', code: '+961' },
  { name: 'Lesotho', code: '+266' },
  { name: 'Liberia', code: '+231' },
  { name: 'Libya', code: '+218' },
  { name: 'Liechtenstein', code: '+423' },
  { name: 'Lithuania', code: '+370' },
  { name: 'Luxembourg', code: '+352' },
  { name: 'Madagascar', code: '+261' },
  { name: 'Malawi', code: '+265' },
  { name: 'Malaysia', code: '+60' },
  { name: 'Maldives', code: '+960' },
  { name: 'Mali', code: '+223' },
  { name: 'Malta', code: '+356' },
  { name: 'Marshall Islands', code: '+692' },
  { name: 'Mauritania', code: '+222' },
  { name: 'Mauritius', code: '+230' },
  { name: 'Mexico', code: '+52' },
  { name: 'Micronesia', code: '+691' },
  { name: 'Moldova', code: '+373' },
  { name: 'Monaco', code: '+377' },
  { name: 'Mongolia', code: '+976' },
  { name: 'Montenegro', code: '+382' },
  { name: 'Morocco', code: '+212' },
  { name: 'Mozambique', code: '+258' },
  { name: 'Myanmar', code: '+95' },
  { name: 'Namibia', code: '+264' },
  { name: 'Nauru', code: '+674' },
  { name: 'Nepal', code: '+977' },
  { name: 'Netherlands', code: '+31' },
  { name: 'New Zealand', code: '+64' },
  { name: 'Nicaragua', code: '+505' },
  { name: 'Niger', code: '+227' },
  { name: 'Nigeria', code: '+234' },
  { name: 'North Korea', code: '+850' },
  { name: 'North Macedonia', code: '+389' },
  { name: 'Norway', code: '+47' },
  { name: 'Oman', code: '+968' },
  { name: 'Pakistan', code: '+92' },
  { name: 'Palau', code: '+680' },
  { name: 'Palestine', code: '+970' },
  { name: 'Panama', code: '+507' },
  { name: 'Papua New Guinea', code: '+675' },
  { name: 'Paraguay', code: '+595' },
  { name: 'Peru', code: '+51' },
  { name: 'Philippines', code: '+63' },
  { name: 'Poland', code: '+48' },
  { name: 'Portugal', code: '+351' },
  { name: 'Qatar', code: '+974' },
  { name: 'Romania', code: '+40' },
  { name: 'Russia', code: '+7' },
  { name: 'Rwanda', code: '+250' },
  { name: 'Saint Kitts and Nevis', code: '+1-869' },
  { name: 'Saint Lucia', code: '+1-758' },
  { name: 'Saint Vincent and the Grenadines', code: '+1-784' },
  { name: 'Samoa', code: '+685' },
  { name: 'San Marino', code: '+378' },
  { name: 'Sao Tome and Principe', code: '+239' },
  { name: 'Saudi Arabia', code: '+966' },
  { name: 'Senegal', code: '+221' },
  { name: 'Serbia', code: '+381' },
  { name: 'Seychelles', code: '+248' },
  { name: 'Sierra Leone', code: '+232' },
  { name: 'Singapore', code: '+65' },
  { name: 'Slovakia', code: '+421' },
  { name: 'Slovenia', code: '+386' },
  { name: 'Solomon Islands', code: '+677' },
  { name: 'Somalia', code: '+252' },
  { name: 'South Africa', code: '+27' },
  { name: 'South Korea', code: '+82' },
  { name: 'South Sudan', code: '+211' },
  { name: 'Spain', code: '+34' },
  { name: 'Sri Lanka', code: '+94' },
  { name: 'Sudan', code: '+249' },
  { name: 'Suriname', code: '+597' },
  { name: 'Sweden', code: '+46' },
  { name: 'Switzerland', code: '+41' },
  { name: 'Syria', code: '+963' },
  { name: 'Taiwan', code: '+886' },
  { name: 'Tajikistan', code: '+992' },
  { name: 'Tanzania', code: '+255' },
  { name: 'Thailand', code: '+66' },
  { name: 'Timor-Leste', code: '+670' },
  { name: 'Togo', code: '+228' },
  { name: 'Tonga', code: '+676' },
  { name: 'Trinidad and Tobago', code: '+1-868' },
  { name: 'Tunisia', code: '+216' },
  { name: 'Turkey', code: '+90' },
  { name: 'Turkmenistan', code: '+993' },
  { name: 'Tuvalu', code: '+688' },
  { name: 'Uganda', code: '+256' },
  { name: 'Ukraine', code: '+380' },
  { name: 'United Arab Emirates', code: '+971' },
  { name: 'United Kingdom', code: '+44' },
  { name: 'United States', code: '+1' },
  { name: 'Uruguay', code: '+598' },
  { name: 'Uzbekistan', code: '+998' },
  { name: 'Vanuatu', code: '+678' },
  { name: 'Vatican City', code: '+39' },
  { name: 'Venezuela', code: '+58' },
  { name: 'Vietnam', code: '+84' },
  { name: 'Yemen', code: '+967' },
  { name: 'Zambia', code: '+260' },
  { name: 'Zimbabwe', code: '+263' },
];

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const { signupData, setSignupData, clearSignupData, signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [connectionTested, setConnectionTested] = useState(false);
  
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

  // Helper function to suggest alternative usernames
  const suggestAlternativeUsernames = (baseUsername: string): string[] => {
    const suggestions = [];
    const timestamp = Date.now().toString().slice(-4); // Last 4 digits of timestamp
    
    suggestions.push(`${baseUsername}${timestamp}`);
    suggestions.push(`${baseUsername}_${timestamp}`);
    suggestions.push(`${baseUsername}123`);
    suggestions.push(`${baseUsername}_user`);
    
    return suggestions;
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
        toValue: 0.33, // Changed back to 0.33 since we now have 3 steps again
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const validateForm = (): boolean => {
    console.log('validateForm called with signupData:', signupData);
    const newErrors: ValidationErrors = {};

    if (!signupData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (signupData.fullName.length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    if (!signupData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (signupData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else {
      const username = signupData.username.trim(); // Use trimmed version for validation
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      const isValid = usernameRegex.test(username);
      
      console.log('Username validation details:', {
        originalUsername: signupData.username,
        trimmedUsername: username,
        length: username.length,
        regex: usernameRegex.toString(),
        isValid: isValid,
        testResult: usernameRegex.test(username),
        hasSpecialChars: /[^a-zA-Z0-9_]/.test(username),
        charCodes: Array.from(username).map(c => c.charCodeAt(0))
      });
      
      if (!isValid) {
        newErrors.username = "Username can only contain letters, numbers, and underscores";
      }
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

    console.log('Validation errors:', newErrors);
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
      // Test backend connection first (only if not recently tested)
      // if (!connectionTested) {
      //   console.log('Testing backend connection before signup...');
      //   const isConnected = await apiService.testBackendConnection();
      //   console.log('Backend connection test result:', isConnected);
      //   setConnectionTested(true);
        
      //   if (!isConnected) {
      //     Alert.alert("Connection Error", "Cannot connect to the server. Please check your network connection and try again.");
      //     setIsLoading(false);
      //     return;
      //   }
      // }
      
      // Create a copy of signupData with trimmed values
      const trimmedSignupData = {
        ...signupData,
        fullName: signupData.fullName.trim(),
        username: signupData.username.trim(),
        country: signupData.country.trim(),
        phone: signupData.phone.trim(),
        password: signupData.password
      };
      
      console.log("Attempting signup with data:", {
        fullName: trimmedSignupData.fullName,
        username: trimmedSignupData.username,
        country: trimmedSignupData.country,
        phone: trimmedSignupData.phone,
        password: "***" // Don't log password
      });
      
      // Call the actual signup function from AuthContext
      // const result = await signup(trimmedSignupData);
      const response = await fetch('https://back-6lbs.onrender.com/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trimmedSignupData),
      }); 

      const result = await response.json();
      console.log("Signup response:", result);

      // let result = await response.json()
      if (result.success) {
        console.log("Signup successful!");
        // Redirect to welcome screen for new users
        router.replace("/(auth)/welcome");
      } else {
        console.log("Signup failed:", result.error);
        
        // Handle specific error cases
        let errorMessage = result.error || "Please try again later.";
        let alertTitle = "Signup Failed";
        
        if (result.error?.includes("Username already exists")) {
          alertTitle = "Username Taken";
          const suggestions = suggestAlternativeUsernames(signupData.username.trim());
          
          Alert.alert(
            "Username Taken",
            "This username is already taken. Would you like to use one of these suggestions?",
            [
              {
                text: "Use Suggestion 1",
                onPress: () => updateSignupData('username', suggestions[0])
              },
              {
                text: "Use Suggestion 2", 
                onPress: () => updateSignupData('username', suggestions[1])
              },
              {
                text: "Use Suggestion 3",
                onPress: () => updateSignupData('username', suggestions[2])
              },
              {
                text: "Choose Different",
                style: "cancel"
              }
            ]
          );
          return; // Don't show the default alert
        } else if (result.error?.includes("Phone number already registered")) {
          alertTitle = "Phone Number Registered";
          errorMessage = "This phone number is already registered. Please use a different phone number or try logging in instead.";
        } else if (result.error?.includes("Email already registered")) {
          alertTitle = "Email Registered";
          errorMessage = "This email is already registered. Please use a different email or try logging in instead.";
        }
        
        Alert.alert(alertTitle, errorMessage);
      }
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Signup Failed", "Network error occurred. Please try again.");
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

            {/* Username Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Username</Text>
              <View style={[styles.inputContainer, errors.username && styles.inputError]}>
                <Ionicons name="person" size={20} color="#8E8E93" />
                <TextInput
                  style={styles.input}
                  placeholder="Choose a username"
                  value={signupData.username}
                  onChangeText={(text) => {
                    console.log('Username input changed:', {
                      text: text,
                      length: text.length,
                      trimmed: text.trim(),
                      hasSpecialChars: /[^a-zA-Z0-9_]/.test(text)
                    });
                    updateSignupData('username', text);
                    if (errors.username) {
                      setErrors({ ...errors, username: undefined });
                    }
                  }}
                  placeholderTextColor="#8E8E93"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
            </View>

            {/* Country Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Country</Text>
              <View style={[styles.inputContainer, errors.country && styles.inputError]}>
                <Ionicons name="location" size={20} color="#8E8E93" />
                <Picker
                  selectedValue={signupData.country}
                  style={{ flex: 1, color: '#000', marginLeft: 12 }}
                  onValueChange={(itemValue: string, itemIndex: number) => {
                    updateSignupData('country', itemValue);
                    if (errors.country) {
                      setErrors({ ...errors, country: undefined });
                    }
                  }}
                  dropdownIconColor="#8E8E93"
                >
                  <Picker.Item label="Select your country" value="" />
                  {countries.map((country) => (
                    <Picker.Item key={country.code + country.name} label={`${country.name} (${country.code})`} value={country.name} />
                  ))}
                </Picker>
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