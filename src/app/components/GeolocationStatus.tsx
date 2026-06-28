import React, { useState, useEffect, useRef } from "react";
import { MapPin, Check } from "lucide-react";

const FULL_TEXT = "Location verified · Lat 28.6139° N · Long 77.2090° E";
const TYPING_SPEED = 38; // ms per character
const LOOP_INTERVAL = 4000; // ms between loop restarts

export const GeolocationStatus: React.FC = () => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startTyping = () => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const tick = () => {
      i++;
      setDisplayed(FULL_TEXT.slice(0, i));
      if (i < FULL_TEXT.length) {
        frameRef.current = setTimeout(tick, TYPING_SPEED);
      } else {
        setDone(true);
      }
    };
    frameRef.current = setTimeout(tick, TYPING_SPEED);
  };

  useEffect(() => {
    startTyping();
    const loop = setInterval(() => {
      if (frameRef.current) clearTimeout(frameRef.current);
      startTyping();
    }, LOOP_INTERVAL);
    return () => {
      clearInterval(loop);
      if (frameRef.current) clearTimeout(frameRef.current);
    };
  }, []);

  return (
    <div
      className="inline-flex items-center gap-3 px-4 py-3 rounded-[10px]"
      style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
    >
      {/* Pin icon */}
      <MapPin
        className="flex-shrink-0"
        style={{ width: 18, height: 18, color: "#16a34a" }}
      />

      {/* Typewriter text */}
      <span
        className="font-mono text-[13px] leading-none select-none"
        style={{ color: "#52b788" }}
      >
        {displayed}
        {!done && (
          <span
            style={{
              display: "inline-block",
              width: "1px",
              animation: "eco-blink 0.7s step-start infinite",
              marginLeft: "1px",
              verticalAlign: "middle",
              fontSize: "14px",
              lineHeight: 1,
              color: "#52b788",
            }}
          >
            |
          </span>
        )}
      </span>

      {/* Checkmark fades in when done */}
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-full"
        style={{
          width: 20,
          height: 20,
          background: "#16a34a",
          opacity: done ? 1 : 0,
          transform: done ? "scale(1)" : "scale(0.6)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
        }}
      >
        <Check style={{ width: 12, height: 12, color: "#fff" }} />
      </div>

      <style>{`
        @keyframes eco-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};
