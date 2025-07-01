import { useEffect, useRef } from 'react';

let isWakeLockActive = false;

export function useWakeLock() {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!('wakeLock' in navigator) || isWakeLockActive) return;

    const acquireWakeLock = async () => {
      if (wakeLockRef.current) return;

      try {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        isWakeLockActive = true;
      } catch (error) {
        console.warn('Failed to acquire wake lock:', error);
      }
    };

    acquireWakeLock();

    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
        isWakeLockActive = false;
      }
    };
  }, []);
}
