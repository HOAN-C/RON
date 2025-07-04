import styled from 'styled-components';
import { Button } from '../common/Button';

const Container = styled.div`
  position: fixed;
  top: 0%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(6px);
`;

const Title = styled.h2`
  font-size: 40px;
  font-weight: 600;
  text-align: center;
  letter-spacing: 3px;
  margin-bottom: 20px;

  color: ${({ theme }) => theme.colors.text.primary};
`;

const SubTitle = styled.h2`
  font-size: 20px;
  font-weight: 400;
  text-align: center;
  letter-spacing: 3px;
  margin-bottom: 20px;

  color: ${({ theme }) => theme.colors.text.primary};
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  width: 80%;
`;

interface EndModalProps {
  onCancel: () => void;
}

export function DonationModal({ onCancel }: EndModalProps) {
  const handleEndGame = async () => {
    await navigator.clipboard.writeText('3333209606356 카카오뱅크');
  };

  return (
    <Container>
      <Title>문의 및 후원 계좌</Title>
      <SubTitle>응원하고 싶다면 후원 부탁드려요! 🙇‍♂️</SubTitle>
      <SubTitle>3333209606356 카카오뱅크</SubTitle>
      <SubTitle>문의</SubTitle>
      <SubTitle>hoan.c9907@gmail.com</SubTitle>
      <ButtonContainer>
        <Button fullWidth variant="primary" onClick={handleEndGame}>
          계좌 복사
        </Button>
        <Button fullWidth variant="secondary" onClick={onCancel}>
          취소
        </Button>
      </ButtonContainer>
    </Container>
  );
}

export default DonationModal;
