import React from "react";
import { motion } from "motion/react";
import { Leaf } from "lucide-react";

export default function LogoDemo() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#0d2818" }}
    >
      <div className="flex items-center gap-4">
        {/* Animated leaf in dark circle */}
        <motion.div
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "#1a4731",
          }}
          animate={{
            rotate: [-8, 8, -8],
            scale: [1.0, 1.08, 1.0],
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          <Leaf style={{ width: 32, height: 32, color: "#2d6a4f" }} fill="#2d6a4f" />
        </motion.div>

        {/* Wordmark */}
        <div className="flex flex-col gap-[3px]">
          <span
            className="text-[22px] font-bold leading-none tracking-tight"
            style={{ color: "#ffffff" }}
          >
            EcoAudit
          </span>
          <span
            className="text-[9px] font-semibold uppercase tracking-widest leading-none"
            style={{ color: "#52b788" }}
          >
            Environmental Platform
          </span>
        </div>
      </div>
    </div>
  );
}
