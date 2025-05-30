import styled from 'styled-components';
import Button from './Button';
import React from 'react';

interface DeathInputGroupProps {
  casualties: number;
  onDecrement: () => void;
  onIncrement: () => void;
  canDecrement: boolean;
  canIncrement: boolean;
  teamLabel: string;
}

const StyledInputGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.2rem;
`;

const DeathInput = styled.input`
  width: 64px;
  padding: 0.5em 0.7em;
  border-radius: 8px;
  border: 2px solid #888;
  background: #232323;
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  outline: none;
  text-align: center;
  margin: 0 8px;
`;

const DeathInputGroup: React.FC<DeathInputGroupProps> = ({
  casualties,
  onDecrement,
  onIncrement,
  canDecrement,
  canIncrement,
  teamLabel,
}) => (
  <StyledInputGroup>
    <Button
      variant="secondary"
      onClick={onDecrement}
      disabled={!canDecrement}
      aria-label={`${teamLabel} 사망자 감소`}
    >
      -
    </Button>
    <DeathInput
      type="number"
      value={casualties}
      readOnly
      aria-label={`${teamLabel}팀 사망자 수`}
    />
    <Button
      variant="danger"
      onClick={onIncrement}
      disabled={!canIncrement}
      aria-label={`${teamLabel} 사망자 증가`}
    >
      +
    </Button>
  </StyledInputGroup>
);

export default DeathInputGroup;
