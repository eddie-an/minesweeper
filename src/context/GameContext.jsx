import { createContext, useContext, useState, useEffect } from "react";

const GameContext = createContext();

export function GameProvider({ children }) {

    // EASY mode: rowSize=8, colSize=10, and numOfMines=10
    // MEDIUM mode: rowSize=14, colSize=18, and numOfMines=40
    // HARD mode: rowSize=20, colSize=24, and numOfMines=99
    // * Refer to App.jsx for the modes

    // Determines the size of the board and number of mines
    const [rowSize, setRowSize] = useState(8);
    const [colSize, setColSize] = useState(10);
    const [numOfMines, setNumOfMines] = useState(10);

    // The board matrix
    // Each element in the 2D array contains the following JSON object: {value: val, flagged: true/false}
    const [board, setBoard] = useState([]);
    
    // States regarding the game progression
    // When numClickedTiles is equal to rowSize*colSize - numOfMines, gameState is set to "WON"
    const [numFlags, setNumFlags] = useState(0);
    const [numClickedTiles, setNumClickedTiles] = useState(0); 
    const [gameState, setGameState] = useState("PLAYING"); // Enumeration of "PLAYING", "WON", "LOST"

    /**
     * Generates the initial state of a minesweeper board. Randomizes the mine placements every time.
     * 
     * @param {number} rows - Number of rows in the generated board
     * @param {number} cols - Number of columns in the generated board
     * @param {number} mines - Number of mines to generate
     * @returns {string[][]} A 2D matrix that represents the minesweeper board.
     *  The possible values in each element of the board are:
     *  - 'M' for unrevealed mines
     *  - 'E' for unrevealed safe tile
     */
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


    /**
     * Handles the state changes of the board when the player clicks on a tile.
     * Uses depth first search algorithm to reveal all the adjacent tiles until those
     *  tiles are adjacent to one or more mines
     *  
     * The following React states are updated in this function:
     * - numFlags
     * - numClickedTiles
     * - board
     * 
     * The following are all the possible tile states/values in a board
     * - 'M' represents an unrevealed mine
     * - 'E' represents an unrevealed empty square
     * - 'B' represents a revealed blank square that has no adjacent mines (i.e., above, below, left, right, and all 4 diagonals)
     * - digit ('1' to '8') represents how many mines are adjacent to this revealed square
     * - 'X' represents a revealed mine
     * 
     * @param {Number} r - Clicked row number
     * @param {Number} c - Clicked column number
     * @returns {void} This function does not return a value. It updates states instead.
     */
    const updateBoard = (r, c) => {
        var dfs = function(r, c, visited) {
            if (r >= newBoard.length || r < 0 || c >= newBoard[0].length || c < 0) {
                return;
            }
            if (newBoard[r][c].value != 'E') {
                return;
            }

            visited.add(JSON.stringify([r,c])); // Keep track of visited tile location to prevent revisiting
            const changeDirs = [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]];
            
            // Count the adjacent mines for each tile
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
            
            // Recursively search adjacent cells that have not been visited yet
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
            // The function doesn't do anything if a tile is flagged (rendering it unclickable) 
            // or if the game is over (either the player has won or lost)
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


    /**
     * 
     * Converts all 'M' states in the board to 'X' states.
     * In other words, unrevealed mines are revealed.
     * 
     * This function executes when the player loses and the game ends, revealing all the mines.
     * 
     * The following React state is updated in this function: board
     * 
     * @param {string[][]} board -  A 2D matrix that represents the minesweeper board
     * @return {void} This function does not return a value. It updates states instead.
     */
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


    /**
     * Handles the flag toggling of a tile when the player right-clicks on it.
     * 
     * 
     * The following React states are updated in this function:
     * - numFlags
     * - board
     * 
     * @param {Number} r - Clicked row number
     * @param {Number} c - Clicked column number
     * @returns {void} This function does not return a value. It updates states instead.
     */
    const toggleFlag = (r,c) => {
        let newBoard = structuredClone(board);
        if (r >= newBoard.length || r < 0 || c >= newBoard[0].length || c < 0) {
            return;
        }
        
        // The function doesn't do anything if the game is over
        if (gameState !== "PLAYING") return;

        // The function only allows flagging tiles that are not yet revealed.
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


    /**
     * Resets all the states of the game and generates a new board.
     * Used for when the user wants to restart the game and play again.
     * 
     * @param {number} rows - Number of rows to generate
     * @param {number} cols - Number of columns to generate
     * @param {number} mines - Number of mines to generate
     * @return {void} This function does not return a value. It updates states instead
     */
    const restartGame = (rows = rowSize, cols = colSize, mines = numOfMines) => {
        setGameState("PLAYING");
        setBoard(generateBoard(rows, cols, mines));
        setRowSize(rows);
        setColSize(cols);
        setNumOfMines(mines);
        setNumClickedTiles(0);
        setNumFlags(0);
    };

    /**
     * This function executes when the player loses. 
     * The game state is set to LOST and all the mines are revealed.
     */
    const handleLoss = () => {
        setGameState("LOST");
        revealMines(board);
    }


    /**
     * Whenever any of the states regarding game progression changes, the use effect hook checks for win conditions
     * When numClickedTiles is equal to rowSize*colSize - numOfMines, gameState is set to "WON"
     */
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