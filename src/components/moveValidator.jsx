import "../App.css"
import { useEffect, useState } from "react";

export default function MoveValidator({pieceValue, currentRow, currentColumn, boardState, updateBoardState}) {
    const rows = 8;
    const columns = 8;
    const cells = [];

    const FRIENDLY = 1
    const EMPTY = 0;
    const ENEMY = -1
    const validMoves = showValidMoves();
 
    

    function showValidMoves() {

        console.log("Showing valid moves");

        const tempMoves = Array.from({ length: 8 }, () => Array(8).fill(0));

        //Piece values are stored as strings inside the board state
        switch (Number(pieceValue)) {
            case 1:
                getPawnMoves(tempMoves);
                break;

            case 2:
                getRookMoves(tempMoves);
                break;
            
            case 4: 
                getBishopMoves(tempMoves);
                break;
        }

        return tempMoves;
    }

    function makeMove({boardState, row, column, validMovesValue, updateBoardState}) {
        let tempState = boardState.map((row) => [...row]);
        tempState[row][column] = validMovesValue; 
        tempState[currentRow][currentColumn] = EMPTY;
        updateBoardState(tempState);
    }

    function getPawnMoves(tempMoves) {
        const PAWN_MOVE = 1;

        if (currentRow === 6) {
            if (boardState[currentRow - 2][currentColumn] === EMPTY) {
                tempMoves[currentRow - 2][currentColumn] = PAWN_MOVE;
            }
        }
        if (currentRow >= 1 && inBounds(currentRow, currentColumn)) {
            if (boardState[currentRow - 1][currentColumn] === EMPTY) {
                tempMoves[currentRow - 1][currentColumn] = PAWN_MOVE;
            }
            if (isEnemyPiece(boardState[currentRow - 1][currentColumn - 1])) {
                tempMoves[currentRow - 1][currentColumn - 1] = PAWN_MOVE;
            }
            if (isEnemyPiece(boardState[currentRow - 1][currentColumn + 1])) {
                tempMoves[currentRow - 1][currentColumn + 1] = PAWN_MOVE;
            }
        }
    }

    function getRookMoves(tempMoves) {
        const ROOK_MOVE = 2;
        const NO_VERTICAL_MOVE = 0;
        const NO_HORIZONTAL_MOVE = 0;
        const LEFT = -1;
        const RIGHT = 1;
        const DOWN = 1;
        const UP = -1;

        lineMoves(currentRow, currentColumn, UP, NO_HORIZONTAL_MOVE, tempMoves, ROOK_MOVE);
        lineMoves(currentRow, currentColumn, NO_VERTICAL_MOVE, RIGHT, tempMoves, ROOK_MOVE);
        lineMoves(currentRow, currentColumn, DOWN, NO_HORIZONTAL_MOVE, tempMoves, ROOK_MOVE);
        lineMoves(currentRow, currentColumn, NO_VERTICAL_MOVE, LEFT, tempMoves, ROOK_MOVE);
    }

    function getBishopMoves(tempMoves) {
        const BISHOP_MOVE = 4;
        const LEFT = -1;
        const RIGHT = 1;
        const DOWN = 1;
        const UP = -1;

        diagonalMoves(currentRow, currentColumn, UP, LEFT, tempMoves, BISHOP_MOVE);
        diagonalMoves(currentRow, currentColumn, UP, RIGHT, tempMoves, BISHOP_MOVE);
        diagonalMoves(currentRow, currentColumn, DOWN, LEFT, tempMoves, BISHOP_MOVE);
        diagonalMoves(currentRow, currentColumn, DOWN, RIGHT, tempMoves, BISHOP_MOVE);

    }

    function lineMoves(startingRow, startingColumn, stepVertical, stepHorizontal, tempMoves, pieceMoveValue) {
        let tempCurrentRow = startingRow + stepVertical;
        let tempCurrentColumn = startingColumn + stepHorizontal;

        while (inBounds( tempCurrentRow, tempCurrentColumn )) {
            if (isFriendlyPiece(boardState[tempCurrentRow][tempCurrentColumn])) { break; }
            tempMoves[tempCurrentRow][tempCurrentColumn] = pieceMoveValue;
            if (isEnemyPiece(boardState[tempCurrentRow][tempCurrentColumn])) { break; }
            tempCurrentRow += stepVertical;
            tempCurrentColumn += stepHorizontal;
        }
    }

    function diagonalMoves(startingRow, startingColumn, stepVertical, stepHorizontal, tempMoves, pieceMoveValue) {
        let tempCurrentRow = startingRow + stepVertical;
        let tempCurrentColumn = startingColumn + stepHorizontal;

        while (inBounds( tempCurrentRow, tempCurrentColumn )) {
            if (isFriendlyPiece(boardState[tempCurrentRow][tempCurrentColumn])) { break; }
            tempMoves[tempCurrentRow][tempCurrentColumn] = pieceMoveValue;
            if (isEnemyPiece(boardState[tempCurrentRow][tempCurrentColumn])) { break; }
            tempCurrentRow += stepVertical;
            tempCurrentColumn += stepHorizontal;
        }
    }

    function inBounds(row, column) {
        return ( row >= 0 && row <= 7 ) && ( column >= 0 && column <= 7 );
    }

    function isEnemyPiece(pieceValue) {
        return pieceValue < 0;
    }
    
    function isFriendlyPiece(pieceValue) {
        return pieceValue > 0;
    }   

    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            const NO_VALID_MOVES = 0;
            const validMovesValue = validMoves[row][column];

            cells.push(<button 
                key={`${row}:${column}`}
                className={( validMovesValue != NO_VALID_MOVES)? "valid-move" : "invalid-move"}
                onClick={() => makeMove({boardState, row, column, validMovesValue, updateBoardState})} />)
        }
    }

    return (
        <div className="grid-container">{cells}</div>
    )
}