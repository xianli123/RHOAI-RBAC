import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import '@patternfly/react-core/dist/styles/base.css';

// Get base path from import.meta.env (Vite's way of accessing env vars)
// This should match the base path in vite.config.ts
const basename = import.meta.env.BASE_URL || '/';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);



