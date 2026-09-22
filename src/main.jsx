import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

// No StrictMode: double-mounted effects would create and dispose the WebGL context twice.
createRoot(document.getElementById('root')).render(<App />);
