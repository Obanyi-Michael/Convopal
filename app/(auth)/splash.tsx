import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View
} from "react-native";

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [slideAnim] = useState(new Animated.Value(50));
  const [logoScaleAnim] = useState(new Animated.Value(0.3));
  const [logoRotateAnim] = useState(new Animated.Value(0));
  const [textFadeAnim] = useState(new Animated.Value(0));
  const [textSlideAnim] = useState(new Animated.Value(30));

  useEffect(() => {
    // Set status bar to light content
    StatusBar.setBarStyle('light-content', true);

    // Create a sequence of animations for a professional feel
    const animationSequence = Animated.sequence([
      // 1. Background fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // 2. Logo entrance with scale and rotation
      Animated.parallel([
        Animated.spring(logoScaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotateAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // 3. Text entrance
      Animated.parallel([
        Animated.timing(textFadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(textSlideAnim, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // 4. Final scale animation for logo
      Animated.spring(scaleAnim, {
        toValue: 1.05,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]);

    animationSequence.start();

    // Navigate to welcome screen after 3.5 seconds
    const timer = setTimeout(() => {
      // Fade out animation before navigation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        router.replace("/(auth)");
      });
    }, 3500);

    return () => {
      clearTimeout(timer);
      StatusBar.setBarStyle('default', true);
    };
  }, [fadeAnim, scaleAnim, logoScaleAnim, logoRotateAnim, textFadeAnim, textSlideAnim]);

  // Create rotation interpolation for logo
  const logoRotation = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Image */}
      <Image 
        source={require("../../assets/images/WelcomeScreen_background.jpeg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Overlay Gradient */}
      <LinearGradient
        colors={[
          "rgba(0, 0, 0, 0.4)",
          "rgba(0, 0, 0, 0.2)",
          "rgba(0, 0, 0, 0.5)"
        ]}
        style={styles.overlay}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Main Content */}
      <Animated.View 
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        {/* Logo Container */}
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              transform: [
                { scale: logoScaleAnim },
                { rotate: logoRotation }
              ],
            }
          ]}
        >
          <View style={styles.logoWrapper}>
            <Image 
              source={require("../../assets/images/Convopal_logo_noBackground.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* Text Container */}
        <Animated.View 
          style={[
            styles.textContainer,
            {
              opacity: textFadeAnim,
              transform: [{ translateY: textSlideAnim }],
            }
          ]}
        >
          <Text style={styles.appName}>ConvoPal</Text>
          <Text style={styles.tagline}>Connect • Share • Discover</Text>
          
          {/* Loading indicator */}
          <View style={styles.loadingContainer}>
            <View style={styles.loadingDots}>
              <View style={[styles.dot, styles.dot1]} />
              <View style={[styles.dot, styles.dot2]} />
              <View style={[styles.dot, styles.dot3]} />
            </View>
          </View>
        </Animated.View>
      </Animated.View>

      {/* Bottom branding */}
      <Animated.View 
        style={[
          styles.bottomBranding,
          {
            opacity: textFadeAnim,
            transform: [{ translateY: textSlideAnim }],
          }
        ]}
      >
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: 100,
    height: 100,
  },
  textContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 2,
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 1,
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loadingContainer: {
    marginTop: 20,
  },
  loadingDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginHorizontal: 4,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
  bottomBranding: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.5,
  },
}); 