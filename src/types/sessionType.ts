// Firebase RTDB 데이터 모델 타입 정의 예시
import type { Team } from './teamType';

export interface Session {
  teams: {
    teamA: Team;
    teamB: Team;
  };
  state: 'empty' | 'waiting' | 'ready' | 'running'; // empty: 방이 생성되지 않은 상태(참가자 받지 않음), waiting: 방이 생성된 상태(참가자 받음), ready: 방이 준비된 상태, running: 게임이 진행 중인 상태
  createdAt: number | object;
}
