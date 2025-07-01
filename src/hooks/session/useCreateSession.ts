import { getSessionAPI, setSessionAPI, deleteSessionAPI } from '../../api/sessionAPI';

import { useCallback } from 'react';
import { generateSessionCode } from '../../utils/generateSessionCode';
import type { Session } from '../../types/sessionType';
import { SESSION_STATE } from '../../constants/session';
import { TEAM_STATUS } from '../../constants/team';

interface CreateSessionResult {
  sessionCode: string;
  error?: string;
}

const initialSession: Session = {
  teams: {
    teamA: { status: TEAM_STATUS.NOT_READY, casualties: 0, players: 0 },
    teamB: { status: TEAM_STATUS.NOT_READY, casualties: 0, players: 0 },
  },
  state: SESSION_STATE.WAITING,
  createdAt: new Date().toISOString(),
};

const createNewSession = async () => {
  const now = new Date();

  // 새로운 세션 코드 생성 및 중복 확인
  let newCode = generateSessionCode();
  while (await getSessionAPI(newCode)) {
    newCode = generateSessionCode();
  }

  // 새 세션 생성 및 저장
  await setSessionAPI(newCode, initialSession);
  localStorage.setItem('sessionCode', newCode);
  localStorage.setItem('createdAt', now.toISOString());

  return { code: newCode, createdAt: now };
};

export const useCreateSession = () => {
  const createSession = useCallback(async (): Promise<CreateSessionResult> => {
    const storedCode = localStorage.getItem('sessionCode');
    const createdAtStr = localStorage.getItem('createdAt');

    try {
      //⚠️ Beta 버전 사용자의 경우 createdAt이 없어 예외 처리. 서비스 출시 1달 뒤 삭제 ⚠️
      if (!createdAtStr && storedCode) {
        await deleteSessionAPI(storedCode);
        const { code } = await createNewSession();
        return { sessionCode: code };
      }

      // 기존 사용자인 경우
      if (storedCode && createdAtStr) {
        const now = new Date();
        const createdAt = new Date(createdAtStr);
        const sevenDays = 7 * 24 * 60 * 60 * 1000;
        const isExpired = now.getTime() - createdAt.getTime() > sevenDays;

        // 만료된 경우 새 세션 생성
        if (isExpired) {
          await deleteSessionAPI(storedCode);
          const { code } = await createNewSession();
          return { sessionCode: code };
        }

        // 만료되지 않은 경우 코드 재발급 없이 기존 세션 재사용
        await setSessionAPI(storedCode, initialSession);
        return { sessionCode: storedCode };
      }

      // 새로운 사용자인 경우
      const { code } = await createNewSession();
      return { sessionCode: code };
    } catch (error) {
      console.error('Error creating session:', error);
      return { sessionCode: '', error: '세션 생성에 실패했습니다.' };
    }
  }, []);

  return { createSession };
};
