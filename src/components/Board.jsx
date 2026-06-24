import { useGame } from "../context/GameContext";
import Tile from './Tile.jsx'

function Board() {
    const { board, colSize } = useGame();
    return (
        <div id="board"  style={{"--cols": colSize}}>
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
