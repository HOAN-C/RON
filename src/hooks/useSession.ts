import { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { db } from '../api/firebase';
import type { Session } from '../types/session';

/**
 * 세션 실시간 구독 커스텀 훅
 */
export function useSession(sessionCode: string | null) {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    if (!sessionCode) return;
    const sessionRef = ref(db, sessionCode);
    const unsubscribe = onValue(sessionRef, (snap) => {
      setSession(snap.val());
    });
    return () => unsubscribe();
  }, [sessionCode]);
  return session;
}
