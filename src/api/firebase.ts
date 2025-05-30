// // Firebase 초기화 및 주요 API 함수 (템플릿)
// // 실제 키/설정은 .env 등에서 관리할 것
// import { initializeApp } from 'firebase/app';
// import { getDatabase } from 'firebase/database';

// const firebaseConfig = {
//   // TODO: 환경별 설정 입력
// };

// const app = initializeApp(firebaseConfig);
// export const db = getDatabase(app);

// // 예시: 방 데이터 구독 함수 (실제 구현은 hooks에서)
// // export function subscribeRoom(roomCode: string, callback: (data: any) => void) {...}

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
// import { getAnalytics } from 'firebase/analytics'; // analytics가 필요하면 주석 해제

const firebaseConfig = {
  apiKey: 'AIzaSyBqhWROQKs1hEu9p09iQrXQYEEK2GlmbS0',
  authDomain: 'ron-database.firebaseapp.com',
  projectId: 'ron-database',
  storageBucket: 'ron-database-default-rtdb.asia-southeast1.firebasedatabase.app',
  messagingSenderId: '643525296802',
  appId: '1:643525296802:web:2564e459da50b09e6f8dfb',
  measurementId: 'G-SH7SLX416S',
  databaseURL: 'https://ron-database-default-rtdb.asia-southeast1.firebasedatabase.app', // 리전 경고 해결
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app, firebaseConfig.databaseURL); // 명시적으로 URL 전달
// const analytics = getAnalytics(app); // 필요 시 주석 해제
