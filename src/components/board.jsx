import '../App.css';

export default function ChessBoard({boardState}) {

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
    const columns = 8;
    const rows = 8;
    const cells = [];
    let lastCellBlack = false;
    
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            const pieceValue = boardState[row][column];
            const pieceImage = CHESS_PIECE_IMAGES[pieceValue]?.img;
            cells.push(<div key={`${row}:${column}`} className={lastCellBlack ? "white" : "black"}> {!(pieceImage === undefined) && <img src={pieceImage} className="chess-image"></img>}</div>);
            lastCellBlack = !lastCellBlack;
        }
        lastCellBlack = !lastCellBlack;

    }
    return (
        <div className="grid-container">{cells}</div>
    );
}   