import { useState, useEffect } from 'react';
import '../App.css';
import MoveValidator from './moveValidator';
import { getValidMoves } from './moveValidator';

export default function ChessBoard({boardState, updateBoardState, resetBoard}) {

    const [ currentRow, setCurrentRow ] = useState(-1);
    const [ currentColumn, setCurrentColumn ] = useState(-1);
    const [ validateMove , setValidateMove ] = useState(false);
    const [ cannotMovePiece, setCannotMovePiece ] = useState(false);
    const [ whiteCheckmate, setWhiteCheckmate ] = useState(false);
    const [ blackCheckmate, setBlackCheckmate ] = useState(false);
    const [ whiteKingPos, setWhiteKingPos ] = useState([7,4]);
    const [ blackKingPos, setBlackKingPos ] = useState([0,4]);

    const CHESS_PIECE_IMAGES = {
       "-6": {img: "black-king.png"},
       "-5": {img: "black-queen.png"},
       "-4": {img: "black-bishop.png"},
       "-3": {img: "black-knight.png"},
       "-2": {img: "black-rook.png"},
       "-1": {img: "black-pawn.png"},
        "1": {img: "white-pawn.png"},
        "2": {img: "white-rook.png"},
        "3": {img: "white-knight.png"},
        "4": {img: "white-bishop.png"},
        "5": {img: "white-queen.png"},
        "6": {img: "white-king.png"},
    };
    const columns = 8;
    const rows = 8;
    const cells = [];
    let lastCellBlack = false;
    let tempWhiteMoves = Array.from({ length: 8 }, () => Array(8).fill(0));
    let tempBlackMoves = Array.from({ length: 8 }, () => Array(8).fill(0));
    
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            const pieceValue = boardState[row][column];
            const pieceImage = CHESS_PIECE_IMAGES[pieceValue]?.img;
            const currentPieceColor = pieceValue > 0 ? 1 : -1;
            if (isWhite(pieceValue)) {
                getValidMoves(tempWhiteMoves, pieceValue, row, column, boardState, currentPieceColor, whiteKingPos, blackKingPos);
            }
            if (isBlack(pieceValue)) {
                getValidMoves(tempBlackMoves, pieceValue, row, column, boardState, currentPieceColor, whiteKingPos, blackKingPos);
            }
            cells.push(
                <button 
                    key={`${row}:${column}`} 
                    className={lastCellBlack ? "white" : "black"}
                    onClick={() => {setValidateMove(true), setCurrentRow(row), setCurrentColumn(column)}}>
                    {!(pieceImage === undefined) && <img src={pieceImage} className="chess-image"></img>}
                </button>);
            lastCellBlack = !lastCellBlack;
        }
        lastCellBlack = !lastCellBlack;

    }

    useEffect(() => {
        const tempValidMoves = tempWhiteMoves.flat();
        const newCheckmate = tempValidMoves.every(cell => cell === 0);
        console.log("White checkmate: " + newCheckmate);
        setWhiteCheckmate(newCheckmate);
    }, [tempWhiteMoves]);

    useEffect(() => {
        const tempValidMoves = tempBlackMoves.flat();
        const newCheckmate = tempValidMoves.every(cell => cell === 0);
        console.log("Black checkmate: " + newCheckmate);
        setBlackCheckmate(newCheckmate);
    }, [tempBlackMoves]);

    function isWhite(pieceValue) {
        return pieceValue > 0;
    }
    function isBlack(pieceValue) {
        return pieceValue < 0;
    }
    const checkmateWinner = (blackCheckmate) ? "White" : "Black";
    const checkmateText = `\n${checkmateWinner} wins!`
    return (    
        <div>
            {(whiteCheckmate || blackCheckmate) && <div className="game-over"><div>Game over!<p>{checkmateText}</p><button className="play-again-btn" onClick={() => resetBoard()}>Play Again</button></div></div>}
            {cannotMovePiece && <div className="pop-up">This piece can't be moved.<br /> It's blocked or king would be in check!</div>}
            <div className="chess-board-container">
                    {validateMove &&
                     <MoveValidator 
                        pieceValue={boardState[currentRow][currentColumn]} 
                        currentRow={currentRow} currentColumn={currentColumn} 
                        boardState={boardState} updateBoardState={updateBoardState} 
                        setCannotMovePiece={setCannotMovePiece}
                        setValidateMove={setValidateMove}
                        setWhiteKingPos={setWhiteKingPos}
                        setBlackKingPos={setBlackKingPos}
                        whiteKingPos={whiteKingPos}
                        blackKingPos={blackKingPos} />}
                <div className="grid-container">{cells}</div>
            </div>
        </div>
    );
}   