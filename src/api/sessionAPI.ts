import { db } from '../libs/config';
import { ref, get, set, update, onValue, off } from 'firebase/database';

import type { Session } from '../types/sessionType';

export const setSessionAPI = async (code: string, session: Session): Promise<boolean | null> => {
  try {
    await set(ref(db, `sessions/${code}`), session);
    return true;
  } catch (error) {
    console.error('Error setting session:', error);
    return null;
  }
};

export const getSessionAPI = async (code: string): Promise<Session | null> => {
  try {
    const snapshot = await get(ref(db, `sessions/${code}`));
    if (!snapshot.exists()) return null;
    return snapshot.val() as Session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

export const updateSessionAPI = async (code: string, session: Partial<Session>): Promise<boolean | null> => {
  try {
    await update(ref(db, `sessions/${code}`), session);
    return true;
  } catch (error) {
    console.error('Error updating session:', error);
    return null;
  }
};

export const subscribeSessionAPI = (code: string, callback: (session: Session | null) => void) => {
  const sessionRef = ref(db, `sessions/${code}`);
  const unsubscribe = onValue(sessionRef, snapshot => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }
    callback(snapshot.val() as Session);
  });
  return () => {
    off(sessionRef);
    unsubscribe();
  };
};
