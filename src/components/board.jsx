import { useState, useEffect } from 'react';
import '../App.css';
import MoveValidator from './moveValidator';
import PreviousMove from './previousMove';
import { getValidMoves } from './moveValidator';
import getAIMove from './recursionAIMove';
import { getBishopMoves, isEnemyPiece } from './pieceMoves';
import getBoardScore from './boardScore';

export default function ChessBoard({boardState, updateBoardState, resetBoard, maxDepth}) {

    const HUMAN = 1;
    const AI = -1;
    const rows = 8;
    const columns = 8;
    const cells = [];
    const WHITE = 1;
    const BLACK = -1;
    const WHITE_KING = 6;
    const BLACK_KING = -6;

    const [ currentRow, setCurrentRow ] = useState(-1);
    const [ currentColumn, setCurrentColumn ] = useState(-1);
    const [ validateMove , setValidateMove ] = useState(false);
    const [ showPreviousMove, setShowPreviousMove ] = useState(false);
    const [ previousMove, setPreviousMove ] = useState([[0,0], [0,0]]);
    const [ cannotMovePiece, setCannotMovePiece ] = useState(false);
    const [ whiteCheckmate, setWhiteCheckmate ] = useState(false);
    const [ blackCheckmate, setBlackCheckmate ] = useState(false);
    const [ whiteKingPos, setWhiteKingPos ] = useState([7,4]);
    const [ blackKingPos, setBlackKingPos ] = useState([0,4]);
    const [ turn, setTurn ] = useState(HUMAN);
    const [ takenWhitePieces, setTakenWhitePieces ] = useState([]);

    const RESTING = 0;
    const MAKING_MOVE = 1;
    const [ AiState, setAiState ] = useState(RESTING);


    useEffect(() => {
        if (turn != AI) {
            setAiState(RESTING);
            return; 
        }
        setAiState(MAKING_MOVE);
    }, [turn]);
    
   useEffect(() => {
        if (AiState === RESTING ) { return; }

        async function AiMove() {
            await new Promise(resolve => setTimeout(resolve, 50));

            const oldState = boardState.map((row) => [...row])

            const moveMap = new Map();
            let bestMove;
            let moveMade;
            let oldPiece;
            for (let depth = 1; depth <= maxDepth; depth++) {
                ({move: bestMove} = getAIMove(boardState, depth, AI, -Infinity, Infinity, bestMove, moveMap, setWhiteCheckmate, setBlackCheckmate));
                for (let row = 0; row < rows; row++) {
                    for (let column = 0; column < columns; column++) {
                        if (oldState[row][column] !== bestMove[row][column] && depth === maxDepth) {
                            if (moveMade === undefined) {
                                moveMade = [row, column];
                                continue;
                            }
                            else if (oldPiece === undefined) {
                                oldPiece = [row, column];
                            }
                            
                        }
                        const pieceValue = boardState[row][column];
                        if (pieceValue === WHITE_KING) { setWhiteKingPos([row, column]); }
                        if (pieceValue === BLACK_KING) { setBlackKingPos([row, column]); }
                    }
                }
            }
            const bestMoveScore = getBoardScore(bestMove);
            if (bestMoveScore > 100000) {
                setWhiteCheckmate(true);
            } 
            if (bestMoveScore < -100000) {
                setBlackCheckmate(true);
            }
            updateBoardState(bestMove);
            setShowPreviousMove(true);
            setPreviousMove([moveMade, oldPiece]);
            setTurn(HUMAN);
            setAiState(RESTING);
        }
        AiMove();
    }, [AiState]);

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

 
    let lastCellBlack = false;
    let tempWhiteMoves = Array.from({ length: 8 }, () => Array(8).fill(0));
    let tempBlackMoves = Array.from({ length: 8 }, () => Array(8).fill(0));
    
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            const pieceValue = boardState[row][column];
            const pieceImage = CHESS_PIECE_IMAGES[pieceValue]?.img;
            const currentPieceColor = isWhite(pieceValue) ? WHITE : BLACK;
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
                    disabled={turn===AI}
                    onClick={() => handleTurn(row, column)}>
                    {!(pieceImage === undefined) && <img src={pieceImage} className="chess-image"></img>}
                </button>);
            lastCellBlack = !lastCellBlack;
        }
        lastCellBlack = !lastCellBlack;

    }

    useEffect(() => {
        const tempValidMoves = tempWhiteMoves.flat();
        const newCheckmate = tempValidMoves.every(cell => cell === 0);
        setWhiteCheckmate(newCheckmate);
    }, [JSON.stringify(tempWhiteMoves)]);

    useEffect(() => {
        const tempValidMoves = tempBlackMoves.flat();
        const newCheckmate = tempValidMoves.every(cell => cell === 0);
        setBlackCheckmate(newCheckmate);
    }, [JSON.stringify(tempBlackMoves)]);

    function handleTurn(row, column) {
        if (turn === HUMAN && isEnemyPiece(boardState[row][column], WHITE)) {
            return;
        }
        setValidateMove(true);
        setShowPreviousMove(false);
        setCurrentRow(row);
        setCurrentColumn(column)
    }
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

            {(AiState !== RESTING ) && <div className="loading">AI Thinking...</div>}
            {(whiteCheckmate || blackCheckmate) && <div className="game-over"><div>Game over!<p>{checkmateText}</p><button className="play-again-btn" onClick={() => resetBoard()}>Play Again</button></div></div>}
            {cannotMovePiece && <div className="pop-up">This piece can't be moved.<br /> It's blocked or king would be in check!</div>}

            <div>{takenWhitePieces}</div>
            <div className="ches}s-board-container">
                    {validateMove &&
                     <MoveValidator 
                        pieceValue={boardState[currentRow][currentColumn]} 
                        currentRow={currentRow} 
                        currentColumn={currentColumn} 
                        boardState={boardState} 
                        updateBoardState={updateBoardState} 
                        setCannotMovePiece={setCannotMovePiece}
                        setValidateMove={setValidateMove}
                        setWhiteKingPos={setWhiteKingPos}
                        setBlackKingPos={setBlackKingPos}
                        whiteKingPos={whiteKingPos}
                        blackKingPos={blackKingPos}
                        setTurn={setTurn}
                        turn={turn}
                        />}
                    
                    {showPreviousMove && <PreviousMove previousMove={previousMove} />}
                <div className="grid-container">{cells}</div>
            </div>
        </div>
    );
}   