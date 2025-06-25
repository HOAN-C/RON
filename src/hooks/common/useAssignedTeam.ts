import { useSessionCode } from './useSessionCode';
import type { Session } from '../../types/sessionType';

type TeamType = keyof Session['teams'];
/**
 * 사용자가 속한 팀을 반환하는 Hook
 * 현재 URL의 sessionCode와 localStorage를 기반으로 호스트이면 teamA, 아니면 teamB
 * @returns 'teamA' | 'teamB'
 */
export default function useAssignedTeam(): TeamType {
  const sessionCode = useSessionCode();
  const storedCode = localStorage.getItem('sessionCode');

  if (storedCode === sessionCode) {
    return 'teamA';
  }

  return 'teamB';
}
