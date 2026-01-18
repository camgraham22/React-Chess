export default function StartScreen({ maxDepth, setMaxDepth, setShowStartScreen }) {
    return (
        <div className="start-screen">
            <h1>Chess Project</h1>
            <div className="select-difficulty">
                <h1>Select Difficulty</h1>
                <>
                    <button className={maxDepth === 4 ? "difficulty-btn selected" : "difficulty-btn"} onClick={() => setMaxDepth(4)}>Beginner</button>
                    <button className={maxDepth === 6 ? "difficulty-btn selected" : "difficulty-btn"} onClick={() => setMaxDepth(6)}>Intermediate</button>
                </>
            </div>
            <button className="start-button" onClick={() => setShowStartScreen(false)}>Start</button>
        </div>
    )
}