# Pasar Malam — Cari Bedanya!

[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![Rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/iwan0494/spot-the-difference-20261121/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![Reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/iwan0494/spot-the-difference-20261121/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

Game cari perbedaan untuk bounty [make.fun — Make the best spot the difference game](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451).

## Cara main

Dua gambar terlihat sama — tapi gambar kanan punya **8 perbedaan licik** di tiap scene. Klik perbedaannya di gambar mana pun untuk melingkarinya. Klik salah mengurangi 5 detik dan memutus kombo. Temukan semua 8 sebelum waktu 2:30 habis, lalu lanjut ke scene berikut.

- **5 scene × 8 perbedaan = 40 total**: Pasar Malam, Pelabuhan Fajar, Taman Pagi, Perpustakaan Senja, Stasiun Luar Angkasa.
- **Semua art digambar dari kode** (canvas, tanpa aset luar, tanpa network).
- **Kaca pembesar 2×** saat hover di atas gambar.
- **Keyboard**: panah untuk menggerakkan crosshair + Enter untuk klik, Tab ganti gambar, H petunjuk, 1–5 ganti scene, R ulang, M suara, P jeda.
- **Petunjuk** 3× per scene, **kombo** menambah skor, **suara** sintetis WebAudio.

## Menjalankan

Buka `game/index.html` di browser desktop (Chrome). Tidak butuh server dan tidak butuh network.

Mode screenshot deterministik (untuk tangkapan layar): `game/index.html?shot=start|play|play2|end`.

## Struktur

- `game/index.html` — halaman game, HUD minimal
- `game/styles.css` — gaya
- `game/src/scenes.js` — 5 scene + 40 perbedaan, semua digambar dari kode
- `game/src/main.js` — logika game
- `game/src/audio.js` — suara sintetis
- `main.ts` — entrypoint: menyalin game + screenshot ke output dan menulis `dossier.json`

## Lisensi

MIT — lihat `LICENSE`.
