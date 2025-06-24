import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Session } from '../../types/sessionType';

export const useGameNavigation = (sessionData?: Session | null) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionData) {
      navigate('/');
      return;
    }

    switch (sessionData.state) {
      case 'empty':
        navigate('/');
        break;
      case 'waiting':
        navigate('/lobby');
        break;
      case 'ready':
        navigate('/ready');
        break;
      case 'running':
        navigate('/game');
        break;
      default:
        navigate('/');
        break;
    }
  }, [sessionData, navigate]);
};
