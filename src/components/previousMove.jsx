export default function PreviousMove({previousMove}) {
    const moveMadeRow = previousMove[0][0];
    const moveMadeColumn = previousMove[0][1];
    const oldPieceRow = previousMove[1][0];
    const oldPieceColumn = previousMove[1][1];

    const rows = 8;
    const columns = 8;
    let cells = [];

    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            if (( row === moveMadeRow && column === moveMadeColumn ) ||
            ( row === oldPieceRow && column === oldPieceColumn )) {
                cells.push(<div key={`${row}:${column}`} className="move-made" />)
            }
            else {
                cells.push(<div key={`${row}:${column}`} className="no-move-made" />)
            }
        }
    }
    return (
        <>
            <div className="grid-container">{cells}</div>
        </>
    ) 
}