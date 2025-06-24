import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.surface};
`;

export const Label = styled.label`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const NumberInput = styled.input`
  width: 60px;
  padding: 8px;
  font-size: 18px;
  text-align: center;
  border: none;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.team.a};
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
