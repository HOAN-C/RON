import { useEffect } from 'react';
import { subscribeSessionAPI } from '../../api/sessionAPI';
import { useNavigate } from 'react-router-dom';

//세션 상태에 따라 페이지 이동하는 함수
export default function useRedirectOnSessionState(sessionCode: string | null, targetState: 'ready' | 'running', redirectPath: (code: string) => string) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionCode) return;
    const unsubscribe = subscribeSessionAPI(sessionCode, session => {
      if (session?.state === targetState) {
        navigate(redirectPath(sessionCode));
        unsubscribe();
      }
    });

    return () => unsubscribe();
  }, [sessionCode, targetState, redirectPath, navigate]);
}
