import React from 'react';
import PongBoard from './components/Board';

function App() {
    return (
      <div className="App" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
      <PongBoard />
  </div>
    );
}

export default App;
