import confetti from 'canvas-confetti';

/**
 * Safely trigger celebration confetti without ever freezing or leaking canvas elements.
 */
export function triggerCelebration() {
  if (typeof window === 'undefined') return;

  try {
    // 1. Reset any existing canvas instance first
    confetti.reset();
    cleanupStuckCanvases();

    // 2. Fire celebration
    confetti({
      particleCount: 75,
      spread: 65,
      origin: { y: 0.7 },
      disableForReducedMotion: true,
      zIndex: 9999,
    });

    // 3. Guaranteed safety cleanup after 3 seconds to prevent iOS WebKit freeze
    setTimeout(() => {
      clearCelebration();
    }, 3200);
  } catch (err) {
    console.warn('Confetti execution notice:', err);
  }
}

/**
 * Instantly reset and remove any canvas created by canvas-confetti.
 */
export function clearCelebration() {
  if (typeof window === 'undefined') return;

  try {
    confetti.reset();
  } catch {
    // ignore
  }

  cleanupStuckCanvases();
}

function cleanupStuckCanvases() {
  try {
    document.querySelectorAll('canvas').forEach((el) => {
      // canvas-confetti creates a fixed, pointer-events: none canvas
      if (
        el.style.position === 'fixed' &&
        el.style.pointerEvents === 'none'
      ) {
        el.remove();
      }
    });
  } catch {
    // ignore
  }
}
