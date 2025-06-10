import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Title, SubTitle } from './ReadyPage.styled';
import Button from '../components/Button';
import PlayerInputGroup from '../components/PlayerInputGroup';
import Countdown from '../components/Countdown';
import { TeamStatus } from '../components/TeamStatus';
import { SoundTester } from '../components/SoundTester';
import { useWakeLock } from '../hooks/useWakeLock';
import { useTeamStatus } from '../hooks/useTeamStatus';
import { useGameCountdown } from '../hooks/useGameCountdown';

/**
 * 게임 준비 페이지 컴포넌트
 *
 * 주요 기능:
 * 1. 팀별 인원수 입력 및 실시간 동기화
 * 2. 팀 준비 상태 관리 (ready/not-ready)
 * 3. 양팀 준비 완료 시 5초 카운트다운 후 게임 시작
 * 4. 화면 꺼짐 방지 (Wake Lock API)
 * 5. 음성 테스트 기능
 */

function ReadyPage() {
  useWakeLock(); // 화면 꺼짐 방지
  const { code } = useParams<{ code: string }>(); // URL에서 세션 코드 가져오기

  const navigate = useNavigate();
  const [sessionCode, setSessionCode] = useState<string | null>(null);

  useEffect(() => {
    console.log('ReadyPage: URL code =', code);
    if (code) {
      console.log('ReadyPage: Setting sessionCode =', code);
      setSessionCode(code);
    }
  }, [code]);

  // 팀 상태 관리 훅
  const { myPlayers, setMyPlayers, ready, toggleReady, teamPath, sessionData } = useTeamStatus(sessionCode);

  // 게임 시작 카운트다운 훅
  const countdown = useGameCountdown(sessionCode, sessionData);

  // 게임 시작 시 GamePage로 이동
  useEffect(() => {
    if (sessionData?.state === 'running') {
      navigate(`/game/${sessionCode}`);
    }
  }, [sessionData?.state, navigate, sessionCode]);

  return (
    <Container>
      <Title>게임 준비</Title>
      <SubTitle>{teamPath}</SubTitle>

      <TeamStatus
        sessionData={sessionData}
        isLoading={!sessionData}
        error={!sessionCode ? '잘못된 접근입니다. (코드 없음)' : undefined}
      />

      {sessionCode && sessionData && (
        <>
          {countdown === null && (
            <>
              <PlayerInputGroup value={myPlayers} setValue={setMyPlayers} disabled={countdown !== null} />
              <Button
                fullWidth
                onClick={() => {
                  if (navigator.vibrate) navigator.vibrate(80);
                  toggleReady();
                }}
                disabled={myPlayers === 0}
              >
                {ready ? '준비 취소' : '준비 완료'}
              </Button>
            </>
          )}

          {countdown !== null && <Countdown value={countdown} />}
        </>
      )}

      <SoundTester />
    </Container>
  );
}
export default ReadyPage;
