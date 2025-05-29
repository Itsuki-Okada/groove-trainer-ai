// frontend/src/App.tsx
import React from "react";
import ClickPlayer from "./components/ClickPlayer";

function App() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Click Test</h1>
      <ClickPlayer />
    </div>
  );
}

export default App;
