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
  "/docs/zh.search-data.min.15eadbf05bf3f29d6bd2797bb14b30cb1ac108f66fd95000fe9f341d702df444.json",
  "/docs/zh.search.min.c5325c70eee8124dee2dc72ad1f8927e6e024cbb4363e649b28edcb05e80cd84.js",
  
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
