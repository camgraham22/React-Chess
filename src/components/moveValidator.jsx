import "../App.css"
import { useEffect, useState } from "react";

export default function MoveValidator({pieceValue, currentRow, currentColumn, boardState, updateBoardState}) {
    const rows = 8;
    const columns = 8;
    const cells = [];

    const [ kingRow, setKingRow ] = useState(7);
    const [ kingColumn, setKingColumn ] = useState(0);
    const EMPTY = 0;
    const WHITE = 1;
    const BLACK = -1;
    const validMoves = getValidMoves();

 
    

    function getValidMoves() {

        const tempMoves = Array.from({ length: 8 }, () => Array(8).fill(0));

        //Piece values are stored as strings inside the board state
        switch (Number(pieceValue)) {
            case 1:
                getPawnMoves(tempMoves, currentRow, currentColumn);
                break;

            case 2:
                getRookMoves(tempMoves, currentRow, currentColumn);
                break;

            case 3:
                getKnightMoves(tempMoves, currentRow, currentColumn);
                break;
            
            case 4: 
                getBishopMoves(tempMoves, currentRow, currentColumn);
                break;
            
            case 5:
                getQueenMoves(tempMoves, currentRow, currentColumn);
                break;
            
            case 6: 
                getKingMoves(tempMoves, currentRow, currentColumn);
                console.log(kingRow + ":" + kingColumn);
                break;

            case -1:
                getPawnMoves(tempMoves, currentRow, currentColumn, BLACK);
                break;

            case -6: 
                getKingMoves(tempMoves, currentRow, currentColumn, BLACK);
                console.log(kingRow + ":" + kingColumn);
                break;
        }

        isInCheck();

        return tempMoves;
    }

    function makeMove({boardState, row, column, validMovesValue, updateBoardState}) {
        let tempState = boardState.map((row) => [...row]);
        tempState[row][column] = validMovesValue; 
        if (validMovesValue === -6) {
            setKingRow(row);
            setKingColumn(column);
        }
        tempState[currentRow][currentColumn] = EMPTY;
        updateBoardState(tempState);
    }

    function getPawnMoves(tempMoves, currentRow, currentColumn, pieceColor) {

        if (pieceColor === WHITE) {
            const PAWN_MOVE = 1;

            if (currentRow === 6) {
                if (boardState[currentRow - 2][currentColumn] === EMPTY) {
                    tempMoves[currentRow - 2][currentColumn] = PAWN_MOVE;
                }
            }
            if (inBounds(currentRow, currentColumn)) {
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
        else if (pieceColor === BLACK) {
            const PAWN_MOVE = -1;
            
            if (currentRow === 1) {
                if (boardState[currentRow + 2][currentColumn] === EMPTY) {
                    tempMoves[currentRow + 2][currentColumn] = PAWN_MOVE;
                }
            }
            if (inBounds(currentRow, currentColumn)) {
                if (boardState[currentRow + 1][currentColumn] === EMPTY) {
                    tempMoves[currentRow + 1][currentColumn] = PAWN_MOVE;
                }
                if (isEnemyPiece(boardState[currentRow + 1][currentColumn - 1])) {
                    tempMoves[currentRow + 1][currentColumn - 1] = PAWN_MOVE;
                }
                if (isEnemyPiece(boardState[currentRow + 1][currentColumn + 1])) {
                    tempMoves[currentRow + 1][currentColumn + 1] = PAWN_MOVE;
                }
            }
        }
    }

    function getRookMoves(tempMoves, currentRow, currentColumn) {
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

    function getKnightMoves(tempMoves, currentRow, currentColumn) {
        const SHORT_LEFT = -1;
        const LONG_LEFT = -2;
        const SHORT_RIGHT = 1;
        const LONG_RIGHT = 2;
        const SHORT_DOWN = 1;
        const LONG_DOWN = 2;
        const SHORT_UP = -1;
        const LONG_UP = -2;

        knightMoves(currentRow, currentColumn, SHORT_UP, LONG_LEFT, tempMoves);
        knightMoves(currentRow, currentColumn, LONG_UP, SHORT_LEFT, tempMoves);
        knightMoves(currentRow, currentColumn, SHORT_UP, LONG_RIGHT, tempMoves);
        knightMoves(currentRow, currentColumn, LONG_UP, SHORT_RIGHT, tempMoves);
        knightMoves(currentRow, currentColumn, SHORT_DOWN, LONG_LEFT, tempMoves);
        knightMoves(currentRow, currentColumn, LONG_DOWN, SHORT_LEFT, tempMoves);
        knightMoves(currentRow, currentColumn, SHORT_DOWN, LONG_RIGHT, tempMoves);
        knightMoves(currentRow, currentColumn, LONG_DOWN, SHORT_RIGHT, tempMoves);

    }

    function getBishopMoves(tempMoves, currentRow, currentColumn) {
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

    function getQueenMoves(tempMoves) {
        const QUEEN_MOVE = 5;
        const NO_VERTICAL_MOVE = 0;
        const NO_HORIZONTAL_MOVE = 0;
        const LEFT = -1;
        const RIGHT = 1;
        const DOWN = 1;
        const UP = -1;

        diagonalMoves(currentRow, currentColumn, UP, LEFT, tempMoves, QUEEN_MOVE);
        diagonalMoves(currentRow, currentColumn, UP, RIGHT, tempMoves, QUEEN_MOVE);
        diagonalMoves(currentRow, currentColumn, DOWN, LEFT, tempMoves, QUEEN_MOVE);
        diagonalMoves(currentRow, currentColumn, DOWN, RIGHT, tempMoves, QUEEN_MOVE);

        lineMoves(currentRow, currentColumn, UP, NO_HORIZONTAL_MOVE, tempMoves, QUEEN_MOVE);
        lineMoves(currentRow, currentColumn, NO_VERTICAL_MOVE, RIGHT, tempMoves, QUEEN_MOVE);
        lineMoves(currentRow, currentColumn, DOWN, NO_HORIZONTAL_MOVE, tempMoves, QUEEN_MOVE);
        lineMoves(currentRow, currentColumn, NO_VERTICAL_MOVE, LEFT, tempMoves, QUEEN_MOVE);

    }

    function getKingMoves(tempMoves, currentRow, currentColumn, pieceColor) {
        const NO_VERTICAL_MOVE = 0;
        const NO_HORIZONTAL_MOVE = 0;
        const LEFT = -1;
        const RIGHT = 1;
        const DOWN = 1;
        const UP = -1;

        //Horizontal and veritical
        adjacentMoves(currentRow, currentColumn, UP, NO_HORIZONTAL_MOVE, tempMoves, pieceColor);
        adjacentMoves(currentRow, currentColumn, NO_VERTICAL_MOVE, RIGHT, tempMoves, pieceColor);
        adjacentMoves(currentRow, currentColumn, DOWN, NO_HORIZONTAL_MOVE, tempMoves, pieceColor);
        adjacentMoves(currentRow, currentColumn, NO_VERTICAL_MOVE, LEFT, tempMoves, pieceColor);
        
        //Diagonal
        adjacentMoves(currentRow, currentColumn, UP, LEFT, tempMoves, pieceColor);
        adjacentMoves(currentRow, currentColumn, UP, RIGHT, tempMoves, pieceColor);
        adjacentMoves(currentRow, currentColumn, DOWN, LEFT, tempMoves, pieceColor);
        adjacentMoves(currentRow, currentColumn, DOWN, RIGHT, tempMoves, pieceColor);
        
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

    function adjacentMoves(currentRow, currentColumn, stepVertical, stepHorizontal, tempMoves, pieceColor) {
        let KING_MOVE = 0;
        pieceColor === WHITE ? KING_MOVE = 6 : KING_MOVE = -6; 
        // if (pieceColor === WHITE) { const KING_MOVE = 6; }
        // if (pieceColor === BLACK) { const KING_MOVE = -6; }
        const tempRow = currentRow + stepVertical;
        const tempColumn = currentColumn + stepHorizontal;

        if (inBounds( tempRow, tempColumn )) {
            if (!isFriendlyPiece(boardState[tempRow][tempColumn])) {
                tempMoves[tempRow][tempColumn] = KING_MOVE;
            }
        }
    }

    function knightMoves(currentRow, currentColumn, stepVertical, stepHorizontal, tempMoves) {
        const KNIGHT_MOVE = 3;
        const tempRow = currentRow + stepVertical;
        const tempColumn = currentColumn + stepHorizontal;

        if (inBounds( tempRow, tempColumn )) {
            if (!isFriendlyPiece(boardState[tempRow][tempColumn])) {
                tempMoves[tempRow][tempColumn] = KNIGHT_MOVE;
            }
        }
    }

    function isInCheck() {
        const tempMoves = Array.from({ length: 8 }, () => Array(8).fill(0));

        const rows = 8;
        const columns = 8;
        
        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
                switch (Number(boardState[row][column])) {
                    case 1:
                        getPawnMoves(tempMoves, row, column);
                        break;

                    case 2:
                        getRookMoves(tempMoves, row, column);
                        break;

                    case 3:
                        getKnightMoves(tempMoves, row, column);
                        break;
                    
                    case 4: 
                        getBishopMoves(tempMoves, row, column);
                        break;
                    
                    case 5:
                        getQueenMoves(tempMoves, row, column);
                        break;
                    
                    case 6: 
                        getKingMoves(tempMoves, row, column);
                        break;
                }
            }
        }
        console.log(tempMoves[kingRow][kingColumn]);
        if (tempMoves[kingRow][kingColumn] != 0) {
            console.log("HOLY SHIT KING IN CHECK!!!")
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