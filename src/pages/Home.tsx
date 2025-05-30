import styled from 'styled-components';
import Button from '../components/Button';

const Wrapper = styled.div`
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
const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #222;
`;
const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

// 세션 코드 안내 박스
const SessionCodeBox = styled.div`
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
`;
const SessionCode = styled.span`
  color: #2563eb;
  font-size: 1.5rem;
`;
const SessionCodeDesc = styled.div`
  margin-top: 8px;
  font-size: 0.95rem;
  color: #666;
`;

// 참가 폼 박스
const JoinBox = styled.div`
  text-align: center;
  background: #f9fafb;
  border-radius: 12px;

  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.07);
`;

const JoinInput = styled.input`
  font-size: 1.2rem;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #bbb;
  text-align: center;
  letter-spacing: 4px;
  margin-bottom: 10px;
`;
const ErrorMsg = styled.div`
  margin-top: 16px;
  color: #dc2626;
`;

//API import
import { useState, useEffect } from 'react';
import { createSession } from '../api/createSession';
import { joinSession } from '../api/joinSession';
import { db } from '../api/firebase';
import { ref, onValue, off } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false); // 세션 생성 중 여부
  const [joining, setJoining] = useState(false); // 참가 시도 중 여부

  const [createdCode, setCreatedCode] = useState<string | null>(null); // 세션 코드

  const [joinOpen, setJoinOpen] = useState(false); // 참가 폼 오픈 여부

  const [joinCode, setJoinCode] = useState(''); // 참가 코드

  const [error, setError] = useState<string | null>(null); // 오류 메시지

  // Firebase 세션 상태 변경 감지 및 콘솔 출력
  useEffect(() => {
    if (!createdCode) return;
    const sessionRef = ref(db, `${createdCode}`);

    const listener = onValue(sessionRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data.state === 'ready') {
          // 세션 준비 완료 시 자동 이동
          navigate(`/ready/${createdCode}`);
        }
      }
    });
    return () => off(sessionRef, 'value', listener);
  }, [createdCode, navigate]);

  // 세션 생성 함수
  const handleCreateRoom = async () => {
    setLoading(true);
    try {
      const { roomCode } = await createSession(); // 새 세션 생성 및 코드 수신
      setCreatedCode(roomCode);
    } finally {
      setLoading(false);
    }
  };

  // Join Session Function
  const handleJoin = async () => {
    setJoining(true);
    setError(null);
    try {
      const result = await joinSession(joinCode);
      if (result === 'success') {
        console.log('참여 성공');
        navigate(`/ready/${joinCode}`);
      } else if (result === 'not_found') {
        setError('존재하지 않는 코드입니다.');
      } else {
        setError('오류가 발생했습니다.');
      }
    } finally {
      setJoining(false);
    }
  };

  return (
    <Wrapper>
      <Title>Ready or Not</Title>
      {!(createdCode || joinOpen) && (
        <ButtonGroup>
          <Button fullWidth onClick={handleCreateRoom} disabled={loading}>
            {loading ? '생성 중...' : '세션 개설'}
          </Button>
          <Button
            fullWidth
            variant="secondary"
            onClick={() => setJoinOpen(true)}
          >
            세션 참가
          </Button>
        </ButtonGroup>
      )}
      {createdCode && !joinOpen && (
        <SessionCodeBox>
          <SessionCodeDesc>참여코드</SessionCodeDesc>
          <SessionCode>{createdCode}</SessionCode>
          <br />
          <SessionCodeDesc>입장 대기 중</SessionCodeDesc>
          <br />
          <Button onClick={() => setCreatedCode(null)}>취소</Button>
        </SessionCodeBox>
      )}
      {joinOpen && (
        <JoinBox>
          <JoinInput
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            maxLength={4}
            placeholder="코드 입력"
          />
          <div>
            <Button
              fullWidth
              variant="primary"
              onClick={handleJoin}
              disabled={joining}
            >
              {joining ? '참가 중...' : '참가'}
            </Button>
            <Button
              fullWidth
              variant="secondary"
              onClick={() => setJoinOpen(false)}
              style={{ marginTop: 8 }}
            >
              취소
            </Button>
          </div>
        </JoinBox>
      )}
      {error && <ErrorMsg>{error}</ErrorMsg>}
    </Wrapper>
  );
}

export default Home;
