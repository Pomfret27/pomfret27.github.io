const cacheName = self.location.pathname
const pages = [

  "/docs/docs/home/",
  "/docs/docs/blog/",
  "/docs/docs/cheatsheet/",
  "/docs/categories/",
  "/docs/docs/",
  "/docs/tags/",
  "/docs/",
  "/docs/book.min.c6771de2b717b3a99f7c695926d0a9b4813cfb30ae5b8563d1d24cc7b3e5643e.css",
  "/docs/zh.search-data.min.4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945.json",
  "/docs/zh.search.min.35a3ffcee9ca1c8c9ccdca3172ac31399c3666981769a91b0ffcac3a4bae47a1.js",
  
];

self.addEventListener("install", function (event) {
  self.skipWaiting();

  caches.open(cacheName).then((cache) => {
    return cache.addAll(pages);
  });
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") {
    return;
  }

  /**
   * @param {Response} response
   * @returns {Promise<Response>}
   */
  function saveToCache(response) {
    if (cacheable(response)) {
      return caches
        .open(cacheName)
        .then((cache) => cache.put(request, response.clone()))
        .then(() => response);
    } else {
      return response;
    }
  }

  /**
   * @param {Error} error
   */
  function serveFromCache(error) {
    return caches.open(cacheName).then((cache) => cache.match(request.url));
  }

  /**
   * @param {Response} response
   * @returns {Boolean}
   */
  function cacheable(response) {
    return response.type === "basic" && response.ok && !response.headers.has("Content-Disposition")
  }

  event.respondWith(fetch(request).then(saveToCache).catch(serveFromCache));
});
