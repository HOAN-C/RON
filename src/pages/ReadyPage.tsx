import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../api/firebase';
import { ref, update } from 'firebase/database';
import styled from 'styled-components';
import Button from '../components/Button';

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

import PlayerInputGroup from '../components/PlayerInputGroup';

const Status = styled.div`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

import Countdown from '../components/Countdown';

import { playBeep } from '../utils/playBeep';
import { getTeamPath } from '../utils/team';
import { useSession } from '../hooks/useSession';
import { updateSessionField } from '../utils/firebase';

import { useNavigate } from 'react-router-dom';

const ReadyPage: React.FC = () => {
  const navigate = useNavigate();
  const [sessionCode, setSessionCode] = useState<string | null>(null);

  const [myPlayers, setMyPlayers] = useState<number>(0);
  const [ready, setReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // [1] 세션 코드 URL 파라미터에서 가져오기
  const { code } = useParams<{ code: string }>();
  useEffect(() => {
    if (code) setSessionCode(code);
  }, [code]);

  // 내 팀명 상수 (공통 유틸 활용)
  const teamPath = getTeamPath(sessionCode ?? null);

  /**
   * 세션 데이터 구독 (커스텀 훅)
   */
  const sessionData = useSession(sessionCode ?? null);

  // [4-A] DB에서 내 팀 인원수(myPlayers) 초기값 동기화 (최초 진입/DB 변경 시)
  useEffect(() => {
    if (!sessionData || !sessionCode) return;
    const dbPlayers = sessionData[teamPath]?.players ?? 0;
    setMyPlayers((prev) => (prev === 0 ? dbPlayers : prev));
  }, [sessionData, sessionCode, teamPath]);

  // [4-B] 내 인원수 입력 시 DB에 반영
  // - 내 팀 판별 후 인원수만 변경 시에만 업데이트
  useEffect(() => {
    if (!sessionCode || sessionData == null) return;
    // teamPath는 위에서 상수로 선언되어 있음
    if (myPlayers !== sessionData[teamPath]?.players) {
      updateSessionField(sessionCode, teamPath, { players: myPlayers });
    }
  }, [sessionCode, sessionData, myPlayers, teamPath]);

  // [5] 준비 버튼 토글 (준비 완료/취소)
  // - 내 팀 status를 'ready' <-> 'not-ready'로 변경
  const handleReady = async () => {
    if (!sessionCode || !sessionData) return;
    // teamPath는 위에서 상수로 선언되어 있음
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
  // Wake Lock API
  const wakeLockRef = React.useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!sessionData) return;
    if (
      sessionData.teamA.status === 'ready' &&
      sessionData.teamB.status === 'ready'
    ) {
      if (countdown === null) {
        setCountdown(5);
        // Wake Lock 활성화
        if ('wakeLock' in navigator) {
          //  // @ts-expect-error: WakeLock API는 일부 브라우저에서만 지원됨
          (
            navigator as Navigator & {
              wakeLock: {
                request: (type: 'screen') => Promise<WakeLockSentinel>;
              };
            }
          ).wakeLock
            .request('screen')
            .then((sentinel: WakeLockSentinel) => {
              wakeLockRef.current = sentinel;
            })
            .catch(() => {});
        }
        timerRef.current = setInterval(() => {
          setCountdown((prev) => {
            if (prev && prev > 1) {
              playBeep(200);
              // 진동(카운트다운)
              if (navigator.vibrate) navigator.vibrate(100);
              return prev - 1;
            }
            if (timerRef.current) clearInterval(timerRef.current);
            playBeep(1000); // 0초는 1초 비프음
            // 진동(게임 시작)
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            // 게임 시작: 세션 상태를 running으로 변경
            update(ref(db, `${sessionCode}`), { state: 'running' });
            setTimeout(() => {
              // Wake Lock 해제
              if (wakeLockRef.current) {
                wakeLockRef.current.release();
                wakeLockRef.current = null;
              }
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
      // Wake Lock 해제
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      // Wake Lock 해제
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    };
  }, [sessionData]);

  return (
    <Container>
      <Title>게임 준비</Title>
      <SubTitle>
        team {getTeamPath(sessionCode ?? null) === 'teamA' ? 'A' : 'B'}
      </SubTitle>
      <Status>
        {!sessionCode ? (
          '잘못된 접근입니다. (코드 없음)'
        ) : !sessionData ? (
          '세션 정보를 불러오는 중...'
        ) : sessionData === null ? (
          '세션 정보를 찾을 수 없습니다.'
        ) : (
          <>
            A : {sessionData.teamA.players}명,{' '}
            {sessionData.teamA.status === 'ready' ? '준비 완료' : '준비중'}
            <br />B : {sessionData.teamB.players}명,{' '}
            {sessionData.teamB.status === 'ready' ? '준비 완료' : '준비중'}
          </>
        )}
      </Status>
      {!sessionCode || !sessionData || sessionData === null
        ? null
        : countdown === null && (
            <PlayerInputGroup
              value={myPlayers}
              setValue={setMyPlayers}
              disabled={countdown !== null}
            />
          )}
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
        disabled={
          !sessionCode ||
          !sessionData ||
          sessionData === null ||
          countdown !== null ||
          myPlayers === 0
        }
      >
        {ready ? '준비 취소' : '준비 완료'}
      </Button>
      <Countdown value={countdown} />
    </Container>
  );
};

export default ReadyPage;
