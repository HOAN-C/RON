import styled from 'styled-components';

const CountdownWrapper = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-top: 2rem;
`;

interface CountdownProps {
  value: number | null;
}

function Countdown({ value }: CountdownProps) {
  if (value === null) return null;
  return <CountdownWrapper>{value}</CountdownWrapper>;
}

export default Countdown;
