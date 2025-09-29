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
            console.log('[PWA] New service worker available');
            // Show update notification
            showUpdateNotification();
          }
        });
      }
    });

    // Handle successful registration
    if (registration.installing) {
      console.log('[PWA] Service Worker installing');
    } else if (registration.waiting) {
      console.log('[PWA] Service Worker installed, waiting');
      showUpdateNotification();
    } else if (registration.active) {
      console.log('[PWA] Service Worker active');
    }

    return registration;
  } catch (error) {
    console.error('[PWA] Service Worker registration failed:', error);
    return null;
  }
}

export function showUpdateNotification(): void {
  // Create a simple update notification
  const notification = document.createElement('div');
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #fff;
      border: 1px solid #ff6600;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      max-width: 300px;
    ">
      <h4 style="margin: 0 0 8px 0; color: #0B3D91; font-size: 14px; font-weight: 600;">
        Update Available
      </h4>
      <p style="margin: 0 0 12px 0; color: #666; font-size: 13px;">
        A new version of the PM Internship Portal is available.
      </p>
      <button onclick="window.location.reload()" style="
        background: #ff6600;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        margin-right: 8px;
      ">
        Update Now
      </button>
      <button onclick="this.parentElement.parentElement.remove()" style="
        background: transparent;
        color: #666;
        border: 1px solid #ddd;
        padding: 8px 16px;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
      ">
        Later
      </button>
    </div>
  `;
  
  document.body.appendChild(notification);

  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.parentElement.removeChild(notification);
    }
  }, 10000);
}

export async function checkForUpdates(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      console.log('[PWA] Checked for updates');
    }
  } catch (error) {
    console.error('[PWA] Update check failed:', error);
  }
}

export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Record<string, unknown>).standalone === true ||
    document.referrer.includes('android-app://')
  );
}

export function isPWAInstalled(): boolean {
  return isStandalone();
}

export async function getInstallPrompt(): Promise<unknown> {
  return new Promise((resolve) => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      resolve(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Timeout after 5 seconds
    setTimeout(() => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      resolve(null);
    }, 5000);
  });
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

    // Unregister all service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(registration => registration.unregister())
      );
      console.log('[PWA] All service workers unregistered');
    }

    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    console.log('[PWA] Local storage cleared');

    // Force reload to ensure fresh state
    window.location.reload();
  } catch (error) {
    console.error('[PWA] Error clearing caches:', error);
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

  // Register service worker
  registerServiceWorker();

  // Check for updates periodically
  setInterval(checkForUpdates, 30 * 60 * 1000); // Every 30 minutes

  // Handle app lifecycle events
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      checkForUpdates();
    }
  });

  // Log PWA status
  console.log('[PWA] Initialized');
  console.log('[PWA] Standalone mode:', isStandalone());
  console.log('[PWA] PWA installed:', isPWAInstalled());
}