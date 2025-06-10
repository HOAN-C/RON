// [API] 세션(세션) 참가 및 상태 변경 관련 API 함수 모음
// - 세션(세션) 참가 시 존재 여부 확인 및 상태(state) 변경 처리 제공
import { db } from './firebase';
import {
  ref, // Firebase Realtime Database의 특정 위치(경로)에 대한 참조를 생성합니다.
  get, // 참조된 위치에서 데이터를 한 번 읽어옵니다.
  update, // 참조된 위치의 특정 하위 키 값을 업데이트합니다. 지정된 키만 업데이트하고 나머지는 유지합니다.
} from 'firebase/database';

/**
 * 세션 참가: 코드 입력 시 해당 세션 존재 확인 후 state를 'ready'로 변경
 * @param {string} sessionCode - 참가할 세션(세션) 코드
 * @returns {Promise<'success'|'not_found'|'error'>}
 */
export async function joinSession(sessionCode: string): Promise<'success' | 'not_found' | 'full' | 'error'> {
  try {
    const sessionRef = ref(db, `sessions/${sessionCode}`);
    const snapshot = await get(sessionRef);
    if (!snapshot.exists()) {
      return 'not_found';
    }
    const data = snapshot.val();
    if (data.state !== 'waiting') {
      return 'full';
    }
    await update(sessionRef, { state: 'ready' });
    return 'success';
  } catch (e) {
    console.error(e);
    return 'error';
  }
}
