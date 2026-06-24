import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Board from './components/Board';

function App() {
  // medium size is row size of 14 and column size of 18
  // small size is row size of 8 and col size of 10
  const [rowSize, setRowSize] = useState(8);
  const [colSize, setColSize] = useState(10);
  // Array.from({length: rowSize}, () => Array(colSize).fill(0))
  const initialBoard = [
    ['E','E','M','E','E','E','E','E','E','M'],
    ['E','E','E','E','E','E','E','E','E','E'],
    ['E','E','E','E','E','E','E','E','E','E'],
    ['E','E','E','E','E','E','E','M','E','E'],
    ['E','E','E','E','E','E','E','E','E','E'],
    ['M','M','E','E','E','E','E','E','E','E'],
    ['E','M','E','E','M','E','E','E','E','E'],
    ['E','M','E','M','E','E','E','E','M','E']
  ];
  const [matrix, setMatrix] = useState(initialBoard);

  const [numOfMines, setNumOfMines] = useState(10);
  const [numGuess, setNumGuess] = useState(0); // When numGuess is equal to rowSize*colSize - numOfMines, we win. If numGuess is null, we lose
  const [isGameOver, setIsGameOver] = useState(false);

  const updateBoard = (originalBoard, r, c) => {
    var dfs = function(r, c, visited) {
        if (r >= board.length || r < 0 || c >= board[0].length || c < 0) {
            return;
        }
        if (board[r][c] != 'E') {
            return;
        }

        visited.add(JSON.stringify([r,c]));
        const changeDirs = [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]];

        let numAdjMines = 0;
        for (const dir of changeDirs) {
            const newR = r+dir[0];
            const newC = c+dir[1];
            if (newR < board.length && newR >= 0 && newC < board[0].length && newC >= 0) {
                if (board[newR][newC] == 'M' || board[newR][newC] == 'X') {
                    numAdjMines++;
                }
            }
        }
        
        if (numAdjMines > 0) {
            board[r][c] = numAdjMines.toString();
            setNumGuess(numGuess => numGuess+1);
            return; // Early return when there are one or more adjacent mine(s)
        }
        else {
            board[r][c] = 'B'; // Revealed square with no adjacent mines
            setNumGuess(numGuess => numGuess+1);
        }
        
        // Recursively search adjacent cells that has not been visited yet
        for (const dir of changeDirs) {
            const newR = r+dir[0];
            const newC = c+dir[1];
            if (!visited.has(JSON.stringify([newR, newC]))) {
                dfs(newR, newC, visited);
            }
        }
        return;
    }; // end of nested DFS function
    let board = structuredClone(originalBoard);
    console.log("game logic")
    if (r >= board.length || r < 0 || c >= board[0].length || c < 0) {
        return board;
    }
    if (board[r][c] == 'M') {
        board[r][c] = 'X'; 
        setNumGuess(null); // Game over
        setMatrix(board);
        return;
    }

    const visited = new Set();
    dfs(r, c, visited);
    setMatrix(board);
    return;
  }; // end of updateBoard function


  const revealBoard = (originalBoard) => {
    let board = structuredClone(originalBoard);
    for (let i=0; i<board.length; i++) {
      for (let j=0; j<board[0].length; j++) {
        if (board[i][j] == 'M') {
          board[i][j] = 'X'; 
        }
      }
    }
    setMatrix(board);
  }

  const restartGame = () => {
    setMatrix(initialBoard);
    setNumGuess(0);
    setIsGameOver(false);
  }

  // Create useEffect hook that checks for wins whenever updateBoard executes
  useEffect(()=> {
    if (numGuess === null) {
      console.log("You lose");
      revealBoard(matrix);
      setIsGameOver(true);
    }
    else if (numGuess == rowSize*colSize - numOfMines) {
      console.log("You win");
      setIsGameOver(true);
    }
    console.log(numGuess);
  }, [numGuess]);

  return (
      <section id="outer">
        <section id="heading">
          <h1>Mine Sweeper</h1>
        </section>
        <section id="game">
          <Board matrix={matrix} updateBoard={updateBoard} rowSize={rowSize} colSize={colSize} matrix={matrix} isGameOver={isGameOver} />
          <div>
            <button onClick={()=>restartGame()}>Try again</button>
          </div>
        </section>

      </section>
  )
}

export default App
