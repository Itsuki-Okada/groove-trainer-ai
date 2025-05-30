// src/App.tsx
import React, { useRef, useState } from "react";
import ClickPlayer from "./components/ClickPlayer";
import WaveformVisualizer from "./components/WaveformVisualizer";

const App: React.FC = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [includeClick, setIncludeClick] = useState(true);
  const [bpm, setBpm] = useState(120);
  const [recordedURL, setRecordedURL] = useState<string | null>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setMediaStream(stream);

    const recorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      setRecordedURL(url);

      const a = document.createElement("a");
      a.href = url;
      a.download = "recording.webm";
      a.click();
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);

    let interval: NodeJS.Timeout | null = null;
    if (includeClick) {
      interval = setInterval(() => {
        const click = new Audio("/click.wav");
        click.currentTime = 0;
        click.play();
      }, 60_000 / bpm);

      setTimeout(() => clearInterval(interval), 60_000);
    }

    setTimeout(() => stopRecording(), 60_000);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Groove Recorder</h1>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={includeClick}
          onChange={(e) => setIncludeClick(e.target.checked)}
        />
        <span>クリック音を含める</span>
      </label>

      <label className="flex items-center space-x-2">
        <span>BPM:</span>
        <input
          type="number"
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          min={30}
          max={300}
          className="border px-2 py-1 w-20"
        />
      </label>

      <div className="space-x-2">
        <button
          onClick={startRecording}
          disabled={isRecording}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          録音を開始
        </button>
        <button
          onClick={stopRecording}
          disabled={!isRecording}
          className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
        >
          録音を停止
        </button>
      </div>

      {recordedURL && (
        <div>
          <h2 className="font-semibold">録音を再生:</h2>
          <audio controls src={recordedURL}></audio>
          <a
            href={recordedURL}
            download="recording.webm"
            className="block mt-2 text-blue-600 underline"
          >
            ダウンロード
          </a>
        </div>
      )}

      <WaveformVisualizer stream={mediaStream} />
      <ClickPlayer />
    </div>
  );
};

export default App;
