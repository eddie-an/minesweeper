
function Tile({matrix, row, col, state, updateBoard, isGameOver}) {

  return (
        <button className="tile" disabled={isGameOver || (state !== 'E' && state !== 'M')} onClick={()=> updateBoard(matrix, row, col)}>
            <p>{state !== 'E' && state !== 'M' ? state : ""}</p>
        </button>
  )
}

export default Tile
