import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const [loginButtonScale] = useState(new Animated.Value(1));
  const [signupButtonScale] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [logoScaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    // Set status bar to light content
    StatusBar.setBarStyle('light-content', true);

    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(logoScaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      StatusBar.setBarStyle('default', true);
    };
  }, []);

  const handleLogin = () => {
    Animated.sequence([
      Animated.timing(loginButtonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(loginButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push("/(auth)/login");
    });
  };

  const handleSignup = () => {
    Animated.sequence([
      Animated.timing(signupButtonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(signupButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push("/(auth)/signup");
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require("../../assets/images/WelcomeScreen_background.jpeg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[
            "rgba(0, 0, 0, 0.4)",
            "rgba(0, 0, 0, 0.2)",
            "rgba(0, 0, 0, 0.6)"
          ]}
          style={styles.gradientOverlay}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          {/* Top Branding */}
          <Animated.View 
            style={[
              styles.topBranding,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <View style={styles.logoContainer}>
              <ImageBackground
                source={require("../../assets/images/Convopal_logo_noBackground.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.appName}>ConvoPal</Text>
            <Text style={styles.tagline}>Connect • Share • Discover</Text>
          </Animated.View>

          {/* Content */}
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            {/* Feature Highlights */}
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Ionicons name="chatbubbles" size={24} color="#07C160" />
                </View>
                <Text style={styles.featureText}>Smart Messaging</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Ionicons name="shield-checkmark" size={24} color="#07C160" />
                </View>
                <Text style={styles.featureText}>Secure & Private</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Ionicons name="globe" size={24} color="#07C160" />
                </View>
                <Text style={styles.featureText}>Global Connect</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <Animated.View style={{ transform: [{ scale: loginButtonScale }] }}>
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                  <Ionicons name="log-in" size={20} color="white" style={styles.buttonIcon} />
                  <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
              </Animated.View>
              
              <Animated.View style={{ transform: [{ scale: signupButtonScale }] }}>
                <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                  <Ionicons name="person-add" size={20} color="#07C160" style={styles.buttonIcon} />
                  <Text style={styles.signupButtonText}>Sign Up</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>

            {/* Terms */}
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By continuing, you agree to our{" "}
                <Text style={styles.linkText}>Terms of Service</Text> and{" "}
                <Text style={styles.linkText}>Privacy Policy</Text>
              </Text>
            </View>
          </Animated.View>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 50,
  },
  topBranding: {
    alignItems: "center",
    paddingHorizontal: 30,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    width: 60,
    height: 60,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 2,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    paddingHorizontal: 30,
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 30,
    justifyContent: "center",
  },
  loginButton: {
    backgroundColor: "#07C160",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: 'row',
    shadowColor: '#07C160',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  signupButton: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  signupButtonText: {
    color: "#07C160",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginRight: 8,
  },
  termsContainer: {
    alignItems: "center",
  },
  termsText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    lineHeight: 18,
  },
  linkText: {
    color: "#07C160",
    textDecorationLine: "underline",
    fontWeight: "500",
  },
}); 