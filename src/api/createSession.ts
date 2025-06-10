// Session 생성 로직

import { db } from './firebase';
import {
  ref, // Firebase Realtime Database의 특정 위치(경로)에 대한 참조를 생성합니다.
  set, // 참조된 위치에 데이터를 씁니다. 기존 데이터를 덮어씁니다.
  get, // 참조된 위치에서 데이터를 한 번 읽어옵니다.
  child, // 부모 참조에서 특정 하위 경로에 대한 참조를 생성합니다.
} from 'firebase/database';
import { generateSessionCode } from '../utils/randomCode';
import type { Session } from '../types/session';

/**
 * 4자리 방 코드 생성 및 방 생성 함수
 * - 이미 존재하는 코드는 피해서 고유 코드 생성
 * - Firebase RTDB에 초기 세션 데이터 저장
 * @returns {Promise<{sessionCode: string, sessionData: Session}>} 생성된 방 코드와 초기 데이터
 */
export async function createSession(): Promise<{
  sessionCode: string;
  sessionData: Session;
}> {
  // DB의 최상위 참조
  const dbRef = ref(db);
  let sessionCode: string | null = localStorage.getItem('sessionCode'); // 로컬 스토리지에 저장되어 있는 세션 코드 가져오기(없으면 null)

  const sessionData: Session = {
    // 초기 세션 데이터
    teamA: { status: 'not-ready', casualties: 0, players: 0 },
    teamB: { status: 'not-ready', casualties: 0, players: 0 },
    state: 'waiting',
    createdAt: Date.now(),
  };

  if (sessionCode) {
    // 기존 사용자(로컬 스토리지에 세션 코드가 있으면) 해당 세션 초기화
    await set(ref(db, `sessions/${sessionCode}`), sessionData);
    return { sessionCode, sessionData };
  } else {
    // 새 사용자(로컬 스토리지에 세션 코드가 없으면) 새로 생성

    let exists = true;

    while (exists) {
      sessionCode = generateSessionCode(); // 4자리 랜덤 코드 생성
      const snapshot = await get(child(dbRef, `sessions/${sessionCode}`)); //생성된 코드 세션 조회
      exists = snapshot.exists(); //해당 세션이 존재하면 true
    }
    await set(ref(db, `sessions/${sessionCode as string}`), sessionData); //비어있는 코드로 세션 생성
    try {
      localStorage.setItem('sessionCode', sessionCode as string); //로컬 스토리지에 세션 코드 저장
    } catch {
      // SSR 환경 등 예외 무시
    }
    return { sessionCode: sessionCode as string, sessionData };
  }
}
