import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Clock } from "lucide-react";

export function TimeHeader() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#555", fontSize: 13 }}>
      <Clock size={14} />
      <span>{format(now, "EEE, MMM d · h:mm:ss a")}</span>
    </div>
  );
}
