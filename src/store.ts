import { create } from "zustand";

export interface Activity {
  id: string;
  label: string;
  value: number;
  timestamp: Date;
}

interface DashboardState {
  activities: Activity[];
  selectedMetric: "views" | "clicks" | "signups";
  addActivity: (label: string, value: number) => void;
  setMetric: (m: "views" | "clicks" | "signups") => void;
}

function randomId() {
  return Math.random().toString(36).slice(2, 9);
}

const seed: Activity[] = [
  { id: randomId(), label: "Homepage",  value: 842,  timestamp: new Date(2025, 3, 10) },
  { id: randomId(), label: "Pricing",   value: 531,  timestamp: new Date(2025, 3, 11) },
  { id: randomId(), label: "Docs",      value: 1204, timestamp: new Date(2025, 3, 12) },
  { id: randomId(), label: "Blog",      value: 376,  timestamp: new Date(2025, 3, 13) },
  { id: randomId(), label: "Changelog", value: 289,  timestamp: new Date(2025, 3, 14) },
  { id: randomId(), label: "Dashboard", value: 710,  timestamp: new Date(2025, 3, 15) },
];

export const useDashboard = create<DashboardState>((set) => ({
  activities: seed,
  selectedMetric: "views",
  addActivity: (label, value) =>
    set((s) => ({
      activities: [
        ...s.activities,
        { id: randomId(), label, value, timestamp: new Date() },
      ],
    })),
  setMetric: (m) => set({ selectedMetric: m }),
}));
