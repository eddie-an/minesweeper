import { createContext, useContext, useState, useEffect } from "react";

const GameContext = createContext();

export function GameProvider({ children }) {

    // medium size is row size of 14 and column size of 18
    // small size is row size of 8 and col size of 10
    const [rowSize, setRowSize] = useState(8);
    const [colSize, setColSize] = useState(10);
    const [numOfMines, setNumOfMines] = useState(10);

    const [board, setBoard] = useState([]);
    
    const [numFlags, setNumFlags] = useState(0);
    const [numClickedTiles, setNumClickedTiles] = useState(0); // When numClickedTiles is equal to rowSize*colSize - numOfMines, we win
    const [gameState, setGameState] = useState("PLAYING"); // Enumeration of PLAYING, WON, LOST

    const generateBoard = (rows, cols, mines) => {
        const initialMatrix = Array.from({ length: rows }, () =>
            Array(cols).fill('E')
        );

        const mineSet = new Set();

        while (mineSet.size < mines) {
            const r = Math.floor(Math.random() * rows);
            const c = Math.floor(Math.random() * cols);
            mineSet.add(`${r},${c}`);
        }

        for (let pos of mineSet) {
            const [r, c] = pos.split(",").map(Number);
            initialMatrix[r][c] = "M";
        }

        return initialMatrix.map(row =>
            row.map(val => ({ value: val, flagged: false }))
        );
    };


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
                if (newBoard[r][c].flagged) {
                    newBoard[r][c].flagged = false;
                    setNumFlags(numFlags => numFlags - 1);
                }
                setNumClickedTiles(numClickedTiles => numClickedTiles+1);
                return; // Early return when there are one or more adjacent mine(s)
            }
            else {
                newBoard[r][c].value = 'B'; // Revealed square with no adjacent mines
                if (newBoard[r][c].flagged) {
                    newBoard[r][c].flagged = false;
                    setNumFlags(numFlags => numFlags - 1);
                }
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
        
        let newBoard = structuredClone(board);
        if (r >= newBoard.length || r < 0 || c >= newBoard[0].length || c < 0) {
            return;
        }
        if (newBoard[r][c].flagged === true || gameState !== "PLAYING") {
            return;
        }
        if (newBoard[r][c].value == 'M') {
            handleLoss(); // Game over
            return;
        }
        
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
                }
            }
        }
        setBoard(newBoard);
    }


    const toggleFlag = (r,c) => {
        let newBoard = structuredClone(board);
        if (r >= newBoard.length || r < 0 || c >= newBoard[0].length || c < 0) {
            return;
        }
        if (gameState !== "PLAYING") return;
        if (board[r][c].value !== 'M' && board[r][c].value !== 'E') return;

        if (newBoard[r][c].flagged) {
            newBoard[r][c].flagged = false;
            setNumFlags(numFlags => numFlags-1);
        }
        else {
            newBoard[r][c].flagged = true;
            setNumFlags(numFlags => numFlags+1);
        }
        
        setBoard(newBoard);
        

    };


    const restartGame = (rows = rowSize, cols = colSize, mines = numOfMines) => {
        setGameState("PLAYING");
        setBoard(generateBoard(rows, cols, mines));
        setRowSize(rows);
        setColSize(cols);
        setNumOfMines(mines);
        setNumClickedTiles(0);
        setNumFlags(0);
    };

    const handleLoss = () => {
        setGameState("LOST");
        revealMines(board);
    }


    useEffect(()=> {
        const totalSafeTiles = rowSize * colSize - numOfMines;
        if (gameState == "PLAYING" && numClickedTiles == totalSafeTiles) {
            setGameState("WON");
        }
    }, [numClickedTiles, rowSize, colSize, numOfMines, gameState]);


  return (
    <GameContext.Provider value={{
        rowSize,
        setRowSize,
        colSize,
        setColSize,
        numOfMines,
        setNumOfMines,
        board,
        updateBoard,
        toggleFlag,
        numFlags,
        restartGame,
        gameState
    }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);