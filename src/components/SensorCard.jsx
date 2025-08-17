// Small card that shows a live sensor value

import React from "react";

export default function SensorCard({ label, value, unitHint }) {
  const fmt = (n) => (Number.isFinite(n) ? n.toFixed(3) : "—");
  return (
    <div style={{ padding: 14, borderRadius: 12, background: "#07101a" }}>
      <div style={{ color: "#9fb0c9", fontSize: 13 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{fmt(value)}</div>
      <div style={{ color: "#7f97ad", fontSize: 12 }}>{unitHint}</div>
    </div>
  );
}
