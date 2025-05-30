// 세션 참가 및 상태 변경 API
import { db } from './firebase';
import { ref, get, update } from 'firebase/database';

/**
 * 세션 참가: 코드 입력 시 해당 세션 존재 확인 후 state를 'ready'로 변경
 * @param {string} roomCode - 참가할 세션(방) 코드
 * @returns {Promise<'success'|'not_found'|'error'>}
 */
export async function joinSession(
  roomCode: string
): Promise<'success' | 'not_found' | 'error'> {
  try {
    const sessionRef = ref(db, `${roomCode}`);
    const snapshot = await get(sessionRef);
    if (!snapshot.exists()) {
      return 'not_found';
    }
    await update(sessionRef, { state: 'ready' });
    return 'success';
  } catch (e) {
    console.error(e);
    return 'error';
  }
}
