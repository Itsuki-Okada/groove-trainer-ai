// frontend/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: ".", // 明示的に現在のディレクトリ
  plugins: [react()],
});
