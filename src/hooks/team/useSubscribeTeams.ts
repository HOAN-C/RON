import { useEffect, useState } from 'react';
import type { Team } from '../../types/teamType';
import { subscribeSessionAPI } from '../../api/sessionAPI';
import { useSessionCode } from '../common/useSessionCode';

export function useSubscribeTeams() {
  const [teams, setTeams] = useState<{ teamA: Team; teamB: Team } | null>(null);
  const code = useSessionCode();

  useEffect(() => {
    const unsubscribe = subscribeSessionAPI(code, session => {
      // console.log('[useSubscribeTeams]Session data:', session);
      setTeams(session?.teams || null);
    });
    return () => unsubscribe(); // 구독 해제
  }, [code]);

  return teams;
}
