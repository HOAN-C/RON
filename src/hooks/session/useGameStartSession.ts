import useSessionCode from '../common/useSessionCode';
import { updateSessionAPI } from '../../api/sessionAPI';
import { SESSION_STATE } from '../../constants/session';

export default function useGameStartSession() {
  const code = useSessionCode();

  const gameStartSession = async () => {
    try {
      await updateSessionAPI(code, { state: SESSION_STATE.RUNNING });
    } catch (error) {
      console.error('세션 상태 업데이트 실패:', error);
    }
  };

  return {
    gameStartSession,
  };
}
