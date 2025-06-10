import styled from 'styled-components';
import Button from '../components/Button';

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #18181b;
  color: #fff;
  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`;

export const TeamBox = styled.div`
  border-radius: 14px;
  background: #23232b;
  padding: 1.1rem 1.6rem 1.2rem 1.6rem;
  margin: 1.2rem 0;
  min-width: 270px;
  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.08);
`;

export const TeamTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.4rem;
  letter-spacing: 0.04em;
`;

export const InfoRow = styled.div`
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
`;

export const Count = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 0.4em;
`;

export const EndButton = styled(Button)<{ $danger: boolean }>`
  margin-top: 2.2rem;
  font-size: 1.15rem;
  padding: 1.1em 2.3em;
  border-radius: 10px;
  background: ${({ $danger }) => ($danger ? '#ef4444' : '#2563eb')};
  color: #fff;
  border: none;
  font-weight: bold;
  transition: background 0.18s;
`;
