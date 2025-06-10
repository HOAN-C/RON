import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useWebRTCPeer } from '../hooks/useWebRTCPeer';

interface WalkieTalkieButtonProps {
  sessionCode: string;
  signalingPath: string; // Firebase RTDB path for signaling
  disabled?: boolean;
}

const FloatButton = styled.button`
  position: fixed;
  right: 28px;
  bottom: 100px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);
  cursor: pointer;
  z-index: 120;
  font-size: 1.6rem;
  transition: background 0.18s;
  &:active {
    background: #1d4ed8;
  }
  opacity: ${(props: { disabled?: boolean }) => (props.disabled ? 0.5 : 1)};
`;

/**
 * WalkieTalkieButton
 * - 화면 우측 하단에 위치하는 플로팅 무전기 버튼
 * - 버튼을 누르고 있는 동안만 마이크 오디오를 WebRTC로 송출 (push-to-talk)
 * - WebRTC 연결/송출 상태에 따라 색상과 안내 텍스트 변경
 * - 내부적으로 useWebRTCPeer 훅을 사용해 P2P 연결 및 송출 트리거
 */
export default function WalkieTalkieButton({ sessionCode, signalingPath, disabled }: WalkieTalkieButtonProps) {
  // 현재 버튼이 눌려있는지(송출 중인지) 상태
  const [isTransmitting, setIsTransmitting] = useState(false);
  // 현재 내 마이크 오디오 스트림 참조
  const streamRef = useRef<MediaStream | null>(null);
  // WebRTC 연결 상태 및 송출 함수 (useWebRTCPeer 훅)
  const { state, sendStream } = useWebRTCPeer(sessionCode, signalingPath);

  /**
   * startTransmit
   * - 버튼을 누르면 실행됨
   * - 마이크 권한 요청 → 오디오 스트림 획득 → WebRTC로 송출 시작
   * - 연결이 안 되어 있으면 송출 불가
   */
  async function startTransmit() {
    if (disabled) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setIsTransmitting(true);
      await sendStream(stream);
    } catch (e) {
      alert(`${e}: 마이크 권한이 필요합니다.`);
    }
  }

  /**
   * stopTransmit
   * - 버튼에서 손을 떼면 실행됨
   * - 마이크 스트림 중지 (상대방도 음성 수신이 멈춤)
   */
  function stopTransmit() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsTransmitting(false);
    // WebRTC 송출 중지는 자동으로 트랙이 끊기면 상대방도 음성 수신이 멈춤
  }

  /**
   * 버튼 UI
   * - 연결 전: 회색, 연결 중: 파랑, 송출 중: 빨강
   * - 상태 텍스트(연결 중/송출 중) 표시
   */
  return (
    <FloatButton
      aria-label="무전 송출"
      title="무전 송출"
      disabled={disabled || state !== 'connected'}
      onMouseDown={startTransmit}
      onTouchStart={startTransmit}
      onMouseUp={stopTransmit}
      onMouseLeave={stopTransmit}
      onTouchEnd={stopTransmit}
      style={{
        background: isTransmitting ? '#ef4444' : state === 'connected' ? '#2563eb' : '#888',
      }}
    >
      {/* 무전기 아이콘 SVG */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="9" y="2" width="6" height="11" rx="3" />
        <path d="M12 13v9" />
        <path d="M8 22h8" />
      </svg>
      {/* 상태 텍스트 */}
      <span
        style={{
          position: 'absolute',
          top: -30,
          right: 0,
          color: '#fff',
          fontSize: 13,
        }}
      >
        {state === 'connecting' && '연결 중...'}
        {state === 'connected' && isTransmitting && '송출 중'}
      </span>
    </FloatButton>
  );
}
