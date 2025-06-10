import styled from 'styled-components';
import Button from './Button';

interface PlayerInputGroupProps {
  value: number;
  setValue: (v: number) => void;
  disabled?: boolean;
}

const StyledInputGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.1rem;
`;

const StyledInput = styled.input`
  width: 96px;
  padding: 0.7em 1em;
  border-radius: 8px;
  border: 2px solid #888;
  background: #232323;
  color: #fff;
  font-size: 1.1rem;
  font-weight: bold;
  outline: none;
  text-align: center;
  transition:
    border 0.18s,
    box-shadow 0.18s;
  box-shadow: 0 1px 8px 0 rgba(229, 57, 53, 0.08);
  &::placeholder {
    color: #ffabab;
    opacity: 0.95;
    font-weight: 400;
  }
  &:focus {
    border: 2.5px solid #888;
    box-shadow: 0 0 0 2px #8882;
    background: #292929;
  }
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type='number'] {
    -moz-appearance: textfield;
  }
`;

const PlayerInputGroup: React.FC<PlayerInputGroupProps> = ({ value, setValue, disabled }) => (
  <StyledInputGroup>
    <Button
      variant="secondary"
      style={{ width: 38, height: 38, borderRadius: '50%', fontSize: '1.5rem', marginRight: 6, padding: 0 }}
      onClick={() => setValue(Math.max(0, value - 1))}
      disabled={value <= 0 || disabled}
    >
      {'<'}
    </Button>
    <StyledInput
      type="number"
      min={0}
      max={100}
      value={value}
      onChange={(e) => setValue(Number(e.target.value))}
      placeholder="내 팀 인원 입력"
      disabled={disabled}
    />
    <Button
      variant="secondary"
      style={{ width: 38, height: 38, borderRadius: '50%', fontSize: '1.5rem', marginLeft: 6, padding: 0 }}
      onClick={() => setValue(value + 1)}
      disabled={disabled}
    >
      {'>'}
    </Button>
  </StyledInputGroup>
);

export default PlayerInputGroup;
