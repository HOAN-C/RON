import { useCallback } from 'react';
import { getSessionAPI, updateSessionAPI } from '../../api/session';

export type JoinSessionResult = 'success' | 'not_found' | 'error' | 'session_full';

//세션 참여하는 함수
export const useJoinSession = () => {
  const joinSession = useCallback(async (sessionCode: string): Promise<JoinSessionResult> => {
    try {
      const sessionData = await getSessionAPI(sessionCode);

      if (!sessionData) {
        return 'not_found';
      }

      if (sessionData.state === 'empty') {
        return 'not_found';
      }

      if (sessionData.state !== 'waiting') {
        return 'session_full';
      }

      await updateSessionAPI(sessionCode, { state: 'ready' });
      return 'success';
    } catch (error) {
      console.error('Join session error:', error);
      return 'error';
    }
  }, []);

  return { joinSession };
};
