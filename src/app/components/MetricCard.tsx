import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp } from 'lucide-react';
import { AnimatedValue } from './AnimatedValue';

interface MetricCardProps {
  label: string;
  value: string;
  trend?: string;
  accent?: boolean;
  index?: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, trend, accent, index = 0 }) => {
  return (
    <motion.div
      // ── Entrance ──────────────────────────────────────────────────────────
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      // ── Hover lift ────────────────────────────────────────────────────────
      whileHover={{
        y: -10,
        scale: 1.03,
        boxShadow:
          '0 16px 32px rgba(46,125,50,0.12), 0 4px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(46,125,50,0.08)',
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
      }}
      className={`bg-white rounded-[12px] p-5 border border-[#E5E7EB] cursor-default ${
        accent ? 'border-l-[3px] border-l-[#2E7D32]' : ''
      }`}
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', willChange: 'transform' }}
    >
      <p className="text-[#6B7280] text-[12px] font-normal mb-1">{label}</p>

      {/* Count-up value */}
      <AnimatedValue
        value={value}
        className="text-[#1F2937] text-[28px] font-medium leading-none mb-2 block"
        duration={1.6}
      />

      {trend && (
        <motion.div
          className="flex items-center text-[#10B981] text-[12px] font-normal gap-1"
          whileHover={{ x: 2 }}
          transition={{ duration: 0.2 }}
        >
          <motion.span
            whileHover={{ scale: 1.3, rotate: -8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            style={{ display: 'inline-flex' }}
          >
            <TrendingUp className="w-3 h-3" />
          </motion.span>
          <span>{trend}</span>
        </motion.div>
      )}
      {!trend && <div className="h-[18px]" />}
    </motion.div>
  );
};
