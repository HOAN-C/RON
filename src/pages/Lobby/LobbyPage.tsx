import useTeam from '../../hooks/useTeam';
import useSubscribeTeams from '../../hooks/Lobby/useSubscribeTeams';

import { useTeamApi } from '../../api/team';

import { Container, Title, ContentsContainer } from './LobbyPage.styled';
import TeamStatus from '../../components/Lobby/TeamStatus';
import PlayerInput from '../../components/Lobby/PlayerInput';
import Button from '../../components/common/Button';
import CountDown from '../../components/Lobby/CountDown';

import type { Team } from '../../types/teamType';

import { useState, useEffect } from 'react';

export default function LobbyPage() {
  const team = useTeam();
  const teamsData = useSubscribeTeams(); // 팀 상태 구독

  const { updateTeamStatusAPI } = useTeamApi();
  const [ready, setReady] = useState<Team['status']>('not-ready');
  const [countDown, setCountDown] = useState<boolean>(false);

  //TODO: session의 state 값이 ready 가 아니면 해당 state값으로 페이지 이동. Hook으로 개발 가능할 듯

  useEffect(() => {
    if (teamsData && teamsData.teamA.status === 'ready' && teamsData.teamB.status === 'ready') {
      setCountDown(true);
    }
  }, [teamsData]);

  const handleReadyChange = () => {
    updateTeamStatusAPI(team, ready === 'ready' ? 'not-ready' : 'ready');
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
