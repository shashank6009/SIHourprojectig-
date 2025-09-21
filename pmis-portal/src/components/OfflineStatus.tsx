'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { offlineSync } from '@/lib/offlineStorage';

export function OfflineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showStatus, setShowStatus] = useState(false);
  const [pendingSync, setPendingSync] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Initialize online status
    setIsOnline(navigator.onLine);

    const handleOnline = async () => {
      setIsOnline(true);
      setShowStatus(true);
      setIsSyncing(true);
      
      try {
        await offlineSync.syncPendingData();
        const status = await offlineSync.getSyncStatus();
        setPendingSync(status.pendingCount);
      } catch (error) {
        console.error('Sync failed:', error);
      } finally {
        setIsSyncing(false);
        // Hide status after 5 seconds
        setTimeout(() => setShowStatus(false), 5000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };

    // Load initial sync status
    const loadSyncStatus = async () => {
      try {
        const status = await offlineSync.getSyncStatus();
        setPendingSync(status.pendingCount);
        if (status.pendingCount > 0) {
          setShowStatus(true);
        }
      } catch (error) {
        console.error('Failed to load sync status:', error);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    loadSyncStatus();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleManualSync = async () => {
    if (!isOnline) return;
    
    setIsSyncing(true);
    try {
      await offlineSync.syncPendingData();
      const status = await offlineSync.getSyncStatus();
      setPendingSync(status.pendingCount);
    } catch (error) {
      console.error('Manual sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDismiss = () => {
    setShowStatus(false);
  };

  // Don't show anything if online and no pending sync
  if (isOnline && pendingSync === 0 && !showStatus) {
    return null;
  }

  return (
    <AnimatePresence>
      {(showStatus || !isOnline || pendingSync > 0) && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Status Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isOnline 
                    ? pendingSync > 0 
                      ? 'bg-orange-100' 
                      : 'bg-green-100'
                    : 'bg-red-100'
                }`}>
                  {isSyncing ? (
                    <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                  ) : isOnline ? (
                    pendingSync > 0 ? (
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-600" />
                  )}
                </div>

                {/* Status Text */}
                <div>
                  <div className="flex items-center gap-2">
                    {isOnline ? (
                      <Wifi className="w-4 h-4 text-green-600" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      isOnline ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-600">
                    {isSyncing ? (
                      'Syncing your data...'
                    ) : isOnline ? (
                      pendingSync > 0 
                        ? `${pendingSync} item${pendingSync > 1 ? 's' : ''} pending sync`
                        : 'All data synced'
                    ) : (
                      'Working offline - data will sync when connection returns'
                    )}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {isOnline && pendingSync > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleManualSync}
                    disabled={isSyncing}
                    className="text-xs"
                  >
                    {isSyncing ? (
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3 h-3 mr-1" />
                    )}
                    Sync Now
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  ×
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Offline indicator for forms
export function OfflineFormIndicator({ isVisible = true }: { isVisible?: boolean }) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isVisible || isOnline) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4"
    >
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-orange-600" />
        <div>
          <h4 className="text-sm font-medium text-orange-800">Working Offline</h4>
          <p className="text-xs text-orange-700">
            Your changes are being saved locally and will sync when you're back online.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
