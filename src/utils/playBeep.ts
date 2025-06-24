import { getAudioContext } from './audioContext';

export function playBeep(volume: number = 0.5, duration: number = 0.1, frequency = 1500) {
  const audioCtx = getAudioContext();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);

  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
}
