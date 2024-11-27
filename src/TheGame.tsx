export function TheGame() {
    return <div className="the-game">
        <StartScreen />
    </div>
}

function StartScreen() {
    return <div>
        <h1>Pick your theme, then press Start!</h1>
        <button>Start</button>
    </div>
}

function EndScreen() {
    return <div>
        <h1>Thanks for listening!</h1>
        <button>Restart</button>
    </div>
}