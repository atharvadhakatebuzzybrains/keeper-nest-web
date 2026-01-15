// utils/roleCache.ts
class RoleCache {
  private static instance: RoleCache;
  private role: 'admin' | 'employee' | null = null;
  private lastFetched: number = 0;
  private cacheDuration: number = 100 * 60 * 1000;

  private constructor() {}

  static getInstance(): RoleCache {
    if (!RoleCache.instance) {
      RoleCache.instance = new RoleCache();
    }
    return RoleCache.instance;
  }

  setRole(role: 'admin' | 'employee'): void {
    this.role = role;
    this.lastFetched = Date.now();
  }

  getRole(): 'admin' | 'employee' | null {
    if (this.role && Date.now() - this.lastFetched < this.cacheDuration) {
      return this.role;
    }
    return null;
  }

  clear(): void {
    this.role = null;
    this.lastFetched = 0;
  }
}

export const roleCache = RoleCache.getInstance();