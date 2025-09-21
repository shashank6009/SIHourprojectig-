// PM Internship Scheme Portal - Service Worker
// Comprehensive offline caching strategy

const CACHE_NAME = 'pmis-portal-v1.0.0';
const OFFLINE_PAGE = '/offline';
const FALLBACK_IMAGE = '/images/offline-fallback.png';

// Resources to cache immediately on install
const STATIC_CACHE_URLS = [
  // Core pages
  '/',
  '/login',
  '/dashboard',
  '/profile',
  '/internship',
  '/internship/recommendations',
  '/api-demo',
  '/offline',
  
  // Static assets
  '/manifest.json',
  '/top.png',
  '/logo.png',
  '/Modi1.png',
  '/Modi2.png',
  '/Modi3.png',
  '/companies.mp4',
  
  // PWA icons (we'll create these)
  '/pwa-icons/icon-192x192.png',
  '/pwa-icons/icon-512x512.png',
  
  // CSS and JS (Next.js will generate these)
  '/_next/static/css/app/layout.css',
  '/_next/static/chunks/webpack.js',
  '/_next/static/chunks/main-app.js',
  
  // Fonts
  'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&display=swap',
];

// API endpoints to cache with network-first strategy
const API_CACHE_URLS = [
  '/api/auth/session',
  '/api/parse-resume',
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('[SW] Install event');
  
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        
        // Cache core resources
        await cache.addAll([
          '/',
          '/offline',
          '/manifest.json'
        ]);
        
        // Try to cache other resources, but don't fail if some are missing
        const cachePromises = STATIC_CACHE_URLS.map(async (url) => {
          try {
            const response = await fetch(url);
            if (response.ok) {
              await cache.put(url, response);
            }
          } catch (error) {
            console.log(`[SW] Failed to cache ${url}:`, error);
          }
        });
        
        await Promise.allSettled(cachePromises);
        console.log('[SW] Static resources cached');
        
        // Skip waiting to activate immediately
        self.skipWaiting();
      } catch (error) {
        console.error('[SW] Install failed:', error);
      }
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');
  
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys();
      const deletePromises = cacheNames
        .filter(name => name !== CACHE_NAME)
        .map(name => caches.delete(name));
      
      await Promise.all(deletePromises);
      
      // Take control of all pages
      await self.clients.claim();
      
      console.log('[SW] Service worker activated and took control');
    })()
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }
  
  event.respondWith(
    (async () => {
      try {
        // Strategy 1: Network First for API calls
        if (url.pathname.startsWith('/api/')) {
          return await networkFirstStrategy(request);
        }
        
        // Strategy 2: Stale While Revalidate for pages
        if (url.pathname.startsWith('/_next/') || 
            url.pathname.endsWith('.js') || 
            url.pathname.endsWith('.css')) {
          return await staleWhileRevalidateStrategy(request);
        }
        
        // Strategy 3: Cache First for images and static assets
        if (url.pathname.startsWith('/images/') ||
            url.pathname.endsWith('.png') ||
            url.pathname.endsWith('.jpg') ||
            url.pathname.endsWith('.jpeg') ||
            url.pathname.endsWith('.gif') ||
            url.pathname.endsWith('.webp') ||
            url.pathname.endsWith('.mp4')) {
          return await cacheFirstStrategy(request);
        }
        
        // Strategy 4: Network First with offline fallback for pages
        return await networkFirstWithFallbackStrategy(request);
        
      } catch (error) {
        console.error('[SW] Fetch error:', error);
        return await getOfflineFallback(request);
      }
    })()
  );
});

// Network First Strategy - for API calls
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API calls
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'This feature requires an internet connection' 
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Stale While Revalidate Strategy - for JS/CSS
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
}

// Cache First Strategy - for images and static assets
async function cacheFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return fallback image for failed image requests
    if (request.destination === 'image') {
      return await cache.match(FALLBACK_IMAGE) || 
             new Response('', { status: 404, statusText: 'Image not found' });
    }
    throw error;
  }
}

// Network First with Offline Fallback - for pages
async function networkFirstWithFallbackStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return await caches.match(OFFLINE_PAGE) || 
             new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
    }
    
    throw error;
  }
}

// Get appropriate offline fallback
async function getOfflineFallback(request) {
  const cache = await caches.open(CACHE_NAME);
  
  if (request.mode === 'navigate') {
    return await cache.match(OFFLINE_PAGE) || 
           new Response('Offline - Please check your internet connection', {
             status: 503,
             statusText: 'Service Unavailable',
             headers: { 'Content-Type': 'text/html' }
           });
  }
  
  if (request.destination === 'image') {
    return await cache.match(FALLBACK_IMAGE) || 
           new Response('', { status: 404 });
  }
  
  return new Response('Offline', { status: 503 });
}

// Background Sync for form submissions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync event:', event.tag);
  
  if (event.tag === 'profile-sync') {
    event.waitUntil(syncProfile());
  } else if (event.tag === 'internship-sync') {
    event.waitUntil(syncInternshipApplication());
  }
});

// Sync profile data when connection returns
async function syncProfile() {
  try {
    // Get pending profile data from IndexedDB
    const pendingData = await getFromIndexedDB('pending-profile');
    
    if (pendingData) {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingData)
      });
      
      if (response.ok) {
        await removeFromIndexedDB('pending-profile');
        console.log('[SW] Profile synced successfully');
      }
    }
  } catch (error) {
    console.error('[SW] Profile sync failed:', error);
  }
}

// Sync internship application when connection returns
async function syncInternshipApplication() {
  try {
    const pendingData = await getFromIndexedDB('pending-internship');
    
    if (pendingData) {
      const response = await fetch('/api/internship/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingData)
      });
      
      if (response.ok) {
        await removeFromIndexedDB('pending-internship');
        console.log('[SW] Internship application synced successfully');
      }
    }
  } catch (error) {
    console.error('[SW] Internship sync failed:', error);
  }
}

// IndexedDB helpers
function getFromIndexedDB(key) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PMISPortalDB', 1);
    
    request.onerror = () => reject(request.error);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['offline-data'], 'readonly');
      const store = transaction.objectStore('offline-data');
      const getRequest = store.get(key);
      
      getRequest.onsuccess = () => resolve(getRequest.result?.data);
      getRequest.onerror = () => reject(getRequest.error);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('offline-data')) {
        db.createObjectStore('offline-data', { keyPath: 'id' });
      }
    };
  });
}

function removeFromIndexedDB(key) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PMISPortalDB', 1);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['offline-data'], 'readwrite');
      const store = transaction.objectStore('offline-data');
      const deleteRequest = store.delete(key);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}

// Push notification handling (for future use)
self.addEventListener('push', (event) => {
  console.log('[SW] Push received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/pwa-icons/icon-192x192.png',
    badge: '/pwa-icons/icon-72x72.png',
    tag: 'pmis-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Open Portal',
        icon: '/pwa-icons/icon-72x72.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/pwa-icons/icon-72x72.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('PM Internship Portal', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('[SW] Service Worker loaded successfully');
