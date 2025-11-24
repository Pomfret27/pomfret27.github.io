const cacheName = self.location.pathname
const pages = [

  "/docs/docs/cheatsheet/git/command/",
  "/docs/docs/cheatsheet/hugo/command/",
  "/docs/docs/cheatsheet/git/gitignore/",
  "/docs/docs/cheatsheet/git/",
  "/docs/docs/cheatsheet/",
  "/docs/docs/cheatsheet/hugo/",
  "/docs/docs/software/",
  "/docs/categories/",
  "/docs/docs/",
  "/docs/tags/",
  "/docs/",
  "/docs/book.min.c6771de2b717b3a99f7c695926d0a9b4813cfb30ae5b8563d1d24cc7b3e5643e.css",
  "/docs/zh.search-data.min.19e7f4b0ced1d77c275ed99f73679ca4dfe412cbb9f585ef0ad16e5fcb3e0792.json",
  "/docs/zh.search.min.debddd0f06a2121be9a341602d712489c412bfd8fe68c6e7c511cc244545ee15.js",
  
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
