import { useCallback } from 'react';
import { updateTeamAPI } from '../../api/teamAPI';
import { updateSessionAPI } from '../../api/sessionAPI';
import { useSessionCode } from '../common/useSessionCode';
import { SESSION_STATE } from '../../constants/session';
import { TEAM_STATUS } from '../../constants/team';

// 세션 상태 ready로 변경 (players 수치는 유지)
export const useEndGame = () => {
  const code = useSessionCode();

  const endGame = useCallback(async (): Promise<boolean> => {
    if (!code) {
      return false;
    }

    try {
      await updateSessionAPI(code, {
        state: SESSION_STATE.READY,
      });

      await updateTeamAPI(code, 'teamA', {
        status: TEAM_STATUS.NOT_READY,
        casualties: 0,
      });

      await updateTeamAPI(code, 'teamB', {
        status: TEAM_STATUS.NOT_READY,
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
