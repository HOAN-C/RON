import { useCallback } from 'react';
import { updateTeamAPI } from '../../api/teamAPI';
import { useSessionCode } from '../common/useSessionCode';
import useTeam from '../common/useAssignedTeam';

export const useUpdateTeamCasualties = () => {
  const code = useSessionCode();
  const team = useTeam();

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
