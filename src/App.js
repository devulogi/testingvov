import React from "react";
import Select from "react-select";

import Timer from "./components/Timer";
import Button from "./components/Button";

const initialState = {
  mediaRecorderInstance: null,
  currentState: "inactive",
  audioClip: null,
  saved: false,
};

function App() {
  const [screenTime, setScreenTime] = React.useState(10);
  const [state, setState] = React.useState(initialState);
  let chunks = [];

  React.useEffect(() => {
    if (navigator.mediaDevices.getUserMedia) {
      console.log("getUserMedia supported.");
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(onSuccess)
        .catch(onError);
    } else {
      console.info("media devices not suppported on your browser.");
    }
  }, []);

  React.useEffect(() => {
    console.info("Here is the current state ===> ", state);
  }, [state]);

  const onSuccess = function (stream) {
    let mediarecorder = new MediaRecorder(stream);

    // this fires on-record
    mediarecorder.onstart = function () {
      setState(prevState => ({ ...prevState, currentState: "recording" }));
    };

    // this fires on-pause
    mediarecorder.onpause = function () {
      setState(prevState => ({ ...prevState, currentState: "paused" }));
    };

    // this fires on-resume
    mediarecorder.onresume = function () {
      setState(prevState => ({ ...prevState, currentState: "recording" }));
    };

    // this fires on-stop
    mediarecorder.onstop = function () {
      // create a blob
      const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
      chunks = [];
      // create a blob url
      const recording = window.URL.createObjectURL(blob);
      setState(prevState => ({
        ...prevState,
        audioClip: recording,
        currentState: "inactive",
        saved: true,
      }));
    };

    // this fires when data is available
    mediarecorder.ondataavailable = function (e) {
      chunks.push(e.data);
    };

    setState(prevState => ({
      ...prevState,
      mediaRecorderInstance: mediarecorder,
    }));
  };

  const onError = function (err) {
    console.warn("The following error occured: " + err);
  };

  const doStart = () => {
    if (state.currentState === "inactive") {
      return state.mediaRecorderInstance.start();
    }
    return;
  };
  const doPause = () => {
    if (state.currentState === "recording") {
      return state.mediaRecorderInstance.pause();
    }
    return;
  };
  const doResume = () => {
    if (state.currentState === "paused") {
      return state.mediaRecorderInstance.resume();
    }
    return;
  };
  const doStop = () => {
    if (state.currentState === "recording") {
      return state.mediaRecorderInstance.stop();
    }
    return;
  };
  const doDelete = () => {
    if (state.saved) {
      setState(prevState => ({
        ...prevState,
        currentState: "inactive",
        audioClip: null,
        saved: false,
      }));
    }
    return;
  };

  const options = [
    { value: 10, label: "10" },
    { value: 15, label: "15" },
    { value: 20, label: "20" },
  ];

  return (
    <div>
      <p>Screen time</p>
      <Select options={options} onChange={e => setScreenTime(e.value)} />

      <Timer
        saved={state.saved}
        currentState={state.currentState}
        screenTime={screenTime}
        onStart={doStart}
        onStop={doStop}
        onPause={doPause}
        onResume={doResume}
        onDelete={doDelete}
      />
      <p>current state: {state.currentState}</p>
      <div>
        {state.saved && <Button text='delete' onClick={doDelete} />}
        {state.currentState === "inactive" ? (
          <Button text='record' onClick={doStart} />
        ) : (
          <Button text='pause' onClick={doPause} />
        )}
        {state.currentState === "paused" && (
          <Button text='resume' onClick={doResume} />
        )}
        {state.currentState === "recording" && (
          <Button text='stop' onClick={doStop} />
        )}
      </div>
      {state.audioClip ? (
        <>
          <p>AudioClip</p>
          <audio controls src={state.audioClip}></audio>
        </>
      ) : null}
    </div>
  );
}

export default App;
