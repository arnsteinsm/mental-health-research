import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppApp.tsx
import { QueryProvider }ueryProviproviders/query-providerryProviproviders/query-providerrom './providers/query-provider';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </StrictMode>
);
