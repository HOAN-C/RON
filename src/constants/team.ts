export const TEAM_STATUS = {
  READY: 'ready',
  NOT_READY: 'not-ready'
} as const;

export type TeamStatus = typeof TEAM_STATUS[keyof typeof TEAM_STATUS];
