import { ref, update } from 'firebase/database';
import { db } from '../api/firebase';

/**
 * 세션의 특정 필드 업데이트 (에러 처리 포함)
 */
/**
 * 세션의 특정 필드를 업데이트합니다. (에러 처리 포함)
 * @param code 세션 코드
 * @param field 업데이트할 필드명 (teamA/teamB 등)
 * @param value 업데이트할 값 (객체)
 */
export async function updateSessionField(code: string, field: string, value: Record<string, unknown>) {
  try {
    await update(ref(db, `sessions/${code}/${field}`), value);
  } catch (err) {
    alert('데이터 저장에 실패했습니다.');
    throw err;
  }
}
