import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [time, setTime] = useState(0);
  const [start, setStart] = useState(false);
  const [spaceDown, setSpaceDown] = useState(false);
  const [solveArray, setSolveArray] = useState([]);

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
        { id: Date.now(), time: `${minutes}:${seconds}.${ms}` },
      ]);
      handleResetTimer()
    }
  }

  function handleResetTimer(){
    setTime(0)
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
      <History solveArray={solveArray} />
    </>
  );
}

function Timer({ minutes, seconds, ms }) {
  return (
    <div className="timer">
      <span className="digits">{String(minutes).padStart(2, "0")}:</span>
      <span className="digits">{String(seconds).padStart(2, "0")}.</span>
      <span className="digits mili-sec">{String(ms).padStart(2, "0")}</span>
    </div>
  );
}

function History({ solveArray }) {
  return (
    <div className="bg-orange-500/10 px-5 py-3 w-45">
      <p className="text-center">History</p>
      {solveArray.map((solve) => (
        <div key={solve.id}>{solve.time}</div>
      ))}
    </div>
  );
}

function Space({ onClick, spaceDown }) {
  return (
    <button onClick={onClick} className={spaceDown ? "text-red-500" : ""}>
      SPACE
    </button>
  );
}

export default App;
