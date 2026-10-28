import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { rmSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { defineConfig, type Plugin } from 'vite';

/**
 * Generate the static route HTML, sitemap, robots and 404 page after Vite has
 * written the client bundle. Running this as a Vite build hook ensures the
 * pages are produced even when a host is configured to run `vite build`
 * directly instead of `npm run build`.
 */
const generateStaticMetadata = (): Plugin => {
  let buildFailed = false;

  return {
    name: 'generate-static-metadata',
    apply: 'build',
    buildStart() {
      buildFailed = false;
      rmSync(path.resolve(__dirname, 'dist'), { recursive: true, force: true });
    },
    buildEnd(error) {
      if (error) buildFailed = true;
    },
    closeBundle() {
      if (buildFailed) return;

      return new Promise<void>((resolve, reject) => {
        const script = path.resolve(__dirname, 'scripts/generate-static-meta.mjs');
        const child = spawn(process.execPath, [script], {
          cwd: __dirname,
          stdio: 'inherit',
        });
        child.on('error', reject);
        child.on('exit', (code) => {
          if (code === 0) resolve();
          else reject(new Error(`Static metadata generation failed with exit code ${code}`));
        });
      });
    },
  };
};

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), generateStaticMetadata()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            motion: ['motion'],
            icons: ['lucide-react'],
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // File watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      // Proxy API calls to the backend during development.
      proxy: {
        '/api': {
          target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
  };
});
