import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // your global styles
import { AnimatePresence } from "framer-motion";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AnimatePresence mode="wait">
      <App />
    </AnimatePresence>
    
  </React.StrictMode>
);
