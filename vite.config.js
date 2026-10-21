import { defineConfig } from 'vite';
import { cpSync, copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

// Arquivos usados diretamente pelo HTML e pelo service worker.
// O Vite nao copia scripts classicos nem todos os recursos da raiz.
export default defineConfig({
  plugins: [{
    name: 'zuz-copy-static-files',
    closeBundle() {
      const out = 'dist';
      mkdirSync(out, { recursive: true });
      for (const name of ['game.js', 'sw.js', 'manifest.webmanifest', 'tema_fim_de_tarde.mp3']) {
        if (existsSync(name)) copyFileSync(name, join(out, name));
      }
      if (existsSync('icons')) {
        cpSync('icons', join(out, 'icons'), { recursive: true });
        cpSync('icons', join(out, 'assets', 'icons'), { recursive: true });
      }
    }
  }]
});
