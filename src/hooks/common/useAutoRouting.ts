import { useEffect } from 'react';
import { subscribeSessionAPI } from '../../api/sessionAPI';
import { useNavigate } from 'react-router-dom';
import { useSessionCode } from '../../hooks/common/useSessionCode';

//세션 상태에 따라 페이지 이동하는 함수
export function useAutoRouting(sessionCode: string | null) {
  const navigate = useNavigate();
  const urlCode = useSessionCode();
  const code = sessionCode || urlCode;

  useEffect(() => {
    if (!code) return;
    // 세션 상태 변화 구독
    const unsubscribe = subscribeSessionAPI(code, session => {
      if (session?.state === 'ready') {
        navigate(`/lobby/${code}`);
        unsubscribe();
      } else if (session?.state === 'running') {
        navigate(`/game/${code}`);
        unsubscribe();
      }
    });

    return () => unsubscribe();
  }, [urlCode, code, navigate]);
}
