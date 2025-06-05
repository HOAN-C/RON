// Improved playBeep function with better mobile support
let audioCtx: AudioContext | null = null;
let isAudioInitialized = false;

// Initialize audio context on first user interaction
export function initializeAudio() {
  if (isAudioInitialized) return true;
  
  try {
    let AudioCtx: typeof AudioContext;
    if ('AudioContext' in window) {
      AudioCtx = window.AudioContext;
    } else if ('webkitAudioContext' in window) {
      // @ts-expect-error: webkitAudioContext is not in standard types
      AudioCtx = window.webkitAudioContext;
    } else {
      return false;
    }

    if (!audioCtx) {
      audioCtx = new AudioCtx();
    }

    // Resume context if suspended (required for iOS Safari)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isAudioInitialized = true;
    return true;
  } catch (error) {
    console.warn('Failed to initialize audio context:', error);
    return false;
  }
}

// Play a single beep
function playSingleBeep(frequency: number = 880, duration: number = 200, volume: number = 0.17): Promise<void> {
  return new Promise((resolve) => {
    try {
      if (!audioCtx || audioCtx.state === 'closed') {
        if (!initializeAudio()) {
          resolve();
          return;
        }
      }

      const ctx = audioCtx!;
      
      // Resume context if suspended
      if (ctx.state === 'suspended') {
        ctx.resume().then(() => {
          playBeepInternal(ctx, frequency, duration, volume, resolve);
        }).catch(() => resolve());
      } else {
        playBeepInternal(ctx, frequency, duration, volume, resolve);
      }
    } catch (error) {
      console.warn('Beep failed:', error);
      resolve();
    }
  });
}

function playBeepInternal(ctx: AudioContext, frequency: number, duration: number, volume: number, resolve: () => void) {
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = frequency;
    
    // Smooth volume envelope to prevent clicks
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + (duration / 1000) - 0.01);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + (duration / 1000));
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const startTime = ctx.currentTime;
    const endTime = startTime + (duration / 1000);
    
    osc.start(startTime);
    osc.stop(endTime);
    
    osc.onended = () => {
      try {
        gain.disconnect();
        osc.disconnect();
      } catch (e) {
        // Ignore disconnect errors
      }
      resolve();
    };
    
    // Fallback timeout in case onended doesn't fire
    setTimeout(resolve, duration + 100);
  } catch (error) {
    console.warn('Beep internal error:', error);
    resolve();
  }
}

// Main playBeep function with continuous beeping support
export async function playBeep(duration: number = 200, frequency: number = 880, volume: number = 0.17) {
  // Initialize audio if not already done
  if (!isAudioInitialized) {
    initializeAudio();
  }

  if (duration <= 500) {
    // Single short beep
    await playSingleBeep(frequency, duration, volume);
  } else {
    // Continuous beeping for longer durations
    const beepDuration = 200; // Individual beep length
    const pauseDuration = 100; // Pause between beeps
    const totalCycleTime = beepDuration + pauseDuration;
    const cycles = Math.floor(duration / totalCycleTime);
    
    for (let i = 0; i < cycles; i++) {
      await playSingleBeep(frequency, beepDuration, volume);
      if (i < cycles - 1) {
        // Pause between beeps (except for the last one)
        await new Promise(resolve => setTimeout(resolve, pauseDuration));
      }
    }
    
    // Handle remaining time
    const remainingTime = duration % totalCycleTime;
    if (remainingTime > 0) {
      await playSingleBeep(frequency, Math.min(remainingTime, beepDuration), volume);
    }
  }
}

// Alternative fallback using HTML5 Audio (for very problematic devices)
export function playBeepFallback() {
  try {
    // Create a short audio data URL (base64 encoded beep sound)
    const audioData = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuKzvLZiTYIG2mw7uOVUwwKT6zowmlhFQo7ncbb';
    const audio = new Audio(audioData);
    audio.volume = 0.1;
    audio.play().catch(() => {
      // Fallback failed, ignore silently
    });
  } catch (error) {
    // Ignore fallback errors
  }
}