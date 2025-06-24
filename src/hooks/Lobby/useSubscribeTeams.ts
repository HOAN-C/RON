import { useEffect, useState } from 'react';
import type { Team } from '../../types/teamType';
import { useTeamApi } from '../../api/team';
import { useSessionCode } from '../../hooks/useSessionCode';

export default function useSubscribeTeams() {
  const [teams, setTeams] = useState<{ teamA: Team; teamB: Team } | null>(null);
  const { subscribeTeamAPI } = useTeamApi();
  const code = useSessionCode();

  useEffect(() => {
    const unsubscribe = subscribeTeamAPI(teams => {
      console.log('Teams data received:', teams);
      setTeams(teams);
    });
    return () => unsubscribe(); // 구독 해제
  }, [code, subscribeTeamAPI]);

  return teams;
}
