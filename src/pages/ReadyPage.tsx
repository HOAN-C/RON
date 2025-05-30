import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../api/firebase';
import { ref, onValue, update } from 'firebase/database';
import styled from 'styled-components';
import Button from '../components/Button';
import type { Session } from '../types/session';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #18181b;
  color: #fff;
`;

const SubTitle = styled.h2`
  font-size: 1.7rem;
  font-weight: bold;
  margin-bottom: 1.2rem;
  color: #e53935;
  letter-spacing: 0.05em;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
`;

// 인원 입력 그룹(버튼+인풋)
const StyledInputGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.1rem;
`;

// 인원 입력 인풋 꾸미기
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
  // 모바일 숫자 입력 화살표 숨김
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type='number'] {
    -moz-appearance: textfield;
  }
`;

const Status = styled.div`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const Countdown = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-top: 2rem;
`;

// 1초마다 비프음 재생
// duration(ms)만큼 연속 비프음
export function playBeep(duration: number = 200) {
  try {
    let AudioCtx: typeof AudioContext;
    if ('AudioContext' in window) {
      AudioCtx = window.AudioContext;
    } else if ('webkitAudioContext' in window) {
      // @ts-expect-error: webkitAudioContext is not in standard types
      AudioCtx = window.webkitAudioContext;
    } else {
      return;
    }
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.value = 0.17;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    setTimeout(() => {
      osc.stop();
      ctx.close();
    }, duration);
  } catch {
    // ignore
  }
}

import { useNavigate } from 'react-router-dom';

const ReadyPage: React.FC = () => {
  const navigate = useNavigate();
  const [sessionCode, setSessionCode] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<Session | null>(null);
  const [myPlayers, setMyPlayers] = useState<number>(0);
  const [ready, setReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // [1] 세션 코드 URL 파라미터에서 가져오기
  const { code } = useParams<{ code: string }>();
  useEffect(() => {
    if (code) setSessionCode(code);
  }, [code]);

  // [2] 내 팀 판별 함수
  // - 방장(호스트): localStorage의 sessionCode와 URL의 code가 같으면 teamA
  // - 게스트: 다르면 teamB
  const getTeamPath = () => {
    const hostSessionCode = localStorage.getItem('sessionCode');
    if (sessionCode === hostSessionCode) return 'teamA';
    return 'teamB';
  };

  // [3] 세션 데이터 실시간 구독 (Firebase RTDB)
  useEffect(() => {
    if (!sessionCode) return;
    const sessionRef = ref(db, `${sessionCode}`);
    const unsubscribe = onValue(sessionRef, (snapshot) => {
      if (snapshot.exists()) {
        setSessionData(snapshot.val());
      }
    });
    return () => unsubscribe();
  }, [sessionCode]);

  // [4-A] DB에서 내 팀 인원수(myPlayers) 초기값 동기화 (최초 진입/DB 변경 시)
  useEffect(() => {
    if (!sessionData || !sessionCode) return;
    const teamPath = getTeamPath();
    const dbPlayers = sessionData[teamPath]?.players ?? 0;
    setMyPlayers((prev) => (prev === 0 ? dbPlayers : prev));
  }, [sessionData, sessionCode]);

  // [4-B] 내 인원수 입력 시 DB에 반영
  // - 내 팀 판별 후 인원수만 변경 시에만 업데이트
  useEffect(() => {
    if (!sessionCode || sessionData == null) return;
    const teamPath = getTeamPath();
    if (myPlayers !== sessionData[teamPath]?.players) {
      update(ref(db, `${sessionCode}/${teamPath}`), { players: myPlayers });
    }
    // eslint-disable-next-line
  }, [myPlayers, sessionCode, sessionData]);

  // [5] 준비 버튼 토글 (준비 완료/취소)
  // - 내 팀 status를 'ready' <-> 'not-ready'로 변경
  const handleReady = async () => {
    if (!sessionCode || !sessionData) return;
    const teamPath = getTeamPath();
    const myStatus = sessionData[teamPath]?.status;
    const nextStatus = myStatus === 'ready' ? 'not-ready' : 'ready';
    await update(ref(db, `${sessionCode}/${teamPath}`), {
      status: nextStatus,
      players: myPlayers,
    });
    setReady(nextStatus === 'ready');
  };

  // [6] 카운트다운 관리
  // - 두 팀 모두 준비 완료 시 5초 카운트다운 시작
  // - 한 팀이라도 준비 취소 시 즉시 중단
  // - 카운트다운이 0이 되면 '게임시작' 로그 출력
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!sessionData) return;
    if (
      sessionData.teamA.status === 'ready' &&
      sessionData.teamB.status === 'ready'
    ) {
      if (countdown === null) {
        setCountdown(5);
        timerRef.current = setInterval(() => {
          setCountdown((prev) => {
            if (prev && prev > 1) {
              playBeep(200);
              return prev - 1;
            }
            if (timerRef.current) clearInterval(timerRef.current);
            playBeep(1000); // 0초는 1초 비프음
            // 게임 시작: 세션 상태를 running으로 변경
            update(ref(db, `${sessionCode}`), { state: 'running' });
            setTimeout(() => {
              navigate(`/game/${sessionCode}`);
            }, 100); // 사운드 겹침 방지 약간의 딜레이
            return 0;
          });
        }, 1000);
      }
    } else {
      setCountdown(null);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [sessionData]);

  return (
    <Container>
      <Title>게임 준비</Title>
      <SubTitle>team {getTeamPath() === 'teamA' ? 'A' : 'B'}</SubTitle>
      <Status>
        {sessionData
          ? (() => {
              return (
                <>
                  A : {sessionData.teamA.players}명,{' '}
                  {sessionData.teamA.status === 'ready'
                    ? '준비 완료'
                    : '준비중'}
                  <br />B : {sessionData.teamB.players}명,{' '}
                  {sessionData.teamB.status === 'ready'
                    ? '준비 완료'
                    : '준비중'}
                </>
              );
            })()
          : '세션 정보를 불러오는 중...'}
      </Status>
      {countdown === null && (
        <div>
          <StyledInputGroup>
            <Button
              variant="secondary"
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                fontSize: '1.5rem',
                marginRight: 6,
                padding: 0,
              }}
              onClick={() => setMyPlayers((v) => Math.max(0, v - 1))}
              disabled={myPlayers <= 0 || countdown !== null}
            >
              &#60;
            </Button>
            <StyledInput
              type="number"
              min={0}
              max={100}
              value={myPlayers}
              onChange={(e) => setMyPlayers(Number(e.target.value))}
              placeholder="내 팀 인원 입력"
              disabled={countdown !== null}
            />
            <Button
              variant="danger"
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                fontSize: '1.5rem',
                marginLeft: 6,
                padding: 0,
              }}
              onClick={() => setMyPlayers((v) => Math.min(100, v + 1))}
              disabled={myPlayers >= 100 || countdown !== null}
            >
              &#62;
            </Button>
          </StyledInputGroup>
          <Button
            variant="primary"
            fullWidth
            style={{
              marginBottom: '2rem',
              fontSize: '1.2rem',
              padding: '1rem 2rem',
              borderRadius: 8,
            }}
            onClick={handleReady}
            disabled={countdown !== null || myPlayers === 0}
          >
            {ready ? '준비 취소' : '준비 완료'}
          </Button>
        </div>
      )}

      {countdown !== null && <Countdown>게임 시작: {countdown}초</Countdown>}
    </Container>
  );
};

export default ReadyPage;
