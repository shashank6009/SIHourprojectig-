// Offline Storage System using IndexedDB
// Provides comprehensive offline data storage and synchronization

export interface OfflineData {
  id: string;
  data: any;
  timestamp: number;
  type: 'profile' | 'internship' | 'cache' | 'form-draft';
  syncStatus: 'pending' | 'synced' | 'failed';
  retryCount?: number;
}

export class OfflineStorageManager {
  private dbName = 'PMISPortalDB';
  private dbVersion = 1;
  private storeName = 'offline-data';

  // Initialize IndexedDB
  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = () => {
        const db = request.result;
        
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          
          // Create indexes for efficient querying
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('syncStatus', 'syncStatus', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  // Store data offline
  async storeOfflineData(
    id: string,
    data: any,
    type: OfflineData['type']
  ): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);

      const offlineData: OfflineData = {
        id,
        data,
        timestamp: Date.now(),
        type,
        syncStatus: 'pending',
        retryCount: 0
      };

      await new Promise<void>((resolve, reject) => {
        const request = store.put(offlineData);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      console.log(`[OfflineStorage] Stored ${type} data offline:`, id);
    } catch (error) {
      console.error('[OfflineStorage] Failed to store offline data:', error);
      throw error;
    }
  }

  // Retrieve offline data
  async getOfflineData(id: string): Promise<OfflineData | null> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);

      return new Promise((resolve, reject) => {
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('[OfflineStorage] Failed to get offline data:', error);
      return null;
    }
  }

  // Get all offline data by type
  async getOfflineDataByType(type: OfflineData['type']): Promise<OfflineData[]> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('type');

      return new Promise((resolve, reject) => {
        const request = index.getAll(type);
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('[OfflineStorage] Failed to get offline data by type:', error);
      return [];
    }
  }

  // Get pending sync data
  async getPendingSyncData(): Promise<OfflineData[]> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('syncStatus');

      return new Promise((resolve, reject) => {
        const request = index.getAll('pending');
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('[OfflineStorage] Failed to get pending sync data:', error);
      return [];
    }
  }

  // Update sync status
  async updateSyncStatus(
    id: string,
    syncStatus: OfflineData['syncStatus'],
    retryCount?: number
  ): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);

      const existingData = await new Promise<OfflineData>((resolve, reject) => {
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      if (existingData) {
        existingData.syncStatus = syncStatus;
        if (retryCount !== undefined) {
          existingData.retryCount = retryCount;
        }

        await new Promise<void>((resolve, reject) => {
          const request = store.put(existingData);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }
    } catch (error) {
      console.error('[OfflineStorage] Failed to update sync status:', error);
    }
  }

  // Remove offline data
  async removeOfflineData(id: string): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);

      await new Promise<void>((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      console.log('[OfflineStorage] Removed offline data:', id);
    } catch (error) {
      console.error('[OfflineStorage] Failed to remove offline data:', error);
    }
  }

  // Clear all offline data
  async clearAllOfflineData(): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);

      await new Promise<void>((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      console.log('[OfflineStorage] Cleared all offline data');
    } catch (error) {
      console.error('[OfflineStorage] Failed to clear offline data:', error);
    }
  }

  // Get storage usage statistics
  async getStorageStats(): Promise<{
    totalItems: number;
    pendingSync: number;
    byType: Record<string, number>;
    oldestItem: number | null;
    newestItem: number | null;
  }> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);

      const allData = await new Promise<OfflineData[]>((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });

      const stats = {
        totalItems: allData.length,
        pendingSync: allData.filter(item => item.syncStatus === 'pending').length,
        byType: {} as Record<string, number>,
        oldestItem: null as number | null,
        newestItem: null as number | null
      };

      // Calculate type distribution
      allData.forEach(item => {
        stats.byType[item.type] = (stats.byType[item.type] || 0) + 1;
      });

      // Find oldest and newest items
      const timestamps = allData.map(item => item.timestamp).sort((a, b) => a - b);
      if (timestamps.length > 0) {
        stats.oldestItem = timestamps[0];
        stats.newestItem = timestamps[timestamps.length - 1];
      }

      return stats;
    } catch (error) {
      console.error('[OfflineStorage] Failed to get storage stats:', error);
      return {
        totalItems: 0,
        pendingSync: 0,
        byType: {},
        oldestItem: null,
        newestItem: null
      };
    }
  }

  // Clean up old data (older than 30 days)
  async cleanupOldData(maxAge: number = 30 * 24 * 60 * 60 * 1000): Promise<number> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);

      const cutoffTime = Date.now() - maxAge;
      let deletedCount = 0;

      const allData = await new Promise<OfflineData[]>((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });

      // Delete old items that are already synced
      for (const item of allData) {
        if (item.timestamp < cutoffTime && item.syncStatus === 'synced') {
          await new Promise<void>((resolve, reject) => {
            const request = store.delete(item.id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
          });
          deletedCount++;
        }
      }

      console.log(`[OfflineStorage] Cleaned up ${deletedCount} old items`);
      return deletedCount;
    } catch (error) {
      console.error('[OfflineStorage] Failed to cleanup old data:', error);
      return 0;
    }
  }
}

// Offline Queue Manager for handling sync operations
export class OfflineSyncManager {
  private storageManager: OfflineStorageManager;
  private syncInProgress = false;
  private maxRetries = 3;

  constructor() {
    this.storageManager = new OfflineStorageManager();
    
    // Listen for online events to trigger sync
    window.addEventListener('online', () => {
      console.log('[OfflineSync] Connection restored, starting sync...');
      this.syncPendingData();
    });

    // Register background sync if supported
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      this.registerBackgroundSync();
    }
  }

  // Queue data for offline sync
  async queueForSync(
    id: string,
    data: any,
    type: OfflineData['type']
  ): Promise<void> {
    await this.storageManager.storeOfflineData(id, data, type);
    
    // Try immediate sync if online
    if (navigator.onLine) {
      this.syncPendingData();
    }
  }

  // Sync all pending data
  async syncPendingData(): Promise<void> {
    if (this.syncInProgress) {
      console.log('[OfflineSync] Sync already in progress');
      return;
    }

    this.syncInProgress = true;

    try {
      const pendingData = await this.storageManager.getPendingSyncData();
      console.log(`[OfflineSync] Found ${pendingData.length} items to sync`);

      for (const item of pendingData) {
        await this.syncSingleItem(item);
      }
    } catch (error) {
      console.error('[OfflineSync] Sync failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  // Sync a single item
  private async syncSingleItem(item: OfflineData): Promise<void> {
    try {
      let success = false;

      switch (item.type) {
        case 'profile':
          success = await this.syncProfile(item);
          break;
        case 'internship':
          success = await this.syncInternship(item);
          break;
        default:
          console.warn('[OfflineSync] Unknown sync type:', item.type);
          return;
      }

      if (success) {
        await this.storageManager.updateSyncStatus(item.id, 'synced');
        console.log(`[OfflineSync] Successfully synced ${item.type}:`, item.id);
      } else {
        const newRetryCount = (item.retryCount || 0) + 1;
        
        if (newRetryCount >= this.maxRetries) {
          await this.storageManager.updateSyncStatus(item.id, 'failed', newRetryCount);
          console.error(`[OfflineSync] Max retries exceeded for ${item.type}:`, item.id);
        } else {
          await this.storageManager.updateSyncStatus(item.id, 'pending', newRetryCount);
          console.log(`[OfflineSync] Retry ${newRetryCount} for ${item.type}:`, item.id);
        }
      }
    } catch (error) {
      console.error(`[OfflineSync] Failed to sync ${item.type}:`, error);
    }
  }

  // Sync profile data
  private async syncProfile(item: OfflineData): Promise<boolean> {
    try {
      const response = await fetch('/api/profile/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.data)
      });

      return response.ok;
    } catch (error) {
      console.error('[OfflineSync] Profile sync failed:', error);
      return false;
    }
  }

  // Sync internship application
  private async syncInternship(item: OfflineData): Promise<boolean> {
    try {
      const response = await fetch('/api/internship/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.data)
      });

      return response.ok;
    } catch (error) {
      console.error('[OfflineSync] Internship sync failed:', error);
      return false;
    }
  }

  // Register background sync
  private async registerBackgroundSync(): Promise<void> {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('background-sync');
      console.log('[OfflineSync] Background sync registered');
    } catch (error) {
      console.error('[OfflineSync] Background sync registration failed:', error);
    }
  }

  // Get sync status
  async getSyncStatus(): Promise<{
    pendingCount: number;
    failedCount: number;
    lastSyncTime: number | null;
  }> {
    const allData = await this.storageManager.getPendingSyncData();
    const failedData = allData.filter(item => item.syncStatus === 'failed');
    
    return {
      pendingCount: allData.length,
      failedCount: failedData.length,
      lastSyncTime: Date.now() // This would be stored separately in a real implementation
    };
  }
}

// Global instances
export const offlineStorage = new OfflineStorageManager();
export const offlineSync = new OfflineSyncManager();
