import { serverTimestamp } from 'firebase/database';
import { getSessionAPI, setSessionAPI } from '../../api/sessionAPI';

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
  createdAt: serverTimestamp(),
};

//세션 생성하는 함수
//TODO: 로직 최적화
export const useCreateSession = () => {
  const createSession = useCallback(async (): Promise<CreateSessionResult> => {
    try {
      // 기존에 사용한 방이 있는지
      const storedCode = localStorage.getItem('sessionCode');
      if (storedCode) {
        await setSessionAPI(storedCode, initialSession); //새 세션 생성
        return { sessionCode: storedCode };
      }

      //기존에 사용한 방이 없으면 새로 생성
      let newCode = generateSessionCode(); //새 코드 생성
      while (await getSessionAPI(newCode)) {
        //해당 코드의 세션이 있는지 확인
        newCode = generateSessionCode();
      }
      //해당 코드의 세션이 없으면 새로 생성
      await setSessionAPI(newCode, initialSession); //새 세션 생성
      localStorage.setItem('sessionCode', newCode);

      return { sessionCode: newCode };
    } catch (error) {
      console.error('Error creating session:', error);
      return { sessionCode: '', error: '세션 생성에 실패했습니다.' };
    }
  }, []);

  return { createSession };
};
