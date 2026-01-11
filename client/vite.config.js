import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  const BACKEND_URL =
    mode === "development"
      ? "http://localhost:3000" // Local backend for development
      : "https://counselling-app-ki9p.onrender.com"; // Deployed backend for production

  const STRIPE_PUBLIC_KEY =
    "pk_test_51QgSIrJck1ciEtaqRPwuppgQeiO8lSuMgIvrLXpKuzCXr1MlMbP1Pjs1EH9ufxHBW6KsoAz1F3U1RcrEEN0i7pQ000WJXd8tnT";

  return {
    plugins: [react()],
    define: {
      "process.env.BACKEND_URL": JSON.stringify(BACKEND_URL),
      "process.env.STRIPE_PUBLIC_KEY": JSON.stringify(STRIPE_PUBLIC_KEY),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
