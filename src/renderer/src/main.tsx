import './index.css';

import { createRoot } from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './components/theme-provider';
import { HashRouter } from 'react-router-dom';
import Titlebar from './components/titlebar';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <HashRouter>
      <App />
    </HashRouter>
  </ThemeProvider>
);

createRoot(document.getElementById('titlebar-root')!).render(
  <ThemeProvider>
    <HashRouter>
      <Titlebar />
    </HashRouter>
  </ThemeProvider>
);
