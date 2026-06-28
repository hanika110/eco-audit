import React, { useState } from "react";

interface AuditRow {
  id: number;
  category: string;
  weight: string;
  lat: string;
  lng: string;
  submittedBy: string;
  date: string;
}

const ROWS: AuditRow[] = [
  { id: 1, category: "E-Waste",  weight: "2.4 kg", lat: "28.6139° N", lng: "77.2090° E", submittedBy: "Jyotsna",   date: "Jun 27, 2026 · 3:41 PM" },
  { id: 2, category: "Plastic",  weight: "1.2 kg", lat: "28.6140° N", lng: "77.2091° E", submittedBy: "Hanika",    date: "Jun 27, 2026 · 2:15 PM" },
  { id: 3, category: "Organic",  weight: "4.5 kg", lat: "28.6135° N", lng: "77.2100° E", submittedBy: "Rohan",     date: "Jun 27, 2026 · 1:30 PM" },
  { id: 4, category: "Glass",    weight: "0.8 kg", lat: "28.6120° N", lng: "77.2085° E", submittedBy: "Priya",     date: "Jun 26, 2026 · 11:20 AM" },
  { id: 5, category: "Metal",    weight: "3.1 kg", lat: "28.6155° N", lng: "77.2070° E", submittedBy: "Arjun",     date: "Jun 26, 2026 · 4:45 PM" },
  { id: 6, category: "Paper",    weight: "1.5 kg", lat: "28.6160° N", lng: "77.2065° E", submittedBy: "Sneha",     date: "Jun 25, 2026 · 2:10 PM" },
];

const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  "E-Waste": { bg: "rgba(249,115,22,0.12)", text: "#f97316" },
  "Plastic":  { bg: "rgba(59,130,246,0.12)", text: "#3b82f6" },
  "Organic":  { bg: "rgba(34,197,94,0.12)",  text: "#16a34a" },
  "Glass":    { bg: "rgba(139,92,246,0.12)", text: "#8b5cf6" },
  "Metal":    { bg: "rgba(107,114,128,0.12)", text: "#6b7280" },
  "Paper":    { bg: "rgba(245,158,11,0.12)", text: "#d97706" },
};

const Badge: React.FC<{ category: string; hovered: boolean }> = ({ category, hovered }) => {
  const c = BADGE_COLORS[category] ?? { bg: "rgba(107,114,128,0.12)", text: "#6b7280" };
  return (
    <span
      className="px-2.5 py-1 rounded-full text-[12px] font-medium whitespace-nowrap inline-block"
      style={{
        backgroundColor: c.bg,
        color: c.text,
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
        boxShadow: hovered ? `0 3px 8px ${c.bg.replace("0.12", "0.35")}` : "none",
        transition: "transform 150ms ease, box-shadow 150ms ease",
      }}
    >
      {category}
    </span>
  );
};

export const WasteAuditTable: React.FC = () => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <div className="w-full overflow-hidden rounded-xl" style={{ border: "1px solid #e5e7eb" }}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ background: "#2d6a4f" }}>
              {["#", "Category", "Weight", "Latitude", "Longitude", "Submitted By", "Date & Time"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.6px]"
                  style={{ color: "#d1fae5" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, index) => {
              const isHovered = hoveredRow === row.id;
              const stripeBase = index % 2 === 0 ? "#ffffff" : "#f0fdf4";
              return (
                <tr
                  key={row.id}
                  onMouseEnter={() => setHoveredRow(row.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                    background: isHovered ? "#dcfce7" : stripeBase,
                    transition: "background 150ms ease",
                    cursor: "default",
                  }}
                >
                  {/* # */}
                  <td
                    className="px-4 py-3 text-[14px] font-medium tabular-nums"
                    style={{
                      color: isHovered ? "#2d6a4f" : "#d1d5db",
                      fontWeight: isHovered ? 700 : 400,
                      transition: "color 150ms ease, font-weight 150ms ease",
                    }}
                  >
                    {row.id}
                  </td>
                  {/* Category badge */}
                  <td className="px-4 py-3">
                    <Badge category={row.category} hovered={isHovered} />
                  </td>
                  {/* Weight */}
                  <td className="px-4 py-3 text-[14px]" style={{ color: "#1f2937" }}>
                    {row.weight}
                  </td>
                  {/* Lat */}
                  <td className="px-4 py-3 font-mono text-[13px]" style={{ color: "#6b7280" }}>
                    {row.lat}
                  </td>
                  {/* Lng */}
                  <td className="px-4 py-3 font-mono text-[13px]" style={{ color: "#6b7280" }}>
                    {row.lng}
                  </td>
                  {/* Submitted By */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0"
                        style={{ background: "#e8f5e9", color: "#2e7d32" }}
                      >
                        {row.submittedBy[0].toUpperCase()}
                      </div>
                      <span className="text-[14px]" style={{ color: "#1f2937" }}>
                        {row.submittedBy}
                      </span>
                    </div>
                  </td>
                  {/* Date */}
                  <td className="px-4 py-3 text-[13px]" style={{ color: "#9ca3af" }}>
                    {row.date}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
