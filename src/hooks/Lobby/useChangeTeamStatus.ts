import { useCallback } from 'react';
import { updateTeamAPI, getTeamAPI } from '../../api/teamAPI';
import { useSessionCode } from '../common/useSessionCode';
import useAssignedTeam from '../common/useAssignedTeam';

export const useChangeTeamStatus = () => {
  const code = useSessionCode();
  const team = useAssignedTeam();

  const changeTeamStatus = useCallback(async (): Promise<boolean> => {
    try {
      const teamData = await getTeamAPI(code, team);
      if (!teamData) return false;
      if (teamData.status === 'ready') {
        const success = await updateTeamAPI(code, team, { status: 'not-ready' });
        return success;
      } else if (teamData.status === 'not-ready') {
        const success = await updateTeamAPI(code, team, { status: 'ready' });
        return success;
      }
      return false;
    } catch (error) {
      console.error('Error updating team status:', error);
      return false;
    }
  }, [code, team]);

  return { changeTeamStatus };
};
