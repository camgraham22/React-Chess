import isInCheck from "./checkChecker";

const WHITE = 1;
const EMPTY = 0;
const BLACK = -1;
    

export function getPawnMoves(tempMoves, currentRow, currentColumn, boardState, currentPieceColor, whiteKingPos, blackKingPos) {
    const PAWN_MOVE = 1 * currentPieceColor;
    const BECOME_QUEEN = 5 * currentPieceColor;
    const kingPos = currentPieceColor === WHITE ? whiteKingPos : blackKingPos;
    const kingColor = currentPieceColor;
    let moveToMake = PAWN_MOVE;

    if (currentRow === 6 && currentPieceColor === WHITE) {
        if (boardState[currentRow - 2][currentColumn] === EMPTY && boardState[currentRow - 1][currentColumn] === EMPTY) {
            let tempState = boardState.map((row) => [...row]);
            tempState[currentRow - 2][currentColumn] = PAWN_MOVE;
            tempState[currentRow][currentColumn] = EMPTY;
            if (!isInCheck(tempState, kingPos, kingColor)) {
                tempMoves[currentRow - 2][currentColumn] = PAWN_MOVE;
            }
        }
    }

    if (currentRow === 1 && currentPieceColor === BLACK) { 
        if (boardState[currentRow + 2][currentColumn] === EMPTY && boardState[currentRow + 1][currentColumn] === EMPTY) {
            let tempState = boardState.map((row) => [...row]);
            tempState[currentRow + 2][currentColumn] = PAWN_MOVE;
            tempState[currentRow][currentColumn] = EMPTY;
            if (!isInCheck(tempState, kingPos, kingColor)) {
                tempMoves[currentRow + 2][currentColumn] = PAWN_MOVE;
            }
        }   
}
    if (inBounds(currentRow - PAWN_MOVE, currentColumn) && boardState[currentRow - PAWN_MOVE][currentColumn] === EMPTY) {
        let tempState = boardState.map((row) => [...row]);
        if (isEdge(currentRow - PAWN_MOVE, currentPieceColor)) {
            tempState[currentRow - PAWN_MOVE][currentColumn] = BECOME_QUEEN;
            moveToMake = BECOME_QUEEN;
        }
        else {
            tempState[currentRow - PAWN_MOVE][currentColumn] = PAWN_MOVE;
        }
        tempState[currentRow][currentColumn] = EMPTY;
        if (!isInCheck(tempState, kingPos, kingColor)) {
            tempMoves[currentRow - PAWN_MOVE][currentColumn] = moveToMake;
        }
    }
    if (inBounds(currentRow - PAWN_MOVE, currentColumn - PAWN_MOVE) && isEnemyPiece(boardState[currentRow - PAWN_MOVE][currentColumn - PAWN_MOVE], currentPieceColor)) {
        let tempState = boardState.map((row) => [...row]);
        if (isEdge(currentRow - PAWN_MOVE, currentPieceColor)) {
            tempState[currentRow - PAWN_MOVE][currentColumn - PAWN_MOVE] = BECOME_QUEEN;
            moveToMake = BECOME_QUEEN;
        }
        else {
            tempState[currentRow - PAWN_MOVE][currentColumn - PAWN_MOVE] = PAWN_MOVE;
        }
        tempState[currentRow][currentColumn] = EMPTY;
        if (!isInCheck(tempState, kingPos, kingColor)) {
            tempMoves[currentRow - PAWN_MOVE][currentColumn - PAWN_MOVE] = moveToMake;
        }
    }
    if (inBounds(currentRow - PAWN_MOVE, currentColumn + PAWN_MOVE) && isEnemyPiece(boardState[currentRow - PAWN_MOVE][currentColumn + PAWN_MOVE], currentPieceColor)) {
        let tempState = boardState.map((row) => [...row]);
        if (isEdge(currentRow - PAWN_MOVE, currentPieceColor)) {
            tempState[currentRow - PAWN_MOVE][currentColumn + PAWN_MOVE] = BECOME_QUEEN;
            moveToMake = BECOME_QUEEN;
        }
        else {
            tempState[currentRow - PAWN_MOVE][currentColumn + PAWN_MOVE] = PAWN_MOVE;
        }
        tempState[currentRow][currentColumn] = EMPTY;
        if (!isInCheck(tempState, kingPos, kingColor)) {
            tempMoves[currentRow - PAWN_MOVE][currentColumn + PAWN_MOVE] = moveToMake;
        }
    }
}

export function getRookMoves(tempMoves, currentRow, currentColumn, boardState, currentPieceColor, whiteKingPos, blackKingPos) {
    const ROOK_MOVE = 2 * currentPieceColor;
    const kingPos = currentPieceColor === WHITE ? whiteKingPos : blackKingPos;
    const kingColor = currentPieceColor;

    const NO_VERTICAL_MOVE = 0;
    const NO_HORIZONTAL_MOVE = 0;
    const LEFT = -1;
    const RIGHT = 1;
    const DOWN = 1;
    const UP = -1;

    lineMoves(currentRow, currentColumn, UP, NO_HORIZONTAL_MOVE, tempMoves, ROOK_MOVE, boardState, currentPieceColor, kingPos, kingColor);
    lineMoves(currentRow, currentColumn, NO_VERTICAL_MOVE, RIGHT, tempMoves, ROOK_MOVE, boardState, currentPieceColor, kingPos, kingColor);
    lineMoves(currentRow, currentColumn, DOWN, NO_HORIZONTAL_MOVE, tempMoves, ROOK_MOVE, boardState, currentPieceColor, kingPos, kingColor);
    lineMoves(currentRow, currentColumn, NO_VERTICAL_MOVE, LEFT, tempMoves, ROOK_MOVE, boardState, currentPieceColor, kingPos, kingColor);
}

export function getKnightMoves(tempMoves, currentRow, currentColumn, boardState, currentPieceColor, whiteKingPos, blackKingPos) {
    const SHORT_LEFT = -1;
    const LONG_LEFT = -2;
    const SHORT_RIGHT = 1;
    const LONG_RIGHT = 2;
    const SHORT_DOWN = 1;
    const LONG_DOWN = 2;
    const SHORT_UP = -1;
    const LONG_UP = -2;

    knightMoves(currentRow, currentColumn, SHORT_UP, LONG_LEFT, tempMoves, boardState, currentPieceColor, whiteKingPos, blackKingPos);
    knightMoves(currentRow, currentColumn, LONG_UP, SHORT_LEFT, tempMoves, boardState, currentPieceColor, whiteKingPos, blackKingPos);
    knightMoves(currentRow, currentColumn, SHORT_UP, LONG_RIGHT, tempMoves, boardState, currentPieceColor, whiteKingPos, blackKingPos);
    knightMoves(currentRow, currentColumn, LONG_UP, SHORT_RIGHT, tempMoves, boardState, currentPieceColor, whiteKingPos, blackKingPos);
    knightMoves(currentRow, currentColumn, SHORT_DOWN, LONG_LEFT, tempMoves, boardState, currentPieceColor, whiteKingPos, blackKingPos);
    knightMoves(currentRow, currentColumn, LONG_DOWN, SHORT_LEFT, tempMoves, boardState, currentPieceColor, whiteKingPos, blackKingPos);
    knightMoves(currentRow, currentColumn, SHORT_DOWN, LONG_RIGHT, tempMoves, boardState, currentPieceColor, whiteKingPos, blackKingPos);
    knightMoves(currentRow, currentColumn, LONG_DOWN, SHORT_RIGHT, tempMoves, boardState, currentPieceColor, whiteKingPos, blackKingPos);

}

export function getBishopMoves(tempMoves, currentRow, currentColumn, boardState, currentPieceColor, whiteKingPos, blackKingPos) {
    const BISHOP_MOVE = 4 * currentPieceColor;
    const kingPos = currentPieceColor === WHITE ? whiteKingPos : blackKingPos;
    const kingColor = currentPieceColor;
    const LEFT = -1;
    const RIGHT = 1;
    const DOWN = 1;
    const UP = -1;

    diagonalMoves(currentRow, currentColumn, UP, LEFT, tempMoves, BISHOP_MOVE, boardState, currentPieceColor, kingPos, kingColor);
    diagonalMoves(currentRow, currentColumn, UP, RIGHT, tempMoves, BISHOP_MOVE, boardState, currentPieceColor, kingPos, kingColor);
    diagonalMoves(currentRow, currentColumn, DOWN, LEFT, tempMoves, BISHOP_MOVE, boardState, currentPieceColor, kingPos, kingColor);
    diagonalMoves(currentRow, currentColumn, DOWN, RIGHT, tempMoves, BISHOP_MOVE, boardState, currentPieceColor, kingPos, kingColor);

}

export function getQueenMoves(tempMoves, currentRow, currentColumn, boardState, currentPieceColor, whiteKingPos, blackKingPos) {
    const QUEEN_MOVE = 5 * currentPieceColor;
    const kingPos = currentPieceColor === WHITE ? whiteKingPos : blackKingPos;
    const kingColor = currentPieceColor;
    const NO_VERTICAL_MOVE = 0;
    const NO_HORIZONTAL_MOVE = 0;
    const LEFT = -1;
    const RIGHT = 1;
    const DOWN = 1;
    const UP = -1;

    diagonalMoves(currentRow, currentColumn, UP, LEFT, tempMoves, QUEEN_MOVE, boardState, currentPieceColor, kingPos, kingColor);
    diagonalMoves(currentRow, currentColumn, UP, RIGHT, tempMoves, QUEEN_MOVE, boardState, currentPieceColor, kingPos, kingColor);
    diagonalMoves(currentRow, currentColumn, DOWN, LEFT, tempMoves, QUEEN_MOVE, boardState, currentPieceColor, kingPos, kingColor);
    diagonalMoves(currentRow, currentColumn, DOWN, RIGHT, tempMoves, QUEEN_MOVE, boardState, currentPieceColor, kingPos, kingColor);

    lineMoves(currentRow, currentColumn, UP, NO_HORIZONTAL_MOVE, tempMoves, QUEEN_MOVE, boardState, currentPieceColor, kingPos, kingColor);
    lineMoves(currentRow, currentColumn, NO_VERTICAL_MOVE, RIGHT, tempMoves, QUEEN_MOVE, boardState, currentPieceColor, kingPos, kingColor);
    lineMoves(currentRow, currentColumn, DOWN, NO_HORIZONTAL_MOVE, tempMoves, QUEEN_MOVE, boardState, currentPieceColor, kingPos, kingColor);
    lineMoves(currentRow, currentColumn, NO_VERTICAL_MOVE, LEFT, tempMoves, QUEEN_MOVE, boardState, currentPieceColor, kingPos, kingColor);

}

export function getKingMoves(tempMoves, currentRow, currentColumn, boardState, currentPieceColor, whiteKingPos, blackKingPos) {
    const NO_VERTICAL_MOVE = 0;
    const NO_HORIZONTAL_MOVE = 0;
    const LEFT = -1;
    const RIGHT = 1;
    const DOWN = 1;
    const UP = -1;

    //Horizontal and veritical
    adjacentMoves(currentRow, currentColumn, UP, NO_HORIZONTAL_MOVE, tempMoves, boardState, currentPieceColor, whiteKingPos, blackKingPos);
    adjacentMoves(currentRow, currentColumn, NO_VERTICAL_MOVE, RIGHT, tempMoves, boardState, currentPieceColor, whiteKingPos, blackKingPos);
    adjacentMoves(currentRow, currentColumn, DOWN, NO_HORIZONTAL_MOVE, tempMoves, boardState, currentPieceColor, whiteKingPos, blackKingPos);
    adjacentMoves(currentRow, currentColumn, NO_VERTICAL_MOVE, LEFT, tempMoves, boardState, currentPieceColor, whiteKingPos, blackKingPos);
    
    //Diagonal
    adjacentMoves(currentRow, currentColumn, UP, LEFT, tempMoves, boardState, currentPieceColor, whiteKingPos, blackKingPos);
    adjacentMoves(currentRow, currentColumn, UP, RIGHT, tempMoves, boardState, currentPieceColor, whiteKingPos, blackKingPos);
    adjacentMoves(currentRow, currentColumn, DOWN, LEFT, tempMoves, boardState, currentPieceColor, whiteKingPos, blackKingPos);
    adjacentMoves(currentRow, currentColumn, DOWN, RIGHT, tempMoves, boardState, currentPieceColor, whiteKingPos, blackKingPos);

    
}


function lineMoves(startingRow, startingColumn, stepVertical, stepHorizontal, tempMoves, pieceMoveValue, boardState, currentPieceColor, kingPos, kingColor) {
        let tempCurrentRow = startingRow + stepVertical;
        let tempCurrentColumn = startingColumn + stepHorizontal;

        while (inBounds( tempCurrentRow, tempCurrentColumn )) {
            if (isFriendlyPiece(boardState[tempCurrentRow][tempCurrentColumn], currentPieceColor)) { break; }
            let tempState = boardState.map((row) => [...row]);
            tempState[tempCurrentRow][tempCurrentColumn] = pieceMoveValue;
            tempState[tempCurrentRow - stepVertical][tempCurrentColumn - stepHorizontal] = EMPTY;
            if (isInCheck(tempState, kingPos, kingColor)) { break; }
            tempMoves[tempCurrentRow][tempCurrentColumn] = pieceMoveValue;
            if (isEnemyPiece(boardState[tempCurrentRow][tempCurrentColumn], currentPieceColor)) { break; }
            tempCurrentRow += stepVertical;
            tempCurrentColumn += stepHorizontal;
        }
    }

function diagonalMoves(startingRow, startingColumn, stepVertical, stepHorizontal, tempMoves, pieceMoveValue, boardState, currentPieceColor, kingPos, kingColor) {
    let tempCurrentRow = startingRow + stepVertical;
    let tempCurrentColumn = startingColumn + stepHorizontal;

    while (inBounds( tempCurrentRow, tempCurrentColumn )) {
        if (isFriendlyPiece(boardState[tempCurrentRow][tempCurrentColumn], currentPieceColor)) { break; }
        let tempState = boardState.map((row) => [...row]);
        tempState[tempCurrentRow][tempCurrentColumn] = pieceMoveValue;
        tempState[tempCurrentRow - stepVertical][tempCurrentColumn - stepHorizontal] = EMPTY;
        if (isInCheck(tempState, kingPos, kingColor)) { break; }
        tempMoves[tempCurrentRow][tempCurrentColumn] = pieceMoveValue;
        if (isEnemyPiece(boardState[tempCurrentRow][tempCurrentColumn], currentPieceColor)) { break; }
        tempCurrentRow += stepVertical;
        tempCurrentColumn += stepHorizontal;
    }
}

function adjacentMoves(currentRow, currentColumn, stepVertical, stepHorizontal, tempMoves, boardState, currentPieceColor, whiteKingPos, blackKingPos) {
    const KING_MOVE = 6 * currentPieceColor;
    const kingColor = currentPieceColor;
    const tempRow = currentRow + stepVertical;
    const tempColumn = currentColumn + stepHorizontal;

    if (inBounds( tempRow, tempColumn )) {
        if (!isFriendlyPiece(boardState[tempRow][tempColumn], currentPieceColor)) {
            let tempState = boardState.map((row) => [...row]);
            tempState[tempRow][tempColumn] = KING_MOVE;
            tempState[currentRow][currentColumn] = EMPTY;
            const tempKingPos = [tempRow, tempColumn];
            if (!isInCheck(tempState, tempKingPos, kingColor)) {
                tempMoves[tempRow][tempColumn] = KING_MOVE;
            }        
        }
    }
}

function knightMoves(currentRow, currentColumn, stepVertical, stepHorizontal, tempMoves, boardState, currentPieceColor, whiteKingPos, blackKingPos) {
    const KNIGHT_MOVE = 3 * currentPieceColor;
    const kingPos = currentPieceColor === WHITE ? whiteKingPos : blackKingPos;
    const kingColor = currentPieceColor;
    const tempRow = currentRow + stepVertical;
    const tempColumn = currentColumn + stepHorizontal;

    if (inBounds( tempRow, tempColumn )) {
        if (!isFriendlyPiece(boardState[tempRow][tempColumn], currentPieceColor)) {
            let tempState = boardState.map((row) => [...row]);
            tempState[tempRow][tempColumn] = KNIGHT_MOVE;
            tempState[tempRow - stepVertical][tempColumn - stepHorizontal] = EMPTY;
            if (!isInCheck(tempState, kingPos, kingColor)) {
                tempMoves[tempRow][tempColumn] = KNIGHT_MOVE;
            }
        }
    }
}

export function inBounds(row, column) {
    return ( row >= 0 && row <= 7 ) && ( column >= 0 && column <= 7 );
}

export function isEdge(row, currentPieceColor) {
    return ( currentPieceColor === WHITE && row === 0 ) || ( currentPieceColor === BLACK && row === 7 );
}

export function isEnemyPiece(pieceValue, currentPieceColor) {
    return (currentPieceColor === WHITE && pieceValue < 0) || (currentPieceColor === BLACK && pieceValue > 0);
}

export function isFriendlyPiece(pieceValue, currentPieceColor) {
    return (currentPieceColor === WHITE && pieceValue > 0) || (currentPieceColor === BLACK && pieceValue < 0);
}   