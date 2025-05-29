import React, { useState, useRef } from 'react';
import * as Tone from 'tone';

export default function Recorder() {
  const [bpm, setBpm] = useState(90);
  const [recording, setRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const playClick = async () => {
    const player = new Tone.Player('/click.wav').toDestination();
    Tone.Transport.bpm.value = bpm;
    Tone.Transport.scheduleRepeat((time) => {
      player.start(time);
    }, '4n');
    await Tone.start();
    Tone.Transport.start();
  };

  const startRecording = async () => {
    await playClick();
    setTimeout(() => {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.ondataavailable = (e) => {
          audioChunks.current.push(e.data);
        };
        mediaRecorder.current.onstop = () => {
          const blob = new Blob(audioChunks.current, { type: 'audio/wav' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'recording.wav';
          a.click();
          audioChunks.current = [];
        };
        mediaRecorder.current.start();
        setRecording(true);
      });
    }, 4000); // カウントイン4拍
  };

  const stopRecording = () => {
    Tone.Transport.stop();
    mediaRecorder.current?.stop();
    setRecording(false);
  };

  return (
    <div>
      <label>BPM: </label>
      <input
        type="number"
        value={bpm}
        min="30"
        max="300"
        onChange={(e) => setBpm(Number(e.target.value))}
      />
      <br /><br />
      {!recording ? (
        <button onClick={startRecording}>録音開始（4拍カウントイン）</button>
      ) : (
        <button onClick={stopRecording}>録音停止</button>
      )}
    </div>
  );
}
