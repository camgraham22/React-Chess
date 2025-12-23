import { inBounds, isFriendlyPiece, isEnemyPiece, isEdge } from "./pieceMoves";

const WHITE = 1;
const EMPTY = 0;
const BLACK = -1;
const ENEMY = -1;
const FRIENDLY = 1;

export default function isInCheck(boardState, kingPos, kingColor) {
    const tempMoves = Array.from({ length: 8 }, () => Array(8).fill(0));
    const rows = 8;
    const columns = 8;
  
    if (!Array.isArray(kingPos) || kingPos.length < 2) {
        return false; 
    }

    if (!inBounds(kingPos[0], kingPos[1])) {
        return false;
    }
    const kingPosRow = kingPos[0];
    const kingColumnRow = kingPos[1];
    
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            const currentPieceColor = boardState[row][column] > 0 ? WHITE : BLACK;
            if (isEnemyPiece(currentPieceColor, kingColor)) {
                getAllValidMoves(boardState, tempMoves, row, column, currentPieceColor, ENEMY);
            }
        }
    }

    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            const currentPieceColor = boardState[row][column] > 0 ? WHITE : BLACK;
            if (isFriendlyPiece(currentPieceColor, kingColor))
            getAllValidMoves(boardState, tempMoves, row, column, currentPieceColor, FRIENDLY);
        }
    }

    if (isEnemyPiece(tempMoves[kingPosRow][kingColumnRow], kingColor)) {
        return true;
    }
}

function getAllValidMoves(boardState, tempMoves, row, column, currentPieceColor, turn) {

        switch (boardState[row][column]) {
            case -1:
            case 1:
                getAllPawnMoves(tempMoves, row, column, boardState, currentPieceColor, turn);
                break;

            case -2:
            case 2:
                getAllRookMoves(tempMoves, row, column, boardState, currentPieceColor, turn);
                break;

            case -3:
            case 3:
                getAllKnightMoves(tempMoves, row, column, boardState, currentPieceColor, turn);
                break;
            
            case -4: 
            case 4: 
                getAllBishopMoves(tempMoves, row, column, boardState, currentPieceColor, turn);
                break;
            
            case -5:
            case 5:
                getAllQueenMoves(tempMoves, row, column, boardState, currentPieceColor, turn);
                break;
            
            case -6: 
            case 6: 
                getAllKingMoves(tempMoves, row, column, boardState, currentPieceColor, turn);
                break;
        }
}

function getAllPawnMoves(tempMoves, currentRow, currentColumn, boardState, currentPieceColor, turn) {
    const PAWN_MOVE = 1 * currentPieceColor;
    const BECOME_QUEEN = 5 * currentPieceColor;
   
    if (currentRow === 6 && currentPieceColor === WHITE) {
        if (boardState[currentRow - 2][currentColumn] === EMPTY && boardState[currentRow - 1][currentColumn] === EMPTY) {
            tempMoves[currentRow - 2][currentColumn] = PAWN_MOVE;
        }
    }

    if (currentRow === 1 && currentPieceColor === BLACK ) { 
        if (boardState[currentRow + 2][currentColumn] === EMPTY && boardState[currentRow + 1][currentColumn] === EMPTY) {
            tempMoves[currentRow + 2][currentColumn] = PAWN_MOVE;
        }   
    
    }
    if (inBounds(currentRow - PAWN_MOVE, currentColumn) && boardState[currentRow - PAWN_MOVE][currentColumn] === EMPTY) {
        if (isEdge(currentRow - PAWN_MOVE, currentPieceColor)) {
            tempMoves[currentRow - PAWN_MOVE][currentColumn] = BECOME_QUEEN;
        }
        else {
            tempMoves[currentRow - PAWN_MOVE][currentColumn] = PAWN_MOVE;
        }
    }
    if (inBounds(currentRow - PAWN_MOVE, currentColumn - PAWN_MOVE) && isEnemyPiece(boardState[currentRow - PAWN_MOVE][currentColumn - PAWN_MOVE], currentPieceColor)) {
        if (isEdge(currentRow - PAWN_MOVE, currentPieceColor)) {
            tempMoves[currentRow - PAWN_MOVE][currentColumn] = BECOME_QUEEN;
        }
        else {
            tempMoves[currentRow - PAWN_MOVE][currentColumn - PAWN_MOVE] = PAWN_MOVE;
        }
    }
    if (inBounds(currentRow - PAWN_MOVE, currentColumn + PAWN_MOVE) && isEnemyPiece(boardState[currentRow - PAWN_MOVE][currentColumn + PAWN_MOVE], currentPieceColor)) {
        if (isEdge(currentRow - PAWN_MOVE, currentPieceColor)) {
            tempMoves[currentRow - PAWN_MOVE][currentColumn] = BECOME_QUEEN;
        }
        else {
            tempMoves[currentRow - PAWN_MOVE][currentColumn + PAWN_MOVE] = PAWN_MOVE;
        }
    }
}

function getAllRookMoves(tempMoves, currentRow, currentColumn, boardState, currentPieceColor) {
    let ROOK_MOVE = 0;
    currentPieceColor === WHITE ? ROOK_MOVE = 2 : ROOK_MOVE = -2;
    const NO_VERTICAL_MOVE = 0;
    const NO_HORIZONTAL_MOVE = 0;
    const LEFT = -1;
    const RIGHT = 1;
    const DOWN = 1;
    const UP = -1;

    lineMoves(currentRow, currentColumn, UP, NO_HORIZONTAL_MOVE, tempMoves, ROOK_MOVE, boardState, currentPieceColor);
    lineMoves(currentRow, currentColumn, NO_VERTICAL_MOVE, RIGHT, tempMoves, ROOK_MOVE, boardState, currentPieceColor);
    lineMoves(currentRow, currentColumn, DOWN, NO_HORIZONTAL_MOVE, tempMoves, ROOK_MOVE, boardState, currentPieceColor);
    lineMoves(currentRow, currentColumn, NO_VERTICAL_MOVE, LEFT, tempMoves, ROOK_MOVE, boardState, currentPieceColor);
}

function getAllKnightMoves(tempMoves, currentRow, currentColumn, boardState, currentPieceColor) {
    const SHORT_LEFT = -1;
    const LONG_LEFT = -2;
    const SHORT_RIGHT = 1;
    const LONG_RIGHT = 2;
    const SHORT_DOWN = 1;
    const LONG_DOWN = 2;
    const SHORT_UP = -1;
    const LONG_UP = -2;

    knightMoves(currentRow, currentColumn, SHORT_UP, LONG_LEFT, tempMoves, boardState, currentPieceColor);
    knightMoves(currentRow, currentColumn, LONG_UP, SHORT_LEFT, tempMoves, boardState, currentPieceColor);
    knightMoves(currentRow, currentColumn, SHORT_UP, LONG_RIGHT, tempMoves, boardState, currentPieceColor);
    knightMoves(currentRow, currentColumn, LONG_UP, SHORT_RIGHT, tempMoves, boardState, currentPieceColor);
    knightMoves(currentRow, currentColumn, SHORT_DOWN, LONG_LEFT, tempMoves, boardState, currentPieceColor);
    knightMoves(currentRow, currentColumn, LONG_DOWN, SHORT_LEFT, tempMoves, boardState, currentPieceColor);
    knightMoves(currentRow, currentColumn, SHORT_DOWN, LONG_RIGHT, tempMoves, boardState, currentPieceColor);
    knightMoves(currentRow, currentColumn, LONG_DOWN, SHORT_RIGHT, tempMoves, boardState, currentPieceColor);

}

function getAllBishopMoves(tempMoves, currentRow, currentColumn, boardState, currentPieceColor) {
    let BISHOP_MOVE = 0;
    currentPieceColor === WHITE ? BISHOP_MOVE = 4 : BISHOP_MOVE = -4;
    const LEFT = -1;
    const RIGHT = 1;
    const DOWN = 1;
    const UP = -1;

    diagonalMoves(currentRow, currentColumn, UP, LEFT, tempMoves, BISHOP_MOVE, boardState, currentPieceColor);
    diagonalMoves(currentRow, currentColumn, UP, RIGHT, tempMoves, BISHOP_MOVE, boardState, currentPieceColor);
    diagonalMoves(currentRow, currentColumn, DOWN, LEFT, tempMoves, BISHOP_MOVE, boardState, currentPieceColor);
    diagonalMoves(currentRow, currentColumn, DOWN, RIGHT, tempMoves, BISHOP_MOVE, boardState, currentPieceColor);

}

function getAllQueenMoves(tempMoves, currentRow, currentColumn, boardState, currentPieceColor) {
    let QUEEN_MOVE = 0;
    currentPieceColor === WHITE ? QUEEN_MOVE = 5 : QUEEN_MOVE = -5;
    const NO_VERTICAL_MOVE = 0;
    const NO_HORIZONTAL_MOVE = 0;
    const LEFT = -1;
    const RIGHT = 1;
    const DOWN = 1;
    const UP = -1;

    diagonalMoves(currentRow, currentColumn, UP, LEFT, tempMoves, QUEEN_MOVE, boardState, currentPieceColor);
    diagonalMoves(currentRow, currentColumn, UP, RIGHT, tempMoves, QUEEN_MOVE, boardState, currentPieceColor);
    diagonalMoves(currentRow, currentColumn, DOWN, LEFT, tempMoves, QUEEN_MOVE, boardState, currentPieceColor);
    diagonalMoves(currentRow, currentColumn, DOWN, RIGHT, tempMoves, QUEEN_MOVE, boardState, currentPieceColor);

    lineMoves(currentRow, currentColumn, UP, NO_HORIZONTAL_MOVE, tempMoves, QUEEN_MOVE, boardState, currentPieceColor);
    lineMoves(currentRow, currentColumn, NO_VERTICAL_MOVE, RIGHT, tempMoves, QUEEN_MOVE, boardState, currentPieceColor);
    lineMoves(currentRow, currentColumn, DOWN, NO_HORIZONTAL_MOVE, tempMoves, QUEEN_MOVE, boardState, currentPieceColor);
    lineMoves(currentRow, currentColumn, NO_VERTICAL_MOVE, LEFT, tempMoves, QUEEN_MOVE, boardState, currentPieceColor);

}

function getAllKingMoves(tempMoves, currentRow, currentColumn, boardState, currentPieceColor) {
    const NO_VERTICAL_MOVE = 0;
    const NO_HORIZONTAL_MOVE = 0;
    const LEFT = -1;
    const RIGHT = 1;
    const DOWN = 1;
    const UP = -1;

    //Horizontal and veritical
    adjacentMoves(currentRow, currentColumn, UP, NO_HORIZONTAL_MOVE, tempMoves, boardState, currentPieceColor);
    adjacentMoves(currentRow, currentColumn, NO_VERTICAL_MOVE, RIGHT, tempMoves, boardState, currentPieceColor);
    adjacentMoves(currentRow, currentColumn, DOWN, NO_HORIZONTAL_MOVE, tempMoves, boardState, currentPieceColor);
    adjacentMoves(currentRow, currentColumn, NO_VERTICAL_MOVE, LEFT, tempMoves, boardState, currentPieceColor);
    
    //Diagonal
    adjacentMoves(currentRow, currentColumn, UP, LEFT, tempMoves, boardState, currentPieceColor);
    adjacentMoves(currentRow, currentColumn, UP, RIGHT, tempMoves, boardState, currentPieceColor);
    adjacentMoves(currentRow, currentColumn, DOWN, LEFT, tempMoves, boardState, currentPieceColor);
    adjacentMoves(currentRow, currentColumn, DOWN, RIGHT, tempMoves, boardState, currentPieceColor);

    
}


function lineMoves(startingRow, startingColumn, stepVertical, stepHorizontal, tempMoves, pieceMoveValue, boardState, currentPieceColor) {
        let tempCurrentRow = startingRow + stepVertical;
        let tempCurrentColumn = startingColumn + stepHorizontal;

        while (inBounds( tempCurrentRow, tempCurrentColumn )) {
            if (isFriendlyPiece(boardState[tempCurrentRow][tempCurrentColumn], currentPieceColor)) { break; }
            tempMoves[tempCurrentRow][tempCurrentColumn] = pieceMoveValue;
            if (isEnemyPiece(boardState[tempCurrentRow][tempCurrentColumn], currentPieceColor)) { break; }
            tempCurrentRow += stepVertical;
            tempCurrentColumn += stepHorizontal;
        }
    }

function diagonalMoves(startingRow, startingColumn, stepVertical, stepHorizontal, tempMoves, pieceMoveValue, boardState, currentPieceColor) {
    let tempCurrentRow = startingRow + stepVertical;
    let tempCurrentColumn = startingColumn + stepHorizontal;

    while (inBounds( tempCurrentRow, tempCurrentColumn )) {
        if (isFriendlyPiece(boardState[tempCurrentRow][tempCurrentColumn], currentPieceColor)) { break; }
        tempMoves[tempCurrentRow][tempCurrentColumn] = pieceMoveValue;
        if (isEnemyPiece(boardState[tempCurrentRow][tempCurrentColumn], currentPieceColor)) { break; }
        tempCurrentRow += stepVertical;
        tempCurrentColumn += stepHorizontal;
    }
}

function adjacentMoves(currentRow, currentColumn, stepVertical, stepHorizontal, tempMoves, boardState, currentPieceColor) {
    let KING_MOVE = 0;
    currentPieceColor === WHITE ? KING_MOVE = 6 : KING_MOVE = -6; 
    const tempRow = currentRow + stepVertical;
    const tempColumn = currentColumn + stepHorizontal;

    if (inBounds( tempRow, tempColumn )) {
        if (!isFriendlyPiece(boardState[tempRow][tempColumn], currentPieceColor)) {
                tempMoves[tempRow][tempColumn] = KING_MOVE;
        }
    }
}

function knightMoves(currentRow, currentColumn, stepVertical, stepHorizontal, tempMoves, boardState, currentPieceColor) {
    let KNIGHT_MOVE = 0;
    currentPieceColor === WHITE ? KNIGHT_MOVE = 3 : KNIGHT_MOVE = -3;
    const tempRow = currentRow + stepVertical;
    const tempColumn = currentColumn + stepHorizontal;

    if (inBounds( tempRow, tempColumn )) {
        if (!isFriendlyPiece(boardState[tempRow][tempColumn], currentPieceColor)) {
            tempMoves[tempRow][tempColumn] = KNIGHT_MOVE;
        }
    }
}