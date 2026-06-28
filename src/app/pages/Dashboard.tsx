import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Leaf, LogOut, Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { MetricCard } from '../components/MetricCard';
import { WasteTable } from '../components/WasteTable';
import { LogWasteModal } from '../components/LogWasteModal';
import { WasteLog } from '../data/mockData';
import bgImage from '../../imports/GREEN.jpg';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../../lib/supabase';

// ── helpers ───────────────────────────────────────────────────────────────────
function formatLat(lat: number): string {
  return `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}`;
}
function formatLng(lng: number): string {
  return `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`;
}
function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: 'numeric', hour12: true,
  });
}

// Supabase row → WasteLog shape for WasteTable
// weight_kg is always stored in kg — use it directly for accuracy
function dbRowToLog(row: any, index: number): WasteLog {
  // Supabase returns numeric columns as JS numbers, but guard with parseFloat
  const weightKg = parseFloat(String(row.weight_kg ?? row.weight_display ?? 0));
  const unit: 'kg' | 'g' = row.unit === 'g' ? 'g' : 'kg';

  return {
    id: row.id,
    rowNum: index + 1,
    category: row.category,
    // Store weight always in kg for metric calculation consistency
    weight: unit === 'g' ? weightKg * 1000 : weightKg,
    unit,
    lat: formatLat(row.latitude),
    lng: formatLng(row.longitude),
    submittedBy: row.submitted_by ?? 'Unknown',
    date: formatDate(row.created_at),
    // Keep raw kg value for metrics (avoids double-conversion bugs)
    _weightKg: weightKg,
  } as WasteLog & { _weightKg: number };
}

// Always return weight in kg regardless of stored unit
function toKg(log: WasteLog & { _weightKg?: number }): number {
  // Prefer the pre-computed _weightKg if available
  if (typeof log._weightKg === 'number' && !isNaN(log._weightKg)) {
    return log._weightKg;
  }
  return log.unit === 'g' ? log.weight / 1000 : log.weight;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, logout } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logs, setLogs] = useState<WasteLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);

  // ── Derived metrics ───────────────────────────────────────────────────────
  const totalWasteKg = logs.reduce((s, l) => s + toKg(l as any), 0);
  const eWasteKg     = logs.filter(l => l.category === 'E-Waste').reduce((s, l) => s + toKg(l as any), 0);
  const plasticKg    = logs.filter(l => l.category === 'Plastic').reduce((s, l) => s + toKg(l as any), 0);
  const totalEntries = logs.length;

  // ── Fetch all logs ────────────────────────────────────────────────────────
  const fetchLogs = useCallback(async () => {
    setIsLoadingLogs(true);
    const { data, error } = await supabase
      .from('waste_logs')
      .select('id, category, weight_display, weight_kg, unit, latitude, longitude, submitted_by, created_at, notes')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Dashboard] fetchLogs error:', error);
    }

    if (data && data.length > 0) {
      setLogs(data.map(dbRowToLog));
    }
    setIsLoadingLogs(false);
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  // ── Called by modal after successful Supabase insert ─────────────────────
  const handleLogSubmit = (data: any) => {
    const weightKg = data.unit === 'g' ? data.weight / 1000 : data.weight;
    const optimistic: WasteLog & { _weightKg: number } = {
      id: crypto.randomUUID(),
      rowNum: 1,
      category: data.category,
      weight: data.weight,
      unit: data.unit,
      lat: data.lat,
      lng: data.lng,
      submittedBy: user?.name ?? 'Unknown',
      date: new Date().toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: 'numeric', hour12: true,
      }),
      _weightKg: weightKg,
    };
    setLogs(prev => [optimistic, ...prev].map((l, i) => ({ ...l, rowNum: i + 1 })));
    // Background re-fetch to sync with DB
    setTimeout(fetchLogs, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF5] font-sans relative">
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
            <div className="hidden sm:flex items-center gap-1">
              <Link to="/" className="text-[#2E7D32] text-[14px] font-semibold px-3 py-1.5 rounded-lg bg-[#E8F5E9] transition-colors">
                Dashboard
              </Link>
              <Link to="/analytics" className="text-[#6B7280] hover:text-[#2E7D32] text-[14px] font-medium px-3 py-1.5 rounded-lg hover:bg-[#E8F5E9] transition-colors">
                Analytics
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] text-[13px] font-semibold">
                {user?.name?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <span className="text-[#6B7280] text-[14px] font-normal hidden sm:block">{user?.name ?? 'User'}</span>
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
          {/* Header */}
          <div className="pt-10 flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-[#1F2937] text-[28px] font-medium m-0 tracking-tight">Waste audit dashboard</h1>
              <p className="text-[#374151] text-[16px] font-normal mt-1.5">
                Community-submitted waste logs with verified geolocation
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden md:flex bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-[15px] font-medium py-2.5 px-5 rounded-lg items-center justify-center gap-2 transition-colors self-start whitespace-nowrap shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Log waste entry
            </button>
          </div>

          {/* Metric Cards — all driven by real data */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              index={0}
              label="Total waste logged"
              value={`${totalWasteKg.toFixed(1)} kg`}
              trend={`↑ ${totalEntries} total entries`}
            />
            <MetricCard
              index={1}
              label="E-waste logged"
              value={`${eWasteKg.toFixed(1)} kg`}
              trend={`${logs.filter(l => l.category === 'E-Waste').length} entries`}
              accent={true}
            />
            <MetricCard
              index={2}
              label="Total entries"
              value={String(totalEntries)}
            />
            <MetricCard
              index={3}
              label="Plastic waste logged"
              value={`${plasticKg.toFixed(1)} kg`}
            />

            {/* Mobile FAB */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#E5E7EB] md:hidden z-40">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full h-[56px] bg-[#2E7D32] text-white text-[16px] font-medium rounded-lg flex items-center justify-center gap-2 shadow-md"
              >
                <Plus className="w-5 h-5" />
                Log waste entry
              </button>
            </div>
          </div>

          {/* Table */}
          {isLoadingLogs ? (
            <div className="mt-10 flex items-center justify-center gap-3 text-[#6B7280] py-20">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-[14px]">Loading waste logs…</span>
            </div>
          ) : (
            <WasteTable logs={logs} />
          )}
        </main>

        <LogWasteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleLogSubmit}
        />
      </div>
    </div>
  );
}