import redisClient from "@/server/lib/redis";

export interface CacheConfig {
  ttl: number; // TTL en segundos
  prefix: string;
}

export class CacheManager {
  private static instance: CacheManager;
  private redis: typeof redisClient;

  private constructor() {
    this.redis = redisClient;
  }

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  /**
   * Obtiene datos del cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.log("[CACHE GET ERROR]", error);
      return null;
    }
  }

  /**
   * Guarda datos en el cache con TTL
   */
  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    try {
      await this.redis.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.log("[CACHE SET ERROR]", error);
    }
  }

  /**
   * Elimina una clave del cache
   */
  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.log("[CACHE DEL ERROR]", error);
    }
  }

  /**
   * Elimina múltiples claves del cache
   */
  async delMultiple(keys: string[]): Promise<void> {
    try {
      if (keys.length > 0) {
        await this.redis.del(keys);
      }
    } catch (error) {
      console.log("[CACHE DEL MULTIPLE ERROR]", error);
    }
  }

  /**
   * Busca claves que coincidan con un patrón
   */
  async keys(pattern: string): Promise<string[]> {
    try {
      return await this.redis.keys(pattern);
    } catch (error) {
      console.log("[CACHE KEYS ERROR]", error);
      return [];
    }
  }

  /**
   * Limpia todas las claves que coincidan con un patrón
   */
  async clearPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.keys(pattern);
      if (keys.length > 0) {
        await this.delMultiple(keys);
      }
    } catch (error) {
      console.log("[CACHE CLEAR PATTERN ERROR]", error);
    }
  }

  /**
   * Obtiene datos del cache o los calcula si no existen
   */
  async getOrSet<T>(
    key: string,
    ttl: number,
    fallback: () => Promise<T>
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fallback();
    await this.set(key, data, ttl);
    return data;
  }

  /**
   * Verifica si Redis está conectado
   */
  async isConnected(): Promise<boolean> {
    try {
      await this.redis.ping();
      return true;
    } catch {
      return false;
    }
  }
}

// Exportar instancia singleton
export const cacheManager = CacheManager.getInstance();

// Funciones de utilidad específicas para el dashboard
export const dashboardCache = {
  keys: {
    bestHoldings: (userId: string) => `dashboard:best_holdings:${userId}`,
    totalEarnings: (userId: string) => `dashboard:total_earnings:${userId}`,
  },
  ttl: {
    bestHoldings: 432000, // 5 días
    totalEarnings: 432000, // 5 días
  },
  async invalidate(userId: string): Promise<void> {
    const keys = [
      dashboardCache.keys.bestHoldings(userId),
      dashboardCache.keys.totalEarnings(userId),
    ];
    await cacheManager.delMultiple(keys);
  },
  async clearAll(): Promise<void> {
    await cacheManager.clearPattern("dashboard:*");
  },
};
