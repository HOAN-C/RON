import { useCallback } from 'react';
import { createSessionAPI, updateSessionAPI, getSessionAPI } from '../../api/session';
import { useSessionCode } from '../useSessionCode';
import type { Session } from '../../types/sessionType';
import type { Team } from '../../types/teamType';

type SessionUpdate = {
  state?: Session['state'];
  teams?: {
    teamA?: Partial<Team>;
    teamB?: Partial<Team>;
  };
};

export const useSession = () => {
  const code = useSessionCode();

  const updateSession = useCallback(
    async (updates: SessionUpdate): Promise<boolean> => {
      try {
        await updateSessionAPI(code, updates);
        return true;
      } catch (error) {
        console.error('Error updating session:', error);
        return false;
      }
    },
    [code]
  );

  const createSession = useCallback(async (sessionCode: string): Promise<boolean> => {
    try {
      const result = await createSessionAPI(sessionCode);
      return result !== null;
    } catch (error) {
      console.error('Error creating session:', error);
      return false;
    }
  }, []);

  const joinSession = useCallback(async (sessionCode: string): Promise<boolean> => {
    try {
      const session = await getSessionAPI(sessionCode);
      return session !== null;
    } catch (error) {
      console.error('Error joining session:', error);
      return false;
    }
  }, []);

  const closeSession = useCallback(async (): Promise<boolean> => {
    try {
      return await updateSession({
        state: 'empty',
        teams: {
          teamA: { status: 'not-ready', casualties: 0, players: 0 },
          teamB: { status: 'not-ready', casualties: 0, players: 0 },
        },
      });
    } catch (error) {
      console.error('Error closing session:', error);
      return false;
    }
  }, [updateSession]);

  return {
    createSession,
    joinSession,
    closeSession,
    updateSession,
  };
};
