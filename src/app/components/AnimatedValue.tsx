import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'motion/react';

interface Props {
  value: string;
  className?: string;
  duration?: number;
}

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
  const isInView = useInView(ref as React.RefObject<Element>, { once: false, margin: '0px 0px -40px 0px' });
  const [display, setDisplay] = useState<string | null>(null);
  const parsed = parse(value);

  useEffect(() => {
    if (!parsed) return;
    const { prefix, num, suffix, decimals, useCommas } = parsed;

    // Always animate when value changes, whether or not in view
    const ctrl = animate(0, num, {
      duration,
      ease: [0.16, 1, 0.3, 1],
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
        setDisplay(value);
      },
    });

    return () => ctrl.stop();
  }, [value]); // re-run whenever value changes

  if (!parsed) {
    return <span ref={ref} className={className}>{value}</span>;
  }

  const shown = display ?? (parsed.prefix + '0' + parsed.suffix);

  return (
    <motion.span
      ref={ref}
      className={className}
      animate={isInView ? { scale: [1, 1.045, 1] } : { scale: 1 }}
      transition={{ duration, times: [0, 0.25, 1], ease: 'easeOut' }}
      style={{ display: 'inline-block' }}
    >
      {shown}
    </motion.span>
  );
};