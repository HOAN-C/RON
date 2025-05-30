import styled from 'styled-components';
import React from 'react';

const CountdownWrapper = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-top: 2rem;
`;

interface CountdownProps {
  value: number | null;
}

const Countdown: React.FC<CountdownProps> = ({ value }) => {
  if (value === null) return null;
  return <CountdownWrapper>{value}</CountdownWrapper>;
};

export default Countdown;
