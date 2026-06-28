import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { animate } from 'motion';

interface Props {
  value: string;
  className?: string;
  duration?: number;
}

// Parses "1,284 kg" → { prefix:"", num:1284, suffix:" kg", decimals:0, useCommas:true }
// Returns null when the string has no numeric content (e.g. "Organic")
function parse(v: string) {
  const m = v.match(/^([^0-9\-]*)([0-9,]+\.?[0-9]*)(.*)$/);
  if (!m) return null;
  const prefix = m[1];
  const raw = m[2];
  const suffix = m[3];
  const num = parseFloat(raw.replace(/,/g, ''));
  if (isNaN(num)) return null;
  const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
  const useCommas = raw.includes(',') || num >= 1000;
  return { prefix, num, suffix, decimals, useCommas };
}

export const AnimatedValue: React.FC<Props> = ({ value, className, duration = 1.8 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  // Trigger once when element scrolls into view, with a -40px bottom margin so it fires slightly before fully visible
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: '0px 0px -40px 0px' });
  const [display, setDisplay] = useState<string | null>(null);
  const parsed = parse(value);

  useEffect(() => {
    if (!isInView || !parsed) return;
    const { prefix, num, suffix, decimals, useCommas } = parsed;

    const ctrl = animate(0, num, {
      duration,
      ease: [0.16, 1, 0.3, 1], // custom spring-like ease — fast start, gentle settle
      onUpdate(v) {
        const formatted =
          decimals > 0
            ? v.toFixed(decimals)
            : useCommas
              ? Math.round(v).toLocaleString()
              : String(Math.round(v));
        setDisplay(prefix + formatted + suffix);
      },
      onComplete() {
        // Snap to exact final value to avoid float drift
        setDisplay(value);
      },
    });

    return () => ctrl.stop();
  }, [isInView]); // eslint-disable-line react-hooks/exhaustive-deps

  // No numeric content — render plain
  if (!parsed) {
    return <span ref={ref} className={className}>{value}</span>;
  }

  const shown = display ?? (parsed.prefix + '0' + parsed.suffix);

  return (
    <motion.span
      ref={ref}
      className={className}
      // Subtle scale pulse synced to the count duration
      animate={isInView ? { scale: [1, 1.045, 1] } : { scale: 1 }}
      transition={{ duration, times: [0, 0.25, 1], ease: 'easeOut' }}
      style={{ display: 'inline-block' }}
    >
      {shown}
    </motion.span>
  );
};
