import path from 'path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv, type ConfigEnv, type UserConfig } from 'vite';

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd(), '');
  process.env = { ...process.env, ...env };

 // const apiContext = env.VITE_API_CONTEXT || 'api';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    },
    css: {
      preprocessorOptions: {
        scss: { },
      },
    },
    server: {
      port: 3000,
      // 백엔드 붙일 때만 사용
      // proxy: {
      //   '/api': {
      //     target: env.VITE_API_TARGET,
      //     rewrite: (p) => p.replace(/^\/api/, `/${apiContext}`),
      //     changeOrigin: true,
      //   },
      // },
    },
    build: {
      sourcemap: true,
      target: 'esnext',
      chunkSizeWarningLimit: 500,
    },
  };
});
