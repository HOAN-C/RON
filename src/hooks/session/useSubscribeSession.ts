import { useEffect, useState } from 'react';

import type { Session } from '../../types/sessionType';
import { subscribeSessionAPI } from '../../api/sessionAPI';
import useSessionCode from '../common/useSessionCode';

export default function useSubscribeSession() {
  const [session, setSession] = useState<Session | null>(null);

  const code = useSessionCode();

  useEffect(() => {
    const unsubscribe = subscribeSessionAPI(code, session => {
      if (session) {
        setSession(session);
      } else {
        setSession(null);
      }
    });
    return () => unsubscribe(); // 구독 해제
  }, [code]);

  return session;
}
