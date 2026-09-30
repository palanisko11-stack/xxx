import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import HavirovApp from './HavirovApp.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HavirovApp />
  </StrictMode>,
);
