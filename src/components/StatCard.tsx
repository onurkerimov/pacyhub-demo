import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
}

export function StatCard({ icon: Icon, title, value, subtitle, color }: StatCardProps) {
  return (
    <div
      style={{
        background: "#1c1c26",
        borderRadius: 14,
        padding: "20px 22px",
        display: "flex",
        gap: 16,
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: `${color}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={20} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {title}
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, color: "#e8e8f0", marginTop: 2 }}>
          {value}
        </div>
        <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{subtitle}</div>
      </div>
    </div>
  );
}
