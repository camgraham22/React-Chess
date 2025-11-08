import React from "react";
import '../App.css'

export default function ChessBoard() {

    const columns = 8;
    const rows = 8;
    const cells = [];
    let lastCellBlack = false;
    
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            cells.push(<div key={`${rows}-${column}`} className={lastCellBlack ? "white" : "black"}></div>);
            lastCellBlack = !lastCellBlack;
        }
        lastCellBlack = !lastCellBlack;

    }
    return (
        <div className="grid-container">{cells}</div>
    );
}