import { useState, useEffect } from 'react';
import { useAssignedTeam } from '../../hooks/common/useAssignedTeam';
import { useSubscribeTeams } from '../../hooks/team/useSubscribeTeams';
import { useChangeTeamStatus } from '../../hooks/team/useChangeTeamStatus';
import { useSessionCode } from '../../hooks/common/useSessionCode';

import { Container, Title, ContentsContainer } from './LobbyPage.styled';
import { TeamStatus } from '../../components/Lobby/TeamStatus';
import { PlayerInput } from '../../components/Lobby/PlayerInput';
import { Button } from '../../components/common/Button';
import { CountDown } from '../../components/Lobby/CountDown';
import { useGetSession } from '../../hooks/session/useGetSession';
import { useNavigate } from 'react-router-dom';

import type { Team } from '../../types/teamType';

export default function LobbyPage() {
  const code = useSessionCode();

  const navigate = useNavigate();
  const sessionData = useGetSession(null);

  const team = useAssignedTeam();
  const teamsData = useSubscribeTeams(); // 팀 상태 구독

  const { changeTeamStatus } = useChangeTeamStatus();
  const [ready, setReady] = useState<Team['status']>('not-ready');
  const [countDown, setCountDown] = useState<boolean>(false);

  useEffect(() => {
    if (sessionData?.state === 'running') {
      navigate(`/game/${code}`);
    }
  }, [sessionData, code, navigate]);

  useEffect(() => {
    if (teamsData && teamsData.teamA.status === 'ready' && teamsData.teamB.status === 'ready') {
      setCountDown(true);
    }
  }, [teamsData]);

  const handleReadyChange = () => {
    changeTeamStatus();
    setReady(ready === 'ready' ? 'not-ready' : 'ready');
  };

  if (!teamsData) {
    return <Title>RON</Title>;
  }

  if (countDown) {
    return <CountDown />;
  }

  if (teamsData) {
    return (
      <Container>
        <Title $teampath={team}>{team === 'teamA' ? 'TEAM A' : 'TEAM B'}</Title>
        <ContentsContainer>
          <TeamStatus teamsData={teamsData} />
          <PlayerInput teamData={teamsData[team]} />
          <Button fullWidth onClick={handleReadyChange} disabled={teamsData[team].players === 0}>
            {ready === 'ready' ? '취소' : '준비 완료'}
          </Button>
        </ContentsContainer>
      </Container>
    );
  }
}
