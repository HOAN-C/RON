import { useCallback } from 'react';
import { updateTeamAPI } from '../../api/teamAPI';
import { useSessionCode } from '../common/useSessionCode';
import { useAssignedTeam } from '../common/useAssignedTeam';

export function useUpdateTeamPlayer() {
  const code = useSessionCode();
  const team = useAssignedTeam();

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
