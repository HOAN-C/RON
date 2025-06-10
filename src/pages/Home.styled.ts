import styled from 'styled-components';

export const Wrapper = styled.div`
  border: 1px solid #ccc;
  max-width: 400px;
  margin: 48px auto;
  padding: 32px 20px;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #222;
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

// 세션 코드 안내 박스
export const SessionCodeBox = styled.div`
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
`;
export const SessionCode = styled.span`
  color: #2563eb;
  font-size: 1.5rem;
`;
export const SessionCodeDesc = styled.div`
  margin-top: 8px;
  font-size: 0.95rem;
  color: #666;
`;

// 참가 폼 박스
export const JoinBox = styled.div`
  text-align: center;
  background: #f9fafb;
  border-radius: 12px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.07);
`;

export const JoinInput = styled.input`
  font-size: 1.2rem;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #bbb;
  text-align: center;
  margin-bottom: 10px;
`;

export const ErrorMsg = styled.div`
  margin-top: 16px;
  color: #dc2626;
`;
