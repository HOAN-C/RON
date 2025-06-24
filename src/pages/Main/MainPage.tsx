import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCreateSession } from '../../hooks/Main/useCreateSession';
import { useCloseSession } from '../../hooks/Main/useCloseSession';
import { useJoinSession } from '../../hooks/Main/useJoinSession';
import { useRedirectOnSessionState } from '../../hooks/useRedirectOnSessionState';

import { Container, ContentsContainer, ButtonContainer, CreateContainer, SessionCode, SessionCodeDesc, JoinContainer, CodeInput, ErrorMsg } from './MainPage.styled';
import Button from '../../components/common/Button';
import MainTitle from '../../components/Main/MainTitle';

export default function MainPage() {
  const navigate = useNavigate();
  const { createSession } = useCreateSession();
  const { closeSession } = useCloseSession();
  const { joinSession } = useJoinSession();

  const [createFormOpen, setCreateFormOpen] = useState(false); // 생성 폼 오픈 상태
  const [joinFormOpen, setJoinFormOpen] = useState(false); // 참가 폼 오픈 상태

  const [loading, setLoading] = useState(false); // 세션 생성 로딩 상태 (세션 개설 <-> 생성 중)
  const [joining, setJoining] = useState(false); // 참가 시도 로딩 상태 (참가 <-> 들어가는 중)

  const [sessionCode, setSessionCode] = useState<string | null>(null); // 세션 생성시
  const [UserSessionCode, setUserSessionCode] = useState<string | null>(null); // 세션 참가시 사용자 입력

  const [error, setError] = useState<string | null>(null); // 오류 메시지

  useRedirectOnSessionState(sessionCode, 'ready', sessionCode => `/lobby/${sessionCode}`);

  const handleCreateSession = async () => {
    setCreateFormOpen(true);
    setLoading(true);
    try {
      const { sessionCode } = await createSession();
      setSessionCode(sessionCode);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionCancel = async () => {
    await closeSession();
    setCreateFormOpen(false);
    setSessionCode(null);
  };

  const handleJoin = async () => {
    if (!UserSessionCode) return;

    setJoining(true);
    setError(null);
    try {
      const result = await joinSession(UserSessionCode);
      if (result === 'success') {
        navigate(`/lobby/${UserSessionCode}`);
      } else if (result === 'not_found') {
        setError('참여 코드 확인.');
      } else if (result === 'session_full') {
        setError('참여 인원 초과.');
      } else {
        setError('오류가 발생했습니다. 관리자에게 문의하세요.');
      }
    } finally {
      setJoining(false);
    }
  };

  return (
    <Container>
      {/* 타이틀 */}
      <MainTitle />

      <ContentsContainer>
        {/* 세션 개설 버튼, 세션 참가 버튼 */}
        {!(sessionCode || joinFormOpen) && (
          <ButtonContainer>
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                if (navigator.vibrate) navigator.vibrate(80);
                handleCreateSession();
              }}
              disabled={loading}
            >
              {loading ? '생성 중' : '세션 개설'}
            </Button>
            <Button
              fullWidth
              variant="secondary"
              onClick={() => {
                if (navigator.vibrate) navigator.vibrate(80);
                setJoinFormOpen(true);
              }}
            >
              세션 참가
            </Button>
          </ButtonContainer>
        )}

        {/* 세션 개설 */}
        {createFormOpen && sessionCode && (
          <CreateContainer>
            <SessionCodeDesc>참여코드</SessionCodeDesc>
            <SessionCode>{sessionCode}</SessionCode>
            <SessionCodeDesc>상대 팀 입장 대기 중</SessionCodeDesc>
            <Button
              style={{ marginTop: 8 }}
              fullWidth
              onClick={() => {
                handleSessionCancel();
              }}
            >
              취소
            </Button>
          </CreateContainer>
        )}

        {/* 세션 참가 */}
        {joinFormOpen && (
          <JoinContainer>
            <ButtonContainer>
              <CodeInput type="number" value={UserSessionCode || ''} onChange={e => setUserSessionCode(e.target.value)} placeholder="참여 코드" />
              {error && <ErrorMsg>{error}</ErrorMsg>}
              <Button
                fullWidth
                variant="primary"
                onClick={() => {
                  if (navigator.vibrate) navigator.vibrate(80);
                  handleJoin();
                }}
                disabled={joining}
              >
                {joining ? '들어가는 중' : '참가'}
              </Button>
              <Button
                fullWidth
                variant="secondary"
                onClick={() => {
                  if (navigator.vibrate) navigator.vibrate(80);
                  setJoinFormOpen(false);
                  setSessionCode(null);
                  setError(null);
                }}
              >
                취소
              </Button>
            </ButtonContainer>
          </JoinContainer>
        )}
      </ContentsContainer>
    </Container>
  );
}
