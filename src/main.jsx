import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/base.css';
import './styles/worlds.css';

// No StrictMode: its double-mounted effects would create and tear down the WebGL engine twice.
createRoot(document.getElementById('root')).render(<App />);
