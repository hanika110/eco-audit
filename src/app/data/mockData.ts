export type WasteCategory = 'Plastic' | 'E-Waste' | 'Organic' | 'Glass' | 'Metal' | 'Paper' | 'Textile' | 'Mixed Waste' | 'Hazardous Waste' | 'Medical Waste' | 'Construction & Demolition' | 'Rubber Waste' | 'Battery Waste' | 'Food Waste' | 'Garden Waste' | 'Sanitary Waste' | 'Reusable/Donatable' | 'Other';

export interface WasteLog {
  id: string;
  rowNum: number;
  category: WasteCategory;
  weight: number;
  unit: 'kg' | 'g';
  lat: string;
  lng: string;
  submittedBy: string;
  date: string;
}

export const mockLogs: WasteLog[] = [
  { id: '1', rowNum: 1, category: 'E-Waste', weight: 2.4, unit: 'kg', lat: '28.6139° N', lng: '77.2090° E', submittedBy: 'Hanika', date: 'Jun 26, 2026 · 3:41 PM' },
  { id: '2', rowNum: 2, category: 'Plastic', weight: 1.2, unit: 'kg', lat: '28.6140° N', lng: '77.2091° E', submittedBy: 'John Smith', date: 'Jun 26, 2026 · 2:15 PM' },
  { id: '3', rowNum: 3, category: 'Organic', weight: 4.5, unit: 'kg', lat: '28.6135° N', lng: '77.2100° E', submittedBy: 'Alice W.', date: 'Jun 26, 2026 · 1:30 PM' },
  { id: '4', rowNum: 4, category: 'Glass', weight: 0.8, unit: 'kg', lat: '28.6120° N', lng: '77.2085° E', submittedBy: 'Bob M.', date: 'Jun 26, 2026 · 11:20 AM' },
  { id: '5', rowNum: 5, category: 'Metal', weight: 3.1, unit: 'kg', lat: '28.6155° N', lng: '77.2070° E', submittedBy: 'Charlie D.', date: 'Jun 25, 2026 · 4:45 PM' },
  { id: '6', rowNum: 6, category: 'Paper', weight: 1.5, unit: 'kg', lat: '28.6160° N', lng: '77.2065° E', submittedBy: 'Hanika', date: 'Jun 25, 2026 · 2:10 PM' },
  { id: '7', rowNum: 7, category: 'Mixed Waste', weight: 5.0, unit: 'kg', lat: '28.6110° N', lng: '77.2110° E', submittedBy: 'Eve A.', date: 'Jun 25, 2026 · 10:05 AM' },
  { id: '8', rowNum: 8, category: 'Textile', weight: 2.0, unit: 'kg', lat: '28.6145° N', lng: '77.2080° E', submittedBy: 'Frank L.', date: 'Jun 24, 2026 · 3:30 PM' },
];
