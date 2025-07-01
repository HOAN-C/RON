import { useEffect, useState } from 'react';

export function useWakeLock() {
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  useEffect(() => {
    const currentWakeLock = wakeLock;
    // WakeLock API가 지원되는지 확인
    if ('wakeLock' in navigator) {
      const requestWakeLock = async () => {
        try {
          // 화면 켜짐 상태 유지 요청
          const wakeLock = await navigator.wakeLock.request('screen');
          setWakeLock(wakeLock);
          console.log('화면 켜짐 상태 유지');

          // visibility change 이벤트 발생 시 (탭 전환 등) 다시 WakeLock 요청
          document.addEventListener('visibilitychange', async () => {
            if (document.visibilityState === 'visible') {
              const wakeLock = await navigator.wakeLock.request('screen');
              setWakeLock(wakeLock);
              console.log('화면 켜짐 상태 유지');
            }
          });
        } catch (err) {
          console.error('WakeLock 요청 실패:', err);
        }
      };

      requestWakeLock();
    } else {
      console.warn('해당 브라우저는 WakeLock API를 지원하지 않습니다.');
    }

    // 컴포넌트 언마운트 시 WakeLock 해제
    return () => {
      if (currentWakeLock) {
        currentWakeLock
          .release()
          .then(() => {
            console.log('WakeLock 해제');
          })
          .catch(err => {
            console.error('WakeLock 해제 실패:', err);
          });
      }
    };
  }, [wakeLock]);

  return wakeLock;
}
