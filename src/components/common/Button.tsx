import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';
import type { DefaultTheme } from 'styled-components';

type Variant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

const getVariantColors = (theme: DefaultTheme) => ({
  primary: {
    bg: theme.colors.team.a,
    hover: theme.colors.team.a,
  },
  secondary: {
    bg: theme.colors.surface,
    hover: theme.colors.surface,
  },
  danger: {
    bg: theme.colors.team.b,
    hover: theme.colors.team.b,
  },
});

const StyledButton = styled.button<{
  $variant: Variant;
  $fullWidth?: boolean;
}>`
  display: inline-block;
  padding: 16px 20px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  transition: background 0.2s ease;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  background: ${({ $variant, theme }) => getVariantColors(theme)[$variant].bg};
  cursor: pointer;
  user-select: none;

  &:hover:enabled {
    background: ${({ $variant, theme }) => getVariantColors(theme)[$variant].hover};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, variant = 'primary', fullWidth = false, ...props }, ref) => {
  return (
    <StyledButton ref={ref} $variant={variant} $fullWidth={fullWidth} {...props}>
      {children}
    </StyledButton>
  );
});

Button.displayName = 'Button';
