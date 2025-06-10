// [Hook] Wake Lock API를 이용한 화면 꺼짐 방지 커스텀 훅
// - 모바일/브라우저에서 화면 꺼짐 방지를 위해 Wake Lock을 요청 및 해제
import { useEffect, useRef } from 'react';

export function useWakeLock() {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    let isActive = true;
    async function requestWakeLock() {
      try {
        if ('wakeLock' in navigator && isActive) {
          // // @ts-expect-error
          wakeLockRef.current = await navigator.wakeLock.request('screen');
        }
      } catch { /* empty */ }
    }
    requestWakeLock();

    return () => {
      isActive = false;
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    };
  }, []);
}
