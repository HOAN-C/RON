import { useState, useEffect, useRef } from 'react';
import { ref, update } from 'firebase/database';
import { db } from '../api/firebase';
import { playBeep } from '../utils/playBeep';
import type { Session } from '../types/session';

interface WakeLockNavigator extends Navigator {
  wakeLock: {
    request: (type: 'screen') => Promise<WakeLockSentinel>;
  };
}

export function useGameCountdown(sessionCode: string | null, sessionData: Session | null) {
  const [countdown, setCountdown] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!sessionData) return;

    const bothTeamsReady = sessionData.teamA.status === 'ready' && sessionData.teamB.status === 'ready';

    console.log('useGameCountdown:', {
      sessionData,
      bothTeamsReady,
      countdown,
      teamA: sessionData.teamA,
      teamB: sessionData.teamB,
    });

    if (bothTeamsReady) {
      if (countdown === null) {
        console.log('Starting countdown');
        setCountdown(5);

        // Wake Lock 활성화
        if ('wakeLock' in navigator) {
          (navigator as WakeLockNavigator).wakeLock
            .request('screen')
            .then((sentinel) => {
              wakeLockRef.current = sentinel;
            })
            .catch(() => {});
        }

        timerRef.current = setInterval(() => {
          setCountdown((prev) => {
            console.log('countdown tick:', { prev });

            if (prev === null) return prev;
            if (prev > 1) {
              playBeep(200);
              if (navigator.vibrate) navigator.vibrate(100);
              return prev - 1;
            }

            if (timerRef.current) clearInterval(timerRef.current);
            playBeep(1000);
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

            // 게임 시작
            update(ref(db, `sessions/${sessionCode}`), { state: 'running' });

            // Wake Lock 해제
            setTimeout(() => {
              if (wakeLockRef.current) {
                wakeLockRef.current.release();
                wakeLockRef.current = null;
              }
            }, 100);

            return 0;
          });
        }, 1000);
      }
    } else {
      setCountdown(null);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    };
  }, [sessionData, sessionCode]);

  return countdown;
}
