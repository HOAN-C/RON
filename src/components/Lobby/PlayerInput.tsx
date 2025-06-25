import styled from 'styled-components';
import { Button } from '../common/Button';
import type { Team } from '../../types/teamType';
import { useUpdateTeamPlayer } from '../../hooks/team/useUpdateTeamPlayer';
import { playBeep } from '../../utils/playBeep';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 1rem;
  width: 100%;
  font-size: 18px;
`;

export function PlayerInput({ teamData }: { teamData: Team }) {
  const { updateTeamPlayer } = useUpdateTeamPlayer();

  const handlePlayerChange = async (diff: number) => {
    const currentPlayerCount = teamData!.players;
    const newPlayerCount = Math.max(0, Math.min(99, currentPlayerCount + diff));
    await updateTeamPlayer(newPlayerCount);
    playBeep(0.1, 0.03);
  };

  return (
    <Container>
      <Button fullWidth variant="secondary" onClick={() => handlePlayerChange(-1)} disabled={teamData!.players <= 0}>
        -
      </Button>

      <Button fullWidth variant="secondary" onClick={() => handlePlayerChange(1)} disabled={teamData!.players >= 99}>
        +
      </Button>
    </Container>
  );
}
