import { useEffect, useRef, useState } from 'react';
import { ref as dbRef, onValue, set } from 'firebase/database';
import { db } from '../api/firebase';

export type WebRTCPeerState = 'idle' | 'connecting' | 'connected' | 'error';

// [Hook] WebRTC 오디오 연결 및 Firebase RTDB 시그널링 커스텀 훅
// - 두 참가자 간 WebRTC 오디오 연결 및 시그널링 데이터(Firebase RTDB) 관리
/**
 * useWebRTCPeer
 * - 두 참가자 간 WebRTC 오디오 연결을 위한 커스텀 React 훅
 * - Firebase RTDB를 시그널링 채널로 사용하여 offer/answer/ICE candidate 교환
 * - 연결 상태(state) 및 송출 함수(sendStream) 제공
 *
 * @param sessionCode  현재 세션 코드(고유 방/게임 식별자)
 * @param signalingPath Firebase RTDB 내 시그널링 데이터 경로
 */
export function useWebRTCPeer(sessionCode: string, signalingPath: string) {
  // 현재 P2P 연결 상태 (idle/connecting/connected/error)
  const [state, setState] = useState<WebRTCPeerState>('idle');
  // WebRTC PeerConnection 인스턴스 참조
  const peerRef = useRef<RTCPeerConnection | null>(null);
  // 상대방 오디오 스트림 저장
  const remoteStreamRef = useRef<MediaStream | null>(null);

  // WebRTC ICE 서버 설정 (구글 STUN 서버만 사용, 실제 서비스는 TURN 필요)
  const rtcConfig = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

  // Firebase RTDB를 통한 시그널링 및 연결 관리
  useEffect(() => {
    if (!sessionCode || !signalingPath) return;
    // 1. PeerConnection 생성 및 상태 초기화
    // - PeerConnection 인스턴스를 생성하고 초기 상태를 설정합니다.
    const peer = new RTCPeerConnection(rtcConfig);
    peerRef.current = peer;
    setState('connecting');
    let closed = false;

    // 2. 상대방 ICE candidate 수신 시 PeerConnection에 추가
    // - 상대방의 ICE candidate를 수신하여 PeerConnection에 추가합니다.
    const iceRef = dbRef(db, `${signalingPath}/ice`);
    onValue(iceRef, (snap) => {
      const candidates = snap.val();
      if (!candidates) return;
      // 여러 candidate를 순회하며 PeerConnection에 추가
      Object.values(candidates).forEach((c: any) => {
        if (c && c.candidate) {
          peer.addIceCandidate(new RTCIceCandidate(c));
        }
      });
    });

    // 3. offer/answer SDP 수신 및 처리
    // - 상대방의 offer 또는 answer SDP를 수신하여 처리합니다.
    const sdpRef = dbRef(db, `${signalingPath}/sdp`);
    onValue(sdpRef, async (snap) => {
      const sdpObj = snap.val();
      if (!sdpObj) return;
      // 상대방이 offer를 올린 경우: answer 생성 후 DB에 기록
      if (sdpObj.type === 'offer') {
        // 상대방의 offer SDP를 설정하고 answer SDP를 생성합니다.
        await peer.setRemoteDescription(new RTCSessionDescription(sdpObj));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        // 생성된 answer SDP를 DB에 기록합니다.
        set(dbRef(db, `${signalingPath}/sdp`), answer.toJSON());
      } else if (sdpObj.type === 'answer') {
        // 상대방이 answer를 올린 경우: 내 PeerConnection에 적용
        // 상대방의 answer SDP를 설정합니다.
        await peer.setRemoteDescription(new RTCSessionDescription(sdpObj));
      }
    });

    // 4. 내 ICE candidate가 생기면 DB에 저장 (상대방이 읽어감)
    // - 내 PeerConnection에서 생성된 ICE candidate를 DB에 저장합니다.
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        set(
          dbRef(
            db,
            `${signalingPath}/ice/${event.candidate.sdpMid}_${event.candidate.sdpMLineIndex}`
          ),
          event.candidate.toJSON()
        );
      }
    };

    // 5. 상대방의 오디오 트랙 수신 시 remoteStream에 저장
    // - 상대방의 오디오 트랙을 수신하여 remoteStream에 저장합니다.
    peer.ontrack = (e) => {
      if (!remoteStreamRef.current) {
        remoteStreamRef.current = new MediaStream();
      }
      remoteStreamRef.current.addTrack(e.track);
    };

    peer.onconnectionstatechange = () => {
      if (peer.connectionState === 'connected') setState('connected');
      else if (
        peer.connectionState === 'failed' ||
        peer.connectionState === 'disconnected'
      )
        setState('error');
    };

    return () => {
      closed = true;
      peer.close();
      peerRef.current = null;
    };
  }, [sessionCode, signalingPath]);

  // 송출: 마이크 stream을 peer에 addTrack
  const sendStream = async (stream: MediaStream) => {
    if (!peerRef.current) return;
    stream.getTracks().forEach((track) => {
      peerRef.current!.addTrack(track, stream);
    });
    // offer 생성 및 signaling
    const offer = await peerRef.current.createOffer();
    await peerRef.current.setLocalDescription(offer);
    set(dbRef(db, `${signalingPath}/sdp`), offer.toJSON());
  };

  // 수신: remoteStream 반환
  const getRemoteStream = () => remoteStreamRef.current;

  return { state, sendStream, getRemoteStream };
}
