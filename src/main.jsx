import { StrictMode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import Preloader from './Preloaders/preloader1.jsx';
import { proposalConfig } from './proposalConfig.js';
import './index.css';

export function Root() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), proposalConfig.preloader.durationMs);
    return () => clearTimeout(timer);
  }, []);

  return loading ? <Preloader /> : <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
