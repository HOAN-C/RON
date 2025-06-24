import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export const Title = styled.h2<{ $teampath?: 'teamA' | 'teamB' | 'none' }>`
  font-size: 45px;
  font-weight: 300;
  text-align: center;
  letter-spacing: 3px;
  margin-bottom: 20px;

  color: ${({ $teampath, theme }) => {
    switch ($teampath) {
      case 'teamA':
        return theme.colors.team.a;
      case 'teamB':
        return theme.colors.team.b;
      default:
        return theme.colors.text.primary;
    }
  }};
`;
