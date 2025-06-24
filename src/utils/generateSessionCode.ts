/**
 * 4자리 랜덤 세션 코드를 생성
 * @returns 4자리 숫자로 구성된 문자열
 */
export const generateSessionCode = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};
