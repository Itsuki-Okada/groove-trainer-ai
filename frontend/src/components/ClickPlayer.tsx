// frontend/src/components/ClickPreviewButton.tsx
import React from "react";

const ClickPreviewButton: React.FC = () => {
  const playClick = () => {
    const audio = new Audio("/click.wav");
    audio.currentTime = 0;
    audio.play();
  };

  return (
    <button
      onClick={playClick}
      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
    >
      Click音を確認
    </button>
  );
};

export default ClickPreviewButton;
