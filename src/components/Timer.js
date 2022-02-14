import React, { useState, useEffect, useRef } from "react";

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function Timer({
  saved,
  currentState,
  screenTime,
  onStart,
  onStop,
  onPause,
  onResume,
  onDelete,
}) {
  const [secondsRemaining, setSecondsRemaining] = useState(screenTime);

  const secondsToDisplay = secondsRemaining % 60;
  const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60;
  const minutesToDisplay = minutesRemaining % 60;
  const hoursToDisplay = (minutesRemaining - minutesToDisplay) / 60;

  React.useEffect(() => {
    handleStop(screenTime);
  }, [screenTime]);

  const twoDigits = num => String(num).padStart(2, "0");

  const handleStart = () => {
    onStart();
  };
  const handlePause = () => {
    onPause();
  };
  const handleResume = () => {
    onResume();
  };
  const handleStop = () => {
    onStop();
    setSecondsRemaining(screenTime);
  };
  const handleDelete = () => {
    onDelete();
  };

  useInterval(
    () => {
      if (secondsRemaining > 0) {
        setSecondsRemaining(secondsRemaining - 1);
      } else {
        handleStop();
      }
    },
    currentState === "recording" ? 1000 : null
    // passing null stops the interval
  );
  return (
    <div>
      <p>
        Remaining time to record: {twoDigits(hoursToDisplay)}:
        {twoDigits(minutesToDisplay)}:{twoDigits(secondsToDisplay)}
      </p>
      <p>Status: {currentState}</p>

      <div>
        {currentState === "inactive" ? (
          <button onClick={handleStart} type='button'>
            Record
          </button>
        ) : (
          <button onClick={handlePause} type='button'>
            Pause
          </button>
        )}
        {currentState === "paused" && (
          <button onClick={handleResume}>Resume</button>
        )}
        {currentState === "recording" && (
          <button onClick={handleStop} type='button'>
            Stop
          </button>
        )}
        {saved && (
          <button onClick={handleDelete} type='button'>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default Timer;
