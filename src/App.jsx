import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [time, setTime] = useState(0);
  const [start, setStart] = useState(false);
  const [spaceDown, setSpaceDown] = useState(false);
  const [solveArray, setSolveArray] = useState([]);

  const solveArraySorted = solveArray.slice();

  const minutes = Math.floor((time / 60000) % 60);
  const seconds = Math.floor((time / 1000) % 60);
  const ms = Math.floor((time / 10) % 100);

  function handleSpaceClick() {
    setStart((prevStart) => !prevStart);
  }

  function handleAddSolve() {
    console.log(minutes, seconds, ms);
    if (minutes > 0 || seconds > 0 || ms > 0) {
      setSolveArray((prevSolveArray) => [
        ...prevSolveArray,
        {
          id: prevSolveArray.length + 1,
          minutes: minutes,
          seconds: seconds,
          ms: ms,
          time: time,
        },
      ]);
      handleResetTimer();
    }
  }

  function handleResetTimer() {
    setTime(0);
  }

  function handleResetHistory() {
    setSolveArray([]);
  }

  useEffect(() => {
    let interval = null;
    if (start) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [start]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === " ") {
        e.preventDefault();
        setStart((prevStart) => !prevStart);
        if (start) {
          handleAddSolve();
        }
        setSpaceDown(false);
      }
    };

    window.addEventListener("keyup", handleKeyPress);
    return () => {
      window.removeEventListener("keyup", handleKeyPress);
    };
  }, [start, time]); // Added dependencies to use latest state

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === " ") {
        e.preventDefault();
        setSpaceDown(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <Timer minutes={minutes} seconds={seconds} ms={ms} />
      <Space onClick={handleSpaceClick} spaceDown={spaceDown} />
      <Fastest fastestTime={solveArraySorted.sort((a, b) => a.time - b.time)} />
      <Average solveArray={solveArray} />
      <History solveArray={solveArray} onResetHistory={handleResetHistory} />
    </>
  );
}

function Timer({ minutes, seconds, ms }) {
  return (
    <div className="mt-20 w-fit rounded-2xl mx-auto p-[3px] bg-gradient-to-b from-white to-white/10">
      <div className="bg-slate-900/80 mx-auto p-8 rounded-[calc(1rem-3px)] w-110 flex items-center justify-center gap-5">
        <div className="font-semibold  text-7xl text-white drop-shadow-[0_5px_5px_rgba(255,255,255,.3)]">
          {minutes > 0 ? (
            <span className="digits">{String(minutes).padStart(2, "0")}:</span>
          ) : (
            ""
          )}
          <span className="digits">{String(seconds).padStart(2, "0")}.</span>
          <span className="digits mili-sec">{String(ms).padStart(2, "0")}</span>
        </div>
      </div>
    </div>
  );
}

function History({ solveArray, onResetHistory }) {
  return (
    <div className="mt-20 w-fit rounded-2xl mx-auto p-[3px] bg-gradient-to-b from-orange-500 to-orange-500/10">
      <div className="bg-slate-900/80 mx-auto p-8 rounded-[calc(1rem-3px)] w-110 flex flex-col items-center justify-center gap-5">
        <p className="underline-offset-3 underline text-center text-3xl font-bold text-orange-500 drop-shadow-[0_5px_5px_rgba(255,105,0,.3)]">
          History
        </p>
        
        <div className=" text-white ">
          {solveArray.map((solve) => (
            <div key={solve.id}>
              <span className="text-orange-500 drop-shadow-[0_5px_5px_rgba(255,105,0,.3)]">Attempt {solve.id}:{" "}</span>
              <span className="drop-shadow-[0_5px_5px_rgba(255,255,255,.3)]">
              {solve.minutes > 0 ? solve.minutes + " m" : ""}{" "}
              {String(solve.seconds).padStart(2, "0")} s{" "}
              {String(solve.ms).padStart(2, "0")} ms
              </span>
            </div>
          ))}
        </div>

        {solveArray.length > 0 ? (
          <div className="w-fit mx-auto px-5 flex">
            <button
              className="font-extrabold py-1.5 px-2 group rounded-lg gap-2 place-content-center flex items-center text-orange-500/80 bg-slate-900/80 border-orange-500/50 border cursor-pointer hover:scale-105 transition-all hover:bg-orange-500/80 hover:text-white hover:shadow-md hover:shadow-orange-500/30"
              onClick={onResetHistory}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                class="size-5 text-orange-500/50 group-hover:text-white/70 transition-all drop-shadow-[0_5px_5px_rgba(255,105,0,.3)]"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
                  clip-rule="evenodd"
                />
              </svg>
              <span className="">Delete</span>
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>

    // <div className="bg-orange-500/10 px-5 py-3 w-45">
    //   <p className="text-center">History</p>
    //   <button onClick={onResetHistory}>Delete History</button>
    //   {solveArray.map((solve) => (
    //     <div key={solve.id}>
    //       Attempt {solve.id}: {solve.minutes > 0 ? solve.minutes + " m" : ""}{" "}
    //       {String(solve.seconds).padStart(2, "0")} s{" "}
    //       {String(solve.ms).padStart(2, "0")} ms
    //     </div>
    //   ))}
    // </div>
  );
}

function Space({ onClick, spaceDown }) {
  return (
    <button onClick={onClick} className={spaceDown ? "text-red-500" : ""}>
      SPACE
    </button>
  );
}

function Fastest({ fastestTime }) {
  return (
    <div className="bg-green-500/10 px-5 py-3 w-45">
      <p>
        Fastest Time:{" "}
        {fastestTime.length > 0 ? (
          <span>
            {fastestTime[0].minutes > 0 ? `${fastestTime[0].minutes} m` : ""}{" "}
            {String(fastestTime[0].seconds).padStart(2, "0")} s{" "}
            {String(fastestTime[0].ms).padStart(2, "0")} ms
          </span>
        ) : (
          ""
        )}
      </p>
    </div>
  );
}

function Average({ solveArray }) {
  const times = solveArray.map((solve) => solve.time);
  const getAverage = times.reduce((p, c) => p + c, 0) / times.length;

  const minutes = Math.floor((getAverage / 60000) % 60);
  const seconds = Math.floor((getAverage / 1000) % 60);
  const ms = Math.floor((getAverage / 10) % 100);

  const total = `${minutes > 0 ? minutes + " m " : ""} ${String(
    seconds
  ).padStart(2, "0")} s ${String(ms).padStart(2, "0")} ms`;
  return (
    <div className="bg-blue-500/10 px-5 py-3 w-45">
      <p>Average Time: {isNaN(getAverage) ? "" : total}</p>
    </div>
  );
}

export default App;
