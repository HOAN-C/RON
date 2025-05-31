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
