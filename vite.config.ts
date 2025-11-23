import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // We use process.cwd() cast to any to avoid TS errors in the build script context
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Robustly fetch the API key. Vercel automatically exposes vars starting with VITE_ to the client,
  // but we also check for standard API_KEY to support backend-style env vars if configured.
  const apiKey = env.VITE_API_KEY || env.API_KEY || '';

  console.log(`[Vite Build] API Key detected: ${apiKey ? 'Yes' : 'No'}`);

  return {
    plugins: [react()],
    define: {
      // Safely expose API_KEY to the client-side code
      // We explicitly define it so it replaces usages in the code with the actual string value.
      // We also define global.process.env for libraries that might rely on it.
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('@google/genai')) {
                return 'genai';
              }
              if (id.includes('recharts')) {
                return 'recharts';
              }
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor';
              }
              if (id.includes('lucide-react')) {
                return 'icons';
              }
              return 'deps';
            }
          }
        }
      }
    }
  };
});