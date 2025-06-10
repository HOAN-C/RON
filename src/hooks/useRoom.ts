// [Hook] 방 데이터 실시간 구독 커스텀 훅 (템플릿)
// - 특정 방(roomCode)의 데이터를 Firebase RTDB에서 실시간 구독하여 반환
import { useEffect, useState } from 'react';
import { db } from '../api/firebase';
import { ref, onValue, off } from 'firebase/database';
import type { Session } from '../types/session';

export function useRoom(roomCode: string) {
  const [room, setRoom] = useState<Session | null>(null);

  useEffect(() => {
    const roomRef = ref(db, `rooms/${roomCode}`);
    const listener = onValue(roomRef, (snapshot) => {
      setRoom(snapshot.val());
    });
    return () => off(roomRef, 'value', listener);
  }, [roomCode]);

  return room;
}
