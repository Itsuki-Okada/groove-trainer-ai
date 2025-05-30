import React, { useEffect, useRef } from "react"

type Props = {
  stream: MediaStream | null
}

const WaveformVisualizer: React.FC<Props> = ({ stream }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!stream) return
    const ctx = new AudioContext()
    const analyser = ctx.createAnalyser()
    const source = ctx.createMediaStreamSource(stream)
    source.connect(analyser)

    const buffer = new Uint8Array(analyser.fftSize)
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")

    const draw = () => {
      if (!canvas || !context) return
      requestAnimationFrame(draw)
      analyser.getByteTimeDomainData(buffer)

      context.clearRect(0, 0, canvas.width, canvas.height)
      context.beginPath()
      for (let i = 0; i < buffer.length; i++) {
        const x = (i / buffer.length) * canvas.width
        const y = (buffer[i] / 255) * canvas.height
        i === 0 ? context.moveTo(x, y) : context.lineTo(x, y)
      }
      context.strokeStyle = "lime"
      context.stroke()
    }

    draw()
  }, [stream])

  return <canvas ref={canvasRef} width={600} height={100} />
}

export default WaveformVisualizer
