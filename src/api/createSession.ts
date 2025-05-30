// 방 생성/조회 관련 API 함수
import { db } from './firebase';
import { ref, set, get, child } from 'firebase/database';
import { generateRoomCode } from '../utils/randomCode';
import type { Session } from '../types/session';

/**
 * 중복 없는 4자리 방 코드 생성 및 방 생성 함수
 * - 이미 존재하는 코드는 피해서 고유 코드 생성
 * - Firebase RTDB에 초기 세션 데이터 저장
 * @returns {Promise<{roomCode: string, roomData: Session}>} 생성된 방 코드와 초기 데이터
 */
export async function createSession(): Promise<{
  roomCode: string;
  roomData: Session;
}> {
  // DB의 최상위 참조
  const dbRef = ref(db);
  let roomCode: string | null = localStorage.getItem('sessionCode');

  const roomData: Session = {
    teamA: { status: 'not-ready', casualties: 0, players: 0 },
    teamB: { status: 'not-ready', casualties: 0, players: 0 },
    state: 'waiting',
    createdAt: Date.now(),
  };

  if (roomCode) {
    // 이미 로컬에 코드가 있으면 해당 세션 초기화
    await set(ref(db, `${roomCode}`), roomData);
    return { roomCode, roomData };
  } else {
    // 없으면 새로 생성
    let exists = true;
    while (exists) {
      roomCode = generateRoomCode(); // 4자리 랜덤 코드 생성
      const snapshot = await get(child(dbRef, `${roomCode}`));
      exists = snapshot.exists();
    }
    await set(ref(db, `${roomCode as string}`), roomData);
    try {
      localStorage.setItem('sessionCode', roomCode as string);
    } catch {
      // SSR 환경 등 예외 무시
    }
    return { roomCode: roomCode as string, roomData };
  }
}
