import type { Activity } from "../store";

interface BarChartProps {
  data: Activity[];
  color: string;
}

export function BarChart({ data, color }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div
      style={{
        background: "#1c1c26",
        borderRadius: 14,
        padding: "20px 22px",
      }}
    >
      <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>
        Activity
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120 }}>
        {data.map((d) => {
          const pct = (d.value / max) * 100;
          return (
            <div key={d.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 10, color: "#888" }}>{d.value}</span>
              <div
                style={{
                  width: "100%",
                  height: `${pct}%`,
                  background: color,
                  borderRadius: 6,
                  minHeight: 4,
                  transition: "height 0.3s ease",
                }}
              />
              <span style={{ fontSize: 9, color: "#555", whiteSpace: "nowrap" }}>{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
