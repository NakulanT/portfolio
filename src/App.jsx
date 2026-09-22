import { useState } from 'react';
import { GameProvider } from './game';
import { ModeProvider, useMode } from './mode';
import { ModeSwitcher } from './components/ModeSwitcher';
import { RLSite } from './modes/rl/RLSite';
import { GamingSite } from './modes/gaming/GamingSite';
import { JapaneseSite } from './modes/japanese/JapaneseSite';
import { GreekSite } from './modes/greek/GreekSite';

// Four completely separate designs — layout, typography, colour and 3D scene — share only
// the underlying content (src/data.js) and the XP/achievement layer (src/game.jsx), which
// persists across mode switches since GameProvider stays mounted the whole time.
function Router() {
  const { mode } = useMode();
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'dark');
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* storage can be unavailable */ }
  };

  if (mode === 'gaming') return <GamingSite />;
  if (mode === 'japanese') return <JapaneseSite />;
  if (mode === 'greek') return <GreekSite />;
  return <RLSite theme={theme} onToggle={toggleTheme} />;
}

export default function App() {
  return (
    <GameProvider>
      <ModeProvider>
        <Router />
        <ModeSwitcher />
      </ModeProvider>
    </GameProvider>
  );
}
