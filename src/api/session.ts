import { ref, get, set, update, onValue, off, serverTimestamp } from 'firebase/database';
import { db } from '../libs/config';
import type { Session } from '../types/sessionType';
import type { Team } from '../types/teamType';

type SessionUpdate = {
  state?: Session['state'];
  teams?: {
    teamA?: Partial<Team>;
    teamB?: Partial<Team>;
  };
  createdAt?: number;
};

/**
 * 초기 세션 데이터
 * - teams: 양 팀의 초기 상태 (준비X, 전사자 0, 플레이어 0)
 * - state: 대기 상태
 * - createdAt: 생성 시간 (서버 타임스탬프로 업데이트됨)
 */
const initialSession: Session = {
  teams: {
    teamA: { status: 'not-ready', casualties: 0, players: 0 },
    teamB: { status: 'not-ready', casualties: 0, players: 0 },
  },
  state: 'waiting',
  createdAt: 0,
};

/**
 * 새로운 세션(방) 생성
 * @param code - 생성할 4자리 세션 코드
 * @returns 생성된 세션 데이터 또는 실패시 null
 * @description
 * - 초기 세션 데이터로 새 방을 생성
 * - createdAt은 서버 타임스탬프로 설정
 */
export const createSessionAPI = async (code: string): Promise<Session | null> => {
  try {
    const newSession = {
      ...initialSession,
      createdAt: serverTimestamp(),
    };
    await set(ref(db, `sessions/${code}`), newSession);
    const snapshot = await get(ref(db, `sessions/${code}`));
    return snapshot.val() as Session;
  } catch (error) {
    console.error('Error creating session:', error);
    return null;
  }
};

/**
 * 세션 데이터 조회
 * @param code - 4자리 세션 코드
 * @returns 세션 데이터 또는 없을 경우 null
 */
export const getSessionAPI = async (code: string): Promise<Session | null> => {
  try {
    const snapshot = await get(ref(db, `sessions/${code}`));
    if (!snapshot.exists()) return null;
    return snapshot.val() as Session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

/**
 * 세션 데이터 업데이트
 * @param code - 세션 코드
 * @param updates - 변경할 세션 데이터 (일부 필드만 업데이트 가능)
 * @returns 업데이트 성공 여부
 * @description
 * 세션의 일부 또는 전체 데이터를 업데이트
 * teams, state, createdAt 등 필요한 필드만 선택적으로 업데이트 가능
 */
export const updateSessionAPI = async (code: string, updates: SessionUpdate): Promise<boolean> => {
  try {
    await update(ref(db, `sessions/${code}`), updates);
    return true;
  } catch (error) {
    console.error('Error updating session:', error);
    return false;
  }
};

/**
 * 세션 상태 실시간 구독
 * @param code - 구독할 세션 코드
 * @param callback - 세션 데이터가 변경될 때마다 호출될 콜백 함수
 * @returns 구독 해제 함수
 * @description
 * Firebase Realtime DB의 onValue를 사용하여 세션 데이터 변경을 실시간으로 감지
 * 컴포넌트 언마운트 시 반환된 함수를 호출하여 구독 해제 필요
 */
export const subscribeSessionAPI = (code: string, callback: (session: Session | null) => void) => {
  const sessionRef = ref(db, `sessions/${code}`);
  const unsubscribe = onValue(sessionRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }
    callback(snapshot.val() as Session);
  });
  return () => {
    off(sessionRef);
    unsubscribe();
  };
};
