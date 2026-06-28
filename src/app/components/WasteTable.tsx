import React, { useState, useMemo } from 'react';
import { WasteLog } from '../data/mockData';
import { CategoryBadge } from './CategoryBadge';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface WasteTableProps {
  logs: WasteLog[];
}

const PAGE_SIZE = 8;

export const WasteTable: React.FC<WasteTableProps> = ({ logs }) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return logs;
    return logs.filter(
      (l) =>
        l.category.toLowerCase().includes(q) ||
        l.lat.toLowerCase().includes(q) ||
        l.lng.toLowerCase().includes(q) ||
        l.submittedBy.toLowerCase().includes(q)
    );
  }, [logs, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const start = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(currentPage * PAGE_SIZE, filtered.length);

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#1F2937] text-[18px] font-medium">All waste entries</h2>
        <div className="relative w-[280px]">
          <Search className="w-4 h-4 text-black absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search by category or location..."
            className="w-full h-[36px] pl-9 pr-3 border border-black rounded-lg text-[14px] text-black outline-none focus:border-black placeholder:text-black [color:black]"
            style={{ color: 'black' }}
          />
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E7EB] overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="h-[44px]" style={{ background: "#2d6a4f" }}>
                <th className="px-4 py-3 text-[12px] font-medium uppercase tracking-[0.5px] w-[48px]" style={{ color: "#d1fae5" }}>#</th>
                <th className="px-4 py-3 text-[12px] font-medium uppercase tracking-[0.5px] w-[140px]" style={{ color: "#d1fae5" }}>Category</th>
                <th className="px-4 py-3 text-[12px] font-medium uppercase tracking-[0.5px] w-[120px]" style={{ color: "#d1fae5" }}>Weight</th>
                <th className="px-4 py-3 text-[12px] font-medium uppercase tracking-[0.5px] w-[140px]" style={{ color: "#d1fae5" }}>Latitude</th>
                <th className="px-4 py-3 text-[12px] font-medium uppercase tracking-[0.5px] w-[140px]" style={{ color: "#d1fae5" }}>Longitude</th>
                <th className="px-4 py-3 text-[12px] font-medium uppercase tracking-[0.5px] w-[160px]" style={{ color: "#d1fae5" }}>Submitted by</th>
                <th className="px-4 py-3 text-[12px] font-medium uppercase tracking-[0.5px] w-[180px]" style={{ color: "#d1fae5" }}>Date & time</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[#9CA3AF] text-[14px]">No entries match your search.</td>
                </tr>
              ) : (
                paged.map((log, index) => (
                  <tr key={log.id} className="h-[52px] border-b border-[#E5E7EB] last:border-0 transition-colors duration-100" style={{ background: index % 2 === 0 ? '#ffffff' : '#f0fdf4' }} onMouseEnter={e => (e.currentTarget.style.background = '#dcfce7')} onMouseLeave={e => (e.currentTarget.style.background = index % 2 === 0 ? '#ffffff' : '#f0fdf4')}>
                    <td className="px-4 py-3 text-[#9CA3AF] text-[14px] font-normal">{log.rowNum}</td>
                    <td className="px-4 py-3"><CategoryBadge category={log.category} /></td>
                    <td className="px-4 py-3 text-[#1F2937] text-[14px] font-normal">{log.weight} {log.unit}</td>
                    <td className="px-4 py-3 text-[#6B7280] text-[13px] font-normal font-mono">{log.lat}</td>
                    <td className="px-4 py-3 text-[#6B7280] text-[13px] font-normal font-mono">{log.lng}</td>
                    <td className="px-4 py-3 text-[#1F2937] text-[14px] font-normal flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] text-[10px] font-medium flex-shrink-0">
                        {log.submittedBy.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <span className="truncate">{log.submittedBy}</span>
                    </td>
                    <td className="px-4 py-3 text-[#9CA3AF] text-[13px] font-normal">{log.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex items-center justify-between border-t border-[#E5E7EB]" style={{ background: '#f0fdf4' }}>
          <span className="text-[#6B7280] text-[13px] font-normal">
            {filtered.length === 0 ? 'No entries' : `Showing ${start}–${end} of ${filtered.length} entries`}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center border border-[#E5E7EB] rounded bg-white text-[#6B7280] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center border border-[#E5E7EB] rounded bg-white text-[#6B7280] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Card List View */}
      <div className="md:hidden flex flex-col gap-3 mt-4">
        {paged.map((log, index) => (
          <div key={log.id} className="rounded-xl border border-[#E5E7EB] p-4 flex flex-col gap-3" style={{ background: index % 2 === 0 ? '#ffffff' : '#f0fdf4' }}>
            <div className="flex justify-between items-start">
              <CategoryBadge category={log.category} />
              <span className="text-[#1F2937] text-[16px] font-medium">{log.weight} {log.unit}</span>
            </div>
            <div>
              <p className="text-[#6B7280] text-[13px] font-mono">{log.lat}</p>
              <p className="text-[#6B7280] text-[13px] font-mono">{log.lng}</p>
            </div>
            <div className="flex justify-between items-center border-t border-[#F3F4F6] pt-3 mt-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] text-[10px] font-medium flex-shrink-0">
                  {log.submittedBy.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <span className="text-[#1F2937] text-[13px] font-normal">{log.submittedBy}</span>
              </div>
              <span className="text-[#9CA3AF] text-[12px] font-normal">{log.date.split('·')[0].trim()}</span>
            </div>
          </div>
        ))}
        <div className="py-2 flex items-center justify-between">
          <span className="text-[#6B7280] text-[13px] font-normal">{start}–{end} of {filtered.length}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center border border-[#E5E7EB] rounded bg-white text-[#6B7280] disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center border border-[#E5E7EB] rounded bg-white text-[#6B7280] disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
