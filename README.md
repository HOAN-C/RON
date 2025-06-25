# RON (Ready Or Not)

사용자들이 실시간으로 게임 준비 상태를 공유하고, 게임을 자동으로 시작 및 종료할 수 있도록 지원합니다.

## 기능

- ✅ 4자리 코드로 방 생성 및 참여
- ✅ 실시간 준비 상태 동기화
- ✅ 5초 카운트다운 후 자동 게임 시작
- ✅ 각 팀의 전사자 수 동가화
- ✅ 전원 전사 시 자동 게임 종료
- ✅ 게임 종료 후 자동 재시작 대기 상태 전환
- ✅ Wake Lock API로 화면 꺼짐 방지
- ✅ PWA 지원 (홈 화면 추가 가능)

## 기술 스택

- React
- TypeScript
- Vite
- Firebase Realtime Database
- Styled Components

## 프로젝트 구조

```
src/
├── api/          # Firebase API 호출
├── components/   # 재사용 가능한 컴포넌트
├── constants/    # 상수 정의
├── hooks/        # 커스텀 훅
├── pages/        # 페이지 컴포넌트
├── styles/       # 전역 스타일 및 테마
├── types/        # TypeScript 타입 정의
└── utils/        # 유틸리티 함수
```

## 🧱 데이터 구조

```ts
export interface TeamData {
  status: 'ready' | 'not-ready';
  casualties: number;
  players: number;
}

export interface Session {
  teams: {
    teamA: TeamData;
    teamB: TeamData;
  };
  state: 'empty' | 'waiting' | 'ready' | 'running';
  createdAt: number;
}
```

## 📝 TODO

    - 무전기 기능
    - 게임 로그 저장
    - UI 애니메이션 추가
    - 사용자 이름 기능

```

```
