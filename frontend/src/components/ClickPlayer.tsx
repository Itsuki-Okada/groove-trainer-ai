// frontend/src/components/ClickPlayer.tsx
import React from "react";

const ClickPlayer: React.FC = () => {
  const playClick = () => {
    const audio = new Audio("/click.wav");
    audio.currentTime = 0; // 連打時の巻き戻し
    audio.play();
  };

  return (
    <button
      onClick={playClick}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Play Click
    </button>
  );
};

export default ClickPlayer;
