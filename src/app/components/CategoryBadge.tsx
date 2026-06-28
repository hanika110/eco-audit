import React from 'react';
import { WasteCategory } from '../data/mockData';

const badgeColors: Record<WasteCategory, { bg: string; text: string }> = {
  'Plastic':                  { bg: 'rgba(21,101,192,0.12)',  text: '#1565C0' },
  'E-Waste':                  { bg: 'rgba(230,81,0,0.12)',    text: '#E65100' },
  'Organic':                  { bg: 'rgba(46,125,50,0.12)',   text: '#2E7D32' },
  'Glass':                    { bg: 'rgba(123,31,162,0.12)',  text: '#7B1FA2' },
  'Metal':                    { bg: 'rgba(55,71,79,0.12)',    text: '#37474F' },
  'Paper':                    { bg: 'rgba(245,127,23,0.12)',  text: '#F57F17' },
  'Textile':                  { bg: 'rgba(194,24,91,0.12)',   text: '#C2185B' },
  'Mixed Waste':              { bg: 'rgba(75,85,99,0.12)',    text: '#4B5563' },
  'Hazardous Waste':          { bg: 'rgba(185,28,28,0.12)',   text: '#B91C1C' },
  'Medical Waste':            { bg: 'rgba(220,38,38,0.12)',   text: '#DC2626' },
  'Construction & Demolition':{ bg: 'rgba(120,53,15,0.12)',   text: '#78350F' },
  'Rubber Waste':             { bg: 'rgba(30,64,175,0.12)',   text: '#1E40AF' },
  'Battery Waste':            { bg: 'rgba(124,58,237,0.12)',  text: '#7C3AED' },
  'Food Waste':               { bg: 'rgba(5,150,105,0.12)',   text: '#059669' },
  'Garden Waste':             { bg: 'rgba(22,163,74,0.12)',   text: '#16A34A' },
  'Sanitary Waste':           { bg: 'rgba(217,119,6,0.12)',   text: '#D97706' },
  'Reusable/Donatable':       { bg: 'rgba(2,132,199,0.12)',   text: '#0284C7' },
  'Other':                    { bg: 'rgba(107,114,128,0.12)', text: '#6B7280' },
};

export const CategoryBadge: React.FC<{ category: WasteCategory }> = ({ category }) => {
  const colors = badgeColors[category] ?? { bg: 'rgba(107,114,128,0.12)', text: '#6B7280' };
  return (
    <span
      className="px-2 py-1 rounded-full text-[12px] font-medium whitespace-nowrap"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {category}
    </span>
  );
};
