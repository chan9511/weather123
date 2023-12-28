// src/App.tsx
import React from 'react';
import Weather from './components/Weather';
import './styles/main.css';

const App: React.FC = () => {
  return (
    <div className='container'>
      <Weather />
    </div>
  );
};

export default App;
