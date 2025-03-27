import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [time, setTime] = useState(0);
  const [start, setStart] = useState(false);
  const [spaceDown, setSpaceDown] = useState(false)

  function handleSpaceClick() {
    setStart((start) => !start);
  }

  useEffect(() => {
    let interval = null;

    if (start) {
      interval = setInterval(() => {
        setTime((time) => time + 10);
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
        setStart((start) => !start);
        setSpaceDown(false)

      }
    };

    window.addEventListener("keyup", handleKeyPress);

    return () => {
      window.removeEventListener("keyup", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === " ") {
        e.preventDefault();
        setSpaceDown(true)
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <Timer time={time} />
      <Space onClick={handleSpaceClick} spaceDown={spaceDown} />
    </>
  );
}


function Timer({ time }) {
  return (
    <div className="timer">
      <span className="digits">
        {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
      </span>
      <span className="digits">
        {("0" + Math.floor((time / 1000) % 60)).slice(-2)}.
      </span>
      <span className="digits mili-sec">
        {("0" + ((time / 10) % 100)).slice(-2)}
      </span>
    </div>
  );
}

function Space({ onClick, spaceDown }) {
  return <button onClick={onClick} className={spaceDown ? "text-red-500": ""}>SPACE</button>;
}

export default App;
