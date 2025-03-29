import { useState, useEffect } from "react";
import "./App.css";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";

function App() {
  const [time, setTime] = useState(0);
  const [start, setStart] = useState(false);
  const [spaceDown, setSpaceDown] = useState(false);
  const [solveArray, setSolveArray] = useState([]);
  const [newSolve, setNewSolve] = useState(false);

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
      setNewSolve(true);

      setTimeout(() => {
        setNewSolve(false);
      }, 80);
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
  }, [start, time]);

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
      <head>
        <title>SOLVEX</title>
        <link rel="icon" type="image/x-icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <div className="px-5">
        <Logo />
        <Timer
          minutes={minutes}
          seconds={seconds}
          ms={ms}
          spaceDown={spaceDown}
        />
        <div className="flex w-fit mt-10 mx-auto gap-6 xl:flex-row flex-col flex-wrap transition-all">
          <LineChart solveArray={solveArray} newSolve={newSolve} />
          <div className="flex flex-col gap-3">
            <Fastest
              fastestTime={solveArraySorted.sort((a, b) => a.time - b.time)}
            />
            <Average solveArray={solveArray} />
          </div>
          <History
            solveArray={solveArray}
            onResetHistory={handleResetHistory}
            newSolve={newSolve}
          />
        </div>
        <Space onClick={handleSpaceClick} spaceDown={spaceDown} />
      </div>
    </>
  );
}

function Logo() {
  return (
    <div className="w-fit mx-auto mt-20">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="size-14 mx-auto drop-shadow-[0_5px_5px_rgba(rgba(251,44,54,.4)]"
      >
        <path d="M10.362 1.093a.75.75 0 0 0-.724 0L2.523 5.018 10 9.143l7.477-4.125-7.115-3.925ZM18 6.443l-7.25 4v8.25l6.862-3.786A.75.75 0 0 0 18 14.25V6.443ZM9.25 18.693v-8.25l-7.25-4v7.807a.75.75 0 0 0 .388.657l6.862 3.786Z" />
      </svg>

      <p className=" mx-auto mt-3 drop-shadow-[0_5px_5px_rgba(0,166,244,.4)] poppins text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-t from-blue-500 to-green-500 w-fit ">
        <span>S</span>
        <span>O</span>
        <span>L</span>
        <span>V</span>
        <span>E</span>
        <span>X</span>
      </p>
      <p className="font-bold text-lg">Built for Solvers, by a Solver.</p>
    </div>
  );
}

function Timer({ minutes, seconds, ms, spaceDown }) {
  return (
    <div className="mt-15 w-fit rounded-2xl mx-auto p-[3px] bg-gradient-to-b from-white to-white/10">
      <div
        className={` mx-auto p-8 rounded-[calc(1rem-3px)] w-110 flex items-center justify-center gap-5 transition-all ${
          spaceDown
            ? "bg-white/50 text-slate-950"
            : "bg-slate-900/80 text-white"
        }`}
      >
        <div
          className={`font-semibold  text-6xl   ${
            spaceDown
              ? "drop-shadow-[0_5px_5px_rgba(0,0,0,.3)]"
              : "drop-shadow-[0_5px_5px_rgba(255,255,255,.3)]"
          }`}
        >
          {minutes > 0 ? (
            <span className="digits">{String(minutes).padStart(2, "0")}:</span>
          ) : (
            ""
          )}
          <span className="digits">{String(seconds).padStart(2, "0")}.</span>
          <span className="digits mili-sec">{String(ms).padStart(2, "0")}</span>
          <span className="ml-2 text-3xl">s</span>
        </div>
      </div>
    </div>
  );
}

function History({ solveArray, onResetHistory, newSolve }) {
  return (
    <div
      className={`row-span-2 h-fit w-fit rounded-2xl mx-auto p-[3px] bg-gradient-to-b from-orange-500 to-orange-500/10 transition-all ${
        newSolve ? "scale-103" : "scale-100"
      }`}
    >
      <div className="bg-slate-900/80 mx-auto p-8 rounded-[calc(1rem-3px)] w-110 flex flex-col items-center justify-center gap-5">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="mb-2 size-10 text-orange-500/50 stroke-2 mx-auto drop-shadow-[0_5px_5px_rgba(255,105,0,.4)]"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
            />
          </svg>

          <p className="tracking-wide poppins underline-offset-3 underline text-center text-2xl font-bold text-orange-500 drop-shadow-[0_5px_5px_rgba(255,105,0,.3)]">
            History
          </p>
        </div>

        <div className=" text-white ">
          {solveArray.map((solve) => (
            <div key={solve.id}>
              <span className="text-orange-500 drop-shadow-[0_5px_5px_rgba(255,105,0,.3)]">
                Attempt {solve.id}:{" "}
              </span>
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
                className="size-5 text-orange-500/50 group-hover:text-white/70 transition-all drop-shadow-[0_5px_5px_rgba(255,105,0,.3)]"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
                  clip-rule="evenodd"
                />
              </svg>
              <span className="poppins text-base">Delete</span>
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

function Space({ onClick, spaceDown }) {
  return (
    <div
      className={`row-span-2 h-fit w-fit rounded-2xl mx-auto p-[3px]  transition-all mt-10  ${
        spaceDown
          ? "bg-gradient-to-b from-yellow-500 to-yellow-500/10  scale-105"
          : " bg-gradient-to-b from-yellow-500 to-yellow-500/10"
      } `}
    >
      <button
        onClick={onClick}
        className={`poppins tracking-wider font-bold text-4xl focus:ring-0  mx-auto p-5 rounded-[calc(1rem-3px)] w-110 flex flex-col items-center justify-center gap-5  ${
          spaceDown
            ? "text-white bg-yellow-500/60 shadow-xl shadow-yellow-500/20 "
            : "text-yellow-500 bg-slate-900/80"
        }`}
      >
        SPACE
      </button>
    </div>
  );
}

function Fastest({ fastestTime }) {
  return (
    <div className="h-fit w-fit rounded-2xl mx-auto p-[3px] bg-gradient-to-b from-green-500 to-green-500/10">
      <div className="bg-slate-900/80 mx-auto py-5 px-5 rounded-[calc(1rem-3px)] w-110 flex items-center justify-center">
        <div className="flex items-center gap-3 w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-7 flex-initial text-green-500/50 stroke-2 mx-auto drop-shadow-[0_5px_5px_rgba(0,201,80,.3)]"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
            />
          </svg>

          <p className="poppins grow text-left text-xl font-bold text-green-500 drop-shadow-[0_5px_5px_rgba(0,201,80,.4)]">
            Fastest Time:
          </p>
          {fastestTime.length > 0 ? (
            <span className=" grow text-xl font-semibold drop-shadow-[0_5px_5px_rgba(255,255,255,.3)]">
              {fastestTime[0].minutes > 0 ? `${fastestTime[0].minutes} m` : ""}{" "}
              {String(fastestTime[0].seconds).padStart(2, "0")} s{" "}
              {String(fastestTime[0].ms).padStart(2, "0")} ms
            </span>
          ) : (
            ""
          )}
        </div>
      </div>
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
    <div className=" h-fit w-fit rounded-2xl mx-auto p-[3px] bg-gradient-to-b from-blue-500 to-blue-500/10">
      <div className="bg-slate-900/80 mx-auto py-5 px-5 rounded-[calc(1rem-3px)] w-110 flex items-center justify-center">
        <div className="flex items-center gap-3 w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-7 flex-initial text-blue-500/50 stroke-2 mx-auto drop-shadow-[0_5px_5px_rgba(43,127,255,.3)]"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>

          <p className="poppins grow text-left text-xl font-bold text-blue-500 drop-shadow-[0_5px_5px_rgba(43,127,255,.4)]">
            Average Time:
          </p>
          <span className=" grow text-white text-xl font-semibold drop-shadow-[0_5px_5px_rgba(255,255,255,.3)]">
            {isNaN(getAverage) ? "" : total}
          </span>
        </div>
      </div>
    </div>
  );
}

function LineChart({ solveArray, newSolve }) {
  const data = {
    labels: solveArray.map((item) => "# " + item.id),
    datasets: [
      {
        label: "Solve Time (Seconds)",
        data: solveArray.map((item) => item.time / 1000),
        backgroundColor: "rgba(251,44,54,.8)",
        borderColor: "rgba(251,44,54,.4)",
        borderWidth: 3,
        tension: 0.4,
        color: "rgb(255,255,255)",
      },
    ],
  };

  console.log(solveArray.map((item) => item.id));

  return (
    <div
      className={`chart-container h-fit w-fit rounded-2xl mx-auto p-[3px] bg-gradient-to-b from-red-500 to-red-500/10 transition-all ${
        newSolve ? "scale-103" : "scale-100"
      }`}
    >
      <div className="bg-slate-900/80 mx-auto py-8 px-10 rounded-[calc(1rem-3px)] w-110 items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-10 text-red-500/50 stroke-2 mx-auto drop-shadow-[0_5px_5px_rgba(251,44,54,.4)] "
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"
          />
        </svg>

        <p className="tracking-wide poppins underline-offset-3 underline text-center text-2xl font-bold text-red-500 drop-shadow-[0_5px_5px_rgba(251,44,54,.4)] mb-3">
          Solving Time Chart
        </p>
        <Line
          data={data}
          options={{
            scales: {
              x: {
                grid: {
                  color: "rgba(251,44,54, 0.1)",
                  borderColor: "white",
                },
                ticks: {
                  color: "rgba(255, 89, 96, .8)",
                },
              },
              y: {
                grid: {
                  color: "rgba(251,44,54, 0.1)",
                  borderColor: "white",
                },
                ticks: {
                  color: "rgba(255, 89, 96, .8)",
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default App;
