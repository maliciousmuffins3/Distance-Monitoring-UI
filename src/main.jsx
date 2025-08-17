// main.jsx — entry point for Vite React

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Attach React to #root (defined in index.html)
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
