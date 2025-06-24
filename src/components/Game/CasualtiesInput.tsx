import styled from 'styled-components';
import Button from '../common/Button';
import type { Team } from '../../types/teamType';
import useTeam from '../../hooks/useTeam';
import { useTeamApi } from '../../api/team';
import { playBeep } from '../../utils/playBeep';

interface CasualtiesInputProps {
  teamData: Team | null;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 1rem;
  width: 100%;
  font-size: 18px;
`;

export default function CasualtiesInput({ teamData }: CasualtiesInputProps) {
  const team = useTeam();

  const { updateTeamCasualtiesAPI } = useTeamApi();

  const handlePlayerChange = async (diff: number) => {
    playBeep(0.1, 0.03);
    const currentPlayerCount = teamData!.casualties;
    const newPlayerCount = Math.max(0, Math.min(99, currentPlayerCount + diff));
    await updateTeamCasualtiesAPI(team, newPlayerCount);
  };

  return (
    <Container>
      <Button fullWidth variant="secondary" onClick={() => handlePlayerChange(-1)} disabled={teamData!.casualties <= 0}>
        -
      </Button>

      <Button fullWidth variant="secondary" onClick={() => handlePlayerChange(1)} disabled={teamData!.casualties >= 99}>
        +
      </Button>
    </Container>
  );
}
