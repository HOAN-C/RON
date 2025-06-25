import { useSessionCode } from './common/useSessionCode';
import { updateSessionAPI } from '../api/sessionAPI';

export default function useStartGameSession() {
  const code = useSessionCode();

  const startGameSession = async () => {
    try {
      await updateSessionAPI(code, { state: 'running' });
    } catch (error) {
      console.error('세션 상태 업데이트 실패:', error);
    }
  };

  return {
    startGameSession,
  };
}
