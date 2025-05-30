import { useEffect, useState, useRef } from 'react';
import { useGameSession } from '../hooks/useGameSession';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../api/firebase';
import { ref, update } from 'firebase/database';
import styled from 'styled-components';
import Button from '../components/Button';

import { playBeep } from '../utils/playBeep';
import { getTeamPath, canDecrement, canIncrement } from '../utils/team'; // 팀/버튼 유틸함수 import
import DeathInputGroup from '../components/DeathInputGroup';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #18181b;
  color: #fff;
`;
const TeamBox = styled.div`
  border-radius: 14px;
  background: #23232b;
  padding: 1.1rem 1.6rem 1.2rem 1.6rem;
  margin: 1.2rem 0;
  min-width: 270px;
  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.08);
`;
const TeamTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.4rem;
  letter-spacing: 0.04em;
`;
const InfoRow = styled.div`
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
`;
const Count = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 0.4em;
`;
const EndButton = styled(Button)<{ $danger: boolean }>`
  margin-top: 2.2rem;
  font-size: 1.15rem;
  padding: 1.1em 2.3em;
  border-radius: 10px;
  background: ${({ $danger }) => ($danger ? '#ef4444' : '#2563eb')};
  color: #fff;
  border: none;
  font-weight: bold;
  transition: background 0.18s;
`;

function GamePage() {
  // Wake Lock API
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const session = useGameSession(code ?? null);
  const [ending, setEnding] = useState(false); // 종료 버튼 누르는 중
  const endTimer = useRef<NodeJS.Timeout | null>(null);
  const myTeam = getTeamPath(code ?? null);


  // 게임 종료 감지(한 팀 전원 사망 또는 state가 ended)
  const hasNavigatedRef = useRef(false);
  useEffect(() => {
    if (!session) return;

    // 상대가 종료 버튼을 눌러 state가 'ready'로 바뀐 경우(내가 직접 종료한 게 아니어도)
    if (session.state !== 'running') {
      // Wake Lock 해제
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
      // 자동 이동(중복 이동 방지)
      if (!hasNavigatedRef.current) {
        hasNavigatedRef.current = true;
        navigate(`/ready/${code}`);
      }
      return;
    }
    hasNavigatedRef.current = false;
    // 게임 진행 시작 시 Wake Lock 활성화
    if (session.state === 'running' && 'wakeLock' in navigator && !wakeLockRef.current) {

      (navigator as Navigator & { wakeLock: { request: (type: 'screen') => Promise<WakeLockSentinel> } }).wakeLock.request('screen').then((sentinel: WakeLockSentinel) => {
        wakeLockRef.current = sentinel;
      }).catch(() => {});
    }
    // 종료 감지는 게임 진행중(running)일 때만 동작
    if (session.state !== 'running') {
      // Wake Lock 해제
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
      return;
    }
    const aAlive = session.teamA.players - session.teamA.casualties;
    const bAlive = session.teamB.players - session.teamB.casualties;
    if (aAlive <= 0 || bAlive <= 0) {
      // 1. DB에서 두 팀 status를 not-ready로 변경
      if (code) {
        update(ref(db, `${code}`), {
          state: 'ready',
        });
        update(ref(db, `${code}/teamA`), {
          status: 'not-ready',
          casualties: 0,
        });
        update(ref(db, `${code}/teamB`), {
          status: 'not-ready',
          casualties: 0,
        });
      }
      // 2. 3초간 연속 비프음 재생 및 진동
      playBeep(3000);
      if (navigator.vibrate) navigator.vibrate([300, 100, 300, 100, 300]);
      setTimeout(() => {
        // 3. 비프음 끝난 뒤 ReadyPage로 이동
        // Wake Lock 해제
        if (wakeLockRef.current) {
          wakeLockRef.current.release();
          wakeLockRef.current = null;
        }
        navigate(`/ready/${code}`);
      }, 3000);
    }
    // 언마운트 시 Wake Lock 해제
    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    };
  }, [session, code, navigate]);

  // 사망자 증감
  const handleDeathChange = (team: 'teamA' | 'teamB', delta: number) => {
    if (!session || !code) return;
    if (team !== myTeam) return;
    const teamData = session[team];
    let next = teamData.casualties + delta;
    if (next < 0) next = 0;
    if (next > teamData.players) next = teamData.players;
    if (next === teamData.casualties) return;
    update(ref(db, `${code}/${team}`), {
      casualties: next,
    });
    // 진동(입력 시)
    if (navigator.vibrate) navigator.vibrate(80);
  };

  // 3초 누르면 게임 종료(자동 종료와 동일하게 처리)
  const handleEndPress = () => {
    setEnding(true);
    endTimer.current = setTimeout(() => {
      if (code) {
        update(ref(db, `${code}`), {
          state: 'ready',
        });
        update(ref(db, `${code}/teamA`), {
          status: 'not-ready',
          casualties: 0,
        });
        update(ref(db, `${code}/teamB`), {
          status: 'not-ready',
          casualties: 0,
        });
        playBeep(3000);
        if (navigator.vibrate) navigator.vibrate([300, 100, 300, 100, 300]);
        setTimeout(() => {
          // Wake Lock 해제
          if (wakeLockRef.current) {
            wakeLockRef.current.release();
            wakeLockRef.current = null;
          }
          navigate(`/ready/${code}`);
        }, 3000);
      }
    }, 3000);
  };
  const handleEndRelease = () => {
    setEnding(false);
    if (endTimer.current) clearTimeout(endTimer.current);
  };

  if (!code) {
    return <Container>잘못된 접근입니다. (코드 없음)</Container>;
  }
  if (!session) {
    return <Container>게임 정보를 불러오는 중...</Container>;
  }
  if (session === null) {
    return <Container>세션 정보를 찾을 수 없습니다.</Container>;
  }
  return (
    <Container>
      <h1>게임 진행</h1>
      <TeamBox>
        <TeamTitle>팀 A</TeamTitle>
        <InfoRow>
          시작 인원: <Count>{session.teamA.players}</Count>
        </InfoRow>
        <InfoRow>
          생존 인원:{' '}
          <Count>
            {Math.max(0, session.teamA.players - session.teamA.casualties)}
          </Count>
        </InfoRow>
        <InfoRow>
          사망 인원:
          <DeathInputGroup
            casualties={session.teamA.casualties}
            onDecrement={() => handleDeathChange('teamA', -1)}
            onIncrement={() => handleDeathChange('teamA', 1)}
            canDecrement={canDecrement(session, 'teamA', myTeam)}
            canIncrement={canIncrement(session, 'teamA', myTeam)}
            teamLabel="A"
          />
        </InfoRow>
      </TeamBox>
      <TeamBox>
        <TeamTitle>팀 B</TeamTitle>
        <InfoRow>
          시작 인원: <Count>{session.teamB.players}</Count>
        </InfoRow>
        <InfoRow>
          생존 인원:{' '}
          <Count>
            {Math.max(0, session.teamB.players - session.teamB.casualties)}
          </Count>
        </InfoRow>
        <InfoRow>
          사망 인원:
          <DeathInputGroup
            casualties={session.teamB.casualties}
            onDecrement={() => handleDeathChange('teamB', -1)}
            onIncrement={() => handleDeathChange('teamB', 1)}
            canDecrement={canDecrement(session, 'teamB', myTeam)}
            canIncrement={canIncrement(session, 'teamB', myTeam)}
            teamLabel="B"
          />
        </InfoRow>
      </TeamBox>
      <EndButton
        $danger={ending}
        variant={ending ? 'danger' : 'primary'}
        fullWidth
        onMouseDown={session.state === 'running' ? handleEndPress : undefined}
        onMouseUp={session.state === 'running' ? handleEndRelease : undefined}
        onTouchStart={session.state === 'running' ? handleEndPress : undefined}
        onTouchEnd={session.state === 'running' ? handleEndRelease : undefined}
        disabled={session.state !== 'running'}
      >
        {session.state !== 'running'
          ? '게임 진행 중에만 종료 가능'
          : ending
            ? '3초 유지 시 게임 종료'
            : '게임 종료 (3초 누르기)'}
      </EndButton>
    </Container>
  );
}

export default GamePage;
