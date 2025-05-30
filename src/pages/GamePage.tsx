import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../api/firebase';
import { ref, onValue, update } from 'firebase/database';
import styled from 'styled-components';
import Button from '../components/Button';
import type { Session } from '../types/session';
import { playBeep } from './ReadyPage'; // 비프음 함수 import

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
const StyledInputGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.1rem;
`;
const DeathButton = styled(Button)`
  font-size: 1.7rem;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  margin: 0 8px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
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
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [ending, setEnding] = useState(false); // 종료 버튼 누르는 중
  const endTimer = useRef<NodeJS.Timeout | null>(null);

  // 실시간 세션 데이터 구독
  useEffect(() => {
    if (!code) return;
    const sessionRef = ref(db, `${code}`);
    const unsub = onValue(sessionRef, (snap) => {
      if (snap.exists()) setSession(snap.val());
    });
    return () => unsub();
  }, [code]);

  // 게임 종료 감지(한 팀 전원 사망 또는 state가 ended)
  useEffect(() => {
    if (!session) return;
    // 종료 감지는 게임 진행중(running)일 때만 동작
    if (session.state !== 'running') return;
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
      // 2. 3초간 연속 비프음 재생
      playBeep(3000);
      setTimeout(() => {
        // 3. 비프음 끝난 뒤 ReadyPage로 이동
        navigate(`/ready/${code}`);
      }, 3000);
    }
  }, [session, code, navigate]);

  // 내 팀 판별 (localStorage sessionCode와 code 비교)
  const isMyTeam = (team: 'teamA' | 'teamB') => {
    const myCode = localStorage.getItem('sessionCode');
    if (!myCode || !code) return false;
    if (team === 'teamA') return myCode === code;
    if (team === 'teamB') return myCode !== code;
    return false;
  };

  // 버튼 활성화 조건 함수
  const canDecrement = (team: 'teamA' | 'teamB') =>
    isMyTeam(team) &&
    session?.state === 'running' &&
    session[team].casualties > 0;
  const canIncrement = (team: 'teamA' | 'teamB') =>
    isMyTeam(team) &&
    session?.state === 'running' &&
    session[team].casualties < session[team].players;

  // 사망자 증감
  const handleDeathChange = (team: 'teamA' | 'teamB', delta: number) => {
    if (!session || !code) return;
    if (!isMyTeam(team)) return;
    const teamData = session[team];
    let next = teamData.casualties + delta;
    if (next < 0) next = 0;
    if (next > teamData.players) next = teamData.players;
    if (next === teamData.casualties) return;
    update(ref(db, `${code}/${team}`), {
      casualties: next,
    });
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
        setTimeout(() => {
          navigate(`/ready/${code}`);
        }, 3000);
      }
    }, 3000);
  };
  const handleEndRelease = () => {
    setEnding(false);
    if (endTimer.current) clearTimeout(endTimer.current);
  };

  if (!session) {
    return <Container>게임 정보를 불러오는 중...</Container>;
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
          <StyledInputGroup>
            <DeathButton
              variant="secondary"
              onClick={() => handleDeathChange('teamA', -1)}
              disabled={!canDecrement('teamA')}
            >
              -
            </DeathButton>
            <DeathInput
              type="number"
              value={session.teamA.casualties}
              readOnly
              aria-label="A팀 사망자 수"
            />
            <DeathButton
              variant="danger"
              onClick={() => handleDeathChange('teamA', 1)}
              disabled={!canIncrement('teamA')}
            >
              +
            </DeathButton>
          </StyledInputGroup>
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
          <StyledInputGroup>
            <DeathButton
              variant="secondary"
              onClick={() => handleDeathChange('teamB', -1)}
              disabled={!canDecrement('teamB')}
            >
              -
            </DeathButton>
            <DeathInput
              type="number"
              value={session.teamB.casualties}
              readOnly
              aria-label="B팀 사망자 수"
            />
            <DeathButton
              variant="danger"
              onClick={() => handleDeathChange('teamB', 1)}
              disabled={!canIncrement('teamB')}
            >
              +
            </DeathButton>
          </StyledInputGroup>
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
