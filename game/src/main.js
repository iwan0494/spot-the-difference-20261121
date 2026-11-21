// main.js — logika game "Pasar Malam — Cari Bedanya!".
// Klik di gambar mana pun, keyboard (panah+Enter, Tab, H, 1-5, R, M, P), kaca pembesar 2x,
// timer 2:30, skor + kombo, strike -5 detik, 3 petunjuk/scene, overlay menang.
// Mode screenshot deterministik via ?shot=start|play|play2|end.
import { SCENES, W, H } from './scenes.js';
import { sfx } from './audio.js';

const $ = (id) => document.getElementById(id);
const cvL = $('cvL');
const cvR = $('cvR');
const ctxL = cvL.getContext('2d');
const ctxR = cvR.getContext('2d');
const lens = $('lens');
const lensCv = $('lensCv');
const lensCtx = lensCv.getContext('2d');

const TIME_LIMIT = 150; // 2:30 per scene
const state = {
  scene: 0,
  found: new Set(),
  score: 0,
  streak: 0,
  strikes: 0,
  timeLeft: TIME_LIMIT,
  hints: 3,
  paused: false,
  muted: false,
  over: false,
  wonScene: false,
  active: 'right',
  cross: { x: W / 2, y: H / 2 },
  flash: null, // {x, y, side, until}
  wonAll: new Set(),
};

const SHOTS = {
  start: { scene: 0, found: 3, score: 300, combo: 2, time: 118 },
  play: { scene: 1, found: 4, score: 450, combo: 2, time: 107 },
  play2: { scene: 2, found: 5, score: 650, combo: 3, time: 72 },
  end: { scene: 0, found: 8, score: 980, combo: 7, time: 58 },
};

function scene() {
  return SCENES[state.scene];
}
function remaining() {
  return scene().diffs.length - state.found.size;
}
function fmtTime(s) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return String(m).padStart(2, '0') + ':' + String(r).padStart(2, '0');
}

function drawMarker(ctx, x, y, r) {
  // lingkaran emas tebal + ring putih + centang hijau
  ctx.save();
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#f5b942';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, r + 4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#2fbf5a';
  ctx.beginPath();
  ctx.arc(x + r * 0.62, y - r * 0.62, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x + r * 0.62 - 6, y - r * 0.62);
  ctx.lineTo(x + r * 0.62 - 1, y - r * 0.62 + 5);
  ctx.lineTo(x + r * 0.62 + 7, y - r * 0.62 - 6);
  ctx.stroke();
  ctx.restore();
}

function render() {
  const sc = scene();
  sc.draw(ctxL, false);
  sc.draw(ctxR, true);
  // marker untuk yang sudah ketemu, di KEDUA panel
  sc.diffs.forEach((d, i) => {
    if (!state.found.has(i)) return;
    drawMarker(ctxL, d.x, d.y, d.r);
    drawMarker(ctxR, d.x, d.y, d.r);
  });
  // flash X merah untuk klik salah
  if (state.flash && Date.now() < state.flash.until) {
    const ctx = state.flash.side === 'left' ? ctxL : ctxR;
    const { x, y } = state.flash;
    ctx.save();
    ctx.strokeStyle = '#ff4d4d';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - 14, y - 14);
    ctx.lineTo(x + 14, y + 14);
    ctx.moveTo(x + 14, y - 14);
    ctx.lineTo(x - 14, y + 14);
    ctx.stroke();
    ctx.restore();
  }
  // crosshair di panel aktif (disembunyikan di mode screenshot supaya frame bersih)
  if (!state.shot) {
    const ctxA = state.active === 'left' ? ctxL : ctxR;
    ctxA.save();
    ctxA.strokeStyle = '#ffffff';
    ctxA.lineWidth = 2;
    ctxA.beginPath();
    ctxA.arc(state.cross.x, state.cross.y, 14, 0, Math.PI * 2);
    ctxA.stroke();
    ctxA.fillStyle = '#f5b942';
    ctxA.beginPath();
    ctxA.arc(state.cross.x, state.cross.y, 4, 0, Math.PI * 2);
    ctxA.fill();
    ctxA.restore();
  }
  updateHud();
}

function updateHud() {
  const sc = scene();
  $('sceneSub').textContent = sc.name + ' · Scene ' + (state.scene + 1) + ' dari ' + SCENES.length + ' · ' + sc.sub;
  $('remainBig').textContent = remaining() + ' lagi dicari';
  const dots = $('dots');
  dots.innerHTML = '';
  sc.diffs.forEach((d, i) => {
    const s = document.createElement('span');
    s.className = 'dot' + (state.found.has(i) ? ' on' : '');
    dots.appendChild(s);
  });
  $('timer').textContent = fmtTime(Math.max(0, state.timeLeft));
  $('score').textContent = String(state.score);
  $('combo').textContent = '×' + Math.max(0, state.streak);
  $('strikes').textContent = String(state.strikes);
  $('hintBtn').textContent = '💡 Petunjuk (' + state.hints + ')';
  $('hintBtn').disabled = state.hints <= 0 || state.over || state.wonScene;
  const names = [...state.found].sort((a, b) => a - b).map((i) => sc.diffs[i].name);
  $('foundList').innerHTML =
    names.length === 0
      ? 'Belum ada — klik perbedaan pertama!'
      : names.map((n) => '✓ ' + n).join(' · ');
  // tab scene
  const tabs = $('tabs');
  tabs.innerHTML = '';
  SCENES.forEach((s, i) => {
    const b = document.createElement('button');
    b.className = 'tab' + (i === state.scene ? ' active' : '') + (state.wonAll.has(i) ? ' done' : '');
    b.textContent = (i + 1) + '. ' + s.name + (state.wonAll.has(i) ? ' ✓' : '');
    b.addEventListener('click', () => switchScene(i));
    tabs.appendChild(b);
  });
}

function toCanvas(ev, cv) {
  const rect = cv.getBoundingClientRect();
  return {
    x: ((ev.clientX - rect.left) / rect.width) * W,
    y: ((ev.clientY - rect.top) / rect.height) * H,
  };
}

function clickAt(x, y, side) {
  if (state.paused || state.over || state.wonScene) return;
  const sc = scene();
  state.cross = { x, y };
  state.active = side;
  const hit = sc.diffs.findIndex((d, i) => !state.found.has(i) && Math.hypot(d.x - x, d.y - y) <= d.r);
  if (hit >= 0) {
    state.found.add(hit);
    state.streak += 1;
    state.score += 100 + 25 * (state.streak - 1);
    sfx('found', state.muted);
    if (remaining() === 0) winScene();
  } else {
    state.strikes += 1;
    state.streak = 0;
    state.timeLeft = Math.max(0, state.timeLeft - 5);
    state.flash = { x, y, side, until: Date.now() + 600 };
    sfx('wrong', state.muted);
    setTimeout(render, 650);
  }
  render();
}

function useHint() {
  if (state.paused || state.over || state.wonScene || state.hints <= 0) return;
  const sc = scene();
  const rest = sc.diffs.map((d, i) => i).filter((i) => !state.found.has(i));
  if (rest.length === 0) return;
  const pick = rest[Math.floor(Math.random() * rest.length)];
  state.found.add(pick);
  state.hints -= 1;
  state.streak = 0;
  state.score += 50;
  sfx('hint', state.muted);
  if (remaining() === 0) winScene();
  render();
}

function switchScene(i) {
  state.scene = i;
  state.found = new Set();
  state.streak = 0;
  state.timeLeft = TIME_LIMIT;
  state.hints = 3;
  state.wonScene = false;
  state.over = false;
  state.cross = { x: W / 2, y: H / 2 };
  hideOverlay();
  render();
}

function winScene() {
  state.wonScene = true;
  state.wonAll.add(state.scene);
  sfx('win', state.muted);
  const sc = scene();
  const next = (state.scene + 1) % SCENES.length;
  const allDone = state.wonAll.size === SCENES.length;
  showOverlay(
    '🎉',
    sc.name + ' selesai!',
    'Semua 8 perbedaan ketemu. Skor: ' + state.score + '. ' + (allDone ? 'Semua 5 scene selesai — kamu master cari beda!' : 'Scene berikut: ' + SCENES[next].name + '.'),
    allDone ? 'Main lagi dari awal ↻' : 'Lanjut: ' + SCENES[next].name + ' →',
    () => {
      if (allDone) switchScene(0);
      else switchScene(next);
    },
  );
  render();
}

function timeUp() {
  state.over = true;
  sfx('lose', state.muted);
  showOverlay('⏰', 'Waktu habis!', 'Kamu menemukan ' + state.found.size + ' dari 8 perbedaan di ' + scene().name + '. Coba lagi!', 'Coba lagi ↻', () => switchScene(state.scene));
  render();
}

function showOverlay(emoji, title, body, btnLabel, onBtn) {
  const ov = $('overlay');
  $('ovEmoji').textContent = emoji;
  $('ovTitle').textContent = title;
  $('ovBody').textContent = body;
  const btn = $('ovBtn');
  btn.textContent = btnLabel;
  btn.onclick = onBtn;
  ov.classList.remove('hidden');
}
function hideOverlay() {
  $('overlay').classList.add('hidden');
}

function togglePause() {
  if (state.over || state.wonScene) return;
  state.paused = !state.paused;
  $('pauseBtn').textContent = state.paused ? '▶ Lanjut' : '⏸ Jeda';
  if (state.paused) {
    showOverlay('⏸', 'Jeda', 'Game dijeda. Tekan P atau tombol Lanjut untuk main lagi.', '▶ Lanjut', togglePause);
  } else {
    hideOverlay();
  }
  render();
}

// ---- magnifier 2x ----
function showLens(ev, cv) {
  const p = toCanvas(ev, cv);
  const src = cv.getContext('2d');
  const size = 90;
  const sx = Math.max(0, Math.min(W - size, p.x - size / 2));
  const sy = Math.max(0, Math.min(H - size, p.y - size / 2));
  lensCtx.imageSmoothingEnabled = false;
  lensCtx.clearRect(0, 0, 180, 180);
  lensCtx.drawImage(cv, sx, sy, size, size, 0, 0, 180, 180);
  lensCtx.strokeStyle = '#f5b942';
  lensCtx.lineWidth = 4;
  lensCtx.beginPath();
  lensCtx.arc(90, 90, 86, 0, Math.PI * 2);
  lensCtx.stroke();
  lens.style.display = 'block';
  const rect = cv.getBoundingClientRect();
  const panels = cv.closest('.panels').getBoundingClientRect();
  let lx = ev.clientX - panels.left + 24;
  let ly = ev.clientY - panels.top - 190;
  if (lx + 190 > panels.width) lx = ev.clientX - panels.left - 214;
  if (ly < 0) ly = ev.clientY - panels.top + 24;
  lens.style.left = lx + 'px';
  lens.style.top = ly + 'px';
}
function hideLens() {
  lens.style.display = 'none';
}

// ---- events ----
for (const [cv, side] of [[cvL, 'left'], [cvR, 'right']]) {
  cv.addEventListener('click', (ev) => {
    const p = toCanvas(ev, cv);
    clickAt(p.x, p.y, side);
  });
  cv.addEventListener('mousemove', (ev) => {
    const p = toCanvas(ev, cv);
    state.cross = { x: p.x, y: p.y };
    state.active = side;
    showLens(ev, cv);
    render();
  });
  cv.addEventListener('mouseleave', hideLens);
}
$('hintBtn').addEventListener('click', useHint);
$('pauseBtn').addEventListener('click', togglePause);

document.addEventListener('keydown', (ev) => {
  if (ev.key === 'Tab') {
    ev.preventDefault();
    state.active = state.active === 'left' ? 'right' : 'left';
    render();
    return;
  }
  const step = ev.shiftKey ? 40 : 14;
  if (ev.key === 'ArrowLeft') {
    state.cross.x = Math.max(0, state.cross.x - step);
    render();
    ev.preventDefault();
  } else if (ev.key === 'ArrowRight') {
    state.cross.x = Math.min(W, state.cross.x + step);
    render();
    ev.preventDefault();
  } else if (ev.key === 'ArrowUp') {
    state.cross.y = Math.max(0, state.cross.y - step);
    render();
    ev.preventDefault();
  } else if (ev.key === 'ArrowDown') {
    state.cross.y = Math.min(H, state.cross.y + step);
    render();
    ev.preventDefault();
  } else if (ev.key === 'Enter') {
    clickAt(state.cross.x, state.cross.y, state.active);
    ev.preventDefault();
  } else if (ev.key === 'h' || ev.key === 'H') {
    useHint();
  } else if (ev.key === 'p' || ev.key === 'P') {
    togglePause();
  } else if (ev.key === 'r' || ev.key === 'R') {
    switchScene(state.scene);
  } else if (ev.key === 'm' || ev.key === 'M') {
    state.muted = !state.muted;
  } else if (/^[1-5]$/.test(ev.key)) {
    switchScene(Number(ev.key) - 1);
  }
});

// ---- timer ----
setInterval(() => {
  if (state.paused || state.over || state.wonScene) return;
  if (state.shot) return; // mode screenshot: timer diam
  state.timeLeft -= 1;
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    timeUp();
  }
  updateHud();
}, 1000);

// ---- mode screenshot deterministik ----
const params = new URLSearchParams(location.search);
const shot = params.get('shot');
if (shot && SHOTS[shot]) {
  const s = SHOTS[shot];
  state.shot = shot;
  state.scene = s.scene;
  state.found = new Set(Array.from({ length: s.found }, (_, i) => i));
  state.score = s.score;
  state.streak = s.combo;
  state.timeLeft = s.time;
  state.hints = 3;
  if (shot === 'end') {
    state.wonScene = true;
    state.wonAll.add(0);
    const sc = scene();
    showOverlay(
      '🎉',
      sc.name + ' selesai!',
      'Semua 8 perbedaan ketemu. Skor: ' + state.score + '. Scene berikut: ' + SCENES[1].name + '.',
      'Lanjut: ' + SCENES[1].name + ' →',
      () => {},
    );
  }
}

render();
