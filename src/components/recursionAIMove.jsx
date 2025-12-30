import getBoardScore from "./boardScore";
import { inBounds, isEnemyPiece, isFriendlyPiece } from "./pieceMoves";

const AI = -1;
const HUMAN = 1;
const WHITE = 1;
const EMPTY = 0;
const BLACK = -1;
const NO_CAPTURE = 0;

export default function getAIMove(boardState, depth, turn, alpha, beta, previousBestMove, moveMap) {

    const boardStateKey = boardState.flat().join(',');
    if (moveMap.has(boardStateKey)) {
        const tempValue = moveMap.get(boardStateKey);
        if (tempValue.depth >= depth) {
                return moveMap.get(boardStateKey);
        }
    }

    const rows = 8;
    const columns = 8;
    const boardScore = getBoardScore(boardState);

    if (depth === 0) {
        return { score: boardScore};
    }
    if (boardScore >= 100000 && turn === AI) {
        return { score: boardScore};
    }
    if (boardScore <= -100000 && turn === HUMAN) {
        return { score: boardScore };
    }

    let everyValidMove = [];

    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            const pieceValue = boardState[row][column];
            const currentPieceColor = isWhite(pieceValue) ? WHITE : BLACK;
            if (isBlack(pieceValue) && turn === AI) {
                everyValidMove.push(...getValidMoves(row, column, boardState, currentPieceColor));
            }
            if (isWhite(pieceValue) && turn === HUMAN) {
                everyValidMove.push(...getValidMoves(row, column, boardState, currentPieceColor));
            }
        }
    }

    if (previousBestMove) { everyValidMove.unshift(previousBestMove); }

    let bestMove = everyValidMove[0];
    const numMoves = everyValidMove.length;
    for (let move = 0; move < numMoves; move++) {
        let currentMove = everyValidMove[move];
        let nextTurn = turn === AI ? HUMAN : AI;
        const {score: currentScore } = getAIMove(currentMove, depth - 1, nextTurn, alpha, beta, null, moveMap);
        if (currentScore > alpha && turn === AI) { 
            alpha = currentScore;
            bestMove = currentMove;
        }
        if (currentScore < beta && turn === HUMAN) { 
            beta = currentScore;
            bestMove = currentMove;
        }
        if (beta <= alpha) {
            moveMap.set(boardStateKey, {score: beta, move: bestMove, depth: depth});
            return {score: (turn === AI ? alpha : beta), move: bestMove};
        }
    }
    moveMap.set(boardStateKey, {score: (turn === AI ? alpha : beta), move: bestMove, depth: depth});
    return {score: (turn === AI ? alpha : beta), move: bestMove};
}

function getValidMoves(row, column, boardState, currentPieceColor) {

    let boardStatesArray = [];

        switch (boardState[row][column]) {
            case -1:
            case 1:
                boardStatesArray.push(...getPawnMoves(row, column, boardState, currentPieceColor));
                break;

            case -2:
            case 2:
                boardStatesArray.push(...getRookMoves(row, column, boardState, currentPieceColor));
                break;

            case -3:
            case 3:
                boardStatesArray.push(...getKnightMoves(row, column, boardState, currentPieceColor));
                break;
            
            case -4: 
            case 4: 
                boardStatesArray.push(...getBishopMoves(row, column, boardState, currentPieceColor));
                break;
            
            case -5:
            case 5:
                boardStatesArray.push(...getQueenMoves(row, column, boardState, currentPieceColor));
                break;
            
            case -6: 
            case 6: 
                boardStatesArray.push(...getKingMoves(row, column, boardState, currentPieceColor));
                break;
        }

    return boardStatesArray;
}

function getPawnMoves(currentRow, currentColumn, boardState, currentPieceColor) {
    const PAWN_MOVE = 1 * currentPieceColor;
    let totalPawnMoves = [];

    if (inBounds(currentRow - PAWN_MOVE, currentColumn - PAWN_MOVE) && isEnemyPiece(boardState[currentRow - PAWN_MOVE][currentColumn - PAWN_MOVE], currentPieceColor)) {
        let tempState = boardState.map((row) => [...row]);
        tempState[currentRow - PAWN_MOVE][currentColumn - PAWN_MOVE] = PAWN_MOVE;
        tempState[currentRow][currentColumn] = EMPTY;
        // totalPawnMoves.push([tempState, NO_CAPTURE]);
        totalPawnMoves.push(tempState);

    }
    if (inBounds(currentRow - PAWN_MOVE, currentColumn + PAWN_MOVE) && isEnemyPiece(boardState[currentRow - PAWN_MOVE][currentColumn + PAWN_MOVE], currentPieceColor)) {
        let tempState = boardState.map((row) => [...row]);
        tempState[currentRow - PAWN_MOVE][currentColumn + PAWN_MOVE] = PAWN_MOVE;
        tempState[currentRow][currentColumn] = EMPTY;
        // totalPawnMoves.push([tempState, NO_CAPTURE]);
        totalPawnMoves.push(tempState);

    }
    if (currentRow === 6 && currentPieceColor === WHITE) {
        if (boardState[currentRow - 2][currentColumn] === EMPTY && boardState[currentRow - 1][currentColumn] === EMPTY) {
            let tempState = boardState.map((row) => [...row]);
            tempState[currentRow - 2][currentColumn] = PAWN_MOVE;
            tempState[currentRow][currentColumn] = EMPTY;
            totalPawnMoves.push(tempState);
        }
    }
    if (currentRow === 1 && currentPieceColor === BLACK) { 
        if (boardState[currentRow + 2][currentColumn] === EMPTY && boardState[currentRow + 1][currentColumn] === EMPTY) {
            let tempState = boardState.map((row) => [...row]);
            tempState[currentRow + 2][currentColumn] = PAWN_MOVE;
            tempState[currentRow][currentColumn] = EMPTY;
            totalPawnMoves.push(tempState);
        }   
    }
    if (inBounds(currentRow - PAWN_MOVE, currentColumn) && boardState[currentRow - PAWN_MOVE][currentColumn] === EMPTY) {
        let tempState = boardState.map((row) => [...row]);
        tempState[currentRow - PAWN_MOVE][currentColumn] = PAWN_MOVE;
        tempState[currentRow][currentColumn] = EMPTY;
        totalPawnMoves.push(tempState);
    }

    return totalPawnMoves;
}

function getRookMoves(currentRow, currentColumn, boardState, currentPieceColor) {
    const ROOK_MOVE = 2 * currentPieceColor;
    const NO_VERTICAL_MOVE = 0;
    const NO_HORIZONTAL_MOVE = 0;
    const LEFT = -1;
    const RIGHT = 1;
    const DOWN = 1;
    const UP = -1;

    let totalRookMoves = [];
    totalRookMoves.push(...lineMoves(currentRow, currentColumn, UP, NO_HORIZONTAL_MOVE, ROOK_MOVE, boardState, currentPieceColor));
    totalRookMoves.push(...lineMoves(currentRow, currentColumn, NO_VERTICAL_MOVE, RIGHT, ROOK_MOVE, boardState, currentPieceColor));
    totalRookMoves.push(...lineMoves(currentRow, currentColumn, DOWN, NO_HORIZONTAL_MOVE, ROOK_MOVE, boardState, currentPieceColor));
    totalRookMoves.push(...lineMoves(currentRow, currentColumn, NO_VERTICAL_MOVE, LEFT, ROOK_MOVE, boardState, currentPieceColor));

    return totalRookMoves;
}

function getKnightMoves(currentRow, currentColumn, boardState, currentPieceColor) {
    const SHORT_LEFT = -1;
    const LONG_LEFT = -2;
    const SHORT_RIGHT = 1;
    const LONG_RIGHT = 2;
    const SHORT_DOWN = 1;
    const LONG_DOWN = 2;
    const SHORT_UP = -1;
    const LONG_UP = -2;

    let totalKnightMoves = [];
    totalKnightMoves.push(...knightMoves(currentRow, currentColumn, SHORT_UP, LONG_LEFT, boardState, currentPieceColor));
    totalKnightMoves.push(...knightMoves(currentRow, currentColumn, LONG_UP, SHORT_LEFT, boardState, currentPieceColor));
    totalKnightMoves.push(...knightMoves(currentRow, currentColumn, SHORT_UP, LONG_RIGHT, boardState, currentPieceColor));
    totalKnightMoves.push(...knightMoves(currentRow, currentColumn, LONG_UP, SHORT_RIGHT, boardState, currentPieceColor));
    totalKnightMoves.push(...knightMoves(currentRow, currentColumn, SHORT_DOWN, LONG_LEFT, boardState, currentPieceColor));
    totalKnightMoves.push(...knightMoves(currentRow, currentColumn, LONG_DOWN, SHORT_LEFT, boardState, currentPieceColor));
    totalKnightMoves.push(...knightMoves(currentRow, currentColumn, SHORT_DOWN, LONG_RIGHT, boardState, currentPieceColor));
    totalKnightMoves.push(...knightMoves(currentRow, currentColumn, LONG_DOWN, SHORT_RIGHT, boardState, currentPieceColor));

    return totalKnightMoves;
}

function getBishopMoves(currentRow, currentColumn, boardState, currentPieceColor) {
    const BISHOP_MOVE = 4 * currentPieceColor;
    const LEFT = -1;
    const RIGHT = 1;
    const DOWN = 1;
    const UP = -1;

    let totalBishopMoves = [];
    totalBishopMoves.push(...diagonalMoves(currentRow, currentColumn, UP, LEFT, BISHOP_MOVE, boardState, currentPieceColor));
    totalBishopMoves.push(...diagonalMoves(currentRow, currentColumn, UP, RIGHT, BISHOP_MOVE, boardState, currentPieceColor));
    totalBishopMoves.push(...diagonalMoves(currentRow, currentColumn, DOWN, LEFT, BISHOP_MOVE, boardState, currentPieceColor));
    totalBishopMoves.push(...diagonalMoves(currentRow, currentColumn, DOWN, RIGHT, BISHOP_MOVE, boardState, currentPieceColor));

    return totalBishopMoves;
}

function getQueenMoves(currentRow, currentColumn, boardState, currentPieceColor) {
    const QUEEN_MOVE = 5 * currentPieceColor;
    const NO_VERTICAL_MOVE = 0;
    const NO_HORIZONTAL_MOVE = 0;
    const LEFT = -1;
    const RIGHT = 1;
    const DOWN = 1;
    const UP = -1;

    let totalQueenMoves = [];
    totalQueenMoves.push(...diagonalMoves(currentRow, currentColumn, UP, LEFT, QUEEN_MOVE, boardState, currentPieceColor));
    totalQueenMoves.push(...diagonalMoves(currentRow, currentColumn, UP, RIGHT, QUEEN_MOVE, boardState, currentPieceColor));
    totalQueenMoves.push(...diagonalMoves(currentRow, currentColumn, DOWN, LEFT, QUEEN_MOVE, boardState, currentPieceColor));
    totalQueenMoves.push(...diagonalMoves(currentRow, currentColumn, DOWN, RIGHT, QUEEN_MOVE, boardState, currentPieceColor));

    totalQueenMoves.push(...lineMoves(currentRow, currentColumn, UP, NO_HORIZONTAL_MOVE, QUEEN_MOVE, boardState, currentPieceColor));
    totalQueenMoves.push(...lineMoves(currentRow, currentColumn, NO_VERTICAL_MOVE, RIGHT, QUEEN_MOVE, boardState, currentPieceColor));
    totalQueenMoves.push(...lineMoves(currentRow, currentColumn, DOWN, NO_HORIZONTAL_MOVE, QUEEN_MOVE, boardState, currentPieceColor));
    totalQueenMoves.push(...lineMoves(currentRow, currentColumn, NO_VERTICAL_MOVE, LEFT, QUEEN_MOVE, boardState, currentPieceColor));

    return totalQueenMoves;
}

function getKingMoves(currentRow, currentColumn, boardState, currentPieceColor) {
    const NO_VERTICAL_MOVE = 0;
    const NO_HORIZONTAL_MOVE = 0;
    const LEFT = -1;
    const RIGHT = 1;
    const DOWN = 1;
    const UP = -1;

    let totalKingMoves = [];
    totalKingMoves.push(...adjacentMoves(currentRow, currentColumn, UP, NO_HORIZONTAL_MOVE, boardState, currentPieceColor));
    totalKingMoves.push(...adjacentMoves(currentRow, currentColumn, NO_VERTICAL_MOVE, RIGHT, boardState, currentPieceColor));
    totalKingMoves.push(...adjacentMoves(currentRow, currentColumn, DOWN, NO_HORIZONTAL_MOVE, boardState, currentPieceColor));
    totalKingMoves.push(...adjacentMoves(currentRow, currentColumn, NO_VERTICAL_MOVE, LEFT, boardState, currentPieceColor));
    
    //Diagonal
    totalKingMoves.push(...adjacentMoves(currentRow, currentColumn, UP, LEFT, boardState, currentPieceColor));
    totalKingMoves.push(...adjacentMoves(currentRow, currentColumn, UP, RIGHT, boardState, currentPieceColor));
    totalKingMoves.push(...adjacentMoves(currentRow, currentColumn, DOWN, LEFT, boardState, currentPieceColor));
    totalKingMoves.push(...adjacentMoves(currentRow, currentColumn, DOWN, RIGHT, boardState, currentPieceColor));

    return totalKingMoves;
}


function lineMoves(startingRow, startingColumn, stepVertical, stepHorizontal, pieceMoveValue, boardState, currentPieceColor) {
    let tempCurrentRow = startingRow + stepVertical;
    let tempCurrentColumn = startingColumn + stepHorizontal;
    let tempLineMoves = [];

    while (inBounds( tempCurrentRow, tempCurrentColumn )) {
        if (isFriendlyPiece(boardState[tempCurrentRow][tempCurrentColumn], currentPieceColor)) { break; }
        let tempState = boardState.map((row) => [...row]);
        tempState[tempCurrentRow][tempCurrentColumn] = pieceMoveValue;
        tempState[startingRow][startingColumn] = EMPTY;
        tempLineMoves.push(tempState);
        if (isEnemyPiece(boardState[tempCurrentRow][tempCurrentColumn], currentPieceColor)) { break; }
        tempCurrentRow += stepVertical;
        tempCurrentColumn += stepHorizontal;
    }
    return tempLineMoves;
}

function diagonalMoves(startingRow, startingColumn, stepVertical, stepHorizontal, pieceMoveValue, boardState, currentPieceColor) {
    let tempCurrentRow = startingRow + stepVertical;
    let tempCurrentColumn = startingColumn + stepHorizontal;
    let tempDiagonalMoves = [];

    while (inBounds( tempCurrentRow, tempCurrentColumn )) {
        if (isFriendlyPiece(boardState[tempCurrentRow][tempCurrentColumn], currentPieceColor)) { break; }
        let tempState = boardState.map((row) => [...row]);
        tempState[tempCurrentRow][tempCurrentColumn] = pieceMoveValue;
        tempState[startingRow][startingColumn] = EMPTY;
        tempDiagonalMoves.push(tempState);
        if (isEnemyPiece(boardState[tempCurrentRow][tempCurrentColumn], currentPieceColor)) { break; }
        tempCurrentRow += stepVertical;
        tempCurrentColumn += stepHorizontal;
    }

    return tempDiagonalMoves;
}

function adjacentMoves(currentRow, currentColumn, stepVertical, stepHorizontal, boardState, currentPieceColor) {
    const KING_MOVE = 6 * currentPieceColor;
    const tempRow = currentRow + stepVertical;
    const tempColumn = currentColumn + stepHorizontal;
    let tempAdjacentMoves = [];

    if (inBounds( tempRow, tempColumn )) {
        if (!isFriendlyPiece(boardState[tempRow][tempColumn], currentPieceColor)) {
            let tempState = boardState.map((row) => [...row]);
            tempState[tempRow][tempColumn] = KING_MOVE;
            tempState[currentRow][currentColumn] = EMPTY;
            tempAdjacentMoves.push(tempState);
        }
    }
    
    return tempAdjacentMoves;
}

function knightMoves(currentRow, currentColumn, stepVertical, stepHorizontal, boardState, currentPieceColor) {
    const KNIGHT_MOVE = 3 * currentPieceColor;
    const tempRow = currentRow + stepVertical;
    const tempColumn = currentColumn + stepHorizontal;
    let tempKnightMoves = [];

    if (inBounds( tempRow, tempColumn )) {
        if (!isFriendlyPiece(boardState[tempRow][tempColumn], currentPieceColor)) {
            let tempState = boardState.map((row) => [...row]);
            tempState[tempRow][tempColumn] = KNIGHT_MOVE;
            tempState[tempRow - stepVertical][tempColumn - stepHorizontal] = EMPTY;
            tempKnightMoves.push(tempState);
        }
    }
    return tempKnightMoves;
}

function isWhite(pieceValue) {
    return pieceValue > 0;
}

function isBlack(pieceValue) {
    return pieceValue < 0;
}