// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { router } from './routes/router';
import { ThemeProvider } from './context/ThemeContext';

async function enableMocking() {
  // 개발환경에서만 MSW 켜기
  if (!import.meta.env.DEV) return;

  const { worker } = await import('./mocks/browser');
  await worker.start({
    onUnhandledRequest: 'warn',
  });
}

// ✅ MSW 초기화가 실패하거나 지연되더라도 앱은 렌더링되어야 합니다.
// then() 대신 catch와 finally를 사용하여 렌더링을 보장합니다.
enableMocking()
  .catch(console.error)
  .finally(() => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </React.StrictMode>,
    );
  });
