import { useDashboard } from "../store";

const metrics = ["views", "clicks", "signups"] as const;

const labels: Record<string, string> = {
  views: "Views",
  clicks: "Clicks",
  signups: "Sign-ups",
};

export function MetricPicker() {
  const selected = useDashboard((s) => s.selectedMetric);
  const setMetric = useDashboard((s) => s.setMetric);

  return (
    <div style={{ display: "flex", gap: 6 }}>
      {metrics.map((m) => (
        <button
          key={m}
          onClick={() => setMetric(m)}
          style={{
            padding: "6px 14px",
            borderRadius: 999,
            border: "none",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            background: selected === m ? "#58a6ff" : "#1c1c26",
            color: selected === m ? "#fff" : "#888",
            transition: "background 0.15s, color 0.15s",
          }}
        >
          {labels[m]}
        </button>
      ))}
    </div>
  );
}
