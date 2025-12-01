import getBoardScore from "./boardScore";
import { inBounds, isEnemyPiece, isFriendlyPiece } from "./pieceMoves";

const AI = -1;
const HUMAN = 1;
const WHITE = 1;
const EMPTY = 0;
const BLACK = -1;

export default function getAIMove(boardState, depth, turn, alpha, beta) {

    const rows = 8;
    const columns = 8;
    const boardScore = getBoardScore(boardState);
    let bestPossibleMove = null;

    if (depth === 0) {
        return { score: boardScore, move: null };
    }
    if (boardScore >= 100000 && turn === AI) {
        return { score: boardScore, move: null };
    }
    if (boardScore <= -100000 && turn === HUMAN) {
        return { score: boardScore, move: null };
    }

    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            const pieceValue = boardState[row][column];
            const currentPieceColor = isWhite(pieceValue) ? WHITE : BLACK;
            const nextTurn = turn === AI ? HUMAN : AI;
            let tempResult = null;
            if (isBlack(pieceValue) && turn === AI) {
                tempResult = getValidMoves(row, column, boardState, currentPieceColor, nextTurn, depth);
            }
            if (isWhite(pieceValue) && turn === HUMAN) {
                tempResult = getValidMoves(row, column, boardState, currentPieceColor, nextTurn, depth);
            }
            if (tempResult != null) { return tempResult; }
        }
    }

    return { score: turn === HUMAN ? alpha : beta, move: bestPossibleMove };

    function getValidMoves(row, column, boardState, currentPieceColor, nextTurn, depth) {

        let tempResult = null;

            switch (boardState[row][column]) {
                case -1:
                case 1:
                    tempResult = getPawnMoves(row, column, boardState, currentPieceColor, nextTurn, depth);
                    break;

                case -2:
                case 2:
                    tempResult = getRookMoves( row, column, boardState, currentPieceColor, nextTurn, depth);
                    break;

                case -3:
                case 3:
                    tempResult = getKnightMoves(row, column, boardState, currentPieceColor, nextTurn, depth);
                    break;
                
                case -4: 
                case 4: 
                    tempResult = getBishopMoves(row, column, boardState, currentPieceColor, nextTurn, depth);
                    break;
                
                case -5:
                case 5:
                    tempResult = getQueenMoves(row, column, boardState, currentPieceColor, nextTurn, depth);
                    break;
                
                case -6: 
                case 6: 
                    tempResult = getKingMoves(row, column, boardState, currentPieceColor, nextTurn, depth);
                    break;
            }
        if (beta <= alpha) { return tempResult; }
        return null;
    }

    function getPawnMoves(currentRow, currentColumn, boardState, currentPieceColor, nextTurn, depth) {
        const PAWN_MOVE = 1 * currentPieceColor;

        if (inBounds(currentRow - PAWN_MOVE, currentColumn - PAWN_MOVE) && isEnemyPiece(boardState[currentRow - PAWN_MOVE][currentColumn - PAWN_MOVE], currentPieceColor)) {
            let tempState = boardState.map((row) => [...row]);
            tempState[currentRow - PAWN_MOVE][currentColumn - PAWN_MOVE] = PAWN_MOVE;
            tempState[currentRow][currentColumn] = EMPTY;   
            const { score: tempScore } = getAIMove(tempState, depth - 1, nextTurn, alpha, beta);

            if (nextTurn === AI) {
                if (tempScore > alpha) { 
                    alpha = tempScore; 
                    bestPossibleMove = tempState;
                } 
            }
            if (nextTurn === HUMAN) {
                if (tempScore < beta) { 
                    beta = tempScore;
                    bestPossibleMove = tempState;
                } 
            }
            if (beta <= alpha) return { score: nextTurn === AI ? alpha : beta, move: bestPossibleMove, alpha, beta };

        }
        if (inBounds(currentRow - PAWN_MOVE, currentColumn + PAWN_MOVE) && isEnemyPiece(boardState[currentRow - PAWN_MOVE][currentColumn + PAWN_MOVE], currentPieceColor)) {
            let tempState = boardState.map((row) => [...row]);
            tempState[currentRow - PAWN_MOVE][currentColumn + PAWN_MOVE] = PAWN_MOVE;
            tempState[currentRow][currentColumn] = EMPTY;
            const { score: tempScore } = getAIMove(tempState, depth - 1, nextTurn, alpha, beta);

            if (nextTurn === AI) {
                if (tempScore > alpha) { 
                    alpha = tempScore; 
                    bestPossibleMove = tempState;
                } 
            }
            if (nextTurn === HUMAN) {
                if (tempScore < beta) { 
                    beta = tempScore;
                    bestPossibleMove = tempState;
                } 
            }
            if (beta <= alpha) {  return { score: nextTurn === AI ? alpha : beta, move: bestPossibleMove, alpha, beta }; }

        }
        if (currentRow === 6 && currentPieceColor === WHITE) {
            if (boardState[currentRow - 2][currentColumn] === EMPTY && boardState[currentRow - 1][currentColumn] === EMPTY) {
                let tempState = boardState.map((row) => [...row]);
                tempState[currentRow - 2][currentColumn] = PAWN_MOVE;
                tempState[currentRow][currentColumn] = EMPTY;
                const { score: tempScore } = getAIMove(tempState, depth - 1, nextTurn, alpha, beta);

                if (nextTurn === AI) {
                    if (tempScore > alpha) { 
                    alpha = tempScore; 
                    bestPossibleMove = tempState;
                } 
                }
                if (nextTurn === HUMAN) {
                    if (tempScore < beta) { 
                    beta = tempScore;
                    bestPossibleMove = tempState;
                } 
                }
                if (beta <= alpha) {  return { score: nextTurn === AI ? alpha : beta, move: bestPossibleMove, alpha, beta }; }
                }
        }
        if (currentRow === 1 && currentPieceColor === BLACK) { 
            if (boardState[currentRow + 2][currentColumn] === EMPTY && boardState[currentRow + 1][currentColumn] === EMPTY) {
                let tempState = boardState.map((row) => [...row]);
                tempState[currentRow + 2][currentColumn] = PAWN_MOVE;
                tempState[currentRow][currentColumn] = EMPTY;
                const { score: tempScore } = getAIMove(tempState, depth - 1, nextTurn, alpha, beta);

                if (nextTurn === AI) {
                    if (tempScore > alpha) { 
                    alpha = tempScore; 
                    bestPossibleMove = tempState;
                } 
                }
                if (nextTurn === HUMAN) {
                    if (tempScore < beta) { 
                    beta = tempScore;
                    bestPossibleMove = tempState;
                } 
                }
                if (beta <= alpha) {  return { score: nextTurn === AI ? alpha : beta, move: bestPossibleMove, alpha, beta }; }
            }   
        }
        if (inBounds(currentRow - PAWN_MOVE, currentColumn) && boardState[currentRow - PAWN_MOVE][currentColumn] === EMPTY) {
            let tempState = boardState.map((row) => [...row]);
            tempState[currentRow - PAWN_MOVE][currentColumn] = PAWN_MOVE;
            tempState[currentRow][currentColumn] = EMPTY;
            const { score: tempScore } = getAIMove(tempState, depth - 1, nextTurn, alpha, beta);

            if (nextTurn === AI) {
                if (tempScore > alpha) { 
                    alpha = tempScore; 
                    bestPossibleMove = tempState;
                } 
            }
            if (nextTurn === HUMAN) {
                if (tempScore < beta) { 
                    beta = tempScore;
                    bestPossibleMove = tempState;
                } 
            }
            if (beta <= alpha) {  return { score: nextTurn === AI ? alpha : beta, move: bestPossibleMove, alpha, beta }; }
        }
        return null;
    }
    
    function getRookMoves(currentRow, currentColumn, boardState, currentPieceColor, nextTurn, depth) {
        const ROOK_MOVE = 2 * currentPieceColor;
        const NO_VERTICAL_MOVE = 0;
        const NO_HORIZONTAL_MOVE = 0;
        const LEFT = -1;
        const RIGHT = 1;
        const DOWN = 1;
        const UP = -1;
    
        let tempResult = null;
        tempResult = lineMoves(currentRow, currentColumn, UP, NO_HORIZONTAL_MOVE, ROOK_MOVE, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }
        tempResult = lineMoves(currentRow, currentColumn, NO_VERTICAL_MOVE, RIGHT, ROOK_MOVE, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }
        tempResult = lineMoves(currentRow, currentColumn, DOWN, NO_HORIZONTAL_MOVE, ROOK_MOVE, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }
        tempResult = lineMoves(currentRow, currentColumn, NO_VERTICAL_MOVE, LEFT, ROOK_MOVE, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }

        return null;
    }
    
    function getKnightMoves(currentRow, currentColumn, boardState, currentPieceColor, nextTurn, depth) {
        const SHORT_LEFT = -1;
        const LONG_LEFT = -2;
        const SHORT_RIGHT = 1;
        const LONG_RIGHT = 2;
        const SHORT_DOWN = 1;
        const LONG_DOWN = 2;
        const SHORT_UP = -1;
        const LONG_UP = -2;
    
        let tempResult = null;
        tempResult = knightMoves(currentRow, currentColumn, SHORT_UP, LONG_LEFT, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }
        tempResult = knightMoves(currentRow, currentColumn, LONG_UP, SHORT_LEFT, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }
        tempResult = knightMoves(currentRow, currentColumn, SHORT_UP, LONG_RIGHT, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }
        tempResult = knightMoves(currentRow, currentColumn, LONG_UP, SHORT_RIGHT, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }
        tempResult = knightMoves(currentRow, currentColumn, SHORT_DOWN, LONG_LEFT, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }
        tempResult = knightMoves(currentRow, currentColumn, LONG_DOWN, SHORT_LEFT, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }
        tempResult = knightMoves(currentRow, currentColumn, SHORT_DOWN, LONG_RIGHT, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }
        tempResult = knightMoves(currentRow, currentColumn, LONG_DOWN, SHORT_RIGHT, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }

        return null;
    }
    
    function getBishopMoves(currentRow, currentColumn, boardState, currentPieceColor, nextTurn, depth) {
        const BISHOP_MOVE = 4 * currentPieceColor;
        const LEFT = -1;
        const RIGHT = 1;
        const DOWN = 1;
        const UP = -1;
    
        let tempResult = null;
        tempResult = diagonalMoves(currentRow, currentColumn, UP, LEFT, BISHOP_MOVE, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }
        tempResult = diagonalMoves(currentRow, currentColumn, UP, RIGHT, BISHOP_MOVE, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }
        tempResult = diagonalMoves(currentRow, currentColumn, DOWN, LEFT, BISHOP_MOVE, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }
        tempResult = diagonalMoves(currentRow, currentColumn, DOWN, RIGHT, BISHOP_MOVE, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }

        return null;
    }
    
    function getQueenMoves(currentRow, currentColumn, boardState, currentPieceColor, nextTurn, depth) {
        const QUEEN_MOVE = 5 * currentPieceColor;
        const NO_VERTICAL_MOVE = 0;
        const NO_HORIZONTAL_MOVE = 0;
        const LEFT = -1;
        const RIGHT = 1;
        const DOWN = 1;
        const UP = -1;

        let tempResult = null;
        tempResult = diagonalMoves(currentRow, currentColumn, UP, LEFT, QUEEN_MOVE, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }
        tempResult = diagonalMoves(currentRow, currentColumn, UP, RIGHT, QUEEN_MOVE, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }
        tempResult = diagonalMoves(currentRow, currentColumn, DOWN, LEFT, QUEEN_MOVE, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }
        tempResult = diagonalMoves(currentRow, currentColumn, DOWN, RIGHT, QUEEN_MOVE, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }
    
        tempResult = lineMoves(currentRow, currentColumn, UP, NO_HORIZONTAL_MOVE, QUEEN_MOVE, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }
        tempResult = lineMoves(currentRow, currentColumn, NO_VERTICAL_MOVE, RIGHT, QUEEN_MOVE, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }
        tempResult = lineMoves(currentRow, currentColumn, DOWN, NO_HORIZONTAL_MOVE, QUEEN_MOVE, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }
        tempResult = lineMoves(currentRow, currentColumn, NO_VERTICAL_MOVE, LEFT, QUEEN_MOVE, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }
    
        return null;
    }
    
    function getKingMoves(currentRow, currentColumn, boardState, currentPieceColor, nextTurn, depth) {
        const NO_VERTICAL_MOVE = 0;
        const NO_HORIZONTAL_MOVE = 0;
        const LEFT = -1;
        const RIGHT = 1;
        const DOWN = 1;
        const UP = -1;

        let tempResult = null;
        tempResult = adjacentMoves(currentRow, currentColumn, UP, NO_HORIZONTAL_MOVE, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }
        tempResult = adjacentMoves(currentRow, currentColumn, NO_VERTICAL_MOVE, RIGHT, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }
        tempResult = adjacentMoves(currentRow, currentColumn, DOWN, NO_HORIZONTAL_MOVE, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }
        tempResult = adjacentMoves(currentRow, currentColumn, NO_VERTICAL_MOVE, LEFT, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }
        
        //Diagonal
        tempResult = adjacentMoves(currentRow, currentColumn, UP, LEFT, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }
        tempResult = adjacentMoves(currentRow, currentColumn, UP, RIGHT, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }
        tempResult = adjacentMoves(currentRow, currentColumn, DOWN, LEFT, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }
        tempResult = adjacentMoves(currentRow, currentColumn, DOWN, RIGHT, boardState, currentPieceColor, nextTurn, depth);
        if (tempResult !== null) { return tempResult; }
    
        return null;
    }
    
    
    function lineMoves(startingRow, startingColumn, stepVertical, stepHorizontal, pieceMoveValue, boardState, currentPieceColor, nextTurn, depth) {
        let tempCurrentRow = startingRow + stepVertical;
        let tempCurrentColumn = startingColumn + stepHorizontal;

        while (inBounds( tempCurrentRow, tempCurrentColumn )) {
            if (isFriendlyPiece(boardState[tempCurrentRow][tempCurrentColumn], currentPieceColor)) { break; }
            let tempState = boardState.map((row) => [...row]);
            tempState[tempCurrentRow][tempCurrentColumn] = pieceMoveValue;
            tempState[startingRow][startingColumn] = EMPTY;
            const { score: tempScore } = getAIMove(tempState, depth - 1, nextTurn, alpha, beta);
            
            if (nextTurn === AI) {
                if (tempScore > alpha) { 
                    alpha = tempScore; 
                    bestPossibleMove = tempState;
                } 
            }
            if (nextTurn === HUMAN) {
                if (tempScore < beta) { 
                    beta = tempScore;
                    bestPossibleMove = tempState;
                } 
            }
            if (beta <= alpha) {  return { score : nextTurn === AI ? alpha : beta, move: bestPossibleMove, alpha, beta }; }
            if (isEnemyPiece(boardState[tempCurrentRow][tempCurrentColumn], currentPieceColor)) { break; }
            tempCurrentRow += stepVertical;
            tempCurrentColumn += stepHorizontal;
        }
        return null;
    }
    
    function diagonalMoves(startingRow, startingColumn, stepVertical, stepHorizontal, pieceMoveValue, boardState, currentPieceColor, nextTurn, depth) {
        let tempCurrentRow = startingRow + stepVertical;
        let tempCurrentColumn = startingColumn + stepHorizontal;
    
        while (inBounds( tempCurrentRow, tempCurrentColumn )) {
            if (isFriendlyPiece(boardState[tempCurrentRow][tempCurrentColumn], currentPieceColor)) { break; }
            let tempState = boardState.map((row) => [...row]);
            tempState[tempCurrentRow][tempCurrentColumn] = pieceMoveValue;
            tempState[startingRow][startingColumn] = EMPTY;
            const { score: tempScore } = getAIMove(tempState, depth - 1, nextTurn, alpha, beta)
            
            if (nextTurn === AI) {
                if (tempScore > alpha) { 
                    alpha = tempScore; 
                    bestPossibleMove = tempState;
                } 
            }
            if (nextTurn === HUMAN) {
                if (tempScore < beta) { 
                    beta = tempScore;
                    bestPossibleMove = tempState;
                } 
            }
            if (beta <= alpha) {  return { score : nextTurn === AI ? alpha : beta, move: bestPossibleMove, alpha, beta }; }
            if (isEnemyPiece(boardState[tempCurrentRow][tempCurrentColumn], currentPieceColor)) { break; }
            tempCurrentRow += stepVertical;
            tempCurrentColumn += stepHorizontal;
        }
    return null;
    }
    
    function adjacentMoves(currentRow, currentColumn, stepVertical, stepHorizontal, boardState, currentPieceColor, nextTurn, depth) {
        const KING_MOVE = 6 * currentPieceColor;
        const tempRow = currentRow + stepVertical;
        const tempColumn = currentColumn + stepHorizontal;
    
        if (inBounds( tempRow, tempColumn )) {
            if (!isFriendlyPiece(boardState[tempRow][tempColumn], currentPieceColor)) {
                let tempState = boardState.map((row) => [...row]);
                tempState[tempRow][tempColumn] = KING_MOVE;
                tempState[tempRow - stepVertical][tempColumn - stepHorizontal] = EMPTY;
                const { score: tempScore } = getAIMove(tempState, depth - 1, nextTurn, alpha, beta);
            
                if (nextTurn === AI) {
                    if (tempScore > alpha) { 
                    alpha = tempScore; 
                    bestPossibleMove = tempState;
                } 
                }
                if (nextTurn === HUMAN) {
                    if (tempScore < beta) { 
                    beta = tempScore;
                    bestPossibleMove = tempState;
                } 
                }
                if (beta <= alpha) {  return { score : nextTurn === AI ? alpha : beta, move: bestPossibleMove, alpha, beta }; }
            }
        }
        return null;
    }
    
    function knightMoves(currentRow, currentColumn, stepVertical, stepHorizontal, boardState, currentPieceColor, nextTurn, depth) {
        const KNIGHT_MOVE = 3 * currentPieceColor;
        const tempRow = currentRow + stepVertical;
        const tempColumn = currentColumn + stepHorizontal;
    
        if (inBounds( tempRow, tempColumn )) {
            if (!isFriendlyPiece(boardState[tempRow][tempColumn], currentPieceColor)) {
                let tempState = boardState.map((row) => [...row]);
                tempState[tempRow][tempColumn] = KNIGHT_MOVE;
                tempState[tempRow - stepVertical][tempColumn - stepHorizontal] = EMPTY;
                const { score: tempScore } = getAIMove(tempState, depth - 1, nextTurn, alpha, beta);
            
                if (nextTurn === AI) {
                    if (tempScore > alpha) { 
                    alpha = tempScore; 
                    bestPossibleMove = tempState;
                } 
                }
                if (nextTurn === HUMAN) {
                    if (tempScore < beta) { 
                    beta = tempScore;
                    bestPossibleMove = tempState;
                } 
                }
                if (beta <= alpha) {  return { score : nextTurn === AI ? alpha : beta, move: bestPossibleMove, alpha, beta }; }
            }
        }
        return null;
    }

    function isWhite(pieceValue) {
        return pieceValue > 0;
    }

    function isBlack(pieceValue) {
        return pieceValue < 0;
    }
}