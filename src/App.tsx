import React from 'react';
import './App.css';
import {Board} from './Board'; 

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
