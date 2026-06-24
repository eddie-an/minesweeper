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
    ].map(row =>
        row.map(val => ({
            value: val,
            flagged: false
        }))
    );
    const [board, setBoard] = useState(initialBoard);
    
    const [numClickedTiles, setNumClickedTiles] = useState(0); // When numClickedTiles is equal to rowSize*colSize - numOfMines, we win
    const [gameState, setGameState] = useState("PLAYING"); // Enumeration of PLAYING, WON, LOST

    const updateBoard = (r, c) => {
        var dfs = function(r, c, visited) {
            if (r >= newBoard.length || r < 0 || c >= newBoard[0].length || c < 0) {
                return;
            }
            if (newBoard[r][c].value != 'E') {
                return;
            }

            visited.add(JSON.stringify([r,c]));
            const changeDirs = [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]];

            let numAdjMines = 0;
            for (const dir of changeDirs) {
                const newR = r+dir[0];
                const newC = c+dir[1];
                if (newR < newBoard.length && newR >= 0 && newC < newBoard[0].length && newC >= 0) {
                    if (newBoard[newR][newC].value == 'M' || newBoard[newR][newC].value == 'X') {
                        numAdjMines++;
                    }
                }
            }
            
            if (numAdjMines > 0) {
                newBoard[r][c].value = numAdjMines.toString();
                newBoard[r][c].flagged = false;
                setNumClickedTiles(numClickedTiles => numClickedTiles+1);
                return; // Early return when there are one or more adjacent mine(s)
            }
            else {
                newBoard[r][c].value = 'B'; // Revealed square with no adjacent mines
                newBoard[r][c].flagged = false;
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
        }; // end of nested DFS function
        
        if (r >= board.length || r < 0 || c >= board[0].length || c < 0) {
            return;
        }
        if (board[r][c].flagged === true || gameState !== "PLAYING") {
            return;
        }
        if (board[r][c].value == 'M') {
            handleLoss(); // Game over
            return;
        }
        let newBoard = structuredClone(board);
        
        const visited = new Set();
        dfs(r, c, visited);
        setBoard(newBoard);
    }; // end of updateBoard function


    const revealMines = (board) => {
        let newBoard = structuredClone(board);
        for (let i=0; i<newBoard.length; i++) {
            for (let j=0; j<newBoard[0].length; j++) {
                if (newBoard[i][j].value == 'M') {
                    newBoard[i][j].value = 'X';
                    newBoard[i][j].flagged = false;
                }
            }
        }
        setBoard(newBoard);
    }


    const toggleFlag = (r,c) => {
        if (r >= board.length || r < 0 || c >= board[0].length || c < 0) {
            return;
        }
        if (board[r][c].value !== 'M' && board[r][c].value !== 'E' || gameState !== "PLAYING") {
            return;
        }
        let newBoard = structuredClone(board);
        newBoard[r][c].flagged = !newBoard[r][c].flagged;
        setBoard(newBoard);
        

    };


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
        toggleFlag,
        restartGame,
        gameState
    }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);