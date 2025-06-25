import { useCallback } from 'react';
import { updateSessionAPI } from '../../api/sessionAPI';

//세션상태 empty로 변경하는 함수
export const useCloseSession = () => {
  const closeSession = useCallback(async (): Promise<boolean> => {
    try {
      const code = localStorage.getItem('sessionCode');
      if (!code) return false;

      await updateSessionAPI(code, { state: 'empty' });

      return true;
    } catch (error) {
      console.error('Error closing session:', error);
      return false;
    }
  }, []);

  return { closeSession };
};
