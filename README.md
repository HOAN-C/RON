# Ready or Not (RON)

스마트폰 기반 에어소프트 게임 준비/진행 자동화 웹앱

## 소개
**Ready or Not**(줄여서 **RON**)은 에어소프트/서바이벌 게임에서 팀별 준비 상태와 전사 인원 관리를 운영자 없이 실시간으로 처리하는 모바일 웹앱입니다. 각 팀원은 스마트폰으로 방에 입장하여 준비 상태를 동기화하고, 게임 시작/종료 및 전사자 카운트를 자동화합니다.

## 주요 기능
- **방 생성/참여**: 4자리 코드를 통한 세션 생성 및 입장
- **팀별 준비 상태 관리**: 모든 인원이 준비 시 자동 카운트다운 후 게임 시작
- **게임 진행**: 각 팀의 전사자 수 수동 입력, 자동 게임 종료 및 결과 동기화
- **자동 페이지 전환**: 게임 종료 시 모든 참가자가 자동으로 준비 페이지로 이동
- **모바일 UX**: Wake Lock(화면 꺼짐 방지), 버튼 진동, 실시간 피드백
- **예외 처리**: 중복 코드, 잘못된 코드, 연결 끊김 등 다양한 예외 상황 안내

## 기술 스택
- **React** + **Vite** + **TypeScript**
- **Firebase Realtime Database** (실시간 세션 동기화)
- **Styled-components** (스타일링)
- **Wake Lock API, Vibration API** (모바일 UX)

## 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```
> ⚠️ 개발 서버 실행 전, 기존 Vite/Node dev 서버를 모두 종료하세요.

## 폴더 구조 (주요)
```
src/
  components/      # 공통 UI 컴포넌트
  hooks/           # 커스텀 React 훅
  pages/           # 주요 페이지(Home, Ready, Game 등)
  routes/          # 라우터
  utils/           # 유틸 함수(Firebase, 팀/플레이어 등)
  types/           # 타입 정의
```

## Firebase 설정
- Firebase Realtime Database를 사용합니다.
- `.env`에 Firebase 설정값을 입력하세요.

## 기여/문의
- 버그, 개선사항, 제안은 이슈 또는 PR로 남겨주세요.
- 문의: [프로젝트 오너에게 연락]

---

> 모바일 브라우저(PWA)에서 최적화된 경험을 제공합니다. 
> 실제 에어소프트/서바이벌 현장에서 운영자 없이 공정하고 빠른 게임 진행을 도와줍니다.
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
