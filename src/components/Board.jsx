import { useGame } from "../context/GameContext";
import Tile from './Tile.jsx'

/**
 * Renders the minesweeper board
 * Creates nested divs by iterating through the board matrix.
 * 
 * @returns {JSX} The rendered grid representing the minesweeper board
 */
function Board() {
    const { board, colSize } = useGame(); // global states
    return (
        <div id="board"  style={{"--cols": colSize}}> {/*  colSize is for dynamic sizing */}
            {board.map((arr, rowNum)=> {
                return (
                    <div key={rowNum} className="row">
                    {
                        arr.map((elem, colNum)=> {
                            return (
                                <Tile key={`${rowNum}-${colNum}`} row={rowNum} col={colNum} state={elem.value} flagged={elem.flagged}/>
                            );
                        })
                    }
                    </div>
                );
            })}

        </div>
    )
}

export default Board
