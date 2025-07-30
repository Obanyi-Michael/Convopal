import { InteractionManager } from 'react-native';
import { Platform } from 'react-native';

export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private memoryUsage: number = 0;
  private frameRate: number = 60;
  private isMonitoring: boolean = false;

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  // Optimize heavy operations to run after interactions
  static deferHeavyOperation(operation: () => void): void {
    InteractionManager.runAfterInteractions(() => {
      operation();
    });
  }

  // Batch state updates to reduce re-renders
  static batchStateUpdates<T>(
    setState: React.Dispatch<React.SetStateAction<T>>,
    updates: Partial<T>[]
  ): void {
    const batchedUpdate = updates.reduce((acc, update) => ({ ...acc, ...update }), {});
    setState(prev => ({ ...prev, ...batchedUpdate }));
  }

  // Optimize list rendering with virtualization
  static getOptimizedListProps() {
    return {
      removeClippedSubviews: true,
      maxToRenderPerBatch: 10,
      windowSize: 10,
      initialNumToRender: 10,
      getItemLayout: undefined, // Will be set per component
      keyExtractor: (item: any, index: number) => item.id?.toString() || index.toString(),
    };
  }

  // Memory management
  static clearMemory(): void {
    if (Platform.OS === 'android') {
      // Android-specific memory cleanup
      if (global.gc) {
        global.gc();
      }
    }
  }

  // Frame rate monitoring
  startFrameRateMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    let frameCount = 0;
    let lastTime = Date.now();

    const measureFrameRate = () => {
      frameCount++;
      const currentTime = Date.now();
      
      if (currentTime - lastTime >= 1000) {
        this.frameRate = frameCount;
        frameCount = 0;
        lastTime = currentTime;
      }

      if (this.isMonitoring) {
        requestAnimationFrame(measureFrameRate);
      }
    };

    requestAnimationFrame(measureFrameRate);
  }

  stopFrameRateMonitoring(): void {
    this.isMonitoring = false;
  }

  getFrameRate(): number {
    return this.frameRate;
  }

  // Debounce function for performance
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait) as ReturnType<typeof setTimeout>;
    };
  }

  // Throttle function for performance
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }
}

// Image optimization utilities
export const ImageOptimizer = {
  // Optimize image loading
  getOptimizedImageProps(uri: string, size: number = 100) {
    return {
      source: { uri },
      style: { width: size, height: size },
      resizeMode: 'cover' as const,
      fadeDuration: 0,
      progressiveRenderingEnabled: true,
    };
  },

  // Lazy load images
  lazyLoadImage(uri: string, placeholder: string) {
    return {
      source: { uri },
      defaultSource: { uri: placeholder },
      loadingIndicatorSource: { uri: placeholder },
    };
  },
};

// Network optimization
export const NetworkOptimizer = {
  // Cache API responses
  cache: new Map<string, { data: any; timestamp: number }>(),

  // Cache with TTL
  setCache(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, { data, timestamp: Date.now() + ttl });
  },

  // Get cached data
  getCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() < cached.timestamp) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  },

  // Clear expired cache
  clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now > value.timestamp) {
        this.cache.delete(key);
      }
    }
  },
}; 