import styled from 'styled-components';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * 재사용 가능한 버튼 컴포넌트
 * - variant: 'primary' | 'secondary' (기본값: primary)
 * - fullWidth: 버튼을 부모 너비에 맞춤
 * - 기타 button 속성 모두 지원
 */
const colorStyles = {
  primary: {
    background: '#2563eb',
    hover: '#1d4ed8',
  },
  secondary: {
    background: '#6b7280',
    hover: '#4b5563',
  },
  danger: {
    background: '#ef4444',
    hover: '#dc2626',
  },
};

const StyledButton = styled.button<{
  $variant: 'primary' | 'secondary' | 'danger';
  $fullWidth?: boolean;
  disabled?: boolean;
}>`
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  outline: none;
  box-shadow: 0 1px 8px 0 rgba(0,0,0,0.08);
  transition: all 0.16s cubic-bezier(.4,0,.2,1);
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  user-select: none;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  color: #fff;
  touch-action: manipulation;
  margin: 0;
  display: inline-block;
  background: ${({ $variant }) => colorStyles[$variant].background};

  &:hover {
    background: ${({ disabled, $variant }) =>
      !disabled && colorStyles[$variant].hover};
  }
`;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  onClick,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      $variant={variant}
      $fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
