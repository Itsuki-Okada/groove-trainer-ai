// frontend/src/components/WaveformVisualizer.tsx
import React, { useEffect, useRef } from "react";

type Props = {
  stream: MediaStream | null;
};

const WaveformVisualizer: React.FC<Props> = ({ stream }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!stream) return;
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 2048;

    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    const canvasCtx = canvas?.getContext("2d");

    const draw = () => {
      if (!canvas || !canvasCtx) return;
      requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);
      canvasCtx.fillStyle = "black";
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "lime";
      canvasCtx.beginPath();
      const sliceWidth = canvas.width / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;
        i === 0 ? canvasCtx.moveTo(x, y) : canvasCtx.lineTo(x, y);
        x += sliceWidth;
      }
      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };

    draw();
  }, [stream]);

  return <canvas ref={canvasRef} width={600} height={100} />;
};

export default WaveformVisualizer;
