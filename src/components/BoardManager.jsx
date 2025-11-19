import { useState } from "react";

export default function BoardManager({ boardState, updateBoardState }) {

    const [row, setRow] = useState(0);
    const [column, setColumn] = useState(0);
    const [value, setValue] = useState();


    function updateCell(row, column, value) {
        console.log("Old State: " + boardState)
        let newBoardState = boardState.slice();
        newBoardState[row] = boardState[row].slice();
        newBoardState[row][column] = value;
        updateBoardState(newBoardState);
        console.log("New State: " + newBoardState);
    }

    return (
        <div>
            <input
             type="number"
             onChange={(e) => setRow(e.target.value)}
             placeholder="Row"
             />
            <input
             type="number"
             onChange={(e) => setColumn(e.target.value)}
             placeholder="Column"
             />
            <input
            type="number"
            onChange={(e) => setValue(e.target.value)}
            placeholder="Value"
            />
            <button onClick={() => updateCell(row, column, value)}>Update</button>
        </div>
    )
}