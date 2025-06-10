import { useState } from 'react';
import { SoundIconButton, SoundToast } from './SoundTester.styled';
import { playBeep } from '../utils/playBeep';

export const SoundTester = () => {
  const [toast, setToast] = useState(false);

  const handleClick = () => {
    playBeep(200);
    if (navigator.vibrate) navigator.vibrate(80);
    setToast(true);
    setTimeout(() => setToast(false), 1000);
  };

  return (
    <>
      <SoundIconButton onClick={handleClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      </SoundIconButton>
      <SoundToast visible={toast}>소리가 들리나요?</SoundToast>
    </>
  );
}
