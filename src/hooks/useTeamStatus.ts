import { useState, useEffect } from 'react';
import { useSession } from './useSession';
import { getTeamPath } from '../utils/team';
import { updateSessionField } from '../utils/firebase';

export function useTeamStatus(sessionCode: string | null) {
  const [myPlayers, setMyPlayers] = useState(0);
  const [ready, setReady] = useState(false);

  const teamPath = getTeamPath(sessionCode);
  const sessionData = useSession(sessionCode);

  // DB에서 팀 인원수와 준비 상태 초기값 동기화
  useEffect(() => {
    if (!sessionData || !sessionCode) return;
    const dbPlayers = sessionData[teamPath]?.players ?? 0;
    setMyPlayers((prev) => (prev === 0 ? dbPlayers : prev));
    
    // 준비 상태 동기화
    const myStatus = sessionData[teamPath]?.status;
    setReady(myStatus === 'ready');
  }, [sessionData, sessionCode, teamPath]);

  // 인원수 변경 시 DB 반영
  useEffect(() => {
    if (!sessionCode || sessionData == null) return;
    if (myPlayers !== sessionData[teamPath]?.players) {
      updateSessionField(sessionCode, teamPath, { players: myPlayers });
    }
  }, [sessionCode, sessionData, myPlayers, teamPath]);

  // 준비 상태 토글 핸들러
  const toggleReady = async () => {
    if (!sessionCode || !sessionData) return;
    const myStatus = sessionData[teamPath]?.status;
    const nextStatus = myStatus === 'ready' ? 'not-ready' : 'ready';

    console.log('toggleReady:', {
      sessionCode,
      teamPath,
      currentStatus: myStatus,
      nextStatus,
      players: myPlayers,
    });

    await updateSessionField(sessionCode, teamPath, {
      status: nextStatus,
      players: myPlayers
    });
    setReady(nextStatus === 'ready');
  };

  return {
    myPlayers,
    setMyPlayers,
    ready,
    toggleReady,
    teamPath,
    sessionData,
  };
}
