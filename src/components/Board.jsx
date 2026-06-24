
import Tile from './Tile.jsx'

function Board({rowSize, colSize, matrix, updateBoard, isGameOver}) {
    return (
        <div id="board">
            {matrix.map((arr, rowNum)=> {
                return (
                    <div key={rowNum} className="row">
                    {
                        arr.map((elem, colNum)=> {
                            return (
                                <Tile key={`${rowNum}-${colNum}`} matrix={matrix} row={rowNum} col={colNum} state={elem} updateBoard={updateBoard} isGameOver={isGameOver}/>
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
