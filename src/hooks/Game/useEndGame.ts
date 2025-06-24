import { useCallback } from 'react';
import { updateSessionAPI } from '../../api/session';
import { useSessionCode } from '../useSessionCode';

//세션상태 ready로 변경하는 함수
export const useEndGame = () => {
  const code = useSessionCode();
  const endGame = useCallback(async (): Promise<boolean> => {
    try {
      await updateSessionAPI(code, {
        state: 'ready',
        'teams/teamA/status': 'not-ready' as const,
        'teams/teamA/casualties': 0,
        'teams/teamB/status': 'not-ready' as const,
        'teams/teamB/casualties': 0,
      } as any); // Firebase는 중첩 경로를 지원하지만 TypeScript 타입을 위해 any 사용

      return true;
    } catch (error) {
      console.error('Error end game:', error);
      return false;
    }
  }, [code]);

  return { endGame };
};
