import { useState, useEffect } from 'react'
import { useGame } from "./context/GameContext";
import './App.css'
import Board from './components/Board';

function App() {

  const { rowSize, setRowSize, colSize, setColSize, numOfMines, setNumOfMines, restartGame, numFlags, gameState } = useGame();

  useEffect(()=> {
    restartGame();
  },[]);

  return (
      <section id="body">
        <section id="header">
          <h1>Mine Sweeper</h1>
        </section>
          <button onClick={() => restartGame(8, 10, 10)}>Easy</button>
          <button onClick={() => restartGame(14, 18, 40)}>Medium</button>
          <button onClick={() => restartGame(20, 24, 99)}>Hard</button>

        <section id="game">
          <div>
            <p>{numOfMines- numFlags}</p>
          </div>
          <Board />
          <div>
            {gameState}
          </div>
          <div>
            <button id="try-again" onClick={()=>restartGame()}>Try again</button>
          </div>
        </section>

      </section>
  )
}

export default App
