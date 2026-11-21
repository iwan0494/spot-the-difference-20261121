// audio.js — suara sintetis WebAudio, tanpa file. Semua nada dibuat di kode.
let ctx = null;

function ac() {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      return null;
    }
  }
  if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq, dur, type, vol, when) {
  const a = ac();
  if (!a) return;
  try {
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = type || 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol || 0.12, a.currentTime + (when || 0));
    g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + (when || 0) + dur);
    o.connect(g);
    g.connect(a.destination);
    o.start(a.currentTime + (when || 0));
    o.stop(a.currentTime + (when || 0) + dur + 0.02);
  } catch {
    // audio gagal diam-diam: game tetap jalan
  }
}

/** Mainkan suara berdasarkan jenisnya: 'found' | 'wrong' | 'hint' | 'win' | 'lose'. */
export function sfx(kind, muted) {
  if (muted) return;
  if (kind === 'found') {
    tone(660, 0.12, 'sine', 0.14, 0);
    tone(880, 0.18, 'sine', 0.14, 0.09);
  } else if (kind === 'wrong') {
    tone(160, 0.22, 'sawtooth', 0.07, 0);
  } else if (kind === 'hint') {
    tone(520, 0.14, 'triangle', 0.12, 0);
    tone(780, 0.16, 'triangle', 0.12, 0.08);
  } else if (kind === 'win') {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, 'sine', 0.13, i * 0.11));
  } else if (kind === 'lose') {
    tone(392, 0.2, 'sine', 0.1, 0);
    tone(311, 0.3, 'sine', 0.1, 0.15);
  }
}
