import styled from 'styled-components';

interface TeamContainerProps {
  $isteam: boolean;
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  width: 100%;
`;

export const TeamContainer = styled.div<TeamContainerProps>`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 10px 20px;
  border-radius: 12px;
  background-color: ${({ $isteam, theme }) => ($isteam ? theme.colors.surface : 'transparent')};
`;

export const TeamCircle = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.surface};
`;

export const TeamPlayerCount = styled.div`
  // border: 1px solid red;
  text-align: left;
  width: 85px;
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text.primary};
`;
