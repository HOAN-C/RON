import { useCallback } from 'react';
import { updateTeamAPI } from '../../api/teamAPI';
import { useSessionCode } from '../common/useSessionCode';
import useTeam from '../common/useAssignedTeam';

export const useUpdateTeamPlayer = () => {
  const code = useSessionCode();
  const team = useTeam();

  const updateTeamPlayer = useCallback(
    async (players: number): Promise<boolean> => {
      return updateTeamAPI(code, team, {
        players,
      });
    },
    [code, team]
  );

  return { updateTeamPlayer };
};
