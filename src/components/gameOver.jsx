const HUMAN = 1;

export default function GameOver({winner, resetBoard}) {

    const GAMEOVER_TEXT = winner === HUMAN ? "You win!" : "You lose."
    return (
        <div className="game-over">
            <div>
                <h1>{GAMEOVER_TEXT}</h1>
                <button className="play-again-btn" onClick={() => resetBoard()}>Play Again</button>
            </div>
        </div>
    )
}