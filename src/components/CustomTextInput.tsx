import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    StyleSheet,
    TextInput,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
import { Colors } from "../constants/Colors";
import { Layout } from "../constants/Layout";

interface CustomTextInputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  variant?: "default" | "outlined" | "filled";
  size?: "sm" | "md" | "lg";
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  multiline?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
  error?: string;
  style?: ViewStyle;
  inputStyle?: TextStyle;
}

export default function CustomTextInput({
  placeholder,
  value,
  onChangeText,
  variant = "default",
  size = "md",
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry = false,
  keyboardType = "default",
  multiline = false,
  numberOfLines = 1,
  disabled = false,
  error,
  style,
  inputStyle,
}: CustomTextInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleRightIconPress = () => {
    if (secureTextEntry) {
      setShowPassword(!showPassword);
    } else if (onRightIconPress) {
      onRightIconPress();
    }
  };

  const containerStyle = [
    styles.container,
    styles[variant],
    styles[size],
    isFocused && styles.focused,
    error && styles.error,
    disabled && styles.disabled,
    style,
  ];

  const inputStyleArray = [
    styles.input,
    styles[`${size}Input`],
    disabled && styles.disabledInput,
    inputStyle,
  ];

  return (
    <View style={styles.wrapper}>
      <View style={containerStyle}>
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={Layout.iconSize.sm}
            color={Colors.textSecondary}
            style={styles.leftIcon}
          />
        )}
        
        <TextInput
          style={inputStyleArray}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={Colors.inputPlaceholder}
        />
        
        {(rightIcon || secureTextEntry) && (
          <TouchableOpacity
            onPress={handleRightIconPress}
            style={styles.rightIcon}
            disabled={disabled}
          >
            <Ionicons
              name={
                secureTextEntry
                  ? showPassword
                    ? "eye-off"
                    : "eye"
                  : rightIcon!
              }
              size={Layout.iconSize.sm}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Layout.spacing.sm,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Layout.borderRadius.md,
  },
  
  // Variants
  default: {
    backgroundColor: Colors.inputBackground,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  outlined: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: Colors.inputBorder,
  },
  filled: {
    backgroundColor: Colors.backgroundDark,
    borderWidth: 0,
  },
  
  // Sizes
  sm: {
    height: Layout.inputHeight.sm,
    paddingHorizontal: Layout.spacing.md,
  },
  md: {
    height: Layout.inputHeight.md,
    paddingHorizontal: Layout.spacing.md,
  },
  lg: {
    height: Layout.inputHeight.lg,
    paddingHorizontal: Layout.spacing.lg,
  },
  
  // States
  focused: {
    borderColor: Colors.primary,
  },
  error: {
    borderColor: Colors.error,
  },
  disabled: {
    backgroundColor: Colors.backgroundDark,
    opacity: 0.6,
  },
  
  // Input styles
  input: {
    flex: 1,
    color: Colors.textPrimary,
  },
  smInput: {
    fontSize: Layout.fontSize.sm,
  },
  mdInput: {
    fontSize: Layout.fontSize.md,
  },
  lgInput: {
    fontSize: Layout.fontSize.lg,
  },
  disabledInput: {
    color: Colors.textSecondary,
  },
  
  // Icons
  leftIcon: {
    marginRight: Layout.spacing.sm,
  },
  rightIcon: {
    marginLeft: Layout.spacing.sm,
    padding: Layout.spacing.xs,
  },
  
  // Error text
  errorText: {
    color: Colors.error,
    fontSize: Layout.fontSize.xs,
    marginTop: Layout.spacing.xs,
    marginLeft: Layout.spacing.sm,
  },
}); 