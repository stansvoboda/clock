import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
// Self-hosted variable faces (Anybody with its width axis), so no visitor data goes to a font CDN.
import '@fontsource-variable/anybody/wdth.css';
import '@fontsource-variable/atkinson-hyperlegible-next';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
