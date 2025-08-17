import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Interval in milliseconds
const UPDATE_INTERVAL = 2000; // 2 seconds

export default function SensorChart({ data, yDomains }) {
  const [displayData, setDisplayData] = useState([]);

  // Update chart data at fixed interval
  useEffect(() => {
    const interval = setInterval(() => {
      const sanitizedData = data.map((d) => ({
        ...d,
        distance: Number(d.distance.toFixed(2)),
        level: Number(d.level.toFixed(2)),
        speed: Number(d.speed.toFixed(2)),
      }));

      // Only update state if data actually changed
      setDisplayData((prevData) => {
        const isEqual =
          prevData.length === sanitizedData.length &&
          prevData.every(
            (p, i) =>
              p.distance === sanitizedData[i].distance &&
              p.level === sanitizedData[i].level &&
              p.speed === sanitizedData[i].speed &&
              p.t === sanitizedData[i].t
          );

        return isEqual ? prevData : sanitizedData;
      });
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [data]);

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <ResponsiveContainer>
        <LineChart data={displayData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            dataKey="t"
            stroke="#ccc"
            tickFormatter={(v) => v.split("T")[1].split(".")[0]}
          />

          {/* Distance axis (left) */}
          <YAxis
            yAxisId="left"
            stroke="#3b82f6"
            domain={[0, 7.208]} // fixed domain for distance
            tickFormatter={(v) => v.toFixed(2)}
          />

          {/* Level axis (right) */}
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#10b981"
            domain={[0, yDomains.level[1]]}
            tickFormatter={(v) => v.toFixed(2)}
          />

          {/* Speed axis (hidden) */}
          <YAxis yAxisId="speed" hide domain={["auto", "auto"]} />

          <Tooltip
            formatter={(value) => value.toFixed(2)}
            contentStyle={{
              backgroundColor: "#1e293b",
              borderRadius: "8px",
              border: "none",
              color: "white",
            }}
          />
          <Legend />

          {/* Distance */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="distance"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            name="Distance"
          />

          {/* Level */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="level"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            name="Water Level"
          />

          {/* Speed */}
          <Line
            yAxisId="speed"
            type="monotone"
            dataKey="speed"
            stroke="#facc15"
            strokeWidth={2}
            dot={false}
            name="Speed (Δlevel/sec)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
