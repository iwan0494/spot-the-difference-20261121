// scenes.js — 5 scene JARANG, 8 perbedaan BESAR tiap scene. Semua art digambar dari kode.
// Tiap scene: sedikit benda BESAR + banyak ruang kosong, supaya di contact sheet tetap jernih.
export const W = 620;
export const H = 500;

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();
}
function txt(ctx, s, x, y, font, color, align) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align || 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(s, x, y);
}
function sky(ctx, c1, c2) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}
function ground(ctx, y, c) {
  ctx.fillStyle = c;
  ctx.fillRect(0, y, W, H - y);
}
function star(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    ctx.lineTo(x + Math.cos(a + 0.5) * r * 0.35, y + Math.sin(a + 0.5) * r * 0.35);
  }
  ctx.closePath();
  ctx.fill();
}
function lantern(ctx, x, y, color) {
  // lampion besar: badan oval + tutup emas + rumbai
  ctx.fillStyle = '#f5b942';
  ctx.fillRect(x - 12, y - 26, 24, 8);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, 20, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(x, y, 20, 26, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x - 20, y);
  ctx.lineTo(x + 20, y);
  ctx.stroke();
  ctx.fillStyle = '#f5b942';
  ctx.fillRect(x - 3, y + 24, 6, 12);
}

// ---------------------------------------------------------------- scene 1: Pasar Malam
function drawPasar(ctx, changed) {
  sky(ctx, '#2a1a4e', '#5b2a6e');
  // bintang-bintang kecil
  for (const [x, y] of [[40, 40], [150, 30], [260, 46], [380, 30], [470, 44], [590, 36], [90, 90], [570, 130]]) {
    star(ctx, x, y, 5, '#ffe9a8');
  }
  // bulan besar (diff 6: membesar)
  const moonR = changed ? 64 : 46;
  circle(ctx, 520, 92, moonR);
  ctx.fillStyle = '#ffe9a8';
  ctx.fill();
  circle(ctx, 505, 80, moonR * 0.22);
  ctx.fillStyle = '#f2d488';
  ctx.fill();
  circle(ctx, 535, 105, moonR * 0.16);
  ctx.fill();
  // tali lampion + 4 lampion besar (diff 4: lampion tengah hilang)
  ctx.strokeStyle = '#1c1038';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(20, 52);
  ctx.quadraticCurveTo(310, 86, 600, 52);
  ctx.stroke();
  lantern(ctx, 90, 66, '#ff5a4e');
  lantern(ctx, 210, 76, '#ffb347');
  if (!changed) lantern(ctx, 330, 78, '#ff5a4e');
  lantern(ctx, 450, 70, '#ff8fb3');
  // tanah
  ground(ctx, 420, '#3d2b1f');
  ctx.fillStyle = '#54402a';
  ctx.fillRect(0, 420, W, 6);
  // lapak SATE kiri (diff 2: tenda merah -> teal)
  const awn = changed ? '#1fa8a0' : '#e8443a';
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = i % 2 === 0 ? awn : '#fff6e8';
    ctx.fillRect(40 + i * 52, 190, 52, 34);
  }
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(48, 224, 192, 130);
  ctx.fillStyle = '#5d3c22';
  ctx.fillRect(48, 224, 192, 10);
  rr(ctx, 92, 244, 104, 40, 8);
  ctx.fillStyle = '#fff6e8';
  ctx.fill();
  txt(ctx, 'SATE', 144, 265, 'bold 26px system-ui, sans-serif', '#3a2410');
  // 3 tusuk sate di konter
  ctx.strokeStyle = '#3a2410';
  ctx.lineWidth = 4;
  for (const x of [80, 110, 200]) {
    ctx.beginPath();
    ctx.moveTo(x, 300);
    ctx.lineTo(x, 340);
    ctx.stroke();
  }
  ctx.fillStyle = '#ffb347';
  for (const x of [80, 110, 200]) {
    circle(ctx, x, 296, 7);
    ctx.fill();
  }
  // gerobak GORENGAN tengah (diff 5: pindah kanan 46px)
  const cartX = changed ? 316 : 270;
  ctx.fillStyle = '#c0392b';
  ctx.beginPath();
  ctx.moveTo(cartX, 300);
  ctx.lineTo(cartX + 40, 262);
  ctx.lineTo(cartX + 80, 300);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(cartX + 4, 300, 72, 62);
  rr(ctx, cartX + 14, 312, 52, 26, 5);
  ctx.fillStyle = '#fff6e8';
  ctx.fill();
  txt(ctx, 'GORENGAN', cartX + 40, 325, 'bold 11px system-ui, sans-serif', '#3a2410');
  ctx.fillStyle = '#2c2c34';
  circle(ctx, cartX + 18, 368, 11);
  ctx.fill();
  circle(ctx, cartX + 62, 368, 11);
  ctx.fill();
  // lapak ES TEH kanan
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#1fa8a0' : '#fff6e8';
    ctx.fillRect(390 + i * 52, 190, 52, 34);
  }
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(398, 224, 192, 130);
  ctx.fillStyle = '#5d3c22';
  ctx.fillRect(398, 224, 192, 10);
  rr(ctx, 442, 244, 104, 40, 8);
  ctx.fillStyle = '#fff6e8';
  ctx.fill();
  txt(ctx, 'ES TEH', 494, 265, 'bold 24px system-ui, sans-serif', '#3a2410');
  // gelas di konter (diff 7: 4 -> 5 gelas)
  const cups = ['#ff9f43', '#7ed957', '#ff9f43', '#7ed957', '#ff9f43'];
  const nCups = changed ? 5 : 4;
  for (let i = 0; i < nCups; i++) {
    const x = 424 + i * 34;
    ctx.fillStyle = cups[i];
    rr(ctx, x, 306, 24, 34, 4);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.fillRect(x + 3, 309, 5, 28);
  }
  // kucing hitam (diff 1: hilang)
  if (!changed) {
    ctx.fillStyle = '#15151c';
    ctx.beginPath();
    ctx.ellipse(92, 428, 26, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    circle(ctx, 112, 404, 13);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(104, 394);
    ctx.lineTo(108, 380);
    ctx.lineTo(114, 394);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(116, 394);
    ctx.lineTo(121, 380);
    ctx.lineTo(125, 395);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(70, 420);
    ctx.quadraticCurveTo(52, 400, 62, 384);
    ctx.quadraticCurveTo(66, 402, 76, 414);
    ctx.closePath();
    ctx.fill();
  }
  // sepeda (diff 8: pindah kiri 64px)
  const bikeX = changed ? 386 : 450;
  ctx.strokeStyle = '#2ec4b6';
  ctx.lineWidth = 5;
  circle(ctx, bikeX, 448, 20);
  ctx.stroke();
  circle(ctx, bikeX + 64, 448, 20);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(bikeX, 448);
  ctx.lineTo(bikeX + 26, 414);
  ctx.lineTo(bikeX + 52, 414);
  ctx.lineTo(bikeX + 64, 448);
  ctx.moveTo(bikeX + 26, 414);
  ctx.lineTo(bikeX + 14, 448);
  ctx.moveTo(bikeX + 52, 414);
  ctx.lineTo(bikeX + 44, 448);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(bikeX + 24, 410);
  ctx.lineTo(bikeX + 40, 410);
  ctx.stroke();
  // balon (diff 3: balon kuning -> biru)
  const balY = changed ? '#4aa8ff' : '#ffd23f';
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(548, 150);
  ctx.lineTo(548, 190);
  ctx.stroke();
  ctx.fillStyle = '#ff8fb3';
  ctx.beginPath();
  ctx.ellipse(528, 128, 16, 20, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = balY;
  ctx.beginPath();
  ctx.ellipse(552, 122, 16, 20, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#4aa8ff';
  ctx.beginPath();
  ctx.ellipse(574, 132, 15, 19, 0.3, 0, Math.PI * 2);
  ctx.fill();
}

// ---------------------------------------------------------------- scene 2: Pelabuhan Fajar
function drawPelabuhan(ctx, changed) {
  sky(ctx, '#ffd9a0', '#ffb37a');
  // matahari (diff 5: membesar)
  const sunR = changed ? 68 : 50;
  circle(ctx, 520, 92, sunR);
  ctx.fillStyle = '#ffdf6b';
  ctx.fill();
  ctx.fillStyle = 'rgba(255,223,107,0.35)';
  circle(ctx, 520, 92, sunR + 18);
  ctx.fill();
  // awan (diff 7: awan kanan hilang)
  ctx.fillStyle = '#fff6e8';
  ctx.beginPath();
  ctx.ellipse(150, 74, 52, 22, 0, 0, Math.PI * 2);
  ctx.ellipse(178, 62, 36, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  if (!changed) {
    ctx.beginPath();
    ctx.ellipse(400, 62, 48, 20, 0, 0, Math.PI * 2);
    ctx.ellipse(426, 52, 32, 16, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // camar (diff 3: camar tengah hilang)
  ctx.strokeStyle = '#5a4632';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  for (const [x, y] of [[196, 108], [330, 118]]) {
    ctx.beginPath();
    ctx.moveTo(x - 12, y);
    ctx.quadraticCurveTo(x - 4, y - 8, x, y);
    ctx.quadraticCurveTo(x + 4, y - 8, x + 12, y);
    ctx.stroke();
  }
  if (!changed) {
    ctx.beginPath();
    ctx.moveTo(248, 88);
    ctx.quadraticCurveTo(256, 80, 260, 88);
    ctx.quadraticCurveTo(264, 80, 272, 88);
    ctx.stroke();
  }
  // laut + pasir
  ctx.fillStyle = '#2f7fc4';
  ctx.fillRect(0, 300, W, 140);
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 3;
  for (const y of [322, 348, 376, 402]) {
    ctx.beginPath();
    for (let x = 0; x <= W; x += 40) ctx.quadraticCurveTo(x + 20, y + 6, x + 40, y);
    ctx.stroke();
  }
  ground(ctx, 440, '#e8d5a3');
  // mercusuar (diff 1: garis merah -> kuning)
  const stripe = changed ? '#ffd23f' : '#e8443a';
  ctx.fillStyle = '#fff6e8';
  ctx.fillRect(72, 150, 66, 180);
  ctx.fillStyle = stripe;
  ctx.fillRect(72, 190, 66, 34);
  ctx.fillRect(72, 262, 66, 34);
  ctx.fillStyle = '#2c2c34';
  ctx.fillRect(64, 132, 82, 20);
  ctx.fillStyle = '#ffd23f';
  ctx.fillRect(88, 108, 34, 26);
  ctx.fillStyle = '#2c2c34';
  ctx.beginPath();
  ctx.moveTo(80, 108);
  ctx.lineTo(105, 88);
  ctx.lineTo(130, 108);
  ctx.closePath();
  ctx.fill();
  // dermaga + peti (diff 6: peti pindah ke ujung kanan dermaga)
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(60, 392, 150, 12);
  for (const x of [76, 116, 156, 190]) ctx.fillRect(x, 404, 8, 34);
  const crateX = changed ? 176 : 78;
  ctx.fillStyle = '#b07a3e';
  ctx.fillRect(crateX, 360, 32, 32);
  ctx.strokeStyle = '#7a5230';
  ctx.lineWidth = 3;
  ctx.strokeRect(crateX, 360, 32, 32);
  ctx.beginPath();
  ctx.moveTo(crateX, 360);
  ctx.lineTo(crateX + 32, 392);
  ctx.moveTo(crateX + 32, 360);
  ctx.lineTo(crateX, 392);
  ctx.stroke();
  // perahu layar (diff 2: layar putih -> kuning)
  ctx.fillStyle = '#7a3b1e';
  ctx.beginPath();
  ctx.moveTo(272, 330);
  ctx.lineTo(428, 330);
  ctx.lineTo(404, 362);
  ctx.lineTo(296, 362);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#5d2c14';
  ctx.fillRect(272, 330, 156, 8);
  ctx.strokeStyle = '#5d2c14';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(350, 330);
  ctx.lineTo(350, 196);
  ctx.stroke();
  ctx.fillStyle = changed ? '#ffd23f' : '#fff6e8';
  ctx.beginPath();
  ctx.moveTo(350, 204);
  ctx.lineTo(350, 322);
  ctx.lineTo(416, 322);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ff9f43';
  ctx.beginPath();
  ctx.moveTo(350, 208);
  ctx.lineTo(350, 322);
  ctx.lineTo(300, 322);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e8443a';
  ctx.beginPath();
  ctx.moveTo(350, 196);
  ctx.lineTo(378, 204);
  ctx.lineTo(350, 212);
  ctx.closePath();
  ctx.fill();
  // ikan (diff 8: biru -> oranye)
  ctx.fillStyle = changed ? '#ff7b2f' : '#4aa8ff';
  ctx.beginPath();
  ctx.ellipse(360, 392, 20, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(378, 392);
  ctx.lineTo(394, 382);
  ctx.lineTo(394, 402);
  ctx.closePath();
  ctx.fill();
  // pelampung (diff 4: hilang)
  if (!changed) {
    ctx.fillStyle = '#ff7b2f';
    circle(ctx, 492, 342, 16);
    ctx.fill();
    ctx.fillStyle = '#fff6e8';
    ctx.fillRect(476, 336, 32, 12);
    ctx.fillStyle = '#2c2c34';
    ctx.fillRect(490, 326, 4, 8);
  }
}

// ---------------------------------------------------------------- scene 3: Taman Pagi
function drawTaman(ctx, changed) {
  sky(ctx, '#aee6ff', '#d8f3ff');
  // matahari (diff 6: membesar)
  const sunR = changed ? 58 : 40;
  circle(ctx, 530, 76, sunR);
  ctx.fillStyle = '#ffdf6b';
  ctx.fill();
  // burung (diff 8: burung kedua bertambah)
  ctx.strokeStyle = '#5a4632';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(238, 66);
  ctx.quadraticCurveTo(246, 58, 250, 66);
  ctx.quadraticCurveTo(254, 58, 262, 66);
  ctx.stroke();
  if (changed) {
    ctx.beginPath();
    ctx.moveTo(308, 58);
    ctx.quadraticCurveTo(316, 50, 320, 58);
    ctx.quadraticCurveTo(324, 50, 332, 58);
    ctx.stroke();
  }
  // layang-layang (diff 1: hilang)
  if (!changed) {
    ctx.fillStyle = '#e8443a';
    ctx.beginPath();
    ctx.moveTo(420, 84);
    ctx.lineTo(452, 116);
    ctx.lineTo(420, 148);
    ctx.lineTo(388, 116);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffd23f';
    ctx.beginPath();
    ctx.moveTo(420, 84);
    ctx.lineTo(452, 116);
    ctx.lineTo(420, 116);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#5a4632';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(420, 148);
    ctx.quadraticCurveTo(410, 180, 424, 204);
    ctx.stroke();
    ctx.fillStyle = '#ff8fb3';
    circle(ctx, 424, 204, 6);
    ctx.fill();
  }
  // rumput
  ground(ctx, 330, '#7ed957');
  ctx.fillStyle = '#6cc24a';
  ctx.fillRect(0, 330, W, 8);
  // pohon besar kiri (diff 4: apel hilang)
  ctx.fillStyle = '#7a5230';
  ctx.beginPath();
  ctx.moveTo(96, 330);
  ctx.lineTo(116, 330);
  ctx.lineTo(110, 220);
  ctx.lineTo(102, 220);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#3fae4a';
  circle(ctx, 106, 168, 92);
  ctx.fill();
  circle(ctx, 48, 200, 52);
  ctx.fill();
  circle(ctx, 168, 200, 52);
  ctx.fill();
  if (!changed) {
    ctx.fillStyle = '#e8443a';
    for (const [x, y] of [[76, 150], [128, 132], [152, 178]]) {
      circle(ctx, x, y, 10);
      ctx.fill();
    }
  }
  // selimut piknik (diff 3: merah -> biru)
  const cA = changed ? '#4aa8ff' : '#e8443a';
  const cB = '#fff6e8';
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 5; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? cA : cB;
      ctx.fillRect(238 + c * 30, 392 + r * 20, 30, 20);
    }
  }
  ctx.strokeStyle = '#5a4632';
  ctx.lineWidth = 3;
  ctx.strokeRect(238, 392, 150, 60);
  // keranjang
  ctx.fillStyle = '#b07a3e';
  rr(ctx, 396, 408, 52, 34, 6);
  ctx.fill();
  ctx.strokeStyle = '#7a5230';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(422, 408, 20, Math.PI, 0);
  ctx.stroke();
  // anjing (diff 2: pindah kanan 80px)
  const dogX = changed ? 380 : 300;
  ctx.fillStyle = '#b07a3e';
  ctx.beginPath();
  ctx.ellipse(dogX, 462, 30, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  circle(ctx, dogX + 30, 448, 13);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(dogX + 24, 438);
  ctx.lineTo(dogX + 28, 426);
  ctx.lineTo(dogX + 34, 438);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#7a5230';
  ctx.beginPath();
  ctx.ellipse(dogX - 28, 462, 12, 7, -0.5, 0, Math.PI * 2);
  ctx.fill();
  // bunga (diff 5: bunga tengah hilang)
  const flowers = [[64, 452, '#ff8fb3'], [104, 462, '#ffd23f'], [146, 452, '#ff8fb3']];
  flowers.forEach(([x, y, col], i) => {
    if (changed && i === 1) return;
    ctx.strokeStyle = '#3fae4a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + 22);
    ctx.stroke();
    ctx.fillStyle = col;
    for (let p = 0; p < 5; p++) {
      const a = (p / 5) * Math.PI * 2;
      circle(ctx, x + Math.cos(a) * 9, y + Math.sin(a) * 9, 7);
      ctx.fill();
    }
    ctx.fillStyle = '#ff9f43';
    circle(ctx, x, y, 6);
    ctx.fill();
  });
  // bangku (diff 7: hilang)
  if (!changed) {
    ctx.fillStyle = '#8a5a2b';
    ctx.fillRect(478, 372, 112, 14);
    ctx.fillRect(478, 344, 112, 12);
    ctx.fillRect(486, 386, 10, 40);
    ctx.fillRect(572, 386, 10, 40);
    ctx.fillRect(486, 356, 8, 18);
    ctx.fillRect(574, 356, 8, 18);
  }
}

// ---------------------------------------------------------------- scene 4: Perpustakaan Senja
function drawPerpustakaan(ctx, changed) {
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#7d5a3a';
  ctx.fillRect(0, 0, W, 10);
  // jendela + bulan (diff 4: bulan hilang)
  ctx.fillStyle = '#1c1038';
  rr(ctx, 396, 56, 184, 190, 10);
  ctx.fill();
  ctx.fillStyle = '#2a1a4e';
  rr(ctx, 404, 64, 168, 174, 8);
  ctx.fill();
  if (!changed) {
    circle(ctx, 488, 128, 34);
    ctx.fillStyle = '#ffe9a8';
    ctx.fill();
  }
  for (const [x, y] of [[430, 96], [540, 88], [520, 180]]) star(ctx, x, y, 5, '#ffe9a8');
  ctx.strokeStyle = '#6b4a2f';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(488, 64);
  ctx.lineTo(488, 238);
  ctx.moveTo(404, 150);
  ctx.lineTo(572, 150);
  ctx.stroke();
  // rak buku (diff 3: buku merah -> hijau)
  ctx.fillStyle = '#5d3c22';
  ctx.fillRect(36, 56, 248, 340);
  const spineCols = ['#e8443a', '#4aa8ff', '#ffd23f', '#7ed957', '#ff8fb3', '#1fa8a0'];
  for (let shelf = 0; shelf < 3; shelf++) {
    const y = 76 + shelf * 108;
    for (let i = 0; i < 6; i++) {
      let col = spineCols[(shelf * 2 + i) % spineCols.length];
      if (changed && shelf === 1 && i === 2) col = '#7ed957';
      ctx.fillStyle = col;
      const h = 78 - ((shelf + i) % 3) * 8;
      ctx.fillRect(52 + i * 38, y + 88 - h, 30, h);
    }
    ctx.fillStyle = '#7a5230';
    ctx.fillRect(44, y + 88, 232, 10);
  }
  // karpet (diff 6: merah -> biru)
  ctx.fillStyle = changed ? '#3a6fd8' : '#b03a3a';
  ctx.beginPath();
  ctx.ellipse(310, 446, 150, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(310, 446, 118, 20, 0, 0, Math.PI * 2);
  ctx.stroke();
  // kursi (diff 7: bantal cokelat -> hijau)
  ctx.fillStyle = '#8a5a2b';
  rr(ctx, 88, 330, 120, 90, 14);
  ctx.fill();
  ctx.fillStyle = '#a06a35';
  rr(ctx, 96, 290, 104, 60, 12);
  ctx.fill();
  ctx.fillStyle = changed ? '#7ed957' : '#5d3c22';
  rr(ctx, 108, 344, 80, 44, 10);
  ctx.fill();
  // lampu lantai (diff 2: kap lampu oranye -> ungu)
  ctx.strokeStyle = '#2c2c34';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(338, 420);
  ctx.lineTo(338, 250);
  ctx.stroke();
  ctx.fillStyle = '#2c2c34';
  ctx.beginPath();
  ctx.ellipse(338, 424, 26, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = changed ? '#9b59d0' : '#ff9f43';
  ctx.beginPath();
  ctx.moveTo(308, 250);
  ctx.lineTo(368, 250);
  ctx.lineTo(356, 206);
  ctx.lineTo(320, 206);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(255,223,107,0.5)';
  circle(ctx, 338, 258, 22);
  ctx.fill();
  // kucing tidur di karpet (diff 1: hilang)
  if (!changed) {
    ctx.fillStyle = '#e8a04c';
    ctx.beginPath();
    ctx.ellipse(300, 442, 34, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    circle(ctx, 330, 434, 12);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(324, 426);
    ctx.lineTo(327, 414);
    ctx.lineTo(332, 426);
    ctx.closePath();
    ctx.fill();
  }
  // tumpukan buku (diff 5: 3 -> 2 buku)
  const stack = ['#e8443a', '#4aa8ff', '#ffd23f'];
  const nStack = changed ? 2 : 3;
  for (let i = 0; i < nStack; i++) {
    ctx.fillStyle = stack[i];
    rr(ctx, 470, 372 - i * 22, 84, 20, 4);
    ctx.fill();
  }
  ctx.fillStyle = '#5d3c22';
  ctx.fillRect(460, 394, 104, 10);
  ctx.fillRect(468, 404, 8, 40);
  ctx.fillRect(548, 404, 8, 40);
  // teko (diff 8: bertambah)
  if (changed) {
    ctx.fillStyle = '#4aa8ff';
    ctx.beginPath();
    ctx.ellipse(522, 330, 26, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(522, 312);
    ctx.lineTo(522, 300);
    ctx.lineTo(534, 306);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#4aa8ff';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(548, 330, 12, -1.2, 1.2);
    ctx.stroke();
  }
}

// ---------------------------------------------------------------- scene 5: Stasiun Luar Angkasa
function drawStasiun(ctx, changed) {
  ctx.fillStyle = '#07081c';
  ctx.fillRect(0, 0, W, H);
  // bintang (diff 6: gugus bintang hilang)
  for (const [x, y] of [[30, 60], [90, 40], [180, 90], [420, 50], [560, 60], [600, 200], [40, 220], [580, 380], [200, 40], [480, 440]]) {
    star(ctx, x, y, 4, '#ffffff');
  }
  if (!changed) {
    for (const [x, y] of [[292, 76], [312, 88], [300, 100]]) star(ctx, x, y, 7, '#ffe9a8');
  }
  // Bumi (diff 5: membesar)
  const earthR = changed ? 118 : 92;
  circle(ctx, 56, 452, earthR);
  ctx.fillStyle = '#2f7fc4';
  ctx.fill();
  ctx.fillStyle = '#3fae4a';
  ctx.beginPath();
  ctx.ellipse(70, 420, 30, 16, 0.4, 0, Math.PI * 2);
  ctx.ellipse(30, 470, 24, 12, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.beginPath();
  ctx.ellipse(80, 400, 34, 8, 0.2, 0, Math.PI * 2);
  ctx.fill();
  // planet bercincin (diff 2: cincin emas -> ungu)
  circle(ctx, 470, 130, 66);
  ctx.fillStyle = '#e8a04c';
  ctx.fill();
  ctx.fillStyle = '#d18a3a';
  ctx.beginPath();
  ctx.ellipse(470, 118, 66, 14, 0, Math.PI, 0);
  ctx.fill();
  ctx.strokeStyle = changed ? '#9b59d0' : '#ffd23f';
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.ellipse(470, 130, 96, 22, -0.25, 0, Math.PI * 2);
  ctx.stroke();
  // roket (diff 4: api membesar)
  ctx.fillStyle = '#e8ecf2';
  ctx.beginPath();
  ctx.moveTo(100, 96);
  ctx.lineTo(116, 128);
  ctx.lineTo(100, 148);
  ctx.lineTo(84, 128);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e8443a';
  ctx.beginPath();
  ctx.moveTo(100, 96);
  ctx.lineTo(108, 112);
  ctx.lineTo(92, 112);
  ctx.closePath();
  ctx.fill();
  circle(ctx, 100, 124, 7);
  ctx.fillStyle = '#4aa8ff';
  ctx.fill();
  const flame = changed ? 44 : 22;
  ctx.fillStyle = '#ff9f43';
  ctx.beginPath();
  ctx.moveTo(90, 148);
  ctx.lineTo(100, 148 + flame);
  ctx.lineTo(110, 148);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffd23f';
  ctx.beginPath();
  ctx.moveTo(95, 148);
  ctx.lineTo(100, 148 + flame * 0.6);
  ctx.lineTo(105, 148);
  ctx.closePath();
  ctx.fill();
  // stasiun: modul + panel surya (diff 3: panel kanan hilang)
  ctx.fillStyle = '#c9d2de';
  rr(ctx, 220, 216, 180, 52, 24);
  ctx.fill();
  ctx.fillStyle = '#9aa7b8';
  ctx.fillRect(300, 216, 20, 52);
  ctx.fillStyle = '#ffd23f';
  for (const x of [246, 356]) {
    circle(ctx, x, 242, 9);
    ctx.fill();
  }
  ctx.fillStyle = '#2f5fd0';
  ctx.fillRect(120, 226, 92, 32);
  ctx.fillRect(408, 226, 92, 32);
  ctx.strokeStyle = '#9aa7b8';
  ctx.lineWidth = 3;
  for (const x of [143, 166, 189]) {
    ctx.beginPath();
    ctx.moveTo(x, 226);
    ctx.lineTo(x, 258);
    ctx.stroke();
  }
  if (!changed) {
    for (const x of [431, 454, 477]) {
      ctx.beginPath();
      ctx.moveTo(x, 226);
      ctx.lineTo(x, 258);
      ctx.stroke();
    }
  }
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(214, 240, 8, 4);
  // astronaut (diff 1: hilang)
  if (!changed) {
    ctx.strokeStyle = '#e8ecf2';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(196, 268);
    ctx.quadraticCurveTo(170, 300, 158, 330);
    ctx.stroke();
    ctx.fillStyle = '#f2f5f9';
    rr(ctx, 140, 316, 34, 44, 12);
    ctx.fill();
    circle(ctx, 157, 306, 14);
    ctx.fill();
    ctx.fillStyle = '#7ec8e3';
    circle(ctx, 161, 304, 8);
    ctx.fill();
    ctx.strokeStyle = '#f2f5f9';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(146, 330);
    ctx.lineTo(132, 352);
    ctx.moveTo(168, 330);
    ctx.lineTo(182, 352);
    ctx.stroke();
  }
  // satelit (diff 7: antena berputar)
  ctx.fillStyle = '#c9d2de';
  rr(ctx, 452, 300, 64, 30, 6);
  ctx.fill();
  ctx.strokeStyle = '#c9d2de';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(484, 300);
  ctx.lineTo(changed ? 512 : 500, changed ? 268 : 282);
  ctx.stroke();
  ctx.fillStyle = '#ffd23f';
  ctx.beginPath();
  ctx.arc(changed ? 512 : 500, changed ? 268 : 282, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2f5fd0';
  ctx.fillRect(440, 306, 12, 22);
  // asteroid (diff 8: bertambah)
  if (changed) {
    ctx.fillStyle = '#8a8f9c';
    ctx.beginPath();
    ctx.moveTo(360, 344);
    ctx.lineTo(392, 352);
    ctx.lineTo(400, 376);
    ctx.lineTo(378, 392);
    ctx.lineTo(356, 378);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#6e7380';
    circle(ctx, 376, 366, 5);
    ctx.fill();
  }
}

export const SCENES = [
  {
    id: 'pasar',
    name: 'Pasar Malam',
    sub: 'lampion, lapak SATE & ES TEH',
    draw: drawPasar,
    diffs: [
      { name: 'Kucing hitam hilang', x: 92, y: 420, r: 38 },
      { name: 'Warna tenda lapak sate', x: 144, y: 207, r: 44 },
      { name: 'Balon kuning jadi biru', x: 552, y: 122, r: 34 },
      { name: 'Lampion tengah hilang', x: 330, y: 78, r: 34 },
      { name: 'Gerobak gorengan pindah', x: 310, y: 330, r: 42 },
      { name: 'Bulan membesar', x: 520, y: 92, r: 52 },
      { name: 'Gelas ES TEH bertambah', x: 478, y: 322, r: 40 },
      { name: 'Sepeda pindah tempat', x: 440, y: 436, r: 44 },
    ],
  },
  {
    id: 'pelabuhan',
    name: 'Pelabuhan Fajar',
    sub: 'mercusuar, perahu & camar',
    draw: drawPelabuhan,
    diffs: [
      { name: 'Garis mercusuar jadi kuning', x: 105, y: 225, r: 44 },
      { name: 'Layar perahu jadi kuning', x: 366, y: 260, r: 44 },
      { name: 'Burung camar hilang', x: 260, y: 88, r: 32 },
      { name: 'Pelampung hilang', x: 492, y: 342, r: 32 },
      { name: 'Matahari membesar', x: 520, y: 92, r: 56 },
      { name: 'Peti di dermaga pindah', x: 130, y: 378, r: 40 },
      { name: 'Awan kanan hilang', x: 404, y: 60, r: 40 },
      { name: 'Ikan berubah warna', x: 368, y: 392, r: 34 },
    ],
  },
  {
    id: 'taman',
    name: 'Taman Pagi',
    sub: 'piknik, layang-layang & anjing',
    draw: drawTaman,
    diffs: [
      { name: 'Layang-layang hilang', x: 420, y: 116, r: 42 },
      { name: 'Anjing pindah tempat', x: 330, y: 452, r: 42 },
      { name: 'Selimut piknik jadi biru', x: 313, y: 422, r: 44 },
      { name: 'Apel di pohon hilang', x: 114, y: 148, r: 44 },
      { name: 'Bunga tengah hilang', x: 104, y: 460, r: 32 },
      { name: 'Matahari membesar', x: 530, y: 76, r: 48 },
      { name: 'Bangku hilang', x: 532, y: 382, r: 44 },
      { name: 'Burung bertambah', x: 320, y: 56, r: 32 },
    ],
  },
  {
    id: 'perpustakaan',
    name: 'Perpustakaan Senja',
    sub: 'rak buku, lampu & kucing tidur',
    draw: drawPerpustakaan,
    diffs: [
      { name: 'Kucing tidur hilang', x: 306, y: 440, r: 40 },
      { name: 'Kap lampu jadi ungu', x: 338, y: 228, r: 40 },
      { name: 'Buku merah jadi hijau', x: 150, y: 150, r: 38 },
      { name: 'Bulan di jendela hilang', x: 488, y: 128, r: 40 },
      { name: 'Tumpukan buku berkurang', x: 512, y: 360, r: 40 },
      { name: 'Karpet jadi biru', x: 310, y: 446, r: 44 },
      { name: 'Bantal kursi jadi hijau', x: 148, y: 366, r: 42 },
      { name: 'Teko bertambah', x: 522, y: 326, r: 38 },
    ],
  },
  {
    id: 'stasiun',
    name: 'Stasiun Luar Angkasa',
    sub: 'planet bercincin & astronaut',
    draw: drawStasiun,
    diffs: [
      { name: 'Astronaut hilang', x: 157, y: 330, r: 40 },
      { name: 'Cincin planet jadi ungu', x: 470, y: 130, r: 52 },
      { name: 'Panel surya kanan hilang', x: 454, y: 242, r: 40 },
      { name: 'Api roket membesar', x: 100, y: 162, r: 38 },
      { name: 'Bumi membesar', x: 56, y: 452, r: 56 },
      { name: 'Gugus bintang hilang', x: 302, y: 88, r: 34 },
      { name: 'Antena satelit berputar', x: 502, y: 278, r: 36 },
      { name: 'Asteroid bertambah', x: 378, y: 368, r: 36 },
    ],
  },
];
