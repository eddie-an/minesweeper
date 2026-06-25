import { useState, useEffect } from 'react'
import { useGame } from "./context/GameContext";
import './App.css'
import Board from './components/Board';
import flag from './assets/flag.svg'

function App() {

  // global states and functions
  const { rowSize, setRowSize, colSize, setColSize, numOfMines, setNumOfMines, restartGame, numFlags, gameState } = useGame();

  // Execute restartGame function when the page is first loaded to initialize the board and set the mines.
  useEffect(()=> {
    restartGame();
  },[]);

  return (
      <section id="main">
        <header>
          <h1>Mine Sweeper</h1>
        </header>
        <section id="settings-section">
          <div className='settings-button-container'>
            <button onClick={() => restartGame(8, 10, 10)}>Easy</button>
          </div>
          <div className='settings-button-container'>
            <button onClick={() => restartGame(14, 18, 40)}>Medium</button>
          </div>
          <div className='settings-button-container'>
            <button onClick={() => restartGame(20, 24, 99)}>Hard</button>
          </div>
        </section>
        <section id="game-section">
          <div id="game-info-container">
            <div className="hud-box mine-counter">
              <img src={flag} alt="Flags" />
              <span>{numOfMines- numFlags}</span>
            </div>
            <div className={`hud-box game-state ${gameState.toLowerCase()}`}>
              {gameState === "PLAYING" && "Playing"}
              {gameState === "WON" && "You Win!"}
              {gameState === "LOST" && "Game Over :("}
            </div>
          </div>
          <div id="board-wrapper">
            <Board />
          </div>

          <div id="try-again-button-container">
            <button onClick={()=>restartGame()}>Try again</button>
          </div>
        </section>

      </section>
  )
}

export default App
