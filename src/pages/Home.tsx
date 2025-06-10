import {
  Wrapper,
  Title,
  ButtonGroup,
  SessionCodeBox,
  SessionCode,
  SessionCodeDesc,
  JoinBox,
  JoinInput,
  ErrorMsg,
} from './Home.styled';
import Button from '../components/Button';

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

  const [createdSessionCode, setCreatedSessionCode] = useState<string | null>(null); // 세션 코드

  const [joinOpen, setJoinOpen] = useState(false); // 참가 폼 오픈 여부

  const [joinCode, setJoinCode] = useState(''); // 사용자 입력 참가 코드

  const [error, setError] = useState<string | null>(null); // 오류 메시지

  // Firebase 세션 상태 변경 감지 및 콘솔 출력
  useEffect(() => {
    if (!createdSessionCode) return;
    const sessionRef = ref(db, `sessions/${createdSessionCode}`);

    const listener = onValue(sessionRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data.state === 'ready') {
          navigate(`/ready/${createdSessionCode}`);
        }
      }
    });
    return () => off(sessionRef, 'value', listener);
  }, [createdSessionCode, navigate]);

  // 세션 생성 함수
  const handleCreateSession = async () => {
    setLoading(true);
    try {
      const { sessionCode } = await createSession(); // 새 세션 생성 및 코드 수신
      setCreatedSessionCode(sessionCode);
    } finally {
      setLoading(false);
    }
  };

  // 세션 참가 함수
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
      } else if (result === 'full') {
        setError('이미 참가자 최대치입니다.');
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
      {/* 세션 개설, 세션 참가 버튼 */}
      {!(createdSessionCode || joinOpen) && (
        <ButtonGroup>
          <Button
            fullWidth
            onClick={() => {
              if (navigator.vibrate) navigator.vibrate(80);
              handleCreateSession();
            }}
            disabled={loading}
          >
            {loading ? '생성 중...' : '세션 개설'}
          </Button>
          <Button
            fullWidth
            variant="secondary"
            onClick={() => {
              if (navigator.vibrate) navigator.vibrate(80);
              setJoinOpen(true);
            }}
          >
            세션 참가
          </Button>
        </ButtonGroup>
      )}

      {/* 세션 코드 출력 */}
      {createdSessionCode && !joinOpen && (
        <SessionCodeBox>
          <SessionCodeDesc>참여코드</SessionCodeDesc>
          <SessionCode>{createdSessionCode}</SessionCode>
          <br />
          <SessionCodeDesc>입장 대기 중</SessionCodeDesc>
          <br />
          <Button
            onClick={() => {
              if (navigator.vibrate) navigator.vibrate(80);
              setCreatedSessionCode(null);
            }}
          >
            취소
          </Button>
        </SessionCodeBox>
      )}

      {/* 세션 참가 */}
      {joinOpen && (
        <JoinBox>
          <JoinInput
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            maxLength={4}
            placeholder="Enter Code"
          />
          <div>
            <Button
              fullWidth
              variant="primary"
              onClick={() => {
                if (navigator.vibrate) navigator.vibrate(80);
                handleJoin();
              }}
              disabled={joining}
            >
              {joining ? '참가 중...' : '참가'}
            </Button>
            <Button
              fullWidth
              variant="secondary"
              onClick={() => {
                if (navigator.vibrate) navigator.vibrate(80);
                setJoinOpen(false);
              }}
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
