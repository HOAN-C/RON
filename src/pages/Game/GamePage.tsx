import { useState, useEffect } from 'react';

import { Container, Title } from './GamePage.styled';
// import Time from '../../components/Game/Time';
import TeamStatus from '../../components/Game/TeamStatus';
import PlayerInput from '../../components/Game/CasualtiesInput';
import Button from '../../components/common/Button';
import EndModal from '../../components/Game/EndModal';

import useTeam from '../../hooks/useTeam';
import useSubscribeTeams from '../../hooks/Lobby/useSubscribeTeams';
import { playBeep } from '../../utils/playBeep';
import { useNavigate } from 'react-router-dom';
import { useSessionCode } from '../../hooks/useSessionCode';
import useSubscribeSession from '../../hooks/Game/useSubscribeSession';
import { useEndGame } from '../../hooks/Game/useEndGame';

export default function GamePage() {
  const code = useSessionCode();
  const team = useTeam();
  const navigate = useNavigate();
  const sessionData = useSubscribeSession();
  const teamsData = useSubscribeTeams();

  const { endGame } = useEndGame();

  const [showEndModal, setShowEndModal] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  console.log(teamsData);
  console.log(sessionData);

  useEffect(() => {
    if (teamsData) {
      if (teamsData.teamA.players === teamsData.teamA.casualties || teamsData.teamB.players === teamsData.teamB.casualties) {
        endGame();
        setGameOver(true);
        playBeep(1, 3);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamsData]);

  useEffect(() => {
    if (sessionData) {
      if (sessionData.state === 'ready') {
        setGameOver(true);
        playBeep(1, 3);
      }
    }
  }, [sessionData]);

  const handleEndGame = () => {
    setShowEndModal(true);
  };

  const handleReturnToLobby = () => {
    navigate(`/lobby/${code}`);
  };

  if (!teamsData) {
    return <Title $teampath={team}>RON</Title>;
  }

  if (gameOver) {
    return (
      <Container>
        <Title $teampath={team}>GAME OVER</Title>
        <Button fullWidth onClick={handleReturnToLobby}>
          돌아가기
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Title $teampath={team}>G A M E</Title>
      {/* <Time /> */}
      <TeamStatus teamsData={teamsData} />
      <PlayerInput teamData={teamsData[team]} />
      <Button fullWidth onClick={handleEndGame}>
        게임 종료
      </Button>
      {showEndModal && <EndModal onCancel={() => setShowEndModal(false)} />}
    </Container>
  );
}
