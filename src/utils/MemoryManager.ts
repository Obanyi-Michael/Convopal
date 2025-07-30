import { Platform } from 'react-native';
import { InteractionManager } from 'react-native';

export class MemoryManager {
  private static instance: MemoryManager;
  private memoryUsage: number = 0;
  private isMonitoring: boolean = false;
  private cleanupTasks: (() => void)[] = [];

  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  // Monitor memory usage
  startMemoryMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.monitorMemoryUsage();
  }

  private monitorMemoryUsage(): void {
    if (!this.isMonitoring) return;

    // Simulate memory monitoring (in real app, use native modules)
    setInterval(() => {
      this.memoryUsage = Math.random() * 100; // Placeholder
      
      // Trigger cleanup if memory usage is high
      if (this.memoryUsage > 80) {
        this.performCleanup();
      }
    }, 5000);

    // Clean up expired cache every minute
    setInterval(() => {
      this.clearExpiredCache();
    }, 60000);
  }

  stopMemoryMonitoring(): void {
    this.isMonitoring = false;
  }

  // Register cleanup tasks
  registerCleanupTask(task: () => void): void {
    this.cleanupTasks.push(task);
  }

  // Perform memory cleanup
  performCleanup(): void {
    console.log('Performing memory cleanup...');
    
    // Run cleanup tasks
    this.cleanupTasks.forEach(task => {
      try {
        task();
      } catch (error) {
        console.error('Cleanup task failed:', error);
      }
    });

    // Platform-specific cleanup
    if (Platform.OS === 'android') {
      // Android-specific memory cleanup
      if (global.gc) {
        global.gc();
      }
    }

    // Clear expired cache
    this.clearExpiredCache();
  }

  // Clear expired cache entries
  private clearExpiredCache(): void {
    // This will be implemented with the NetworkOptimizer
  }

  // Get current memory usage
  getMemoryUsage(): number {
    return this.memoryUsage;
  }

  // Optimize image loading
  static optimizeImageLoading(uri: string, size: number = 100) {
    return {
      source: { uri },
      style: { width: size, height: size },
      resizeMode: 'cover' as const,
      fadeDuration: 0,
      progressiveRenderingEnabled: true,
      cachePolicy: 'memory-disk' as const,
    };
  }

  // Optimize list rendering
  static getOptimizedListConfig() {
    return {
      removeClippedSubviews: true,
      maxToRenderPerBatch: 5,
      windowSize: 5,
      initialNumToRender: 5,
      updateCellsBatchingPeriod: 50,
      disableVirtualization: false,
    };
  }

  // Debounce expensive operations
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

  // Throttle frequent operations
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

  // Batch state updates
  static batchUpdates<T>(
    setState: React.Dispatch<React.SetStateAction<T>>,
    updates: Partial<T>[]
  ): void {
    InteractionManager.runAfterInteractions(() => {
      const batchedUpdate = updates.reduce((acc, update) => ({ ...acc, ...update }), {});
      setState(prev => ({ ...prev, ...batchedUpdate }));
    });
  }
}

// Battery optimization
export class BatteryOptimizer {
  private static instance: BatteryOptimizer;
  private isLowPowerMode: boolean = false;

  static getInstance(): BatteryOptimizer {
    if (!BatteryOptimizer.instance) {
      BatteryOptimizer.instance = new BatteryOptimizer();
    }
    return BatteryOptimizer.instance;
  }

  // Optimize for low power mode
  setLowPowerMode(enabled: boolean): void {
    this.isLowPowerMode = enabled;
  }

  // Get optimized polling interval based on battery level
  getOptimizedPollingInterval(): number {
    return this.isLowPowerMode ? 10000 : 5000; // 10s vs 5s
  }

  // Get optimized image quality based on battery
  getOptimizedImageQuality(): number {
    return this.isLowPowerMode ? 0.5 : 1.0;
  }

  // Get optimized animation settings
  getOptimizedAnimationSettings() {
    return {
      useNativeDriver: true,
      duration: this.isLowPowerMode ? 200 : 300,
      tension: this.isLowPowerMode ? 50 : 80,
      friction: this.isLowPowerMode ? 10 : 8,
    };
  }
} 