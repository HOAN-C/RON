import styled from 'styled-components';
import Button from '../common/Button';
import { playBeep } from '../../utils/playBeep';
import { useEndGame } from '../../hooks/session/useEndGame';

const Container = styled.div`
  position: fixed;
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
  font-size: 16px;
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

const EndModal = ({ onCancel }: EndModalProps) => {
  const { endGame } = useEndGame();

  const handleEndGame = () => {
    playBeep(1, 3);
    endGame();
    onCancel();
  };

  return (
    <Container>
      <Title>게임 종료</Title>
      <SubTitle>아직 생존 인원이 남아있습니다.</SubTitle>
      <ButtonContainer>
        <Button fullWidth variant="primary" onClick={handleEndGame}>
          종료
        </Button>
        <Button fullWidth variant="secondary" onClick={onCancel}>
          취소
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default EndModal;
