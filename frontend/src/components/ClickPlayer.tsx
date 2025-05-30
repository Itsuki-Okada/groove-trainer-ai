import React from "react";

const ClickPlayer: React.FC = () => {
  const handleClick = () => {
    const click = new Audio("/click.wav");
    click.play();
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      単発クリック音再生
    </button>
  );
};

export default ClickPlayer;
