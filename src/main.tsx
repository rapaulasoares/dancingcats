import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/lora/400.css';
import '@fontsource/lora/600.css';
import '@fontsource/lora/400-italic.css';
import '@fontsource/caveat/500.css';
import '@fontsource/special-elite/400.css';
import './styles/theme.css';
import './styles/global.css';
import { App } from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
