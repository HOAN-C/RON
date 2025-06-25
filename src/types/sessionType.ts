import type { Team } from './teamType';
import type { SessionState } from '../constants/session';

export interface Session {
  teams: {
    teamA: Team;
    teamB: Team;
  };
  state: SessionState;
  createdAt: number | object;
}
