import { createContext, useContext, useState, useEffect } from "react";

const GameContext = createContext();

export function GameProvider({ children }) {

    // medium size is row size of 14 and column size of 18
    // small size is row size of 8 and col size of 10
    const [rowSize, setRowSize] = useState(8);
    const [colSize, setColSize] = useState(10);
    const [numOfMines, setNumOfMines] = useState(10);

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
    const [board, setBoard] = useState(initialBoard);
    
    const [numClickedTiles, setNumClickedTiles] = useState(0); // When numClickedTiles is equal to rowSize*colSize - numOfMines, we win
    const [gameState, setGameState] = useState("PLAYING"); // Enumeration of PLAYING, WON, LOST

    const updateBoard = (r, c) => {
        var dfs = function(r, c, visited) {
            if (r >= newBoard.length || r < 0 || c >= newBoard[0].length || c < 0) {
                return;
            }
            if (newBoard[r][c] != 'E') {
                return;
            }

            visited.add(JSON.stringify([r,c]));
            const changeDirs = [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]];

            let numAdjMines = 0;
            for (const dir of changeDirs) {
                const newR = r+dir[0];
                const newC = c+dir[1];
                if (newR < newBoard.length && newR >= 0 && newC < newBoard[0].length && newC >= 0) {
                    if (newBoard[newR][newC] == 'M' || newBoard[newR][newC] == 'X') {
                        numAdjMines++;
                    }
                }
            }
            
            if (numAdjMines > 0) {
                newBoard[r][c] = numAdjMines.toString();
                setNumClickedTiles(numClickedTiles => numClickedTiles+1);
                return; // Early return when there are one or more adjacent mine(s)
            }
            else {
                newBoard[r][c] = 'B'; // Revealed square with no adjacent mines
                setNumClickedTiles(numClickedTiles => numClickedTiles+1);
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
        let newBoard = structuredClone(board);
        if (r >= newBoard.length || r < 0 || c >= newBoard[0].length || c < 0) {
            return newBoard;
        }
        if (newBoard[r][c] == 'M') {
            handleLoss(); // Game over
            return;
        }

        const visited = new Set();
        dfs(r, c, visited);
        setBoard(newBoard);
        return;
    }; // end of updateBoard function

    const revealMines = (originalBoard) => {
        let board = structuredClone(originalBoard);
        for (let i=0; i<board.length; i++) {
            for (let j=0; j<board[0].length; j++) {
                if (board[i][j] == 'M') {
                    board[i][j] = 'X'; 
                }
            }
        }
        setBoard(board);
    }

    const restartGame = () => {
        setGameState("PLAYING");
        setBoard(initialBoard);
        setNumClickedTiles(0);
    }

    const handleLoss = () => {
        setGameState("LOST");
        revealMines(board);
    }

    useEffect(()=> {
        if (gameState == "PLAYING" && numClickedTiles == rowSize*colSize - numOfMines) {
            setGameState("WON");
        }
        console.log(numClickedTiles);
    }, [numClickedTiles]);


  return (
    <GameContext.Provider value={{
        board,
        setBoard,
        updateBoard,
        restartGame,
        gameState
    }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);