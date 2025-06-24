import { ref, onValue, off } from 'firebase/database';
import { useCallback } from 'react';
import { db } from '../libs/config';
import type { Team } from '../types/teamType';
import { useSessionCode } from '../hooks/useSessionCode';
import { updateSessionAPI } from './session';

type TeamType = 'teamA' | 'teamB';

export const useTeamApi = () => {
  const code = useSessionCode();

  const updateTeamStatusAPI = useCallback(
    async (team: TeamType, status: Team['status']): Promise<boolean> => {
      return updateSessionAPI(code, {
        [`teams/${team}/status`]: status,
      });
    },
    [code]
  );

  const updateTeamCasualtiesAPI = useCallback(
    async (team: TeamType, casualties: number): Promise<boolean> => {
      return updateSessionAPI(code, {
        [`teams/${team}/casualties`]: casualties,
      });
    },
    [code]
  );

  const updateTeamPlayersAPI = useCallback(
    async (team: TeamType, players: number): Promise<boolean> => {
      return updateSessionAPI(code, {
        [`teams/${team}/players`]: players,
      });
    },
    [code]
  );

  const subscribeTeamAPI = useCallback(
    (callback: (teams: { teamA: Team; teamB: Team } | null) => void) => {
      const teamRef = ref(db, `sessions/${code}/teams`);

      onValue(teamRef, snapshot => {
        if (snapshot.exists()) {
          callback(snapshot.val() as { teamA: Team; teamB: Team } | null);
        } else {
          callback(null);
        }
      });

      return () => off(teamRef);
    },
    [code]
  );

  return {
    updateTeamStatusAPI,
    updateTeamCasualtiesAPI,
    updateTeamPlayersAPI,
    subscribeTeamAPI,
  };
};
