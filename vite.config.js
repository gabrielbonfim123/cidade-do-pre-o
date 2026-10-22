import { defineConfig } from 'vite';
import { copyFileSync, cpSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

// Inclui scripts classicos, estilo, arquivos offline e icones no build da Vercel.
export default defineConfig({
  plugins: [{
    name: 'zuz-static-assets',
    closeBundle() {
      mkdirSync('dist', { recursive: true });
      for (const file of ['game.js','sw.js','manifest.webmanifest','tema_fim_de_tarde.mp3','styles.css','city.css','sales.css','expansion.css','features.css','interactive.css','mobile.css']) {
        if (existsSync(file)) copyFileSync(file, join('dist',file));
      }
      if (existsSync('icons')) {
        cpSync('icons',join('dist','icons'), { recursive:true });
        cpSync('icons',join('dist','assets','icons'), { recursive:true });
      }
    }
  }]
});
