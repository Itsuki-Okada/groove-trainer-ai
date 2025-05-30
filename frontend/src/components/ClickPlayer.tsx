import React from "react"

const ClickPlayer: React.FC = () => {
  const play = () => {
    const click = new Audio("/click.wav")
    click.currentTime = 0
    click.play()
  }

  return <button onClick={play}>単発クリック音</button>
}

export default ClickPlayer
