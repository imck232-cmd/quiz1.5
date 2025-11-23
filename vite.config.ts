import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Cast process to any to avoid TypeScript errors regarding 'cwd'
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Safely expose API_KEY to the client-side code
      // Default to empty string if undefined to prevent JSON.stringify(undefined) which results in 'undefined' in code
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    },
    build: {
      // Increase the warning limit slightly to avoid false positives on medium-sized chunks
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // Manually split chunks to improve performance and solve the "chunk larger than 500kB" warning
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // Split Google GenAI into its own chunk (it's large)
              if (id.includes('@google/genai')) {
                return 'genai';
              }
              // Split Recharts into its own chunk
              if (id.includes('recharts')) {
                return 'recharts';
              }
              // Split React core into its own chunk
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor';
              }
              // Split Lucide icons
              if (id.includes('lucide-react')) {
                return 'icons';
              }
              // All other dependencies go to a general dependencies chunk
              return 'deps';
            }
          }
        }
      }
    }
  };
});