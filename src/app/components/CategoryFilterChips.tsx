import React, { useState } from "react";

interface Chip {
  label: string;
  text: string;
  bg: string;
  shadow: string;
  border: string;
}

const CHIPS: Chip[] = [
  { label: "E-Waste",       text: "#f97316", bg: "#fff7ed", shadow: "rgba(249,115,22,0.20)",  border: "rgba(249,115,22,0.30)" },
  { label: "Plastic",       text: "#3b82f6", bg: "#eff6ff", shadow: "rgba(59,130,246,0.20)",  border: "rgba(59,130,246,0.30)" },
  { label: "Organic",       text: "#22c55e", bg: "#f0fdf4", shadow: "rgba(34,197,94,0.20)",   border: "rgba(34,197,94,0.30)" },
  { label: "Glass",         text: "#8b5cf6", bg: "#f5f3ff", shadow: "rgba(139,92,246,0.20)",  border: "rgba(139,92,246,0.30)" },
  { label: "Metal",         text: "#6b7280", bg: "#f9fafb", shadow: "rgba(107,114,128,0.20)", border: "rgba(107,114,128,0.30)" },
  { label: "Paper",         text: "#f59e0b", bg: "#fffbeb", shadow: "rgba(245,158,11,0.20)",  border: "rgba(245,158,11,0.30)" },
  { label: "Textile",       text: "#ec4899", bg: "#fdf2f8", shadow: "rgba(236,72,153,0.20)",  border: "rgba(236,72,153,0.30)" },
  { label: "Battery Waste", text: "#eab308", bg: "#fefce8", shadow: "rgba(234,179,8,0.20)",   border: "rgba(234,179,8,0.30)" },
  { label: "Food Waste",    text: "#84cc16", bg: "#f7fee7", shadow: "rgba(132,204,22,0.20)",  border: "rgba(132,204,22,0.30)" },
];

export const CategoryFilterChips: React.FC = () => {
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap gap-2">
      {CHIPS.map((chip, i) => {
        const isActive = active === chip.label;
        const isHovered = hovered === chip.label;

        return (
          <button
            key={chip.label}
            onClick={() => setActive(isActive ? null : chip.label)}
            onMouseEnter={() => setHovered(chip.label)}
            onMouseLeave={() => setHovered(null)}
            className="px-3.5 py-1.5 text-[13px] font-medium leading-none outline-none focus-visible:ring-2"
            style={{
              borderRadius: 999,
              backgroundColor: isActive ? chip.text : chip.bg,
              color: isActive ? "#ffffff" : chip.text,
              border: `1px solid ${isHovered || isActive ? chip.border : "transparent"}`,
              transform: isHovered && !isActive ? "translateY(-3px)" : "translateY(0)",
              boxShadow: isHovered && !isActive
                ? `0 4px 12px ${chip.shadow}`
                : isActive
                  ? `0 2px 8px ${chip.shadow}`
                  : "none",
              transition: "transform 200ms ease, box-shadow 200ms ease, background-color 200ms ease, color 200ms ease, border-color 200ms ease",
              cursor: "pointer",
              // Staggered entrance handled by parent
            }}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
};
