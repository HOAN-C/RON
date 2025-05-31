// 1초마다 비프음 재생
// duration(ms)만큼 연속 비프음
let audioCtx: AudioContext | null = null;

export function playBeep(duration: number = 200, frequency: number = 880, volume: number = 0.17) {
  try {
    let AudioCtx: typeof AudioContext;
    if ('AudioContext' in window) {
      AudioCtx = window.AudioContext;
    } else if ('webkitAudioContext' in window) {
      // @ts-expect-error: webkitAudioContext is not in standard types
      AudioCtx = window.webkitAudioContext;
    } else {
      return;
    }
    if (!audioCtx) {
      audioCtx = new AudioCtx();
    }
    const ctx = audioCtx;
    // iOS: resume context if suspended
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = frequency;
    gain.gain.value = volume;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
    osc.onended = () => {
      gain.disconnect();
      osc.disconnect();
    };
  } catch {
    // ignore
  }
}

