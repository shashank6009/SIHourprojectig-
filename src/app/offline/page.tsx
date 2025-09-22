'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  WifiOff, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Database,
  Smartphone,
  Globe,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { offlineStorage, offlineSync } from '@/lib/offlineStorage';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [syncStatus, setSyncStatus] = useState({
    pendingCount: 0,
    failedCount: 0,
    lastSyncTime: null as number | null
  });
  const [storageStats, setStorageStats] = useState({
    totalItems: 0,
    pendingSync: 0,
    byType: {} as Record<string, number>
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      loadSyncStatus();
    };
    
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load initial data
    loadSyncStatus();
    loadStorageStats();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadSyncStatus = async () => {
    try {
      if (offlineSync) {
        const status = await offlineSync!.getSyncStatus();
        setSyncStatus(status);
      }
    } catch (error) {
      console.error('Failed to load sync status:', error);
    }
  };

  const loadStorageStats = async () => {
    try {
      if (offlineStorage) {
        const stats = await offlineStorage.getStorageStats();
        setStorageStats(stats);
      }
    } catch (error) {
      console.error('Failed to load storage stats:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      if (isOnline && offlineSync) {
        // Try to sync pending data
        await offlineSync!.syncPendingData();
        await loadSyncStatus();
      }
      
      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRetryConnection = () => {
    setIsRefreshing(true);
    // Force a network request to check connectivity
    fetch('/', { method: 'HEAD', cache: 'no-cache' })
      .then(() => {
        setIsOnline(true);
        window.location.reload();
      })
      .catch(() => {
        setIsOnline(false);
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gov-saffron/10 rounded-full flex items-center justify-center">
            <WifiOff className="w-12 h-12 text-gov-saffron" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {`You're Currently Offline`}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don&apos;t worry! The PM Internship Scheme Portal works offline. 
            You can continue using the application and your data will sync when you&apos;re back online.
          </p>
        </motion.div>

        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Alert className={`${isOnline ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
            <div className="flex items-center">
              {isOnline ? (
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              ) : (
                <WifiOff className="h-4 w-4 text-orange-600 mr-2" />
              )}
              <AlertDescription className={isOnline ? 'text-green-800' : 'text-orange-800'}>
                {isOnline ? 'Connection restored! Your data will sync automatically.' : 'No internet connection detected.'}
              </AlertDescription>
            </div>
          </Alert>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Offline Features */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-gov-navy" />
                  Available Offline
                </CardTitle>
                <CardDescription>Features you can use without internet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Edit Profile</h4>
                    <p className="text-sm text-gray-600">Update your personal information and preferences</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Fill Applications</h4>
                    <p className="text-sm text-gray-600">Complete internship applications and save as drafts</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">View Cached Content</h4>
                    <p className="text-sm text-gray-600">Access previously loaded pages and information</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Resume Upload</h4>
                    <p className="text-sm text-gray-600">Upload and parse resumes (saved for later sync)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sync Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-gov-navy" />
                  Sync Status
                </CardTitle>
                <CardDescription>Your offline data synchronization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Stored Items</span>
                  <span className="text-lg font-bold text-gov-navy">{storageStats.totalItems}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Pending Sync</span>
                  <span className={`text-lg font-bold ${syncStatus.pendingCount > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    {syncStatus.pendingCount}
                  </span>
                </div>
                
                {syncStatus.failedCount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Failed Sync</span>
                    <span className="text-lg font-bold text-red-600">{syncStatus.failedCount}</span>
                  </div>
                )}
                
                <div className="pt-2 border-t">
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Auto-sync when connection returns
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <Button
            onClick={handleRetryConnection}
            disabled={isRefreshing}
            className="bg-gov-saffron hover:bg-gov-saffron/90 text-white"
          >
            {isRefreshing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Globe className="w-4 h-4 mr-2" />
            )}
            Check Connection
          </Button>
          
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="border-gov-navy text-gov-navy hover:bg-gov-navy hover:text-white"
          >
            {isRefreshing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh Page
          </Button>
        </motion.div>

        {/* Navigation Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <Link href="/">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <ArrowLeft className="w-6 h-6 mx-auto mb-2 text-gov-saffron" />
                <h3 className="font-medium text-gray-900">Go Home</h3>
                <p className="text-sm text-gray-600">Return to homepage</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/dashboard">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Database className="w-6 h-6 mx-auto mb-2 text-gov-saffron" />
                <h3 className="font-medium text-gray-900">Edit Profile</h3>
                <p className="text-sm text-gray-600">Update your information</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/internship">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Smartphone className="w-6 h-6 mx-auto mb-2 text-gov-saffron" />
                <h3 className="font-medium text-gray-900">Apply Offline</h3>
                <p className="text-sm text-gray-600">Fill internship application</p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        {/* Info Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <AlertCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-blue-900 mb-2">Offline Mode Active</h3>
            <p className="text-blue-800 text-sm max-w-2xl mx-auto">
              The PM Internship Scheme Portal is designed to work seamlessly offline. 
              All your changes are saved locally and will automatically sync with our servers 
              when your internet connection is restored. Continue using the portal normally.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
