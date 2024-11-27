import { useState } from "react"
import { TheGame } from "./TheGame"

export default function App() {
    const currentPageState = useState<JSX.Element | null>(null)
    const [currentPage, _] = currentPageState

    return <main>
        {!currentPage ?
            <Intro state={currentPageState} />
            : currentPage
        }
    </main>
}

export type PageStateType = [JSX.Element | null, React.Dispatch<React.SetStateAction<JSX.Element | null>>]

function Intro({ state }: { state: PageStateType }) {
    const [_, setCurrentPage] = state;
    return <div>
        <h1>PowerPoint Karaoke!</h1>

        <button
            className="less-important-button"
            onClick={() => setCurrentPage(() => <HowToPlay state={state} />)}>
            How to Play
        </button>
        <button
            className="less-important-button"
            onClick={() => setCurrentPage(() => <About state={state} />)}>
            About
        </button>


        <button
            onClick={() => setCurrentPage(() => <TheGame state={state} />)}>
            Play
        </button>
    </div>
}

function HowToPlay({ state }: { state: PageStateType }) {
    const [_, setCurrentPage] = state;

    return <div>
        <h1>How to Play</h1>
        <ul>
            <li>There are a total of 10 slides per turn</li>
            <li>Before starting, set a theme for your presentation, and try to stick to it throughout!</li>
            <li>Try to spend 15-30 seconds per slide</li>
            <li>Good presentations have:</li>
            <ul>
                <li>good flow</li>
                <li>great humour</li>
                <li>poking fun at your friends</li>
                <li>credibility</li>
                <li>get through the entire deck</li>
            </ul>
        </ul>

        <button onClick={() => setCurrentPage(null)}>Go back</button>
    </div>
}

function About({ state }: { state: PageStateType }) {
    const [_, setCurrentPage] = state;

    return <div>
        <h1>About this project</h1>

        <h2>Authors</h2>
        <p>Slides sourced by <a href="https://github.com/huijing/" target="_blank">huijing</a></p>
        <p>This app is created by <a href="https://zakariya.tech/" target="_blank">mzk468</a></p>

        <button onClick={() => setCurrentPage(null)}>Go back</button>
    </div>
}