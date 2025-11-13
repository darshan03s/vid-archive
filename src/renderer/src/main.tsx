import './index.css';

import { createRoot } from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './components/theme-provider';
import { HashRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <HashRouter>
      <App />
    </HashRouter>
  </ThemeProvider>
);
