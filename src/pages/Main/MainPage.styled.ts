import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Title = styled.h2`
  font-size: 4rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const SubTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1rem;
  font-weight: 300;
  margin-bottom: 20px;
  letter-spacing: 0.2em;
`;

export const ContentsContainer = styled.div`
  height: 30vh;
  width: 100%;
  padding: 20px;
  border-radius: 8px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

export const CreateContainer = styled.div`
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
`;

export const SessionCode = styled.div`
  margin: 4px;
  color: ${({ theme }) => theme.colors.team.a};
  font-size: 1.5rem;
`;

export const SessionCodeDesc = styled.div`
  font-size: 0.95rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const JoinContainer = styled.div`
  text-align: center;
`;

export const CodeInput = styled.input`
  width: 100%;
  padding: 16px;
  border: none;
  font-size: 1.2rem;
  border-radius: 8px;
  text-align: center;
  text-decoration: none;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.primary};

  /* Chrome, Safari, Edge, Opera에서 화살표 제거 */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox에서 화살표 제거 */
  &[type='number'] {
    -moz-appearance: textfield;
  }
`;

export const ErrorMsg = styled.div`
  font-size: 0.95rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.team.b};
`;
