import { useSessionCode } from './useSessionCode';

type TeamType = 'teamA' | 'teamB';
/**
 * 현재 URL의 sessionCode와 localStorage를 기반으로
 * 사용자가 속한 팀을 반환하는 Hook
 */
export default function useMyTeam(): TeamType {
  const sessionCode = useSessionCode();
  const storedCode = localStorage.getItem('sessionCode');

  if (storedCode === sessionCode) {
    return 'teamA';
  }

  return 'teamB';
}
