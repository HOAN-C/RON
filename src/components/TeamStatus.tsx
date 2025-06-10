import { Status } from '../pages/ReadyPage.styled';
import type { Session } from '../types/session';

interface TeamStatusProps {
  sessionData: Session | null;
  isLoading: boolean;
  error?: string;
}

export function TeamStatus({ sessionData, isLoading, error }: TeamStatusProps) {
  if (error) return <Status>{error}</Status>;
  if (isLoading) return <Status>세션 정보를 불러오는 중...</Status>;
  if (!sessionData) return <Status>세션 정보를 찾을 수 없습니다.</Status>;

  return (
    <Status>
      A : {sessionData.teamA.players}명, {sessionData.teamA.status === 'ready' ? '준비 완료' : '준비중'}
      <br />
      B : {sessionData.teamB.players}명, {sessionData.teamB.status === 'ready' ? '준비 완료' : '준비중'}
    </Status>
  );
}
