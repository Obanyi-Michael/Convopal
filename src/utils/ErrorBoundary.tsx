import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log error to analytics service
    this.logError(error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });
  }

  private logError(error: Error, errorInfo: React.ErrorInfo) {
    // In a real app, send this to your error tracking service
    // Example: Sentry, Crashlytics, etc.
    console.error('Error logged:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReport = () => {
    Alert.alert(
      'Report Error',
      'Would you like to report this error to help us improve the app?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Report', 
          onPress: () => {
            // In a real app, open email or feedback form
            console.log('Error report requested');
          }
        }
      ]
    );
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Ionicons name="warning" size={64} color="#FF6B6B" />
          </View>
          
          <Text style={styles.title}>Oops! Something went wrong</Text>
          <Text style={styles.message}>
            We're sorry, but something unexpected happened. Please try again.
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.retryButton} onPress={this.handleRetry}>
              <Ionicons name="refresh" size={20} color="white" />
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.reportButton} onPress={this.handleReport}>
              <Ionicons name="bug" size={20} color="#FF6B6B" />
              <Text style={styles.reportButtonText}>Report Issue</Text>
            </TouchableOpacity>
          </View>
          
          {__DEV__ && this.state.error && (
            <View style={styles.debugContainer}>
              <Text style={styles.debugTitle}>Debug Information:</Text>
              <Text style={styles.debugText}>{this.state.error.message}</Text>
              <Text style={styles.debugText}>{this.state.error.stack}</Text>
            </View>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#07C160',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    gap: 8,
  },
  reportButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
  debugContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#ECF0F1',
    borderRadius: 8,
    width: '100%',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  debugText: {
    fontSize: 12,
    color: '#7F8C8D',
    fontFamily: 'monospace',
  },
});

// Global error handler
export const setupGlobalErrorHandler = () => {
  const originalErrorHandler = ErrorUtils.setGlobalHandler;
  
  ErrorUtils.setGlobalHandler((error: Error) => {
    console.error('Global error caught:', error);
    
    // Log to analytics
    console.error('Global error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
    
    // Call original handler
    if (originalErrorHandler) {
      originalErrorHandler(error);
    }
  });
};

// Promise rejection handler
export const setupPromiseRejectionHandler = () => {
  const originalHandler = global.onunhandledrejection;
  
  global.onunhandledrejection = (event: any) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Log to analytics
    console.error('Promise rejection:', {
      reason: event.reason,
      timestamp: new Date().toISOString(),
    });
    
    // Call original handler
    if (originalHandler) {
      originalHandler.call(global, event);
    }
  };
}; 