import React, { useEffect, useMemo, useRef, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import { db } from "./firebase/config";

import SensorCard from "./components/SensorCard";
import SensorChart from "./components/SensorChart";
import StatusPill from "./components/StatusPill";

export default function App() {
  const [distance, setDistance] = useState(null);
  const [level, setLevel] = useState(null);
  const [series, setSeries] = useState([]);
  const [status, setStatus] = useState("connecting...");
  const [error, setError] = useState(null);

  const SENSOR_PATH = "/"; // adjust to your DB path
  const MAX_POINTS = 300; // keep last N points
  const SAMPLE_MS = 10000; // update every 10 seconds
  const lastAppendRef = useRef(0);

  const nowIso = () => new Date().toISOString();

  useEffect(() => {
    try {
      const sensorRef = ref(db, SENSOR_PATH);
      const unsub = onValue(
        sensorRef,
        (snapshot) => {
          const val = snapshot.val();
          if (!val) {
            setStatus("no-data");
            return;
          }

          const dNum = Number(val.distance);
          const lNum = Number(val.level);

          setDistance(Number.isFinite(dNum) ? dNum : null);
          setLevel(Number.isFinite(lNum) ? lNum : null);
          setStatus("live");
          setError(null);

          const now = Date.now();
          if (now - lastAppendRef.current >= SAMPLE_MS) {
            lastAppendRef.current = now;

            setSeries((prev) => {
              const last = prev[prev.length - 1];
              let speed = 0;

              if (last) {
                const dt = (now - new Date(last.t).getTime()) / 1000; // seconds
                if (dt > 0) speed = (lNum - last.level) / dt;
              }

              const point = { t: nowIso(), distance: dNum, level: lNum, speed };
              return [...prev, point].slice(-MAX_POINTS);
            });
          }
        },
        (err) => {
          console.error(err);
          setStatus("error");
          setError(err.message || String(err));
        }
      );

      return () => {
        off(sensorRef);
        if (typeof unsub === "function") unsub();
      };
    } catch (e) {
      console.error(e);
      setStatus("error");
      setError(e.message || String(e));
    }
  }, []); // no dependency needed since SAMPLE_MS is constant

  const yDomains = useMemo(() => {
    const distances = series.map((p) => p.distance).filter(Number.isFinite);
    const levels = series.map((p) => p.level).filter(Number.isFinite);

    const pad = (min, max) => {
      const range = Math.max(1e-6, max - min);
      const extra = range * 0.05;
      return [min - extra, max + extra];
    };

    return {
      distance: distances.length
        ? pad(Math.min(...distances), Math.max(...distances))
        : [0, 1],
      level: levels.length
        ? pad(Math.min(...levels), Math.max(...levels))
        : [0, 1],
    };
  }, [series]);

  const clearSeries = () => setSeries([]);

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        padding: 18,
        background: "#0b1220",
        color: "#e6eef8",
        minHeight: "100vh",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>💧 Realtime Water Sensor</h1>
          <div style={{ fontSize: 13, color: "#9fb0c9" }}>
            Firebase RTDB Path: <code>{SENSOR_PATH}</code>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <StatusPill status={status} />
          <button
            onClick={clearSeries}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              background: "#1b2538",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </div>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
          marginTop: 18,
        }}
      >
        <SensorCard
          label="Distance"
          value={distance}
          unitHint="units: sensor"
        />
        <SensorCard
          label="Water Level"
          value={level}
          unitHint="0 = low, higher = more water"
        />
      </section>

      <section
        style={{
          marginTop: 18,
          padding: 12,
          borderRadius: 12,
          background: "#07101a",
        }}
      >
        <div style={{ marginBottom: 6, color: "#9fb0c9" }}>Live Chart</div>
        <SensorChart data={series} yDomains={yDomains} />
        <div style={{ marginTop: 6, fontSize: 12, color: "#7f97ad" }}>
          Keeping last {MAX_POINTS} points · updating every {SAMPLE_MS / 1000}{" "}
          seconds
        </div>
      </section>

      {error && (
        <div
          style={{
            marginTop: 12,
            padding: 10,
            borderRadius: 8,
            background: "#2d0b0b",
            color: "#ffb4b4",
          }}
        >
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
