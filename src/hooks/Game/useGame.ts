import { useCallback } from 'react';
import { useSession } from '../session/useSession';
import type { Team } from '../../types/teamType';

export const useGame = () => {
  const { updateSession } = useSession();

  const startGame = useCallback(async (): Promise<boolean> => {
    return updateSession({
      state: 'running',
    });
  }, [updateSession]);

  const endGame = useCallback(async (): Promise<boolean> => {
    const initialTeam: Team = {
      status: 'not-ready',
      casualties: 0,
      players: 0,
    };

    return updateSession({
      state: 'ready',
      teams: {
        teamA: initialTeam,
        teamB: initialTeam,
      },
    });
  }, [updateSession]);

  const updateCasualties = useCallback(
    async (team: 'teamA' | 'teamB', casualties: number): Promise<boolean> => {
      const teamUpdate = {
        [team]: {
          casualties,
        } as Partial<Team>,
      } as { teamA?: Partial<Team>; teamB?: Partial<Team> };

      return updateSession({
        teams: teamUpdate,
      });
    },
    [updateSession]
  );

  return {
    startGame,
    endGame,
    updateCasualties,
  };
};
