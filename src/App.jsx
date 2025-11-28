import { useState } from 'react'
import './App.css'
import ChessBoard from './components/board.jsx'
// import Pawn from './components/chess-pieces/pawn.jsx'

function App() {


  const initialBoard = Array.from({ length: 8 }, () => Array(8).fill("0"));
  const initialBoardValues = [-2,-3,-4,-5,-6,-4,-3,-2,-1,-1,-1,-1,-1,-1,-1,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,2,3,4,5,6,4,3,2];
  const columns = 8;
  const rows = 8;

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      initialBoard[row][column] = initialBoardValues[column + 8 * row];
    }
  }
  const [ boardState, updateBoardState] = useState(initialBoard);

  function resetBoard() {
    updateBoardState(initialBoard);
  }

  return (
    <div className="app-container">
          <ChessBoard boardState={boardState} updateBoardState={updateBoardState} resetBoard={resetBoard} />
    </div>
  )
}

export default App
