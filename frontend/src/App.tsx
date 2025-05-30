import React, { useRef, useState } from "react"
import ClickPlayer from "./components/ClickPlayer"
import WaveformVisualizer from "./components/WaveformVisualizer"

const App: React.FC = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [bpm, setBpm] = useState(120)
  const [includeClick, setIncludeClick] = useState(true)
  const [recordedURL, setRecordedURL] = useState<string | null>(null)

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    setStream(stream)

    const recorder = new MediaRecorder(stream)
    const chunks: Blob[] = []

    recorder.ondataavailable = (e) => chunks.push(e.data)
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" })
      const url = URL.createObjectURL(blob)
      setRecordedURL(url)

      const a = document.createElement("a")
      a.href = url
      a.download = "recording.webm"
      a.click()
    }

    recorder.start()
    mediaRecorderRef.current = recorder
    setIsRecording(true)

    let interval: NodeJS.Timeout | null = null
    if (includeClick) {
      interval = setInterval(() => {
        const click = new Audio("/click.wav")
        click.currentTime = 0
        click.play()
      }, 60_000 / bpm)
      setTimeout(() => clearInterval(interval!), 60_000)
    }

    setTimeout(() => stopRecording(), 60_000)
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🎧 Groove Recorder</h1>

      <label>
        <input
          type="checkbox"
          checked={includeClick}
          onChange={(e) => setIncludeClick(e.target.checked)}
        />
        クリック音を含める
      </label>

      <div>
        <label>
          BPM:
          <input
            type="number"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            min={30}
            max={300}
          />
        </label>
      </div>

      <button onClick={startRecording} disabled={isRecording}>
        録音を開始
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        録音を停止
      </button>

      {recordedURL && (
        <>
          <h2>録音プレビュー</h2>
          <audio controls src={recordedURL}></audio>
          <a href={recordedURL} download="recording.webm">ダウンロード</a>
        </>
      )}

      <WaveformVisualizer stream={stream} />
      <ClickPlayer />
    </div>
  )
}

export default App
