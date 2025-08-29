// Advanced caching utilities for performance optimization
import { useState, useEffect } from "react";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
  accessCount: number;
  lastAccessed: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
  staleWhileRevalidate?: boolean; // Return stale data while fetching fresh
}

export class MemoryCache<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private options: Required<CacheOptions>;

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl || 5 * 60 * 1000, // 5 minutes default
      maxSize: options.maxSize || 100,
      staleWhileRevalidate: options.staleWhileRevalidate || false,
    };
  }

  set(key: string, data: T, customTTL?: number): void {
    const now = Date.now();
    const ttl = customTTL || this.options.ttl;

    // Clean up if at max size
    if (this.cache.size >= this.options.maxSize) {
      this.evictLeastUsed();
    }

    this.cache.set(key, {
      data,
      timestamp: now,
      expiry: now + ttl,
      accessCount: 1,
      lastAccessed: now,
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();

    // Update access stats
    entry.accessCount++;
    entry.lastAccessed = now;

    // Check if expired
    if (now > entry.expiry) {
      if (!this.options.staleWhileRevalidate) {
        this.cache.delete(key);
        return null;
      }
      // Return stale data but mark for revalidation
      entry.data = { ...entry.data, __stale: true } as T;
    }

    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const now = Date.now();
    if (now > entry.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Evict least recently used entry
  private evictLeastUsed(): void {
    let lruKey = "";
    let lruTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < lruTime) {
        lruTime = entry.lastAccessed;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
    }
  }

  // Get cache statistics
  getStats() {
    const entries = Array.from(this.cache.values());
    const now = Date.now();

    return {
      size: this.cache.size,
      maxSize: this.options.maxSize,
      expired: entries.filter((entry) => now > entry.expiry).length,
      totalAccesses: entries.reduce((sum, entry) => sum + entry.accessCount, 0),
      averageAge:
        entries.reduce((sum, entry) => sum + (now - entry.timestamp), 0) /
          entries.length || 0,
    };
  }
}

// Local storage cache with compression
export class PersistentCache<T = any> {
  private prefix: string;
  private compression: boolean;

  constructor(prefix = "tropical_cache_", compression = true) {
    this.prefix = prefix;
    this.compression = compression;
  }

  set(key: string, data: T, ttl = 24 * 60 * 60 * 1000): void {
    try {
      const entry = {
        data,
        expiry: Date.now() + ttl,
        compressed: this.compression,
      };

      let serialized = JSON.stringify(entry);

      // Simple compression using string manipulation
      if (this.compression) {
        serialized = this.compress(serialized);
      }

      localStorage.setItem(this.prefix + key, serialized);
    } catch (error) {
      console.warn("Failed to cache to localStorage:", error);
    }
  }

  get(key: string): T | null {
    try {
      let item = localStorage.getItem(this.prefix + key);
      if (!item) return null;

      // Decompress if needed
      if (item.startsWith("COMPRESSED:")) {
        item = this.decompress(item);
      }

      const entry = JSON.parse(item);

      if (Date.now() > entry.expiry) {
        this.delete(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.warn("Failed to retrieve from localStorage:", error);
      return null;
    }
  }

  delete(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  // Simple string compression
  private compress(str: string): string {
    return "COMPRESSED:" + btoa(str);
  }

  private decompress(str: string): string {
    return atob(str.replace("COMPRESSED:", ""));
  }
}

// Recipe cache specifically optimized for AI responses
export class RecipeCache extends MemoryCache<any> {
  constructor() {
    super({
      ttl: 30 * 60 * 1000, // 30 minutes for recipes
      maxSize: 50,
      staleWhileRevalidate: true,
    });
  }

  // Generate cache key from recipe request
  generateKey(request: {
    fruit: string;
    style: string;
    vegetables?: string;
    dietaryRestrictions?: string;
  }): string {
    const normalized = {
      fruit: request.fruit.toLowerCase().trim(),
      style: request.style.toLowerCase().trim(),
      vegetables: request.vegetables?.toLowerCase().trim() || "",
      dietaryRestrictions:
        request.dietaryRestrictions?.toLowerCase().trim() || "",
    };

    return `recipe_${JSON.stringify(normalized)}`;
  }

  cacheRecipe(request: any, recipe: any): void {
    const key = this.generateKey(request);
    this.set(key, recipe);
  }

  getCachedRecipe(request: any): any {
    const key = this.generateKey(request);
    return this.get(key);
  }
}

// Image cache for optimized loading
export class ImageCache {
  private cache = new Map<string, HTMLImageElement>();
  private loading = new Set<string>();

  async preload(src: string): Promise<HTMLImageElement> {
    if (this.cache.has(src)) {
      return this.cache.get(src)!;
    }

    if (this.loading.has(src)) {
      // Wait for existing load
      return new Promise((resolve) => {
        const checkLoaded = () => {
          if (this.cache.has(src)) {
            resolve(this.cache.get(src)!);
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
      });
    }

    this.loading.add(src);

    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        this.cache.set(src, img);
        this.loading.delete(src);
        resolve(img);
      };

      img.onerror = () => {
        this.loading.delete(src);
        reject(new Error(`Failed to load image: ${src}`));
      };

      img.src = src;
    });
  }

  preloadMultiple(srcs: string[]): Promise<HTMLImageElement[]> {
    return Promise.all(srcs.map((src) => this.preload(src)));
  }

  has(src: string): boolean {
    return this.cache.has(src);
  }

  clear(): void {
    this.cache.clear();
    this.loading.clear();
  }
}

// Global cache instances
export const memoryCache = new MemoryCache();
export const persistentCache = new PersistentCache();
export const recipeCache = new RecipeCache();
export const imageCache = new ImageCache();

// React hooks for caching
export const useCachedData = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options: { ttl?: number; persistToStorage?: boolean } = {}
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Try memory cache first
        const cached = memoryCache.get(key);
        if (cached) {
          setData(cached);
          setLoading(false);
          return;
        }

        // Try persistent cache if enabled
        if (options.persistToStorage) {
          const persistent = persistentCache.get(key);
          if (persistent) {
            setData(persistent);
            setLoading(false);
            memoryCache.set(key, persistent, options.ttl);
            return;
          }
        }

        // Fetch fresh data
        setLoading(true);
        const freshData = await fetcher();

        // Cache the results
        memoryCache.set(key, freshData, options.ttl);
        if (options.persistToStorage) {
          persistentCache.set(key, freshData, options.ttl);
        }

        setData(freshData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [key, fetcher, options.ttl, options.persistToStorage]);

  return { data, loading, error };
};

export default {
  MemoryCache,
  PersistentCache,
  RecipeCache,
  ImageCache,
  memoryCache,
  persistentCache,
  recipeCache,
  imageCache,
  useCachedData,
};
