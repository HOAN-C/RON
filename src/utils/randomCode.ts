// 4자리 랜덤 방 코드 생성
export function generateRoomCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
