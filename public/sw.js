// 캐시 스토리지의 이름
const CACHE_NAME = 'ron-cache-v1';

// 오프라인 사용을 위해 캐시할 파일 목록
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Service Worker 설치 시 실행되는 이벤트 핸들러
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// 네트워크 요청 시 실행되는 이벤트 핸들러
// 캐시된 리소스가 있으면 캐시에서 반환, 없으면 네트워크에서 반환
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
});
