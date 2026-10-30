/**
 * @fileoverview Application entry point for AuraPlan AI.
 *
 * Bootstraps the React application into the `#root` DOM node using
 * `ReactDOM.createRoot` with `React.StrictMode` enabled for development-time
 * double-invocation checks and deprecated API warnings.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

/** Root DOM element guaranteed present by `index.html`. */
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    '[AuraPlan] Fatal: #root element not found in the DOM. ' +
    'Ensure index.html contains <div id="root"></div>.'
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
