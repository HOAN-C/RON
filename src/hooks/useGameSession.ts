import { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { db } from '../api/firebase';
import type { Session } from '../types/session';

/**
 * 게임 세션 실시간 구독 커스텀 훅
 */
export function useGameSession(code: string | null) {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    if (!code) return;
    const sessionRef = ref(db, code);
    const unsub = onValue(sessionRef, (snap) => {
      if (snap.exists()) setSession(snap.val());
    });
    return () => unsub();
  }, [code]);
  return session;
}
