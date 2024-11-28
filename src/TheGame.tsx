import { useEffect, useState } from "react";
import { PageStateType } from "./App"

// Modify this if adding slides
const TOTAL_SLIDES = 400

export function TheGame({ state }: { state: PageStateType }) {
    return <div className="the-game">
        <RandomNumberGenerator state={state} />
    </div>
}

function RandomNumberGenerator({ state }: { state: PageStateType }) {
    const [_, setCurrentPage] = state
    const [selectedSlide, setSelectedSlide] = useState<number | null>(null)

    return <div>
        <h1>Random Number Generator</h1>
        <p>Spin to randomise your presentation!</p>
        <h6>{selectedSlide ? parseInt(selectedSlide + "").toString().padStart(2, "0") : "00"}</h6>
        <button
            className="less-important-button"
            onClick={() => {
                setSelectedSlide(Math.random() * 170)
            }}>
            {!selectedSlide ?
                "Generate a number"
                :
                "Generate a new number"
            }
        </button>
        {selectedSlide !== null &&
            <button
                onClick={() => {
                    setCurrentPage(<StartScreen state={state} rngNum={selectedSlide} />)
                }}>
                Choose this number
            </button>
        }
    </div>
}

function StartScreen({ state, rngNum }: { state: PageStateType; rngNum: number }) {
    const [_, setCurrentPage] = state;
    return <div>
        <h1>Pick your theme, then press Start!</h1>
        <p>&#128712; Use the arrow keys or click on the screen to move through the slides</p>
        <p>&#128712; To go back, press Esc 3 times</p>

        <button
            onClick={(event) => {
                event.stopPropagation()
                setCurrentPage(
                    <Slides pageState={state} slidesArr={randomSlidesPicker(rngNum)} />
                )
            }}>
            Start
        </button>
    </div>
}

function Slides({ pageState, slidesArr }: { pageState: PageStateType; slidesArr: string[] }) {
    const setCurrentPage = pageState[1];
    const [currentSlideIdx, setCurrentSlideIdx] = useState<number>(0)
    const setNumEscPresses = useState<number>(0)[1]

    const incrementSlideIdx = () =>
        setCurrentSlideIdx(currentSlideIdx => {
            if (currentSlideIdx === 9) {
                // Save to local storage to reduce repetition
                saveToStorage(slidesArr)
                // Go back to homepage
                setCurrentPage(() => <EndScreen state={pageState} />)

                return 0 // Reset the slides
            }
            return currentSlideIdx + 1
        })

    // Arrow key press handling effect
    useEffect(() => {
        const handleKeyPress = (ev: KeyboardEvent) => {
            if (ev.key === "ArrowRight") {
                incrementSlideIdx()
            }
            if (ev.key === "ArrowLeft") setCurrentSlideIdx(currentSlideIdx =>
                (currentSlideIdx > 0) ? currentSlideIdx - 1 : currentSlideIdx
            )
        };

        document.body.addEventListener("keydown", handleKeyPress);
        return () => document.body.removeEventListener("keydown", handleKeyPress);
    }, []);

    // Click handling effect
    useEffect(() => {
        const handleClick = () => {
            incrementSlideIdx()
        }

        document.body.addEventListener("click", handleClick)
        return () => document.body.removeEventListener("click", handleClick)
    }, [])

    // Arrow key presses handling effect
    useEffect(() => {
        const handleEscKeyPress = (ev: KeyboardEvent) => {
            if (ev.key === "Escape") {
                setNumEscPresses(numEscPresses => {
                    if (numEscPresses < 2) {
                        return numEscPresses + 1
                    }
                    setCurrentPage(() => null)
                    return 0
                })
            }
        };

        document.body.addEventListener("keydown", handleEscKeyPress);
        return () => document.body.removeEventListener("keydown", handleEscKeyPress);
    }, []);

    return <div>
        <img src={`/slides/${slidesArr[currentSlideIdx]}`} />
    </div>
}

function EndScreen({ state }: { state: PageStateType }) {
    const [_, setCurrentPage] = state;
    return <div>
        <h1>Thanks for listening!</h1>
        <button
            onClick={() => setCurrentPage(null)}>
            Restart
        </button>
    </div>
}

const randomSlidesPicker = (rngNum: number) => {
    const stringifiedIdList = localStorage.getItem("id_list");
    const idList: string[] = stringifiedIdList === null ? [] : JSON.parse(stringifiedIdList);

    const getAvailableRngFileName = (rngNum: number): string => {
        while (idList.includes(`${rngNum}.jpg`)) {
            rngNum++;
        }
        return `${rngNum}.jpg`;
    };

    let slides = [getAvailableRngFileName(Math.floor((rngNum + (TOTAL_SLIDES / 2)) * Math.random()) % TOTAL_SLIDES)];
    for (let i = 1; i < 10; i++) {
        slides.push(
            getAvailableRngFileName(Math.floor((i * rngNum + (rngNum / 2969)) % TOTAL_SLIDES))
        );
    }

    return slides;
};

const saveToStorage = (slidesArr: string[]) => {
    const stringifiedIdList = localStorage.getItem("id_list")
    if (!stringifiedIdList) localStorage.setItem("id_list", JSON.stringify(slidesArr))
    else {
        let idList = JSON.parse(stringifiedIdList).concat(slidesArr)

        // Once the list of used up slides reaches 50% of the total slides, we start
        // removing the first slides we have used to allow for a more varied set of
        // slides to be picked from!
        if (idList.length > TOTAL_SLIDES / 2)
            idList = idList.slice(idList.length - TOTAL_SLIDES)

        localStorage.setItem("id_list", JSON.stringify(idList))
    }
}
