import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Nav from './components/Nav';
import Content from './components/Content.jsx';
import Skill from './components/Skill.jsx';
import Edu from './components/Edu.jsx';

function App() {

  return (
    <div>
      <Nav />
      <Content />
      <Skill />
      <Edu />
    </div>

  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

reportWebVitals();
