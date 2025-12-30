import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Analytics } from "@vercel/analytics/react";

function Root() {
  return (
    <React.StrictMode>
      <App />
      <Analytics />
    </React.StrictMode>
  );
}

createRoot(document.getElementById("root")).render(<Root />);
