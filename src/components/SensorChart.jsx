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

export default function SensorChart({ data, yDomains }) {
  return (
    <div style={{ height: "400px", width: "100%" }}>
      <ResponsiveContainer>
        <LineChart data={data}>
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
            domain={yDomains.distance}
            allowDataOverflow
          />

          {/* Level axis (right) */}
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#10b981"
            domain={yDomains.level}
            allowDataOverflow
          />

          {/* Speed axis (hidden, bottom) */}
          <YAxis yAxisId="speed" hide={true} domain={["auto", "auto"]} />

          <Tooltip
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
