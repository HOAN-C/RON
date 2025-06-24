import styled, { keyframes } from 'styled-components';

const fadeInOut = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  20% {
    opacity: 1;
    transform: scale(1.1);
  }
  80% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  height: 100%;
`;

export const Title = styled.h2`
  font-size: 24px;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5em;
`;

export const Number = styled.div`
  font-size: 120px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.team.a};
  animation: ${fadeInOut} 1s ease-in-out;
`;
