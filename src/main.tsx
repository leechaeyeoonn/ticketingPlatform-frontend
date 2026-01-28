// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { router } from '@/routes/router';

async function enableMocking() {
  // 개발환경에서만 MSW 켜기
  if (!import.meta.env.DEV) return;

  const { worker } = await import('./mocks/browser');
  await worker.start({
    onUnhandledRequest: 'warn',
  });
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
});
