// Pasar Malam — Cari Bedanya! Entry program (Node 22, standard library only).
//
// The playable game lives in game/ as plain static files (index.html plus its
// ES modules, no libraries, no network requests). This program is the handoff:
// it copies game/ and screenshots/ next to this file into the output directory
// the grader provides, then writes dossier.json there — the summary the judge
// reads — using the make.fun game library vendored under vendor/.
//
// Run it locally with an output directory of your own:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// Caps the scorer enforces: at most 4 screenshots of 256 KiB each, a game of
// at most 993 files / 48 MiB, and a path under game/ of at most 1000 bytes.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
