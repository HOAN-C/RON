// 캐시 스토리지의 이름
const CACHE_NAME = 'ron-cache-v0.0.1';

// 오프라인 사용을 위해 캐시할 파일 목록
const urlsToCache = ['/', '/index.html', '/manifest.json', '/icon-192.png', '/icon-512.png'];

// 현재 환경이 개발 환경인지 확인
const isDevelopment = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';

// Service Worker 설치 시 실행되는 이벤트 핸들러
self.addEventListener('install', event => {
  // 개발 환경에서는 캐시 생성 스킵
  if (isDevelopment) return;

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 네트워크 요청 시 실행되는 이벤트 핸들러
self.addEventListener('fetch', event => {
  // 개발 환경에서는 항상 네트워크 요청 우선
  if (isDevelopment) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 프로덕션 환경에서는 네트워크 우선, 실패 시 캐시 사용
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// 서비스 워커 업데이트 시 이전 캐시 삭제
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
