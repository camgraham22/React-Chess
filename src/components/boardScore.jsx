import { getValidMoves } from "./moveValidator";

export default function getBoardScore(boardState) {

    const pawnTable = [
        [0,  0,  0,  0,  0,  0,  0,  0],
        [50, 50, 50, 50, 50, 50, 50, 50],
        [10, 10, 20, 30, 30, 20, 10, 10],
        [5,  5, 10, 25, 25, 10,  5,  5],
        [0,  0,  0, 20, 20,  0,  0,  0],
        [5, -5,-10,  0,  0,-10, -5,  5],
        [5, 10, 10,-20,-20, 10, 10,  5],
        [0,  0,  0,  0,  0,  0,  0,  0]
    ];

    const knightTable = [
        [-50,-40,-30,-30,-30,-30,-40,-50],
        [-40,-20,  0,  0,  0,  0,-20,-40],
        [-30,  0, 10, 15, 15, 10,  0,-30],
        [-30,  5, 15, 20, 20, 15,  5,-30],
        [-30,  0, 15, 20, 20, 15,  0,-30],
        [-30,  5, 10, 15, 15, 10,  5,-30],
        [-40,-20,  0,  5,  5,  0,-20,-40],
        [-50,-40,-30,-30,-30,-30,-40,-50],
    ];

    const bishopTable = [
        [-20,-10,-10,-10,-10,-10,-10,-20],
        [-10,  0,  0,  0,  0,  0,  0,-10],
        [-10,  0,  5, 10, 10,  5,  0,-10],
        [-10,  5,  5, 10, 10,  5,  5,-10],
        [-10,  0, 10, 10, 10, 10,  0,-10],
        [-10, 10, 10, 10, 10, 10, 10,-10],
        [-10,  5,  0,  0,  0,  0,  5,-10],
        [-20,-10,-10,-10,-10,-10,-10,-20],
    ];

    const rookTable = [
        [0,  0,  0,  0,  0,  0,  0,  0],
        [5, 10, 10, 10, 10, 10, 10,  5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [0,  0,  0,  5,  5,  0,  0,  0]
    ];

    const queenTable = [
        [-20,-10,-10, -5, -5,-10,-10,-20],
        [-10,  0,  0,  0,  0,  0,  0,-10],
        [-10,  0,  5,  5,  5,  5,  0,-10],
        [ -5,  0,  5,  5,  5,  5,  0, -5],
        [  0,  0,  5,  5,  5,  5,  0, -5],
        [-10,  5,  5,  5,  5,  5,  0,-10],
        [-10,  0,  5,  0,  0,  0,  0,-10],
        [-20,-10,-10, -5, -5,-10,-10,-20]
    ];

    const kingTable = [
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-20,-30,-30,-40,-40,-30,-30,-20],
        [-10,-20,-20,-20,-20,-20,-20,-10],
        [ 20, 20,  0,  0,  0,  0, 20, 20],
        [ 20, 30, 10,  0,  0, 10, 30, 20]
    ];

    const pieceSquareTables = {
        1: pawnTable,
        2: rookTable,
        3: knightTable,
        4: bishopTable,
        5: queenTable,
        6: kingTable,
    };

    const rewardMaterialTable = {
        king: 0,
        pawn: 100,
        bishop: 300,
        knight: 300,
        rook: 500,
        queen: 900,
        checkmate: 100000,
    }

    const pieceTextValues = {
        1: "pawn",
        2: "rook",
        3: "knight",
        4: "bishop",
        5: "queen",
        6: "king",
    }

    const rows = 8;
    const columns = 8;
    const WHITE_KING = 6;
    const BLACK_KING = -6;
    let whiteTotal = 0;
    let blackTotal = 0;
    let whiteKingPos;
    let blackKingPos;
    let tempWhiteMoves = Array.from({ length: 8 }, () => Array(8).fill(0));
    let tempBlackMoves = Array.from({ length: 8 }, () => Array(8).fill(0));

    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            const pieceValue = boardState[row][column];
            if (pieceValue === WHITE_KING) { whiteKingPos = [row, column]; }
            if (pieceValue === BLACK_KING) { blackKingPos = [row, column]; }
        }
    }

    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            if (isWhite(boardState[row][column])) {
                const currentPieceValue = boardState[row][column];
                const currentPieceColor = currentPieceValue > 0 ? 1 : -1;
                const rewardTable = pieceSquareTables[Math.abs(currentPieceValue)];
                const rewardPoisitionValue = rewardTable[7-row][column];
                const rewardMaterialValue = rewardMaterialTable[pieceTextValues[Math.abs(currentPieceValue)]]
                whiteTotal += (rewardMaterialValue + rewardPoisitionValue);
                getValidMoves(tempWhiteMoves, currentPieceValue, row, column, boardState, currentPieceColor, whiteKingPos, blackKingPos);

            }
            if (isBlack(boardState[row][column])) {
                const currentPieceValue = boardState[row][column];
                const currentPieceColor = currentPieceValue > 0 ? 1 : -1;
                const rewardTable = pieceSquareTables[Math.abs(currentPieceValue)];
                const rewardPoisitionValue = rewardTable[row][column];
                const rewardMaterialValue = rewardMaterialTable[pieceTextValues[Math.abs(currentPieceValue)]];
                blackTotal += (rewardMaterialValue + rewardPoisitionValue);
                getValidMoves(tempBlackMoves, currentPieceValue, row, column, boardState, currentPieceColor, whiteKingPos, blackKingPos);
            }
        }
    }

    const tempValidWhiteMoves = tempWhiteMoves.flat();
    const whiteCheckmate = tempValidWhiteMoves.every(cell => cell === 0);
    if (whiteCheckmate) { whiteTotal += rewardMaterialTable.checkmate; }
    
    const tempValidBlackMoves = tempBlackMoves.flat();
    const blackCheckmate = tempValidBlackMoves.every(cell => cell === 0);
    if (blackCheckmate) { blackTotal -= rewardMaterialTable.checkmate; }

    return blackTotal - whiteTotal;
}

function isWhite(pieceValue) {
    return pieceValue > 0;
}
function isBlack(pieceValue) {
    return pieceValue < 0;
}