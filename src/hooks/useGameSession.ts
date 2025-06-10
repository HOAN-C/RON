import { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { db } from '../api/firebase';
import type { Session } from '../types/session';

// [Hook] 게임 세션 실시간 구독 커스텀 훅
// - 주어진 세션 코드로 Firebase RTDB의 세션 데이터를 실시간 구독하여 반환
export function useGameSession(code: string | null) {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    if (!code) return;
    const sessionRef = ref(db, `sessions/${code}`);
    const unsub = onValue(sessionRef, (snap) => {
      if (snap.exists()) setSession(snap.val());
    });
    return () => unsub();
  }, [code]);
  return session;
}
