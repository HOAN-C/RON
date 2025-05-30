import type { Session } from '../types/session';

/**
 * localStorage의 sessionCode와 현재 code를 비교해 내 팀을 판별
 * @param sessionCode 현재 URL의 세션 코드
 * @returns 'teamA' | 'teamB'
 */
export function getTeamPath(sessionCode: string | null): 'teamA' | 'teamB' {
  const hostSessionCode = localStorage.getItem('sessionCode');
  if (sessionCode === hostSessionCode) return 'teamA';
  return 'teamB';
}

/**
 * 사망자 감소 버튼 활성화 여부
 */
export function canDecrement(
  session: Session,
  team: 'teamA' | 'teamB',
  myTeam: 'teamA' | 'teamB'
): boolean {
  return (
    session.state === 'running' &&
    team === myTeam &&
    session[team].casualties > 0
  );
}

/**
 * 사망자 증가 버튼 활성화 여부
 */
export function canIncrement(
  session: Session,
  team: 'teamA' | 'teamB',
  myTeam: 'teamA' | 'teamB'
): boolean {
  return (
    session.state === 'running' &&
    team === myTeam &&
    session[team].casualties < session[team].players
  );
}
