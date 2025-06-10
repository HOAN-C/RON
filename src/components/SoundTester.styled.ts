import styled from 'styled-components';

export const SoundIconButton = styled.button`
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: #333;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.9);
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
    stroke: #fff;
  }
`;

interface ToastProps {
  visible: boolean;
}

export const SoundToast = styled.div<ToastProps>`
  position: fixed;
  right: 1rem;
  bottom: 4.5rem;
  padding: 0.5rem 1rem;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  opacity: ${(props: ToastProps) => props.visible ? 1 : 0};
  transform: translateY(${(props: ToastProps) => props.visible ? 0 : '1rem'});
  transition: all 0.2s ease-in-out;
  pointer-events: none;
`;
