// frontend/src/App.tsx
import React, { useRef, useState } from "react";
import ClickPlayer from "./components/ClickPlayer";

const App: React.FC = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [includeClick, setIncludeClick] = useState(true);
  const [recordedURL, setRecordedURL] = useState<string | null>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      setRecordedURL(url);
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);

    // ⏱️ 自動停止タイマー（例：30秒）
    setTimeout(() => stopRecording(), 60_000);

    // 🔊 クリック再生（オプション）
    if (includeClick) {
      const interval = setInterval(() => {
        const audio = new Audio("/click.wav");
        audio.currentTime = 0;
        audio.play();
      }, 60000 / 120); // BPM 120 → 0.5秒

      setTimeout(() => clearInterval(interval), 30_000);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Groove Recorder</h1>

      {/* 🔘 ④クリック音を録音に含めるか */}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={includeClick}
          onChange={(e) => setIncludeClick(e.target.checked)}
        />
        <span>クリック音を含める</span>
      </label>

      {/* ▶️ 録音ボタン */}
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

      {/* 🔊 再生プレビュー */}
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

      {/* クリックプレビュー */}
      <ClickPlayer />
    </div>
  );
};

export default App;
