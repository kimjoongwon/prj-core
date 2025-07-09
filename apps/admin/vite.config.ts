import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isDev = command === 'serve';
  const isBuild = command === 'build';

  return {
    plugins: [react()],

    // 빌드 시에만 최적화 적용
    ...(isBuild && {
      build: {
        // 청크 크기 제한으로 메모리 사용량 최적화
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
          output: {
            // 더 많은 청크로 분할하여 메모리 사용량 분산
            manualChunks: {
              vendor: ['react', 'react-dom', 'react-router'],
              ui: ['@heroui/react', 'framer-motion'],
              state: ['mobx', 'mobx-react-lite'],
            },
          },
        },
        // 소스맵을 비활성화하여 메모리 절약
        sourcemap: false,
      },
    }),

    // 개발 환경 설정
    ...(isDev && {
      server: {
        // 개발 시에는 HMR 활성화
        hmr: true,
        // 개발 서버 포트 설정
        port: 3000,
        // 자동으로 브라우저 열기
        open: false,
      },
    }),

    // 공통 의존성 최적화 (개발/빌드 모두 적용)
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router',
        '@heroui/react',
        'mobx',
        'mobx-react-lite',
      ],
    },
  };
});
