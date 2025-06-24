import { useCallback } from 'react';
import { useSession } from '../session/useSession';
import type { Team } from '../../types/teamType';

export const useTeamActions = (team: 'teamA' | 'teamB') => {
  const { updateSession } = useSession();

  const setTeamStatus = useCallback(
    async (status: Team['status']): Promise<boolean> => {
      const teamUpdate = {
        [team]: {
          status,
        } as Partial<Team>,
      } as { teamA?: Partial<Team>; teamB?: Partial<Team> };

      return updateSession({
        teams: teamUpdate,
      });
    },
    [team, updateSession]
  );

  const setTeamPlayers = useCallback(
    async (players: number): Promise<boolean> => {
      const teamUpdate = {
        [team]: {
          players,
        } as Partial<Team>,
      } as { teamA?: Partial<Team>; teamB?: Partial<Team> };

      return updateSession({
        teams: teamUpdate,
      });
    },
    [team, updateSession]
  );

  return {
    setTeamStatus,
    setTeamPlayers,
  };
};
