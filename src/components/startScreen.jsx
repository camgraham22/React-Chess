export default function StartScreen({ setMaxDepth, setShowStartScreen }) {
    return (
        <div className="start-screen">
            <div>
                <h1>Select Difficulty</h1>
                <button onClick={() => setMaxDepth(2)}>Beginner</button>
                <button onClick={() => setMaxDepth(4)}>Amatuer</button>
                <button onClick={() => setMaxDepth(6)}>Experienced</button>
            </div>
            <button onClick={() => setShowStartScreen(false)}>Start</button>
        </div>
    )
}