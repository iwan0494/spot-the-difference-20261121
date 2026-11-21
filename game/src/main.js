// Pasar Malam — Cari Bedanya! Game logic: mouse + keyboard play, hints,
// magnifier, timer, score, streaks, per-scene progress and deterministic
// screenshot presets (?shot=start|play|play2|end). No network, no files.
import { SCENES, SCENE_W, SCENE_H, renderScene } from './scenes.js';
import { makeSounds } from './audio.js';

const $ = (id) => document.getElementById(id);
const sounds = makeSounds();

const TIME_PER_SCENE = 150; // 2:30
const CLICK_TOLERANCE = 10; // extra px around a difference when clicking

const state = {
  scene: 0,
  activePanel: 'right',
  paused: false,
  shot: null,
  totalScore: 0,
  scenes: SCENES.map(() => ({
    found: new Set(),
    timeLeft: TIME_PER_SCENE,
    hints: 3,
    strikes: 0,
    streak: 0,
  })),
  cross: { x: SCENE_W / 2, y: SCENE_H / 2, visible: false },
  pulse: null, // {x, y, until} for the hint pulse
};

let timerId = null;

const els = {
  remain: $('remainBig'),
  dots: $('foundDots'),
  timer: $('timer'),
  score: $('score'),
  streak: $('streak'),
  strikes: $('strikes'),
  hintCount: $('hintCount'),
  hintBtn: $('hintBtn'),
  pauseBtn: $('pauseBtn'),
  restartBtn: $('restartBtn'),
  soundBtn: $('soundBtn'),
  progress: $('progressBar'),
  sceneSub: $('sceneSub'),
  tabs: $('sceneTabs'),
  foundList: $('foundList'),
  overlay: $('overlay'),
  overlayEmoji: $('overlayEmoji'),
  overlayTitle: $('overlayTitle'),
  overlayText: $('overlayText'),
  overlayBtn: $('overlayBtn'),
  left: $('canvasLeft'),
  right: $('canvasRight'),
  lensLeft: $('lensLeft'),
  lensRight: $('lensRight'),
  crossLeft: $('crossLeft'),
  crossRight: $('crossRight'),
  boardLeft: $('boardLeft'),
  boardRight: $('boardRight'),
};

const cur = () => state.scenes[state.scene];
const scene = () => SCENES[state.scene];
const allApplied = () => new Set(scene().diffs.map((_, i) => i));

// ---------- rendering ----------
function drawMarker(c, x, y, r) {
  // Bold double ring + green check badge: readable at a glance in a screenshot.
  c.save();
  c.lineWidth = 6;
  c.strokeStyle = '#ffd166';
  c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.stroke();
  c.lineWidth = 2;
  c.strokeStyle = '#ffffff';
  c.beginPath(); c.arc(x, y, r - 7, 0, Math.PI * 2); c.stroke();
  c.fillStyle = '#2fd48a';
  c.beginPath(); c.arc(x + r * 0.62, y - r * 0.62, 11, 0, Math.PI * 2); c.fill();
  c.strokeStyle = '#06281a'; c.lineWidth = 3; c.lineCap = 'round'; c.lineJoin = 'round';
  c.beginPath();
  c.moveTo(x + r * 0.62 - 5, y - r * 0.62);
  c.lineTo(x + r * 0.62 - 1, y - r * 0.62 + 4);
  c.lineTo(x + r * 0.62 + 6, y - r * 0.62 - 4);
  c.stroke();
  c.restore();
}

function drawPulse(c, x, y, r, t) {
  const p = (Date.now() - t) / 1200;
  if (p >= 1) return false;
  const rr = r + p * 22;
  c.save();
  c.globalAlpha = 1 - p;
  c.lineWidth = 5;
  c.strokeStyle = '#ffd166';
  c.beginPath(); c.arc(x, y, rr, 0, Math.PI * 2); c.stroke();
  c.restore();
  return true;
}

function render() {
  const s = scene();
  renderScene(els.left, s, new Set());
  renderScene(els.right, s, allApplied());
  for (const [canvas, isRight] of [[els.left, false], [els.right, true]]) {
    const c = canvas.getContext('2d');
    for (const i of cur().found) {
      const d = s.diffs[i];
      drawMarker(c, d.x, d.y, d.r);
    }
    if (state.pulse) {
      const d = s.diffs[state.pulse.index];
      if (!drawPulse(c, d.x, d.y, d.r, state.pulse.started)) state.pulse = null;
    }
    void isRight;
  }
  if (state.pulse) requestAnimationFrame(render);
  updateHud();
  updateCrosshair();
}

function fmtTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.max(0, sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function updateHud() {
  const s = scene();
  const st = cur();
  const remain = s.diffs.length - st.found.size;
  els.remain.textContent = remain === 0 ? 'Semua ketemu! 🎉' : `${remain} lagi dicari`;
  els.dots.innerHTML = s.diffs.map((_, i) =>
    `<span class="dot${st.found.has(i) ? ' hit' : ''}">${st.found.has(i) ? '✓' : ''}</span>`).join('');
  els.timer.textContent = fmtTime(st.timeLeft);
  els.timer.classList.toggle('low', st.timeLeft <= 30);
  els.score.textContent = state.totalScore;
  els.streak.textContent = `×${st.streak}`;
  els.strikes.textContent = st.strikes;
  els.hintCount.textContent = st.hints;
  els.hintBtn.disabled = st.hints <= 0 || remain === 0;
  els.progress.style.width = `${(st.found.size / s.diffs.length) * 100}%`;
  els.sceneSub.textContent = `${s.name} · ${s.sub}`;
  els.foundList.innerHTML = st.found.size === 0
    ? 'Belum ada — klik perbedaan pertama!'
    : [...st.found].map((i) => `<span class="found-name">${s.diffs[i].name}</span>`).join(' &middot; ');
  els.tabs.querySelectorAll('button').forEach((b, i) => {
    b.classList.toggle('active', i === state.scene);
    b.classList.toggle('done', state.scenes[i].found.size === SCENES[i].diffs.length);
  });
  els.boardLeft.classList.toggle('active', state.activePanel === 'left');
  els.boardRight.classList.toggle('active', state.activePanel === 'right');
}

function updateCrosshair() {
  const { x, y, visible } = state.cross;
  for (const [el, panel] of [[els.crossLeft, 'left'], [els.crossRight, 'right']]) {
    el.hidden = !visible || state.activePanel !== panel;
    el.style.left = `${(x / SCENE_W) * 100}%`;
    el.style.top = `${(y / SCENE_H) * 100}%`;
  }
}

// ---------- gameplay ----------
function toSceneCoords(canvas, ev) {
  const r = canvas.getBoundingClientRect();
  return {
    x: ((ev.clientX - r.left) / r.width) * SCENE_W,
    y: ((ev.clientY - r.top) / r.height) * SCENE_H,
  };
}

function hitDiff(x, y) {
  const s = scene();
  let best = -1;
  let bestDist = Infinity;
  s.diffs.forEach((d, i) => {
    if (cur().found.has(i)) return;
    const dist = Math.hypot(x - d.x, y - d.y);
    if (dist <= d.r + CLICK_TOLERANCE && dist < bestDist) { best = i; bestDist = dist; }
  });
  return best;
}

function guess(x, y) {
  if (state.paused || overlayOpen()) return;
  sounds.unlock();
  state.cross = { x, y, visible: true };
  const i = hitDiff(x, y);
  if (i >= 0) {
    cur().found.add(i);
    cur().streak += 1;
    const gained = 100 + (cur().streak - 1) * 25;
    state.totalScore += gained;
    sounds.found();
    render();
    if (cur().found.size === scene().diffs.length) {
      sounds.sceneClear();
      stopTimer();
      setTimeout(() => showSceneClear(), 450);
    }
  } else {
    cur().strikes += 1;
    cur().streak = 0;
    cur().timeLeft = Math.max(0, cur().timeLeft - 5);
    sounds.wrong();
    flashMiss(x, y);
    render();
    if (cur().timeLeft <= 0) {
      stopTimer();
      showOverlay('⏰', 'Waktu habis!', `Kamu menemukan ${cur().found.size} dari 7 perbedaan di ${scene().name}. Coba lagi — perbedaan yang sama menunggu.`, 'Coba lagi', () => { resetScene(); hideOverlay(); startTimer(); });
    }
  }
}

function flashMiss(x, y) {
  for (const canvas of [els.left, els.right]) {
    const c = canvas.getContext('2d');
    c.save();
    c.lineWidth = 5; c.strokeStyle = '#ff5347';
    c.beginPath(); c.arc(x, y, 22, 0, Math.PI * 2); c.stroke();
    c.beginPath();
    c.moveTo(x - 10, y - 10); c.lineTo(x + 10, y + 10);
    c.moveTo(x + 10, y - 10); c.lineTo(x - 10, y + 10);
    c.stroke();
    c.restore();
  }
  setTimeout(render, 450);
}

function useHint() {
  const st = cur();
  if (state.paused || overlayOpen() || st.hints <= 0) return;
  const remaining = scene().diffs.map((_, i) => i).filter((i) => !st.found.has(i));
  if (remaining.length === 0) return;
  st.hints -= 1;
  state.pulse = { index: remaining[0], started: Date.now() };
  sounds.hint();
  render();
  setTimeout(render, 1300);
}

function resetScene() {
  const st = cur();
  st.found = new Set();
  st.timeLeft = TIME_PER_SCENE;
  st.hints = 3;
  st.strikes = 0;
  st.streak = 0;
  state.pulse = null;
  render();
}

function switchScene(i) {
  if (i === state.scene) return;
  state.scene = i;
  state.pulse = null;
  state.paused = false;
  els.pauseBtn.textContent = '⏸ Jeda';
  hideOverlay();
  sounds.click();
  render();
  startTimer();
}

// ---------- timer ----------
function startTimer() {
  stopTimer();
  if (state.shot) return; // screenshot presets freeze the clock
  timerId = setInterval(() => {
    if (state.paused || overlayOpen()) return;
    cur().timeLeft -= 1;
    if (cur().timeLeft <= 0) {
      cur().timeLeft = 0;
      stopTimer();
      showOverlay('⏰', 'Waktu habis!', `Kamu menemukan ${cur().found.size} dari 7 perbedaan di ${scene().name}. Coba lagi — perbedaan yang sama menunggu.`, 'Coba lagi', () => { resetScene(); hideOverlay(); startTimer(); });
    }
    updateHud();
  }, 1000);
}
function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }

// ---------- overlay ----------
let overlayAction = null;
function overlayOpen() { return !els.overlay.hidden; }
function showOverlay(emoji, title, text, btn, action) {
  els.overlayEmoji.textContent = emoji;
  els.overlayTitle.textContent = title;
  els.overlayText.textContent = text;
  els.overlayBtn.textContent = btn;
  overlayAction = action;
  els.overlay.hidden = false;
}
function hideOverlay() { els.overlay.hidden = true; overlayAction = null; }
function showSceneClear() {
  const done = state.scenes.filter((st, i) => st.found.size === SCENES[i].diffs.length).length;
  if (done === SCENES.length) {
    sounds.win();
    showOverlay('🏆', 'Semua scene selesai!', `Luar biasa — kamu menemukan seluruh 28 perbedaan di 4 scene. Skor akhir: ${state.totalScore}. Main lagi dari awal?`, 'Main lagi dari awal', () => {
      state.totalScore = 0;
      state.scenes = SCENES.map(() => ({ found: new Set(), timeLeft: TIME_PER_SCENE, hints: 3, strikes: 0, streak: 0 }));
      state.scene = 0;
      hideOverlay(); render(); startTimer();
    });
  } else {
    const next = (state.scene + 1) % SCENES.length;
    const nextName = SCENES[next].name;
    showOverlay('🎉', `${scene().name} selesai!`, `Semua 7 perbedaan ketemu. Skor: ${state.totalScore}. Scene berikut: ${nextName}.`, `Lanjut: ${nextName} →`, () => { switchScene(next); });
  }
}

// ---------- magnifier ----------
function setupLens(canvas, lens) {
  const wrap = canvas.parentElement;
  canvas.addEventListener('mousemove', (ev) => {
    if (state.paused) { lens.style.display = 'none'; return; }
    const p = toSceneCoords(canvas, ev);
    const lc = lens.getContext('2d');
    lc.clearRect(0, 0, 180, 180);
    lc.drawImage(canvas, p.x - 45, p.y - 45, 90, 90, 0, 0, 180, 180);
    lc.strokeStyle = '#ffd166'; lc.lineWidth = 3;
    lc.beginPath(); lc.arc(90, 90, 14, 0, Math.PI * 2); lc.stroke();
    const wr = wrap.getBoundingClientRect();
    const lx = Math.min(Math.max(ev.clientX - wr.left - 90, -20), wr.width - 160);
    const ly = Math.min(Math.max(ev.clientY - wr.top - 90, -20), wr.height - 160);
    lens.style.left = `${lx}px`;
    lens.style.top = `${ly}px`;
    lens.style.display = 'block';
  });
  canvas.addEventListener('mouseleave', () => { lens.style.display = 'none'; });
}

// ---------- wiring ----------
function buildTabs() {
  SCENES.forEach((s, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = `${i + 1}. ${s.name}`;
    b.addEventListener('click', () => switchScene(i));
    els.tabs.appendChild(b);
  });
}

els.left.addEventListener('click', (ev) => { state.activePanel = 'left'; guess(...Object.values(toSceneCoords(els.left, ev))); });
els.right.addEventListener('click', (ev) => { state.activePanel = 'right'; guess(...Object.values(toSceneCoords(els.right, ev))); });
els.hintBtn.addEventListener('click', useHint);
els.restartBtn.addEventListener('click', () => { resetScene(); startTimer(); });
els.soundBtn.addEventListener('click', () => {
  const m = sounds.toggleMute();
  els.soundBtn.textContent = m ? '🔇 Senyap' : '🔊 Suara';
});
els.pauseBtn.addEventListener('click', () => {
  if (overlayOpen()) return;
  state.paused = !state.paused;
  els.pauseBtn.textContent = state.paused ? '▶ Lanjut' : '⏸ Jeda';
  if (state.paused) {
    showOverlay('⏸', 'Dijeda', 'Istirahat sebentar — waktunya berhenti di sini.', 'Lanjut main', () => { state.paused = false; els.pauseBtn.textContent = '⏸ Jeda'; hideOverlay(); });
  }
});
els.overlayBtn.addEventListener('click', () => { if (overlayAction) overlayAction(); });

window.addEventListener('keydown', (ev) => {
  if (ev.key === 'Tab') {
    ev.preventDefault();
    state.activePanel = state.activePanel === 'left' ? 'right' : 'left';
    updateHud();
    updateCrosshair();
    return;
  }
  if (overlayOpen()) {
    if (ev.key === 'Enter' || ev.key === 'Escape') { ev.preventDefault(); if (overlayAction) overlayAction(); }
    return;
  }
  const step = ev.shiftKey ? 40 : 12;
  let moved = false;
  if (ev.key === 'ArrowLeft') { state.cross.x = Math.max(0, state.cross.x - step); moved = true; }
  if (ev.key === 'ArrowRight') { state.cross.x = Math.min(SCENE_W, state.cross.x + step); moved = true; }
  if (ev.key === 'ArrowUp') { state.cross.y = Math.max(0, state.cross.y - step); moved = true; }
  if (ev.key === 'ArrowDown') { state.cross.y = Math.min(SCENE_H, state.cross.y + step); moved = true; }
  if (moved) {
    ev.preventDefault();
    state.cross.visible = true;
    updateCrosshair();
    return;
  }
  if (ev.key === 'Enter') { ev.preventDefault(); guess(state.cross.x, state.cross.y); }
  else if (ev.key === 'h' || ev.key === 'H') useHint();
  else if (ev.key === 'r' || ev.key === 'R') { resetScene(); startTimer(); }
  else if (ev.key === 'm' || ev.key === 'M') els.soundBtn.click();
  else if (ev.key === 'p' || ev.key === 'P') els.pauseBtn.click();
  else if (ev.key >= '1' && ev.key <= '4') switchScene(Number(ev.key) - 1);
});

setupLens(els.left, els.lensLeft);
setupLens(els.right, els.lensRight);

// ---------- deterministic screenshot presets ----------
function applyShot() {
  const q = new URLSearchParams(window.location.search);
  const shot = q.get('shot');
  if (!shot) return;
  state.shot = shot;
  if (shot === 'start') {
    state.scene = 0;
  } else if (shot === 'play') {
    state.scene = 1;
    cur().found = new Set([0, 1, 2]);
    cur().streak = 2;
    cur().timeLeft = 107;
    state.totalScore = 350;
  } else if (shot === 'play2') {
    state.scene = 0;
    cur().found = new Set([0, 1, 2, 3]);
    cur().streak = 3;
    cur().timeLeft = 72;
    state.totalScore = 520;
  } else if (shot === 'end') {
    state.scene = 0;
    cur().found = new Set([0, 1, 2, 3, 4, 5, 6]);
    cur().streak = 7;
    cur().timeLeft = 58;
    state.totalScore = 980;
  }
  render();
  if (shot === 'end') {
    showOverlay('🎉', 'Pasar Malam selesai!', 'Semua 7 perbedaan ketemu. Skor: 980. Scene berikut: Pelabuhan Fajar.', 'Lanjut: Pelabuhan Fajar →', () => {});
    // End screenshot keeps the win card but must not advance on its own.
    overlayAction = null;
  }
}

// ---------- boot ----------
buildTabs();
applyShot();
render();
startTimer();
