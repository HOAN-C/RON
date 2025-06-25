import type { TeamStatus } from '../constants/team';

export interface Team {
  status: TeamStatus;
  casualties: number;
  players: number;
}
