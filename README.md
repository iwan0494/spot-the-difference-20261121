# Pasar Malam — Cari Bedanya!

[![best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/iwan0494/spot-the-difference-20261121/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/iwan0494/spot-the-difference-20261121/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

**Pasar Malam — Cari Bedanya!** adalah game spot-the-difference yang jalan
offline di browser desktop dari file statis, tanpa network. Dua gambar yang
hampir identik berdampingan; klik perbedaan di gambar mana pun untuk
melingkarinya. Dibangun untuk kompetisi make.fun
[best-spot-the-difference-game-20261121-0451](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451).

## Cara main

- **4 scene × 7 perbedaan adil = 28 perbedaan**: Pasar Malam, Pelabuhan Fajar,
  Taman Pagi, dan Perpustakaan Senja. Setiap perbedaan itu adil: dihapus,
  diwarnai ulang, dipindah, diperbesar, diperkecil, atau ditambah.
- **Mouse**: klik untuk menebak, hover = kaca pembesar 2×.
- **Keyboard**: `← ↑ ↓ →` gerakkan crosshair, `Enter` tebak, `Tab` ganti gambar,
  `H` petunjuk, `1`–`4` ganti scene, `R` ulang scene, `M` suara, `P` jeda.
- **HUD**: counter sisa besar ("7 lagi dicari"), titik ketemu, timer 2:30,
  skor, kombo, strike, 3 petunjuk per scene, dan daftar "Sudah ketemu" yang
  menyebut nama tiap perbedaan.
- Klik salah mengurangi 5 detik. Temukan semua 7 sebelum waktu habis.

## Menjalankan

```sh
# mainkan langsung (server statis apa pun bisa; contoh di bawah pakai Python)
python3 -m http.server 8080 --directory game
# lalu buka http://localhost:8080

# atau jalankan program entry-nya (menyalin game + screenshot ke output + dossier.json)
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Screenshot deterministik

`game/index.html` menerima `?shot=` untuk keadaan yang sama setiap kali:

- `?shot=start` — scene 1, 0 ketemu
- `?shot=play` — scene Pelabuhan Fajar, 3 ketemu, 4 lagi dicari
- `?shot=play2` — scene Pasar Malam, 4 ketemu, 3 lagi dicari
- `?shot=end` — scene Pasar Malam, semua ketemu + kartu menang

## Struktur

- `main.ts` — program entry: menyalin `game/` + `screenshots/` ke output dan
  menulis `dossier.json` lewat `vendor/makefun-game.ts`.
- `game/index.html`, `game/styles.css` — layout & tampilan.
- `game/src/scenes.js` — keempat scene, digambar dari kode (canvas).
- `game/src/main.js` — logika game (klik, keyboard, hint, timer, skor).
- `game/src/audio.js` — suara sintetis WebAudio, tanpa file suara.
- `vendor/makefun-game.ts` — library make.fun dari kit, tanpa diubah.
- `screenshots/` — 4 render asli dari kode game.

## Lisensi

MIT — lihat `LICENSE`.
