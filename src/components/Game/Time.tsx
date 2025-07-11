import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  width: 150px;
`;

const TimeDisplay = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  width: 150px;
  text-align: center;
  font-weight: 300;
`;

interface TimeProps {
  startTime?: string;
}

const Time = ({ startTime }: TimeProps) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!startTime) return;

    const calculateInitialSeconds = () => {
      const startTimeMs = new Date(startTime).getTime();
      const nowMs = new Date().getTime();
      return Math.floor((nowMs - startTimeMs) / 1000);
    };

    setSeconds(calculateInitialSeconds());

    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => String(num).padStart(2, '0');
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <Container>
      <TimeDisplay>{formatTime(seconds)}</TimeDisplay>
    </Container>
  );
};

export default Time;
