import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App.tsx';

createRoot(
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.getElementById('root')!,
).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
