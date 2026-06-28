import React, { useEffect, useState } from "react";
import { GeolocationStatus } from "../components/GeolocationStatus";
import { AnimatedLogo } from "../components/AnimatedLogo";
import { WasteAuditTable } from "../components/WasteAuditTable";
import { CategoryFilterChips } from "../components/CategoryFilterChips";

interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
}

const FadeUp: React.FC<FadeUpProps> = ({ children, delay = 0 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: "opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {children}
    </div>
  );
};

const Section: React.FC<{ label: string; children: React.ReactNode; dark?: boolean }> = ({
  label,
  children,
  dark,
}) => (
  <div className={`rounded-2xl p-6 ${dark ? "" : "bg-white"}`} style={dark ? { background: "#0d2818" } : { border: "1px solid #e5e7eb" }}>
    <p
      className="text-[11px] font-semibold uppercase tracking-widest mb-5"
      style={{ color: dark ? "#52b788" : "#9ca3af" }}
    >
      {label}
    </p>
    {children}
  </div>
);

export default function ComponentShowcase() {
  return (
    <div className="min-h-screen py-12 px-4" style={{ background: "#f8faf5" }}>
      <div className="max-w-3xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <FadeUp delay={0}>
          <div className="mb-2">
            <h1 className="text-[28px] font-bold tracking-tight" style={{ color: "#1f2937" }}>
              Component Showcase
            </h1>
            <p className="text-[14px] mt-1" style={{ color: "#6b7280" }}>
              EcoAudit UI components
            </p>
          </div>
        </FadeUp>

        {/* Animated Logo */}
        <FadeUp delay={100}>
          <Section label="Animated Logo" dark>
            <AnimatedLogo />
          </Section>
        </FadeUp>

        {/* Geolocation Status */}
        <FadeUp delay={200}>
          <Section label="Geolocation Status Confirmation">
            <GeolocationStatus />
          </Section>
        </FadeUp>

        {/* Category Filter Chips */}
        <FadeUp delay={300}>
          <Section label="Category Filter Chips">
            <CategoryFilterChips />
          </Section>
        </FadeUp>

        {/* Waste Audit Table */}
        <FadeUp delay={400}>
          <Section label="Waste Audit Table">
            <WasteAuditTable />
          </Section>
        </FadeUp>

      </div>
    </div>
  );
}
