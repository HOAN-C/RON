// 1초마다 비프음 재생
// duration(ms)만큼 연속 비프음
export function playBeep(duration: number = 200) {
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
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.value = 0.17;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    setTimeout(() => {
      osc.stop();
      ctx.close();
    }, duration);
  } catch {
    // ignore
  }
}
