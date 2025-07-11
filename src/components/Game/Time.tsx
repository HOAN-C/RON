import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.primary};
  width: 100px;
  margin-bottom: 10px;
  padding: 5px;
`;

const TimeDisplay = styled.div`
  font-size: 1.7rem;
  font-weight: 300;
  width: 150px;
  text-align: center;
`;

interface TimeProps {
  startTime?: string;
}

const Time = ({ startTime }: TimeProps) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!startTime) return;

    const calculateElapsedSeconds = () => {
      const startTimeMs = new Date(startTime).getTime();
      const nowMs = new Date().getTime();
      const elapsed = Math.floor((nowMs - startTimeMs) / 1000);
      return elapsed > 0 ? elapsed : 0; // 음수 시간 방지
    };

    // 초기 시간 설정
    setSeconds(calculateElapsedSeconds());

    // 1초마다 경과 시간을 다시 계산하여 동기화
    const timer = setInterval(() => {
      setSeconds(calculateElapsedSeconds());
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
