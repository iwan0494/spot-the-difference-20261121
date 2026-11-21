// Tiny synthesized sounds for Pasar Malam — no audio files, no network.
// Everything is a WebAudio oscillator, created only after the player has
// interacted with the page (browsers block audio before a gesture).
export function makeSounds() {
  let ctx = null;
  let muted = false;
  function audio() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tone(freq, start, dur, type, vol) {
    if (muted) return;
    const ac = audio();
    if (!ac) return;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, ac.currentTime + start);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + start + dur);
    o.connect(g);
    g.connect(ac.destination);
    o.start(ac.currentTime + start);
    o.stop(ac.currentTime + start + dur + 0.02);
  }
  return {
    get muted() { return muted; },
    toggleMute() { muted = !muted; return muted; },
    unlock() { audio(); },
    found() { tone(880, 0, 0.16, 'sine', 0.22); tone(1318, 0.09, 0.22, 'sine', 0.18); },
    wrong() { tone(180, 0, 0.22, 'sawtooth', 0.12); },
    hint() { tone(660, 0, 0.12, 'triangle', 0.16); },
    click() { tone(520, 0, 0.06, 'triangle', 0.1); },
    win() {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.28, 'sine', 0.2));
    },
    sceneClear() {
      [784, 988, 1175].forEach((f, i) => tone(f, i * 0.1, 0.24, 'sine', 0.18));
    },
  };
}
