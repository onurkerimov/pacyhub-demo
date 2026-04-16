import { Eye, MousePointerClick, UserPlus } from "lucide-react";
import { useDashboard } from "./store";
import { StatCard } from "./components/StatCard";
import { BarChart } from "./components/BarChart";
import { TimeHeader } from "./components/TimeHeader";
import { MetricPicker } from "./components/MetricPicker";

const metricConfig = {
  views:   { icon: Eye,               color: "#58a6ff", label: "Total Views" },
  clicks:  { icon: MousePointerClick,  color: "#f0883e", label: "Total Clicks" },
  signups: { icon: UserPlus,           color: "#3fb950", label: "Sign-ups" },
} as const;

export default function App() {
  const activities = useDashboard((s) => s.activities);
  const metric = useDashboard((s) => s.selectedMetric);

  const total = activities.reduce((sum, a) => sum + a.value, 0);
  const avg = activities.length ? Math.round(total / activities.length) : 0;
  const peak = activities.length ? Math.max(...activities.map((a) => a.value)) : 0;
  const cfg = metricConfig[metric];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111118",
        color: "#e8e8f0",
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        padding: "36px 24px 64px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Dashboard</h1>
            <p style={{ color: "#555", fontSize: 13, margin: "4px 0 0" }}>Multifile PacyHub demo</p>
          </div>
          <TimeHeader />
        </div>

        {/* Metric picker */}
        <div style={{ marginBottom: 20 }}>
          <MetricPicker />
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
          <StatCard icon={cfg.icon} title={cfg.label} value={total.toLocaleString()} subtitle="all time" color={cfg.color} />
          <StatCard icon={cfg.icon} title="Average" value={avg.toLocaleString()} subtitle="per page" color={cfg.color} />
          <StatCard icon={cfg.icon} title="Peak" value={peak.toLocaleString()} subtitle="single page" color={cfg.color} />
        </div>

        {/* Bar chart */}
        <BarChart data={activities} color={cfg.color} />

        {/* Footer */}
        <p style={{ color: "#333", fontSize: 12, marginTop: 32, textAlign: "center" }}>
          Powered by <strong>zustand</strong> · <strong>lucide-react</strong> · <strong>date-fns</strong>
        </p>
      </div>
    </div>
  );
}
