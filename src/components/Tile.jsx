import { useGame } from "../context/GameContext";
import bomb from '../assets/bomb.svg';
import flag from '../assets/flag.svg'
import cross from '../assets/x.svg'

/**
 * 
 * Renders each tile of a minesweeper board
 * 
 * @param {number} row - Row number of tile
 * @param {number} col - Column number of tile
 * @param {string} state - State of tile.
 *  Accepted values are as follows:
 *  - 'M' represents an unrevealed mine
 *  - 'E' represents an unrevealed empty square
 *  - 'B' represents a revealed blank square that has no adjacent mines (i.e., above, below, left, right, and all 4 diagonals)
 *  - digit ('1' to '8') represents how many mines are adjacent to this revealed square
 *  - 'X' represents a revealed mine
 * @param {boolean} flagged - Represents if the tile is flagged. Tiles can be flagged by right clicking on it
 * @returns {JSX} The tile at location row, col with state and flagged attributes rendered accordingly.
 */
function Tile({row, col, state, flagged}) {
    const { updateBoard, toggleFlag, gameState } = useGame(); // Global states and functions

    /**
     * Helper function for rendering content
     * The tile can have a bomb, flag, cross, or a number depending on the game state, tile state, and flags.
     * 
     * @param {string} state - State of tile.
     * @param {boolean} flagged - Represents if the tile is flagged. Tiles can be flagged by right clicking on it
     * @param {string} gameState - Emueration representing the global state of the game. 
     *  The values are either "PLAYING", "LOST", or "WON".
     * @returns {JSX} The rendered content of each tile based on its state and flagged value.
     */
    function renderContent(state, flagged, gameState) {
        if (gameState === "LOST") { // Game state is "LOST"
            if (state === 'X' || state === 'M') {
                return (<img src={flagged ? flag : bomb} alt={flagged ? "F": "X"} width="16" height="16" />);
            }
            else if (Number(state) >= 1 && Number(state) <= 8) {
                return (<p className={`tile-${state} number-tile`}>{state}</p>);
            }
            else if (state === 'B') {
                return (<p></p>); 
            }
            else if (state === 'E') {
                return (
                    flagged ? 
                    <img src={cross} alt={state} width="16" height="16" /> : // Cross to indicate the user's assumption was wrong
                    <p></p> 
                );
            }
            else {
                return (<p></p>);
            }
        }
        else { // Game state is "PLAYING" or "WON"
            if (state === 'X') { // This state is redundant but kept in here for completeness
                return (<img src={bomb} alt="X" width="16" height="16" />)
            }
            else if (Number(state) >= 1 && Number(state) <= 8) {
                return (<p className={`tile-${state} number-tile`}>{state}</p>);
            }
            else if (state === 'B') {
                return (<p></p>);
            }
            else if (state === 'E' || state === 'M') {
                return (
                    flagged ? 
                    <img src={flag} alt="F" width="16" height="16" /> : // Cross to indicate the user's assumption was wrong
                    <p></p> 
                );
            }
            else {
                return (<p></p>);
            }
        }
    }

    // onClick handles left clicks and onContextMenu handles right click (for marking flags)
    return (
        <button className={`tile ${(state !== 'E' && state !== 'M') ? "clicked-tile": ""}`} 
            disabled={gameState !== "PLAYING" || (state !== 'E' && state !== 'M') || flagged} 
            onClick={()=> updateBoard(row, col)}
            onContextMenu={(e) => {
                e.preventDefault();
                toggleFlag(row, col);
            }}>
                {renderContent(state, flagged, gameState)}
        </button>
  )
}

export default Tile;
