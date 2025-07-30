import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function VerificationScreen() {
  return (
    <LinearGradient colors={["#ff00cc", "#333399"]} style={styles.container}>
      <View style={styles.scrollContainer}>
        <Text style={styles.title}>VERIFICATION</Text>
        <Text style={styles.instruction}>
          Enter the 6-digit code sent to your phone
        </Text>
        <View style={styles.verificationCodeContainer}>
          {[...Array(6)].map((_, i) => (
            <TextInput
              key={i}
              style={styles.codeInput}
              keyboardType="number-pad"
              maxLength={1}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  instruction: {
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  verificationCodeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  codeInput: {
    backgroundColor: "#fff",
    width: 40,
    height: 50,
    borderRadius: 8,
    textAlign: "center",
    marginHorizontal: 5,
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  },
});