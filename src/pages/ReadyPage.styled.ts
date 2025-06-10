import styled from 'styled-components';

export const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #e53935;
  letter-spacing: 0.05em;
`;

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

export const SubTitle = styled.h2`
  font-size: 1.7rem;
  font-weight: bold;
  margin-bottom: 1.2rem;
`;

export const Status = styled.div`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

export const SoundIconButton = styled.button`
  position: fixed;
  right: 28px;
  bottom: 28px;
  background: #23232b;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  z-index: 101;
  transition: background 0.18s;
  &:active {
    background: #444;
  }
`;

export const SoundToast = styled.div`
  position: fixed;
  right: 80px;
  bottom: 28px;
  background: #222;
  color: #fff;
  padding: 7px 18px;
  border-radius: 20px;
  font-size: 0.98rem;
  opacity: 0.95;
  z-index: 101;
  pointer-events: none;
`;
