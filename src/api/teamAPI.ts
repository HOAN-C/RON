import { db } from '../libs/config';
import { update, ref, onValue, off, get } from 'firebase/database';

import type { Team } from '../types/teamType';

export const getTeamAPI = async (code: string, team: 'teamA' | 'teamB'): Promise<Team | null> => {
  try {
    const snapshot = await get(ref(db, `sessions/${code}/teams/${team}`));
    if (!snapshot.exists()) return null;
    return snapshot.val() as Team;
  } catch (error) {
    console.error('Error getting team:', error);
    return null;
  }
};

export const updateTeamAPI = async (code: string, team: 'teamA' | 'teamB', data: Partial<Team>): Promise<boolean> => {
  try {
    await update(ref(db, `sessions/${code}/teams/${team}`), data);
    return true;
  } catch (error) {
    console.error('Error updating team:', error);
    return false;
  }
};

export const subscribeTeamAPI = (code: string, callback: (team: Team | null) => void) => {
  const teamRef = ref(db, `sessions/${code}/teams`);
  const unsubscribe = onValue(teamRef, snapshot => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }
    callback(snapshot.val() as Team);
  });
  return () => {
    off(teamRef);
    unsubscribe();
  };
};
