import { useParams } from 'react-router-dom';

// URL에서 세션 코드를 가져오는 훅
export const useSessionCode = () => {
  const { code } = useParams<{ code: string }>();
  if (!code) throw new Error('Session code not found');
  return code;
};
