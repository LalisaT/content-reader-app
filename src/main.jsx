import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Defer non-critical audio context initialization off the initial thread
setTimeout(async () => {
  try {
    const { initAudioUnlock } = await import('./services/notificationService');
    initAudioUnlock();
  } catch {}
}, 400);
