import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Nav from './components/Nav';
import Content from './components/Content.jsx';
import Skill from './components/Skill.jsx';
import Edu from './components/Edu.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div>
    <Nav />
    <Content />
    <Skill />
    <Edu />
  </div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
