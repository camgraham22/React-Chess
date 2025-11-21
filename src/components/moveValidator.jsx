import "../App.css"
import { useEffect, useState } from "react";

export default function MoveValidator({pieceValue, currentRow, currentColumn, boardState, updateBoardState}) {
    const rows = 8;
    const columns = 8;
    const cells = [];
    const validMoves = showValidMoves();

    function showValidMoves() {

        const tempMoves = Array.from({ length: 8 }, () => Array(8).fill(0));
        console.log(pieceValue);
        // Converts strings into values
        switch (Number(pieceValue)) {
            case 1:
                if (currentRow === 6) {
                    if (boardState[currentRow - 2][currentColumn] === 0) {
                        tempMoves[currentRow - 2][currentColumn] = 1;
                    }
                }
                if (currentRow >= 1) {
                    if (boardState[currentRow - 1][currentColumn] === 0) {
                        tempMoves[currentRow - 1][currentColumn] = 1;
                    }
                    if (currentColumn > 0 && boardState[currentRow - 1][currentColumn - 1] < 0) {
                        tempMoves[currentRow - 1][currentColumn - 1] = 1;
                    }
                    if (currentColumn < 7 && boardState[currentRow - 1][currentColumn + 1] < 0) {
                        tempMoves[currentRow - 1][currentColumn + 1] = 1;
                    }
                }
                break;

            case 2:
                console.log(currentRow);
                let tempCurrentRow = currentRow - 1;
                console.log(`${tempCurrentRow} + ${currentColumn}`);

                while (tempCurrentRow >= 0 && boardState[tempCurrentRow][currentColumn] <= 0) {
                    tempMoves[tempCurrentRow][currentColumn] = 2;
                    if (boardState[tempCurrentRow][currentColumn] < 0) {
                        tempCurrentRow = -1;
                    }
                    tempCurrentRow--;
                }

                tempCurrentRow = currentRow + 1;
                while (tempCurrentRow <= 7 && boardState[tempCurrentRow][currentColumn] <= 0) {
                    tempMoves[tempCurrentRow][currentColumn] = 2;
                    if (boardState[tempCurrentRow][currentColumn] < 0) {
                        tempCurrentRow = -1;
                    }
                    tempCurrentRow++;
                }

                let tempCurrentColumn = currentColumn - 1;
                while (tempCurrentColumn >= 0 && boardState[currentRow][tempCurrentColumn] <= 0) {
                    tempMoves[currentRow][tempCurrentColumn] = 2;
                    if (boardState[currentRow][tempCurrentColumn] < 0) {
                        tempCurrentColumn = -1;
                    }
                    tempCurrentColumn--;
                }

                tempCurrentColumn = currentColumn + 1;
                while (tempCurrentColumn <= 7 && boardState[currentRow][tempCurrentColumn] <= 0) {
                    tempMoves[currentRow][tempCurrentColumn] = 2;
                    if (boardState[currentRow][tempCurrentColumn] < 0) {
                        tempCurrentColumn = -1;
                    }
                    tempCurrentColumn++;
                }
                break;
        }

        return tempMoves;
    }

    function makeMove({boardState, row, column, validMovesValue, updateBoardState}) {
        let tempState = boardState.map((row) => [...row]);
        tempState[row][column] = validMovesValue; 
        tempState[currentRow][currentColumn] = 0;
        updateBoardState(tempState);
    }

    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            const validMovesValue = validMoves[row][column];

            cells.push(<button 
                key={`${row}:${column}`}
                className={( validMovesValue >= 1 )? "valid-move" : "invalid-move"}
                onClick={() => makeMove({boardState, row, column, validMovesValue, updateBoardState})} />)
        }
    }

    return (
        <div className="grid-container">{cells}</div>
    )
}