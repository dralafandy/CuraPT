import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/CuraPT/', // Important for GitHub Pages to ensure correct asset paths
<<<<<<< HEAD
});
=======
  optimizeDeps: {
    exclude: ['react-chartjs-2', 'chart.js'],
  },
});
>>>>>>> 9da656e (Initial commit for CuraPT clinic app)
