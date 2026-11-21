// Pasar Malam — Spot the Difference: all four scenes, drawn fresh in code.
// Scene space is 640 x 400. Every scene draws itself twice: once clean (left
// panel) and once with a set of differences applied (right panel). A difference
// is one small, fair change: removed, recoloured, moved, resized, flipped or
// added. Nothing here is copied from any other game or entry.

export const SCENE_W = 640;
export const SCENE_H = 400;

// ---------- tiny drawing helpers (plain canvas paths, no libraries) ----------
function rr(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}
function circ(c, x, y, r) { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); }
function ell(c, x, y, rx, ry) { c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); }
function poly(c, pts) {
  c.beginPath();
  c.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
  c.closePath();
}
function fill(c, color) { c.fillStyle = color; c.fill(); }
function sky(c, top, mid, bottom) {
  const g = c.createLinearGradient(0, 0, 0, SCENE_H);
  g.addColorStop(0, top); g.addColorStop(0.55, mid); g.addColorStop(1, bottom);
  c.fillStyle = g; c.fillRect(0, 0, SCENE_W, SCENE_H);
}
function cloud(c, x, y, s, color) {
  c.fillStyle = color;
  circ(c, x, y, 16 * s); c.fill();
  circ(c, x + 18 * s, y + 3 * s, 13 * s); c.fill();
  circ(c, x - 18 * s, y + 4 * s, 12 * s); c.fill();
  circ(c, x + 4 * s, y - 9 * s, 12 * s); c.fill();
}
function star4(c, x, y, r, color) {
  c.fillStyle = color;
  poly(c, [[x, y - r], [x + r * 0.28, y - r * 0.28], [x + r, y], [x + r * 0.28, y + r * 0.28], [x, y + r], [x - r * 0.28, y + r * 0.28], [x - r, y], [x - r * 0.28, y - r * 0.28]]);
  c.fill();
}
function gull(c, x, y, s, color) {
  c.strokeStyle = color; c.lineWidth = 2.5 * s; c.lineCap = 'round';
  c.beginPath();
  c.moveTo(x - 9 * s, y); c.quadraticCurveTo(x - 4 * s, y - 7 * s, x, y);
  c.quadraticCurveTo(x + 4 * s, y - 7 * s, x + 9 * s, y);
  c.stroke();
}
function lantern(c, x, y, r, color) {
  c.fillStyle = color;
  ell(c, x, y, r, r * 1.15); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.35)';
  ell(c, x - r * 0.3, y - r * 0.35, r * 0.28, r * 0.45); c.fill();
  c.strokeStyle = '#7a2d12'; c.lineWidth = 2;
  c.beginPath(); c.moveTo(x, y - r * 1.15); c.lineTo(x, y - r * 1.15 - 7); c.stroke();
  c.fillStyle = '#ffd166'; rr(c, x - 5, y + r * 1.15, 10, 6, 2); c.fill();
}
function stringLights(c, y0, y1, n, lit) {
  c.strokeStyle = '#3a2a1a'; c.lineWidth = 2;
  c.beginPath(); c.moveTo(0, y0); c.quadraticCurveTo(SCENE_W / 2, y1 + 42, SCENE_W, y0); c.stroke();
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const x = t * SCENE_W;
    const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * (y1 + 42) + t * t * y0;
    const colors = ['#ffd166', '#ff6b6b', '#2fd48a', '#5ab8ff'];
    c.fillStyle = lit ? colors[i % colors.length] : '#8a7a5a';
    circ(c, x, y + 4, 6); c.fill();
    if (lit) { c.fillStyle = 'rgba(255,209,102,0.25)'; circ(c, x, y + 4, 11); c.fill(); }
  }
}
function awning(c, x, y, w, colorA, colorB) {
  const stripes = 6, sw = w / stripes;
  for (let i = 0; i < stripes; i++) {
    c.fillStyle = i % 2 === 0 ? colorA : colorB;
    c.fillRect(x + i * sw, y, sw, 26);
  }
  c.fillStyle = colorA;
  for (let i = 0; i < stripes; i++) {
    c.beginPath();
    c.arc(x + i * sw + sw / 2, y + 26, sw / 2, 0, Math.PI);
    c.fill();
  }
}
function crate(c, x, y, w, h, apples) {
  c.fillStyle = '#a8763e'; c.fillRect(x, y, w, h);
  c.fillStyle = '#8a5f2c';
  c.fillRect(x, y, w, 5); c.fillRect(x, y + h - 5, w, 5);
  c.fillStyle = '#c98f4e';
  for (let i = 1; i < 3; i++) c.fillRect(x + (w / 3) * i - 1, y, 2, h);
  const spots = [[0.22, 0.3], [0.5, 0.22], [0.78, 0.32], [0.36, 0.62], [0.64, 0.6]];
  for (let i = 0; i < apples; i++) {
    c.fillStyle = i % 2 === 0 ? '#e8452c' : '#ff8c1a';
    circ(c, x + w * spots[i][0], y + h * spots[i][1], 8); c.fill();
    c.fillStyle = '#2f7d32'; c.fillRect(x + w * spots[i][0] + 2, y + h * spots[i][1] - 11, 2, 5);
  }
}
function bicycle(c, x, y, s, frame) {
  c.strokeStyle = '#3a3a3a'; c.lineWidth = 3 * s;
  circ(c, x, y, 16 * s); c.stroke();
  circ(c, x + 52 * s, y, 16 * s); c.stroke();
  c.strokeStyle = frame; c.lineWidth = 4 * s; c.lineCap = 'round';
  c.beginPath();
  c.moveTo(x, y); c.lineTo(x + 24 * s, y - 18 * s); c.lineTo(x + 52 * s, y);
  c.moveTo(x + 24 * s, y - 18 * s); c.lineTo(x + 14 * s, y - 18 * s);
  c.moveTo(x + 14 * s, y - 18 * s); c.lineTo(x + 6 * s, y - 30 * s);
  c.moveTo(x + 24 * s, y - 18 * s); c.lineTo(x + 44 * s, y - 28 * s);
  c.moveTo(x + 44 * s, y - 28 * s); c.lineTo(x + 52 * s, y);
  c.stroke();
  c.strokeStyle = '#3a3a3a'; c.lineWidth = 3 * s;
  c.beginPath(); c.moveTo(x + 2 * s, y - 30 * s); c.lineTo(x + 12 * s, y - 30 * s); c.stroke();
  c.beginPath(); c.moveTo(x + 40 * s, y - 30 * s); c.lineTo(x + 50 * s, y - 28 * s); c.stroke();
}
function catSit(c, x, y, s, color) {
  c.fillStyle = color;
  ell(c, x, y, 13 * s, 10 * s); c.fill();
  circ(c, x + 2 * s, y - 14 * s, 8 * s); c.fill();
  poly(c, [[x - 3 * s, y - 20 * s], [x - 5 * s, y - 28 * s], [x + 1 * s, y - 22 * s]]); c.fill();
  poly(c, [[x + 5 * s, y - 21 * s], [x + 9 * s, y - 28 * s], [x + 9 * s, y - 19 * s]]); c.fill();
  c.strokeStyle = color; c.lineWidth = 4 * s; c.lineCap = 'round';
  c.beginPath(); c.moveTo(x - 12 * s, y + 2 * s); c.quadraticCurveTo(x - 24 * s, y - 2 * s, x - 20 * s, y - 14 * s); c.stroke();
  c.fillStyle = '#ffd166'; circ(c, x + 5 * s, y - 15 * s, 1.6 * s); c.fill();
}

// ---------- SCENE 1 — Pasar Malam (signature scene) ----------
function drawPasarMalam(c, m) {
  sky(c, '#2b1d4e', '#7a3b6e', '#ff9a52');
  star4(c, 60, 40, 7, '#ffe9a8'); star4(c, 480, 34, 5, '#ffe9a8'); star4(c, 610, 90, 6, '#ffe9a8');
  // moon (diff 6: bigger)
  const moonR = m.has(6) ? 34 : 24;
  c.fillStyle = '#ffe9a8'; circ(c, 566, 62, moonR); c.fill();
  c.fillStyle = '#f2d488'; circ(c, 558, 56, 5); c.fill(); circ(c, 574, 70, 4); c.fill();
  cloud(c, 130, 66, 0.9, 'rgba(255,214,170,0.5)');
  cloud(c, 420, 50, 0.7, 'rgba(255,214,170,0.4)');
  // hanging lanterns (diff 3: middle one gone)
  lantern(c, 250, 96, 15, '#ff5347');
  if (!m.has(3)) lantern(c, 320, 100, 16, '#ff5347');
  lantern(c, 392, 96, 15, '#ff8c1a');
  stringLights(c, 26, 30, 13, true);
  // ground
  c.fillStyle = '#e8c98f'; c.fillRect(0, 316, SCENE_W, 84);
  c.fillStyle = '#d9b878'; c.fillRect(0, 316, SCENE_W, 6);
  // left stall — sate (diff 0: awning red -> teal)
  const awn = m.has(0) ? '#1f9d8a' : '#e8452c';
  c.fillStyle = '#6b4423'; c.fillRect(52, 168, 8, 148); c.fillRect(212, 168, 8, 148);
  awning(c, 40, 138, 192, awn, '#fff6e0');
  c.fillStyle = '#8a5f2c'; c.fillRect(48, 236, 176, 80);
  c.fillStyle = '#fff6e0'; rr(c, 84, 196, 104, 34, 6); fill(c, '#fff6e0');
  c.fillStyle = '#231303'; c.font = 'bold 20px sans-serif'; c.textAlign = 'center';
  c.fillText('SATE', 136, 220);
  c.strokeStyle = '#5a3a1a'; c.lineWidth = 3;
  for (const sx of [70, 100, 130, 160, 190]) {
    c.beginPath(); c.moveTo(sx, 252); c.lineTo(sx, 276); c.stroke();
    c.fillStyle = '#c96a2c'; circ(c, sx, 250, 6); c.fill();
  }
  // right stall — es teh (diff 5 is bicycle; diff 2 is balloon)
  c.fillStyle = '#6b4423'; c.fillRect(420, 168, 8, 148); c.fillRect(580, 168, 8, 148);
  awning(c, 408, 138, 192, '#1f9d8a', '#fff6e0');
  c.fillStyle = '#8a5f2c'; c.fillRect(416, 236, 176, 80);
  c.fillStyle = '#fff6e0'; rr(c, 452, 196, 104, 34, 6); fill(c, '#fff6e0');
  c.fillStyle = '#231303'; c.fillText('ES TEH', 504, 220);
  for (const [cx, col] of [[448, '#ff9a52'], [480, '#7ec850'], [512, '#ff9a52'], [544, '#7ec850']]) {
    c.fillStyle = col; rr(c, cx, 252, 20, 26, 4); c.fill();
    c.fillStyle = '#fff'; c.fillRect(cx + 8, 244, 3, 10);
  }
  // balloons (diff 2: yellow balloon turns blue)
  const balY = m.has(2) ? '#5ab8ff' : '#ffd166';
  const balloons = [[520, 108, '#ff6b9d'], [548, 96, balY], [576, 110, '#5ab8ff']];
  for (const [bx, by, col] of balloons) {
    c.strokeStyle = '#5a3a1a'; c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(bx, by + 16); c.quadraticCurveTo(bx + 6, by + 34, bx - 2, by + 52); c.stroke();
    c.fillStyle = col; ell(c, bx, by, 13, 16); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.4)'; ell(c, bx - 4, by - 5, 3, 6); c.fill();
  }
  // food cart with umbrella, centre
  c.fillStyle = '#7a4a21'; c.fillRect(296, 250, 56, 66);
  c.fillStyle = '#c96a2c'; rr(c, 284, 236, 80, 22, 6); fill(c, '#c96a2c');
  c.fillStyle = '#ffd166'; c.font = 'bold 13px sans-serif'; c.fillText('GORENGAN', 324, 251);
  c.fillStyle = '#e8452c';
  poly(c, [[280, 236], [368, 236], [324, 196]]); c.fill();
  c.fillStyle = '#3a3a3a'; circ(c, 300, 322, 9); c.fill(); circ(c, 348, 322, 9); c.fill();
  // fruit crate (diff 5: apples 5 -> 3)
  crate(c, 150, 296, 76, 26, m.has(5) ? 3 : 5);
  // bicycle (diff 4: moved right)
  bicycle(c, m.has(4) ? 470 : 400, 352, 0.9, '#1f9d8a');
  // cat (diff 1: gone)
  if (!m.has(1)) catSit(c, 96, 348, 1, '#22222e');
  // little flags along the ground line
  for (let i = 0; i < 9; i++) {
    c.fillStyle = ['#ffd166', '#ff6b6b', '#2fd48a'][i % 3];
    poly(c, [[40 + i * 68, 316], [52 + i * 68, 316], [46 + i * 68, 330]]); c.fill();
  }
}

// ---------- SCENE 2 — Pelabuhan Fajar ----------
function drawPelabuhan(c, m) {
  sky(c, '#ffb26b', '#ffd9a0', '#ffe9c4');
  const sunR = m.has(5) ? 40 : 30;
  c.fillStyle = '#ffdf6b'; circ(c, 566, 66, sunR); c.fill();
  c.fillStyle = 'rgba(255,223,107,0.35)'; circ(c, 566, 66, sunR + 12); c.fill();
  cloud(c, 150, 60, 1, 'rgba(255,255,255,0.9)');
  cloud(c, 400, 44, 0.8, 'rgba(255,255,255,0.85)');
  gull(c, 210, 84, 1, '#4a3a2a');
  if (!m.has(2)) gull(c, 260, 62, 0.9, '#4a3a2a');
  gull(c, 330, 96, 1, '#4a3a2a');
  // lighthouse (diff 0: top band red -> yellow)
  const band = m.has(0) ? '#ffd166' : '#e8452c';
  c.fillStyle = '#f7efdd';
  poly(c, [[52, 268], [92, 268], [86, 132], [58, 132]]); c.fill();
  c.strokeStyle = '#8a7a5a'; c.lineWidth = 2; c.stroke();
  c.fillStyle = band; c.fillRect(55, 168, 34, 26); c.fillRect(57, 224, 30, 22);
  c.fillStyle = '#231303'; c.fillRect(56, 120, 32, 14);
  c.fillStyle = '#ffd166'; circ(c, 72, 127, 7); c.fill();
  // sea + sand
  c.fillStyle = '#2a7fa8'; c.fillRect(0, 268, SCENE_W, 62);
  c.fillStyle = '#3a97bd';
  for (const wy of [282, 300, 318]) {
    c.beginPath();
    for (let x = 0; x <= SCENE_W; x += 16) {
      const y = wy + Math.sin((x + wy) * 0.09) * 3;
      if (x === 0) c.moveTo(x, y); else c.lineTo(x, y);
    }
    c.lineWidth = 2.5; c.strokeStyle = 'rgba(255,255,255,0.5)'; c.stroke();
  }
  c.fillStyle = '#e8c98f'; c.fillRect(0, 330, SCENE_W, 70);
  // sailboat (diff 1: sail white -> yellow)
  const sail = m.has(1) ? '#ffd166' : '#fff6e0';
  c.fillStyle = '#8a4a2a';
  poly(c, [[262, 296], [392, 296], [376, 316], [278, 316]]); c.fill();
  c.fillStyle = '#5a3a1a'; c.fillRect(322, 196, 5, 100);
  c.fillStyle = sail;
  poly(c, [[330, 200], [330, 292], [392, 292]]); c.fill();
  c.strokeStyle = '#7a6a4a'; c.lineWidth = 1.5; c.stroke();
  c.fillStyle = '#ff8c6b';
  poly(c, [[320, 214], [320, 292], [272, 292]]); c.fill();
  c.stroke();
  // rowboat
  c.fillStyle = '#1f9d8a';
  poly(c, [[452, 300], [540, 300], [528, 316], [464, 316]]); c.fill();
  c.fillStyle = '#5a3a1a'; c.fillRect(492, 288, 4, 14);
  // pier + crate (diff 6: crate moved)
  c.fillStyle = '#6b4423'; c.fillRect(120, 330, 150, 10);
  c.fillStyle = '#7a4a21';
  for (const px of [132, 172, 212, 252]) c.fillRect(px, 340, 8, 34);
  c.fillStyle = '#a8763e'; c.fillRect(m.has(6) ? 210 : 140, 300, 34, 30);
  c.fillStyle = '#8a5f2c'; c.fillRect(m.has(6) ? 210 : 140, 313, 34, 3);
  // buoy (diff 3: added)
  if (m.has(3)) {
    c.fillStyle = '#ff6b1a'; ell(c, 480, 296, 13, 10); c.fill();
    c.fillStyle = '#fff'; c.fillRect(470, 290, 20, 5);
    c.fillStyle = '#231303'; c.fillRect(477, 282, 5, 8);
  }
  // jumping fish (diff 4: blue -> red)
  c.fillStyle = m.has(4) ? '#e8452c' : '#5ab8ff';
  ell(c, 380, 306, 14, 7); c.fill();
  poly(c, [[392, 306], [402, 300], [402, 312]]); c.fill();
  c.fillStyle = '#fff'; circ(c, 374, 304, 2); c.fill();
  // shells on the sand
  c.fillStyle = '#fff6e0'; circ(c, 90, 372, 6); c.fill();
  c.fillStyle = '#ffb6c1'; circ(c, 590, 366, 6); c.fill();
  c.fillStyle = '#ff8c6b'; circ(c, 540, 382, 5); c.fill();
}

// ---------- SCENE 3 — Taman Pagi ----------
function drawTaman(c, m) {
  sky(c, '#7ec8f7', '#bfe8ff', '#e8f7d8');
  c.fillStyle = '#ffdf6b'; circ(c, 88, 62, 26); c.fill();
  c.fillStyle = 'rgba(255,223,107,0.4)'; circ(c, 88, 62, 36); c.fill();
  cloud(c, 250, 58, 1, '#ffffff');
  cloud(c, 500, 48, 0.8, '#ffffff');
  if (m.has(6)) cloud(c, 360, 92, 0.7, '#ffffff');
  // hills + grass
  c.fillStyle = '#8fce62'; c.fillRect(0, 250, SCENE_W, 150);
  c.fillStyle = '#7cbf52';
  ell(c, 120, 268, 190, 34); c.fill();
  ell(c, 540, 262, 170, 30); c.fill();
  // big tree (diff 4: canopy smaller)
  const canR = m.has(4) ? 46 : 62;
  c.fillStyle = '#6b4423'; c.fillRect(96, 150, 16, 116);
  c.fillStyle = '#3f9e4d';
  circ(c, 104, 118, canR); c.fill();
  circ(c, 66, 140, canR * 0.7); c.fill();
  circ(c, 142, 140, canR * 0.7); c.fill();
  c.fillStyle = '#2f7d32';
  circ(c, 88, 104, 9); c.fill(); circ(c, 126, 112, 8); c.fill(); circ(c, 104, 132, 7); c.fill();
  // kite (diff 0: red -> purple)
  const kiteCol = m.has(0) ? '#9b59d0' : '#e8452c';
  c.strokeStyle = '#5a3a1a'; c.lineWidth = 1.5;
  c.beginPath(); c.moveTo(452, 116); c.lineTo(430, 250); c.stroke();
  c.fillStyle = kiteCol;
  poly(c, [[452, 78], [486, 112], [452, 146], [418, 112]]); c.fill();
  c.fillStyle = '#ffd166';
  poly(c, [[452, 146], [462, 168], [452, 186], [442, 168]]); c.fill();
  // picnic blanket + basket (diff 3: basket moved)
  c.fillStyle = '#ff6b6b';
  poly(c, [[250, 300], [380, 300], [396, 356], [234, 356]]); c.fill();
  c.fillStyle = '#fff6e0';
  for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) {
    c.fillRect(262 + i * 32, 308 + j * 24, 16, 12);
  }
  const bx = m.has(3) ? 400 : 300, by = m.has(3) ? 318 : 312;
  c.fillStyle = '#a8763e'; rr(c, bx, by, 44, 26, 5); fill(c, '#a8763e');
  c.strokeStyle = '#6b4423'; c.lineWidth = 3;
  c.beginPath(); c.arc(bx + 22, by + 2, 12, Math.PI, 0); c.stroke();
  // bench (diff 5: brown -> blue)
  c.fillStyle = m.has(5) ? '#3a7bd5' : '#8a5f2c';
  c.fillRect(500, 262, 96, 10); c.fillRect(500, 286, 96, 8);
  c.fillRect(508, 294, 8, 34); c.fillRect(580, 294, 8, 34);
  // dog (diff 1: gone)
  if (!m.has(1)) {
    c.fillStyle = '#c98f4e';
    ell(c, 508, 344, 20, 12); c.fill();
    circ(c, 528, 330, 10); c.fill();
    poly(c, [[522, 322], [524, 312], [530, 320]]); c.fill();
    c.fillStyle = '#8a5f2c'; ell(c, 488, 340, 8, 5); c.fill();
    c.strokeStyle = '#c98f4e'; c.lineWidth = 4;
    c.beginPath(); c.moveTo(490, 344); c.quadraticCurveTo(478, 340, 480, 330); c.stroke();
  }
  // flowers (diff 2: one extra)
  const flowers = [[60, 372, '#ff6b9d'], [150, 366, '#ffd166'], [210, 376, '#fff'], [560, 372, '#ff6b9d'], [610, 360, '#ffd166']];
  if (m.has(2)) flowers.push([330, 378, '#ff6b9d']);
  for (const [fx, fy, col] of flowers) {
    c.strokeStyle = '#2f7d32'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(fx, fy); c.lineTo(fx, fy - 12); c.stroke();
    c.fillStyle = col;
    for (let p = 0; p < 5; p++) {
      const a = (p / 5) * Math.PI * 2;
      circ(c, fx + Math.cos(a) * 5, fy - 14 + Math.sin(a) * 5, 4); c.fill();
    }
    c.fillStyle = '#ff8c1a'; circ(c, fx, fy - 14, 3.5); c.fill();
  }
  // butterfly
  c.fillStyle = '#9b59d0';
  ell(c, 232, 208, 8, 5); c.fill(); ell(c, 244, 208, 8, 5); c.fill();
}

// ---------- SCENE 4 — Perpustakaan Senja ----------
function drawPerpustakaan(c, m) {
  c.fillStyle = '#3a2a4a'; c.fillRect(0, 0, SCENE_W, SCENE_H);
  // window with dusk sky (diff 5: moon bigger)
  c.fillStyle = '#1c1430'; rr(c, 268, 30, 130, 150, 10); fill(c, '#1c1430');
  c.fillStyle = '#ff9a52'; rr(c, 276, 38, 114, 134, 6); fill(c, '#ff9a52');
  const wmR = m.has(5) ? 22 : 14;
  c.fillStyle = '#ffe9a8'; circ(c, 348, 74, wmR); c.fill();
  c.fillStyle = '#2b1d4e';
  poly(c, [[276, 172], [330, 110], [390, 172]]); c.fill();
  c.fillStyle = '#1c1430'; c.fillRect(330, 38, 6, 134); c.fillRect(276, 100, 114, 6);
  // bookshelves
  for (const sx of [24, 452]) {
    c.fillStyle = '#6b4423'; c.fillRect(sx, 40, 164, 250);
    c.fillStyle = '#8a5f2c';
    for (const sy of [40, 112, 184, 256]) c.fillRect(sx, sy + 66, 164, 6);
    const cols = ['#e8452c', '#ffd166', '#2fd48a', '#5ab8ff', '#9b59d0', '#ff8c6b'];
    for (let row = 0; row < 3; row++) {
      for (let i = 0; i < 7; i++) {
        let col = cols[(i + row * 2) % cols.length];
        if (sx === 24 && row === 1 && i === 3) col = m.has(0) ? '#2fd48a' : '#e8452c';
        c.fillStyle = col;
        c.fillRect(sx + 10 + i * 22, 52 + row * 72, 16, 52);
      }
    }
  }
  // floor + rug (diff 6: rug stripes change colour)
  c.fillStyle = '#7a5a3a'; c.fillRect(0, 290, SCENE_W, 110);
  c.fillStyle = '#c94f43'; rr(c, 200, 306, 260, 76, 10); fill(c, '#c94f43');
  c.fillStyle = m.has(6) ? '#ffd166' : '#ffe9a8';
  c.fillRect(214, 322, 232, 8); c.fillRect(214, 356, 232, 8);
  // armchair
  c.fillStyle = '#1f9d8a'; rr(c, 470, 250, 120, 90, 12); fill(c, '#1f9d8a');
  c.fillStyle = '#17806f'; rr(c, 482, 236, 96, 44, 10); fill(c, '#17806f');
  // lamp (diff 1: glow bigger / shade warmer)
  c.fillStyle = '#3a3a3a'; c.fillRect(586, 210, 6, 92);
  c.fillStyle = m.has(1) ? '#ffdf6b' : '#e8a33d';
  poly(c, [[566, 212], [612, 212], [600, 176], [578, 176]]); c.fill();
  if (m.has(1)) { c.fillStyle = 'rgba(255,223,107,0.3)'; circ(c, 589, 196, 34); c.fill(); }
  // side table + teacup (diff 4: cup moved)
  c.fillStyle = '#5a3a1a'; c.fillRect(420, 268, 56, 8); c.fillRect(444, 276, 8, 40);
  const cupX = m.has(4) ? 470 : 432;
  c.fillStyle = '#fff6e0'; rr(c, cupX, 250, 22, 16, 4); fill(c, '#fff6e0');
  c.strokeStyle = '#fff6e0'; c.lineWidth = 3;
  c.beginPath(); c.arc(cupX + 24, 258, 6, -Math.PI / 2, Math.PI / 2); c.stroke();
  // plant (diff 3: gone)
  if (!m.has(3)) {
    c.fillStyle = '#c94f43'; poly(c, [[52, 330], [84, 330], [78, 362], [58, 362]]); c.fill();
    c.fillStyle = '#2f7d32';
    ell(c, 68, 312, 8, 20); c.fill(); ell(c, 56, 318, 6, 14); c.fill(); ell(c, 80, 318, 6, 14); c.fill();
  }
  // sleeping cat on the rug (diff 2: gone)
  if (!m.has(2)) {
    c.fillStyle = '#ff8c42';
    ell(c, 316, 344, 26, 12); c.fill();
    circ(c, 340, 340, 10); c.fill();
    poly(c, [[334, 332], [336, 324], [341, 331]]); c.fill();
    poly(c, [[344, 331], [349, 324], [350, 332]]); c.fill();
    c.strokeStyle = '#ff8c42'; c.lineWidth = 4; c.lineCap = 'round';
    c.beginPath(); c.moveTo(292, 344); c.quadraticCurveTo(276, 348, 280, 336); c.stroke();
  }
  // hanging bulb
  c.strokeStyle = '#d9c9a8'; c.lineWidth = 2;
  c.beginPath(); c.moveTo(140, 0); c.lineTo(140, 34); c.stroke();
  c.fillStyle = '#ffd166'; circ(c, 140, 44, 9); c.fill();
  c.fillStyle = 'rgba(255,209,102,0.25)'; circ(c, 140, 44, 18); c.fill();
}

// ---------- scene catalogue ----------
export const SCENES = [
  {
    id: 'pasar-malam',
    name: 'Pasar Malam',
    sub: 'Scene 1 dari 4 · Par 2:30 · lampion, sate & es teh',
    draw: drawPasarMalam,
    diffs: [
      { name: 'Warna tenda lapak sate', x: 136, y: 152, r: 30, kind: 'diwarnai ulang' },
      { name: 'Kucing hitam hilang', x: 96, y: 344, r: 28, kind: 'dihapus' },
      { name: 'Balon kuning jadi biru', x: 548, y: 96, r: 26, kind: 'diwarnai ulang' },
      { name: 'Lampion tengah hilang', x: 320, y: 100, r: 26, kind: 'dihapus' },
      { name: 'Sepeda pindah tempat', x: 426, y: 348, r: 30, kind: 'dipindah' },
      { name: 'Jumlah apel berkurang', x: 188, y: 308, r: 28, kind: 'dihapus' },
      { name: 'Bulan membesar', x: 566, y: 62, r: 30, kind: 'diperbesar' },
    ],
  },
  {
    id: 'pelabuhan-fajar',
    name: 'Pelabuhan Fajar',
    sub: 'Scene 2 dari 4 · Par 2:30 · mercusuar, perahu & camar',
    draw: drawPelabuhan,
    diffs: [
      { name: 'Garis mercusuar jadi kuning', x: 72, y: 181, r: 28, kind: 'diwarnai ulang' },
      { name: 'Layar perahu jadi kuning', x: 356, y: 246, r: 30, kind: 'diwarnai ulang' },
      { name: 'Burung camar hilang', x: 260, y: 62, r: 26, kind: 'dihapus' },
      { name: 'Pelampung oranye muncul', x: 480, y: 294, r: 28, kind: 'ditambah' },
      { name: 'Ikan jadi merah', x: 382, y: 306, r: 26, kind: 'diwarnai ulang' },
      { name: 'Matahari membesar', x: 566, y: 66, r: 30, kind: 'diperbesar' },
      { name: 'Peti kayu pindah tempat', x: 157, y: 315, r: 28, kind: 'dipindah' },
    ],
  },
  {
    id: 'taman-pagi',
    name: 'Taman Pagi',
    sub: 'Scene 3 dari 4 · Par 2:30 · piknik, layang-layang & anjing',
    draw: drawTaman,
    diffs: [
      { name: 'Layang-layang jadi ungu', x: 452, y: 112, r: 30, kind: 'diwarnai ulang' },
      { name: 'Anjing hilang', x: 508, y: 340, r: 28, kind: 'dihapus' },
      { name: 'Bunga merah bertambah', x: 330, y: 372, r: 26, kind: 'ditambah' },
      { name: 'Keranjang piknik pindah', x: 322, y: 324, r: 28, kind: 'dipindah' },
      { name: 'Tajuk pohon mengecil', x: 104, y: 118, r: 32, kind: 'diperkecil' },
      { name: 'Bangku jadi biru', x: 548, y: 274, r: 28, kind: 'diwarnai ulang' },
      { name: 'Awan tambahan muncul', x: 360, y: 92, r: 26, kind: 'ditambah' },
    ],
  },
  {
    id: 'perpustakaan-senja',
    name: 'Perpustakaan Senja',
    sub: 'Scene 4 dari 4 · Par 2:30 · rak buku, lampu & kucing tidur',
    draw: drawPerpustakaan,
    diffs: [
      { name: 'Buku merah jadi hijau', x: 108, y: 150, r: 26, kind: 'diwarnai ulang' },
      { name: 'Lampu menyala lebih terang', x: 589, y: 194, r: 28, kind: 'diwarnai ulang' },
      { name: 'Kucing tidur hilang', x: 316, y: 344, r: 28, kind: 'dihapus' },
      { name: 'Tanaman hilang', x: 68, y: 330, r: 26, kind: 'dihapus' },
      { name: 'Cangkir teh pindah tempat', x: 443, y: 258, r: 26, kind: 'dipindah' },
      { name: 'Bulan di jendela membesar', x: 348, y: 74, r: 28, kind: 'diperbesar' },
      { name: 'Karpet berubah pola', x: 330, y: 339, r: 30, kind: 'diwarnai ulang' },
    ],
  },
];

// Render one scene into a canvas: `applied` is a Set of diff indexes that are
// turned ON (right panel uses all 7, left panel uses none).
export function renderScene(canvas, scene, applied) {
  const c = canvas.getContext('2d');
  c.clearRect(0, 0, SCENE_W, SCENE_H);
  scene.draw(c, applied);
}
