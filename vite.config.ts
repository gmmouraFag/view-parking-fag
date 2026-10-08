import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    plugins: [react()],
    server: {
      host: "0.0.0.0",
      proxy: { "/api": env.JAVA_PROXY_URL || "http://localhost:8080" },
    },
    preview: {
      host: "0.0.0.0",
      proxy: { "/api": env.JAVA_PROXY_URL || "http://localhost:8080" },
    },
  };
});
