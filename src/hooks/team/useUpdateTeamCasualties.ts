import { useCallback } from 'react';
import { updateTeamAPI } from '../../api/teamAPI';
import { useSessionCode } from '../common/useSessionCode';
import { useAssignedTeam } from '../common/useAssignedTeam';

export function useUpdateTeamCasualties() {
  const code = useSessionCode();
  const team = useAssignedTeam();

  const updateTeamCasualties = useCallback(
    async (casualties: number): Promise<boolean> => {
      return updateTeamAPI(code, team, {
        casualties,
      });
    },
    [code, team]
  );

  return { updateTeamCasualties };
};
