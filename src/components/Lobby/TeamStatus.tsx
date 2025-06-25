import { Container, TeamContainer, TeamCircle, TeamPlayerCount, ReadyStatus } from './TeamStatus.styled';
import { useAssignedTeam } from '../../hooks/common/useAssignedTeam';

import type { Team } from '../../types/teamType';

export function TeamStatus({ teamsData }: { teamsData: { teamA: Team; teamB: Team } | null }) {
  const myTeam = useAssignedTeam();

  return (
    <Container>
      <TeamContainer $isteam={myTeam === 'teamA'}>
        <TeamCircle>A</TeamCircle>
        <TeamPlayerCount>{teamsData?.teamA.players}명</TeamPlayerCount>
        <ReadyStatus $isready={teamsData?.teamA.status === 'ready'}>{teamsData?.teamA.status === 'ready' ? '준비 완료' : '준비 중'}</ReadyStatus>
      </TeamContainer>
      <TeamContainer $isteam={myTeam === 'teamB'}>
        <TeamCircle>B</TeamCircle>
        <TeamPlayerCount>{teamsData?.teamB.players}명</TeamPlayerCount>
        <ReadyStatus $isready={teamsData?.teamB.status === 'ready'}>{teamsData?.teamB.status === 'ready' ? '준비 완료' : '준비 중'}</ReadyStatus>
      </TeamContainer>
    </Container>
  );
}
