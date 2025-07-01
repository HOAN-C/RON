import { useParams } from 'react-router-dom';

/**
 * URL에서 세션 코드를 가져오는 훅
 * @returns 세션 코드
 */
export function useSessionCode() {
  const { code } = useParams<{ code: string }>();
  if (!code) return '';
  return code;
}
