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
const emptyBoard:number[][] = [];
const emptyBase:number = 3;
for(let i=0; i<emptyBase*emptyBase; i++){
  emptyBoard.push(new Array(emptyBase*emptyBase).fill(0));
}

const App: React.FC = () => {
  return (
    <div className="App">
      <Board baseBoard={emptyBoard} base={emptyBase}/>
    </div>
  );
}

export default App;
