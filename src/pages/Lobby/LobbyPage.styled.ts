import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const Title = styled.h2<{ $teampath?: 'teamA' | 'teamB' | 'none' }>`
  font-size: 35px;
  font-weight: 300;
  margin-bottom: 1.2rem;
  letter-spacing: 0.5em;
  text-transform: uppercase;
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

export const ContentsContainer = styled.div`
  // border: 1px solid red;
  width: 100%;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;
