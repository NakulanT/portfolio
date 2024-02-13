import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Nav from './components/Nav';
import Content from './components/Content.jsx';
import Skill from './components/Skill.jsx';
import Edu from './components/Edu.jsx';

function App() {
  const [showEdu, setShowEdu] = useState(false);

  return (
    <div>
      <Nav />
      <Content />
      <Skill />
      {showEdu && <Edu />}
      <button onClick={() => setShowEdu(true)} style={{ width: '100px', height: '40px', backgroundColor: 'blue' }}>Here</button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

reportWebVitals();
