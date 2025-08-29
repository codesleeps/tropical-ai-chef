// Service Worker for Tropical AI Chef
// Provides offline functionality and caching for better performance

const CACHE_NAME = "tropical-ai-chef-v1";
const STATIC_CACHE_NAME = "tropical-static-v1";
const DYNAMIC_CACHE_NAME = "tropical-dynamic-v1";

// Assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  "/robots.txt",
  // Add critical CSS and JS files
  // Note: Vite generates hashed filenames, so these would need to be dynamically determined
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Cache first, network fallback - for static assets
  CACHE_FIRST: "cache-first",
  // Network first, cache fallback - for dynamic content
  NETWORK_FIRST: "network-first",
  // Network only - for API calls that shouldn't be cached
  NETWORK_ONLY: "network-only",
  // Cache only - for offline pages
  CACHE_ONLY: "cache-only",
};

// URL patterns and their caching strategies
const CACHE_RULES = [
  {
    pattern: /\.(css|js|woff2?|png|jpg|jpeg|gif|svg|ico)$/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
  },
  { pattern: /\/api\//, strategy: CACHE_STRATEGIES.NETWORK_FIRST },
  { pattern: /\/$/, strategy: CACHE_STRATEGIES.NETWORK_FIRST },
  { pattern: /\/recipes/, strategy: CACHE_STRATEGIES.NETWORK_FIRST },
  { pattern: /\/about/, strategy: CACHE_STRATEGIES.CACHE_FIRST },
  { pattern: /\/benefits/, strategy: CACHE_STRATEGIES.CACHE_FIRST },
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log("Caching static assets...");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("Static assets cached successfully");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("Failed to cache static assets:", error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== DYNAMIC_CACHE_NAME
            ) {
              console.log("Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("Old caches cleaned up");
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests based on caching strategy
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Determine caching strategy
  const strategy = getCacheStrategy(request.url);

  event.respondWith(handleRequest(request, strategy));
});

// Get cache strategy for a URL
function getCacheStrategy(url) {
  for (const rule of CACHE_RULES) {
    if (rule.pattern.test(url)) {
      return rule.strategy;
    }
  }
  return CACHE_STRATEGIES.NETWORK_FIRST; // Default strategy
}

// Handle request based on strategy
async function handleRequest(request, strategy) {
  switch (strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return cacheFirst(request);
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return networkFirst(request);
    case CACHE_STRATEGIES.NETWORK_ONLY:
      return fetch(request);
    case CACHE_STRATEGIES.CACHE_ONLY:
      return caches.match(request);
    default:
      return networkFirst(request);
  }
}

// Cache first strategy
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error("Cache first strategy failed:", error);
    return new Response("Offline", { status: 503 });
  }
}

// Network first strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("Network failed, trying cache:", error);

    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page for navigation requests
    if (request.mode === "navigate") {
      return (
        caches.match("/offline.html") ||
        new Response("Offline", {
          status: 503,
          headers: { "Content-Type": "text/html" },
        })
      );
    }

    return new Response("Offline", { status: 503 });
  }
}

// Background sync for failed requests
self.addEventListener("sync", (event) => {
  if (event.tag === "recipe-generation") {
    event.waitUntil(syncRecipeRequests());
  }
});

// Sync failed recipe requests when back online
async function syncRecipeRequests() {
  try {
    // Get stored failed requests from IndexedDB
    const failedRequests = await getFailedRequests();

    for (const request of failedRequests) {
      try {
        await fetch(request.url, request.options);
        await removeFailedRequest(request.id);
      } catch (error) {
        console.log("Still offline, request will retry later");
      }
    }
  } catch (error) {
    console.error("Background sync failed:", error);
  }
}

// Push notifications for recipe updates
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const title = data.title || "Tropical AI Chef";
  const options = {
    body: data.body || "New recipe available!",
    icon: "/icon-192.png",
    badge: "/badge-96.png",
    data: data.url,
    actions: [
      {
        action: "view",
        title: "View Recipe",
        icon: "/action-view.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/action-close.png",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "view") {
    const url = event.notification.data || "/recipes";
    event.waitUntil(self.clients.openWindow(url));
  }
});

// Placeholder functions for IndexedDB operations
async function getFailedRequests() {
  // Implementation would use IndexedDB to store/retrieve failed requests
  return [];
}

async function removeFailedRequest(id) {
  // Implementation would remove request from IndexedDB
  console.log("Removing failed request:", id);
}

// Clean up old dynamic cache entries
async function cleanupDynamicCache() {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const requests = await cache.keys();

  // Keep only the 50 most recent entries
  if (requests.length > 50) {
    const oldRequests = requests.slice(50);
    await Promise.all(oldRequests.map((request) => cache.delete(request)));
  }
}

// Periodic cleanup
setInterval(cleanupDynamicCache, 24 * 60 * 60 * 1000); // Daily cleanup
