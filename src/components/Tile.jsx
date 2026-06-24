import { useGame } from "../context/GameContext";
import bomb from '../assets/bomb.svg';

/**
 * 
 * Renders each tile of a minesweeper board
 * States:
 * - 'M' represents an unrevealed mine
 * - 'E' represents an unrevealed empty square
 * - 'B' represents a revealed blank square that has no adjacent mines (i.e., above, below, left, right, and all 4 diagonals)
 * - digit ('1' to '8') represents how many mines are adjacent to this revealed square
 * - 'X' represents a revealed mine
 * 
 * @param {*} props
 * @returns JSX
 */
function Tile({row, col, state}) {
    const { updateBoard, toggleFlag, gameState } = useGame();

    function renderContent(state) {
        if (Number(state) >= 1 && Number(state) <= 8) {
            return (<p className={state}>{state}</p>);
        }
        else if (state == 'X') {
            return (<img src={bomb} alt="X" width="16" height="16" />)
        }
        else {
            return (<p></p>);
        }
    }

    return (
        <button className={`tile ${(state !== 'E' && state !== 'M') ? "clicked-tile": ""}`} 
            disabled={gameState !== "PLAYING" || (state !== 'E' && state !== 'M')} 
            onClick={()=> updateBoard(row, col)}>
                {renderContent(state)}
        </button>
  )
}

export default Tile;
