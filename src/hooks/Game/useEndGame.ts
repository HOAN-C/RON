import { useCallback } from 'react';
import { updateTeamAPI } from '../../api/teamAPI';
import { updateSessionAPI } from '../../api/sessionAPI';
import { useSessionCode } from '../common/useSessionCode';

// 세션 상태 ready로 변경 (players 수치는 유지)
export const useEndGame = () => {
  const code = useSessionCode();

  const endGame = useCallback(async (): Promise<boolean> => {
    try {
      await updateSessionAPI(code, {
        state: 'ready',
      });

      await updateTeamAPI(code, 'teamA', {
        status: 'not-ready',
        casualties: 0,
      });

      await updateTeamAPI(code, 'teamB', {
        status: 'not-ready',
        casualties: 0,
      });

      return true;
    } catch (error) {
      console.error('Error end game:', error);
      return false;
    }
  }, [code]);

  return { endGame };
};
