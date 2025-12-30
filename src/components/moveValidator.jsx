import "../App.css"
import { useEffect, useState } from "react";
import { getPawnMoves, getRookMoves, getKnightMoves, getBishopMoves, getQueenMoves, getKingMoves } from "./pieceMoves";

const rows = 8;
const columns = 8;

export default function MoveValidator({ 
    pieceValue, 
    currentRow, 
    currentColumn, 
    boardState, 
    updateBoardState, 
    setCannotMovePiece, 
    setValidateMove, 
    setWhiteKingPos, 
    setBlackKingPos, 
    whiteKingPos, 
    blackKingPos, 
    setTurn,
    turn
}) {
   
    const cells = [];
    const BLACK = -1;
    const EMPTY = 0;
    const WHITE = 1;
    const currentPieceColor = boardState[currentRow][currentColumn] > 0 ? 1 : -1;
    const HUMAN = 1;
    const AI = -1;

    const [ validMoves, setValidMoves ] = useState(Array.from({ length: 8 }, () => Array(8).fill(0)));

    useEffect(() => {
        let tempMoves = Array.from({ length: 8 }, () => Array(8).fill(0));
        getValidMoves(tempMoves, pieceValue, currentRow, currentColumn, boardState, currentPieceColor, whiteKingPos, blackKingPos);
        setValidMoves(tempMoves);
        const tempValidMoves = tempMoves.flat();
        tempValidMoves.every(cell => cell === 0) ? setCannotMovePiece(true) : setCannotMovePiece(false);
    }, [pieceValue, currentRow, currentColumn]);

    function makeMove({boardState, row, column, validMovesValue, updateBoardState}) {
        const BLACK_KING = -6;
        const WHITE_KING = 6;

        if (validMovesValue === BLACK_KING) {
            setBlackKingPos([row, column]);
        }
        if (validMovesValue === WHITE_KING) {
            setWhiteKingPos([row, column]);
        }

        let tempState = boardState.map((row) => [...row]);
        tempState[row][column] = validMovesValue; 
        tempState[currentRow][currentColumn] = EMPTY;
        updateBoardState(tempState);
        setValidateMove(false);
        const nextTurn = turn === HUMAN ? AI : HUMAN;
        setTurn(nextTurn);
    }


    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            const NO_VALID_MOVES = 0;
            const validMovesValue = validMoves[row][column];

            cells.push(<button 
                key={`${row}:${column}`}
                className={( validMovesValue != NO_VALID_MOVES)? "valid-move" : "invalid-move"}
                onClick={() => { makeMove({boardState, row, column, validMovesValue, updateBoardState}); }} />)
        }
    }

    return (
        <div>
            <div className="grid-container">{cells}</div>
        </div>
    )
}

export function getValidMoves(tempMoves, pieceValue, currentRow, currentColumn, boardState, currentPieceColor, whiteKingPos, blackKingPos) {

    //Piece values are stored as strings inside the board state
    switch (pieceValue) {

        case -1:
        case 1:
            getPawnMoves(tempMoves, currentRow, currentColumn, boardState, currentPieceColor, whiteKingPos, blackKingPos);
            break;

        case -2:
        case 2:
            getRookMoves(tempMoves, currentRow, currentColumn, boardState, currentPieceColor, whiteKingPos, blackKingPos);
            break;

        case -3:
        case 3:
            getKnightMoves(tempMoves, currentRow, currentColumn, boardState, currentPieceColor, whiteKingPos, blackKingPos);
            break;
        
        case -4: 
        case 4: 
            getBishopMoves(tempMoves, currentRow, currentColumn, boardState, currentPieceColor, whiteKingPos, blackKingPos);
            break;
        
        case -5:
        case 5:
            getQueenMoves(tempMoves, currentRow, currentColumn, boardState, currentPieceColor, whiteKingPos, blackKingPos);
            break;
        
        case -6: 
        case 6: 
            getKingMoves(tempMoves, currentRow, currentColumn, boardState, currentPieceColor, whiteKingPos, blackKingPos)
            break;
    }
}