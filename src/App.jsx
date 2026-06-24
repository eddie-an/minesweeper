import { useState, useEffect } from 'react'
import { useGame } from "./context/GameContext";
import './App.css'
import Board from './components/Board';

function App() {

  const { restartGame } = useGame();


  return (
      <section id="outer">
        <section id="heading">
          <h1>Mine Sweeper</h1>
        </section>
        <section id="game">
          <Board />
          <div>
            <button onClick={()=>restartGame()}>Try again</button>
          </div>
        </section>

      </section>
  )
}

export default App
