// PWA and Service Worker Registration

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('[PWA] Service Worker not supported');
    return null;
  }

  // Skip service worker in development to avoid port conflicts
  if (process.env.NODE_ENV === 'development') {
    console.log('[PWA] Service Worker disabled in development mode');
    return null;
  }

  try {
    console.log('[PWA] Registering Service Worker...');
    
    // Check if service worker file exists before registering
    const swResponse = await fetch('/sw.js', { method: 'HEAD' });
    if (!swResponse.ok) {
      console.warn('[PWA] Service Worker file not found, skipping registration');
      return null;
    }

    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none'
    });

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[PWA] New content available, please refresh');
            // You could show a notification here
          }
        });
      }
    });

    console.log('[PWA] Service Worker registered successfully:', registration.scope);
    return registration;
  } catch (error) {
    console.error('[PWA] Service Worker registration failed:', error);
    return null;
  }
}

export async function checkForUpdates(): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      console.log('[PWA] Checked for updates');
    }
  } catch (error) {
    console.error('[PWA] Error checking for updates:', error);
  }
}

export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
}

export function isPWAInstalled(): boolean {
  return isStandalone();
}

export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof window === 'undefined' || !('storage' in navigator && 'persist' in navigator.storage)) {
    return false;
  }

  try {
    const isPersistent = await navigator.storage.persist();
    console.log(`[PWA] Persistent storage: ${isPersistent ? 'granted' : 'denied'}`);
    return isPersistent;
  } catch (error) {
    console.error('[PWA] Error requesting persistent storage:', error);
    return false;
  }
}

export async function getStorageEstimate(): Promise<StorageEstimate | null> {
  if (typeof window === 'undefined' || !('storage' in navigator && 'estimate' in navigator.storage)) {
    return null;
  }

  try {
    const estimate = await navigator.storage.estimate();
    console.log('[PWA] Storage estimate:', estimate);
    return estimate;
  } catch (error) {
    console.error('[PWA] Error getting storage estimate:', error);
    return null;
  }
}

// Handle PWA install prompt
let deferredPrompt: any = null;

export function setupInstallPrompt(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('[PWA] Install prompt available');
  });

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App was installed');
    deferredPrompt = null;
  });
}

export async function showInstallPrompt(): Promise<boolean> {
  if (!deferredPrompt) {
    console.log('[PWA] Install prompt not available');
    return false;
  }

  try {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] Install prompt outcome: ${outcome}`);
    deferredPrompt = null;
    return outcome === 'accepted';
  } catch (error) {
    console.error('[PWA] Error showing install prompt:', error);
    return false;
  }
}

export function canInstall(): boolean {
  return deferredPrompt !== null;
}

// Check if device supports PWA features
export function getPWACapabilities(): {
  serviceWorker: boolean;
  pushNotifications: boolean;
  backgroundSync: boolean;
  persistentStorage: boolean;
  installPrompt: boolean;
} {
  if (typeof window === 'undefined') {
    return {
      serviceWorker: false,
      pushNotifications: false,
      backgroundSync: false,
      persistentStorage: false,
      installPrompt: false
    };
  }

  return {
    serviceWorker: 'serviceWorker' in navigator,
    pushNotifications: 'PushManager' in window,
    backgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
    persistentStorage: 'storage' in navigator && 'persist' in navigator.storage,
    installPrompt: 'BeforeInstallPromptEvent' in window || deferredPrompt !== null
  };
}

// Clear all caches (useful for development)
export async function clearAllCaches(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    // Clear service worker caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('[PWA] All caches cleared');
    }

    // Clear browser storage
    localStorage.clear();
    sessionStorage.clear();
    console.log('[PWA] Local storage cleared');

    // Force reload to ensure fresh state
    window.location.reload();
  } catch (error) {
    console.error('[PWA] Error clearing caches:', error);
  }
}

// Clean up service workers in development
export async function cleanupServiceWorkers(): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
      console.log('[PWA] Unregistered service worker:', registration.scope);
    }
  } catch (error) {
    console.error('[PWA] Error cleaning up service workers:', error);
  }
}

// Initialize PWA features
export function initializePWA(): void {
  if (typeof window === 'undefined') return;

  // Clear caches in development mode
  if (process.env.NODE_ENV === 'development') {
    // Add a global function to clear caches manually
    (window as any).clearCaches = clearAllCaches;
    console.log('[PWA] Development mode: Use clearCaches() to clear all caches');
  }

  // Log PWA initialization
  console.log('[PWA] Initializing PWA features...');
  
  // In development, clean up any existing service workers to prevent errors
  if (process.env.NODE_ENV === 'development') {
    cleanupServiceWorkers();
  }
  
  // Register service worker (will be skipped in development)
  registerServiceWorker();

  // Only set up update checking in production
  if (process.env.NODE_ENV === 'production') {
    // Check for updates periodically
    setInterval(checkForUpdates, 30 * 60 * 1000); // Every 30 minutes

    // Handle app lifecycle events
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        checkForUpdates();
      }
    });

    // Set up install prompt
    setupInstallPrompt();

    // Request persistent storage
    requestPersistentStorage();
  }

  // Log PWA status
  console.log('[PWA] Standalone mode:', isStandalone());
  console.log('[PWA] PWA installed:', isPWAInstalled());
  console.log('[PWA] Capabilities:', getPWACapabilities());
}