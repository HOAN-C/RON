// Firebase RTDB 데이터 모델 타입 정의 예시
export interface TeamData {
  status: 'ready' | 'not-ready';
  casualties: number;
  players: number;
}

export interface Session {
  teamA: TeamData;
  teamB: TeamData;
  state: 'waiting' | 'ready' | 'running';
  createdAt: number;
}
