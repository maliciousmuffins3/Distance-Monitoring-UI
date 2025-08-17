// Badge showing connection status (live / connecting / error)

import React from "react";

export default function StatusPill({ status }) {
  let bg, text;
  if (status === "live") {
    bg = "#053e30";
    text = "Live";
  } else if (status === "connecting...") {
    bg = "#3a2d04";
    text = "Connecting...";
  } else {
    bg = "#3a0712";
    text = status;
  }

  return (
    <div
      style={{
        padding: "6px 10px",
        borderRadius: 999,
        background: bg,
        border: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {text}
    </div>
  );
}
