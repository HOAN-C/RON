import { getSessionAPI } from '../../api/sessionAPI';
import { useSessionCode } from '../../hooks/common/useSessionCode';

import { useState, useEffect } from 'react';
import type { Session } from '../../types/sessionType';

//세션 상태를 가져오는 훅
export function useGetSession(sessionCode: string | null) {
  const urlCode = useSessionCode();
  const code = sessionCode || urlCode;

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      if (!code) return;

      try {
        const sessionData = await getSessionAPI(code);
        setSession(sessionData);
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    };

    fetchSession();
  }, [code]);

  return session;
}
