import styled from 'styled-components';

const TeamText = styled.span<{ $team: 'a' | 'b' }>`
  color: ${({ theme, $team }) => theme.colors.team[$team]};
`;

const Title = styled.h2`
  font-size: 4rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SubTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1rem;
  font-weight: 300;
  margin-bottom: 20px;
  letter-spacing: 0.2em;
`;
export function MainTitle() {
  return (
    <div>
      <Title>RON</Title>
      <SubTitle>
        <TeamText $team="b">Ready </TeamText>
        or
        <TeamText $team="a"> Not</TeamText>
      </SubTitle>
    </div>
  );
}
