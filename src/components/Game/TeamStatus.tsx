import { Container, TeamContainer, TeamCircle, TeamPlayerCount } from './TeamStatus.styled';
import { useAssignedTeam } from '../../hooks/common/useAssignedTeam';

import type { Team } from '../../types/teamType';

export function TeamStatus({ teamsData }: { teamsData: { teamA: Team; teamB: Team } | null }) {
  const myTeam = useAssignedTeam();

  return (
    <Container>
      <TeamContainer $isteam={myTeam === 'teamA'}>
        <TeamCircle>A</TeamCircle>
        <TeamPlayerCount>생존 : {teamsData!.teamA.players - (teamsData!.teamA.casualties || 0)}</TeamPlayerCount>
        <TeamPlayerCount>전사 : {teamsData!.teamA.casualties}</TeamPlayerCount>
      </TeamContainer>
      <TeamContainer $isteam={myTeam === 'teamB'}>
        <TeamCircle>B</TeamCircle>
        <TeamPlayerCount>생존 : {teamsData!.teamB.players - (teamsData!.teamB.casualties || 0)}</TeamPlayerCount>
        <TeamPlayerCount>전사 : {teamsData?.teamB.casualties}</TeamPlayerCount>
      </TeamContainer>
    </Container>
  );
}
