import React from 'react';
import './App.css';
import {Board} from './Board'; 

const baseBoard = [
  [3, 8, 0, 0, 0, 0, 0, 0, 0], 
  [0, 0, 0, 4, 0, 0, 7, 8, 5], 
  [0, 0, 9, 0, 2, 0, 3, 0, 0], 
  [0, 6, 0, 0, 9, 0, 0, 0, 0], 
  [8, 0, 0, 3, 0, 2, 0, 0, 9], 
  [0, 0, 0, 0, 4, 0, 0, 7, 0], 
  [0, 0, 1, 0, 7, 0, 5, 0, 0], 
  [4, 9, 5, 0, 0, 6, 0, 0, 0], 
  [0, 0, 0, 0, 0, 0, 0, 9, 2]
]

const App: React.FC = () => {
  return (
    <div className="App">
      <Board baseBoard={baseBoard} base={3}/>
    </div>
  );
}

export default App;
