import React from 'react';
import { motion } from 'motion/react';
import { Leaf, TrendingUp, Package, BarChart2, Layers, Recycle, Zap, Users, Wind, LogOut } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { AnimatedValue } from '../components/AnimatedValue';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from 'recharts';
import bgImage from '../../imports/GREEN.jpg';

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORY_DATA = [
  { name: 'Plastic',     value: 287, color: '#1565C0' },
  { name: 'Paper',       value: 198, color: '#F57F17' },
  { name: 'Glass',       value: 142, color: '#7B1FA2' },
  { name: 'Metal',       value: 176, color: '#37474F' },
  { name: 'Organic',     value: 321, color: '#2E7D32' },
  { name: 'E-Waste',     value: 312, color: '#E65100' },
  { name: 'Textile',     value: 89,  color: '#C2185B' },
  { name: 'Mixed Waste', value: 134, color: '#4B5563' },
  { name: 'Hazardous',   value: 47,  color: '#B71C1C' },
  { name: 'Medical',     value: 28,  color: '#0277BD' },
];

const TOP_CATEGORIES = [...CATEGORY_DATA]
  .sort((a, b) => b.value - a.value)
  .slice(0, 5)
  .map((c, i) => ({
    ...c,
    barColor: ['#2E7D32', '#388E3C', '#43A047', '#66BB6A', '#A5D6A7'][i],
  }));

const WEEKLY_TREND = [
  { day: 'Mon', Plastic: 38, Organic: 52, EWaste: 41 },
  { day: 'Tue', Plastic: 42, Organic: 47, EWaste: 35 },
  { day: 'Wed', Plastic: 55, Organic: 61, EWaste: 58 },
  { day: 'Thu', Plastic: 31, Organic: 38, EWaste: 44 },
  { day: 'Fri', Plastic: 67, Organic: 72, EWaste: 49 },
  { day: 'Sat', Plastic: 48, Organic: 55, EWaste: 62 },
  { day: 'Sun', Plastic: 29, Organic: 43, EWaste: 38 },
];

const RECENT_ACTIVITY = [
  { user: 'Hanika',      category: 'E-Waste',     weight: 2.4,  time: 'Just now',   color: '#FFF3E0', dot: '#E65100' },
  { user: 'John Smith',  category: 'Plastic',     weight: 1.2,  time: '43 min ago', color: '#E3F2FD', dot: '#1565C0' },
  { user: 'Alice W.',    category: 'Organic',     weight: 4.5,  time: '1 hr ago',   color: '#E8F5E9', dot: '#2E7D32' },
  { user: 'Bob M.',      category: 'Glass',       weight: 0.8,  time: '2 hr ago',   color: '#F3E5F5', dot: '#7B1FA2' },
  { user: 'Charlie D.',  category: 'Metal',       weight: 3.1,  time: 'Yesterday',  color: '#ECEFF1', dot: '#37474F' },
  { user: 'Eve A.',      category: 'Mixed Waste', weight: 5.0,  time: 'Yesterday',  color: '#F3F4F6', dot: '#4B5563' },
];

const totalWaste = CATEGORY_DATA.reduce((s, c) => s + c.value, 0);
const totalEntries = 847;
const mostLogged = CATEGORY_DATA.reduce((a, b) => (a.value > b.value ? a : b)).name;
const avgPerEntry = (totalWaste / totalEntries).toFixed(1);

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon, label, value, sub, index = 0,
}: {
  icon: React.ReactNode; label: string; value: string; sub?: string; index?: number;
}) {
  return (
    <motion.div
      // ── Entrance ────────────────────────────────────────────────────────
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      // ── Hover lift ──────────────────────────────────────────────────────
      whileHover={{
        y: -10,
        scale: 1.03,
        boxShadow:
          '0 16px 32px rgba(46,125,50,0.12), 0 4px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(46,125,50,0.08)',
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
      }}
      className="bg-white rounded-xl border border-[#E5E7EB] p-5 flex items-start gap-4 shadow-sm cursor-default"
      style={{ willChange: 'transform' }}
    >
      {/* Icon — bounces on card hover */}
      <motion.div
        className="w-11 h-11 rounded-lg bg-[#E8F5E9] flex items-center justify-center flex-shrink-0 text-[#2E7D32]"
        whileHover={{ scale: 1.18, rotate: -8 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      >
        {icon}
      </motion.div>

      <div className="min-w-0">
        <p className="text-[#6B7280] text-[13px] font-medium leading-none mb-1 truncate">{label}</p>
        <AnimatedValue
          value={value}
          className="text-[#1F2937] text-[24px] font-bold leading-tight tracking-tight block"
          duration={1.7}
        />
        {sub && <p className="text-[#10B981] text-[12px] font-medium mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
}

function Card({ title, children, className = '' }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-[#E5E7EB]">
          <h2 className="text-[#1F2937] text-[16px] font-semibold tracking-tight">{title}</h2>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

// Custom tooltip for recharts
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-md px-3 py-2 text-[13px]">
      {label && <p className="text-[#6B7280] font-medium mb-1">{label}</p>}
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value} kg
        </p>
      ))}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Analytics() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-[#F8FAF5] font-sans relative">
      {/* Background image */}
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />

      <div className="relative z-10">
        {/* Nav */}
        <nav className="h-[72px] bg-white border-b border-[#E5E7EB] px-6 lg:px-12 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <Leaf className="w-8 h-8 text-[#2E7D32]" fill="currentColor" />
            <div className="flex flex-col justify-center">
              <span className="text-[#1F2937] text-[24px] font-bold tracking-tight leading-none">EcoAudit</span>
              <span className="text-[#6B7280] text-[13px] font-bold mt-1">Where Waste Meets Accountability</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Nav links */}
            <div className="hidden sm:flex items-center gap-1">
              <Link
                to="/"
                className="text-[#6B7280] hover:text-[#2E7D32] text-[14px] font-medium px-3 py-1.5 rounded-lg hover:bg-[#E8F5E9] transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/analytics"
                className="text-[#2E7D32] text-[14px] font-semibold px-3 py-1.5 rounded-lg bg-[#E8F5E9] transition-colors"
              >
                Analytics
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] text-[13px] font-semibold">
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <span className="text-[#6B7280] text-[14px] font-normal hidden sm:block">{user?.name ?? "User"}</span>
              <button
                onClick={logout}
                title="Sign out"
                className="flex items-center gap-1.5 text-[#9CA3AF] hover:text-[#D32F2F] transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline font-medium">Sign out</span>
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-[1440px] mx-auto px-6 lg:px-12 pb-20">
          {/* Page header */}
          <div className="pt-10 pb-2">
            <h1 className="text-[#1F2937] text-[28px] font-medium tracking-tight m-0">Analytics Dashboard</h1>
            <p className="text-[#374151] text-[16px] font-normal mt-1.5">
              Comprehensive insights from community waste audits
            </p>
          </div>

          {/* Top stats row */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              index={0}
              icon={<Package className="w-5 h-5" />}
              label="Total Waste Logged"
              value={`${totalWaste.toLocaleString()} kg`}
              sub="↑ 12% this week"
            />
            <StatCard
              index={1}
              icon={<Layers className="w-5 h-5" />}
              label="Total Log Entries"
              value={totalEntries.toLocaleString()}
              sub="↑ 34 since yesterday"
            />
            <StatCard
              index={2}
              icon={<BarChart2 className="w-5 h-5" />}
              label="Most Logged Category"
              value={mostLogged}
              sub="321 kg total"
            />
            <StatCard
              index={3}
              icon={<TrendingUp className="w-5 h-5" />}
              label="Avg Waste per Entry"
              value={`${avgPerEntry} kg`}
              sub="Per submission"
            />
          </div>

          {/* Charts: doughnut + horizontal bar */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <Card title="Category Distribution">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={CATEGORY_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={68}
                    outerRadius={106}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {CATEGORY_DATA.map((entry, index) => (
                      <Cell key={`pie-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [`${value} kg`, name]}
                    contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Custom legend — avoids recharts duplicate-key bug when Legend is inside PieChart */}
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
                {CATEGORY_DATA.map((entry) => (
                  <div key={`legend-${entry.name}`} className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
                    <span className="text-[#374151] text-[12px] truncate">{entry.name}</span>
                    <span className="text-[#9CA3AF] text-[12px] ml-auto flex-shrink-0">{entry.value} kg</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top Categories bar */}
            <Card title="Top Waste Categories">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={TOP_CATEGORIES}
                  layout="vertical"
                  margin={{ top: 4, right: 20, left: 4, bottom: 4 }}
                  barCategoryGap="28%"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    axisLine={false}
                    tickLine={false}
                    unit=" kg"
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: 13, fill: '#374151', fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip
                    cursor={{ fill: '#F8FAF5' }}
                    formatter={(value: number) => [`${value} kg`, 'Weight']}
                    contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13 }}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {TOP_CATEGORIES.map((entry, index) => (
                      <Cell key={`bar-cell-${index}`} fill={entry.barColor} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Weekly trend line chart */}
          <div className="mt-6">
            <Card title="Weekly Waste Trends">
              {/* Custom legend */}
              <div className="flex items-center gap-5 mb-4">
                {[{ label: 'Plastic', color: '#1565C0' }, { label: 'Organic', color: '#2E7D32' }, { label: 'E-Waste', color: '#E65100' }].map((s) => (
                  <div key={`line-legend-${s.label}`} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-[#374151] text-[13px]">{s.label}</span>
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={WEEKLY_TREND} margin={{ top: 8, right: 20, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="day" tick={{ fontSize: 13, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    axisLine={false}
                    tickLine={false}
                    unit=" kg"
                    width={52}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="Plastic"
                    name="Plastic"
                    stroke="#1565C0"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#1565C0', strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Organic"
                    name="Organic"
                    stroke="#2E7D32"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#2E7D32', strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="EWaste"
                    name="E-Waste"
                    stroke="#E65100"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#E65100', strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Bottom insights row */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent community activity */}
            <Card title="Recent Community Activity">
              <ul className="space-y-3">
                {RECENT_ACTIVITY.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.dot }}
                    />
                    <div
                      className="flex-1 flex items-center justify-between gap-2 rounded-lg px-3 py-2"
                      style={{ backgroundColor: item.color }}
                    >
                      <div className="min-w-0">
                        <span className="text-[#1F2937] text-[13px] font-semibold">{item.user}</span>
                        <span className="text-[#6B7280] text-[13px]"> logged </span>
                        <span className="text-[#1F2937] text-[13px] font-semibold">{item.weight} kg</span>
                        <span className="text-[#6B7280] text-[13px]"> of </span>
                        <span className="text-[#1F2937] text-[13px] font-semibold">{item.category}</span>
                      </div>
                      <span className="text-[#9CA3AF] text-[12px] whitespace-nowrap flex-shrink-0">{item.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Environmental impact */}
            <Card title="Environmental Impact">
              <p className="text-[#6B7280] text-[13px] mb-5">
                Estimated CO₂ savings based on waste collected and properly diverted from landfill.
              </p>

              <div className="space-y-4">
                {[
                  {
                    icon: <Recycle className="w-5 h-5" />,
                    label: 'CO₂ Emissions Avoided',
                    value: '2,847 kg',
                    note: 'equiv. to 1,420 km driven',
                    bg: '#E8F5E9',
                    text: '#2E7D32',
                  },
                  {
                    icon: <Wind className="w-5 h-5" />,
                    label: 'Methane Prevented',
                    value: '142 m³',
                    note: 'from organic diversion',
                    bg: '#E3F2FD',
                    text: '#1565C0',
                  },
                  {
                    icon: <Zap className="w-5 h-5" />,
                    label: 'Energy Recovered',
                    value: '4,210 kWh',
                    note: 'via recycling programs',
                    bg: '#FFF3E0',
                    text: '#E65100',
                  },
                  {
                    icon: <Users className="w-5 h-5" />,
                    label: 'Active Contributors',
                    value: '238',
                    note: 'unique users this month',
                    bg: '#F3E5F5',
                    text: '#7B1FA2',
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 rounded-lg px-4 py-3"
                    style={{ backgroundColor: item.bg }}
                  >
                    <div style={{ color: item.text }} className="flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#374151] text-[13px] font-medium leading-none">{item.label}</p>
                      <p className="text-[#9CA3AF] text-[12px] mt-0.5">{item.note}</p>
                    </div>
                    <p className="text-[#1F2937] text-[18px] font-bold tracking-tight flex-shrink-0" style={{ color: item.text }}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
