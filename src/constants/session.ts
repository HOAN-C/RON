export const SESSION_STATE = {
  EMPTY: 'empty',     // 방이 생성되지 않은 상태
  WAITING: 'waiting', // 방이 생성된 상태
  READY: 'ready',     // 방이 준비된 상태
  RUNNING: 'running'  // 게임이 진행 중인 상태
} as const;

export type SessionState = typeof SESSION_STATE[keyof typeof SESSION_STATE];
