// 방 데이터 실시간 구독용 커스텀 훅 (템플릿)
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
