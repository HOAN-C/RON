import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionCode } from '../../hooks/useSessionCode';
import useStartGameSession from '../../hooks/useStartGameSession';
import { playBeep } from '../../utils/playBeep';
import styled from 'styled-components';

const COUNTDOWN_SECONDS = 5;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const CountText = styled.div`
  margin-bottom: 1rem;
  font-size: 5rem;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const BarWrapper = styled.div`
  position: relative;
  width: 300px;
  height: 5px;
  background-color: ${({ theme }) => theme.colors.surface};
  overflow: hidden;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.text.primary};
  animation: shrinkBar ${COUNTDOWN_SECONDS}s linear forwards;

  @keyframes shrinkBar {
    from {
      transform: scaleX(1);
    }
    to {
      transform: scaleX(0);
    }
  }
`;

export default function CountDown() {
  const [count, setCount] = useState(COUNTDOWN_SECONDS);
  const navigate = useNavigate();
  const code = useSessionCode();
  const { startGameSession } = useStartGameSession();

  useEffect(() => {
    if (count === 0) {
      playBeep(1, 1);
      setTimeout(async () => {
        await startGameSession();
        navigate(`/game/${code}`);
      }, 200);
      return;
    }
    playBeep(1, 0.15);
    const timer = setTimeout(() => setCount(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, navigate, code, startGameSession]);

  return (
    <Container>
      <CountText>{count}</CountText>
      <BarWrapper>
        <ProgressBar />
      </BarWrapper>
    </Container>
  );
}
