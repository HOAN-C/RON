import { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { db } from '../api/firebase';
import type { Session } from '../types/session';

// [Hook] 세션 실시간 구독 커스텀 훅
// - 주어진 세션 코드로 Firebase RTDB에서 세션 데이터를 실시간 구독하여 반환
export function useSession(sessionCode: string | null) {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    console.log('useSession: sessionCode =', sessionCode);
    if (!sessionCode) return;
    
    const sessionRef = ref(db, `sessions/${sessionCode}`);
    console.log('useSession: path =', sessionRef.toString());
    
    const unsubscribe = onValue(sessionRef, (snap) => {
      console.log('useSession: snapshot =', snap.val());
      setSession(snap.val());
    }, (error) => {
      console.error('useSession: Firebase error =', error);
    });
    
    return () => unsubscribe();
  }, [sessionCode]);
  return session;
}
