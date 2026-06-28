import React, { useState, useEffect } from 'react';
import { X, ChevronDown, MapPin, Check, XCircle, Loader2 } from 'lucide-react';
import { WasteCategory } from '../data/mockData';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../context/AuthContext';

// ── Helpers ────────────────────────────────────────────────────────────────
function formatLat(lat: number): string {
  return `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}`;
}
function formatLng(lng: number): string {
  return `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`;
}

// ── Types ──────────────────────────────────────────────────────────────────
interface LogWasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    category: WasteCategory;
    weight: number;
    unit: 'kg' | 'g';
    notes: string;
    lat: string;
    lng: string;
  }) => void;
}

interface CapturedLocation {
  rawLat: number;
  rawLng: number;
  lat: string;   // formatted display string e.g. "28.6139° N"
  lng: string;   // formatted display string e.g. "77.2090° E"
}

// ── Component ──────────────────────────────────────────────────────────────
export const LogWasteModal: React.FC<LogWasteModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { user } = useAuth();

  // form fields
  const [category, setCategory] = useState<WasteCategory | ''>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'kg' | 'g'>('kg');
  const [notes, setNotes] = useState('');

  // geo state
  const [geoStatus, setGeoStatus] = useState<'pending' | 'captured' | 'error'>('pending');
  const [location, setLocation] = useState<CapturedLocation | null>(null);
  const [geoErrorMsg, setGeoErrorMsg] = useState('Location access is required to submit a waste log.');

  // submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Fire REAL geolocation when modal opens ─────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    // Reset everything
    setCategory('');
    setWeight('');
    setNotes('');
    setUnit('kg');
    setGeoStatus('pending');
    setLocation(null);
    setIsSubmitting(false);

    if (!navigator.geolocation) {
      setGeoErrorMsg('Geolocation is not supported by your browser.');
      setGeoStatus('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const rawLat = pos.coords.latitude;
        const rawLng = pos.coords.longitude;
        setLocation({ rawLat, rawLng, lat: formatLat(rawLat), lng: formatLng(rawLng) });
        setGeoStatus('captured');
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setGeoErrorMsg('Location access is required to submit a waste log.');
        } else if (err.code === err.TIMEOUT) {
          setGeoErrorMsg('Location request timed out. Please try again.');
        } else {
          setGeoErrorMsg('Unable to determine your location. Please try again.');
        }
        setGeoStatus('error');
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 0 }
    );
  }, [isOpen]);

  if (!isOpen) return null;

  const categories: WasteCategory[] = [
    'Plastic', 'Paper', 'Glass', 'Metal', 'Organic', 'E-Waste', 'Textile', 'Mixed Waste',
    'Hazardous Waste', 'Medical Waste', 'Construction & Demolition', 'Rubber Waste',
    'Battery Waste', 'Food Waste', 'Garden Waste', 'Sanitary Waste', 'Reusable/Donatable', 'Other',
  ];

  // ── handleSubmit ──────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!category || !weight) return;

    if (geoStatus !== 'captured' || !location) {
      toast.error(geoErrorMsg);
      return;
    }

    setIsSubmitting(true);

    try {
      const weightNum = parseFloat(weight);
      const weightKg = unit === 'g' ? weightNum / 1000 : weightNum;

      const { error } = await supabase.from('waste_logs').insert({
        user_id: user!.id,
        category,
        weight_display: weightNum,
        unit,
        weight_kg: weightKg,
        notes: notes || null,
        latitude: location.rawLat,
        longitude: location.rawLng,
        submitted_by: user!.name,
      });

      if (error) throw error;

      // Update local table immediately (optimistic)
      onSubmit({
        category: category as WasteCategory,
        weight: weightNum,
        unit,
        notes,
        lat: location.lat,
        lng: location.lng,
      });

      // Success toast — same custom markup as original
      toast.custom((t) => (
        <div className="bg-white border-l-4 border-l-[#10B981] rounded-[10px] p-[14px_16px] w-[340px] flex items-start gap-3 shadow-lg">
          <div className="bg-[#10B981] rounded-full p-0.5 mt-0.5 flex-shrink-0">
            <Check className="w-4 h-4 text-white" />
          </div>
          <div className="flex-grow">
            <p className="text-[#1F2937] text-[14px] font-medium leading-tight mb-1">Entry logged</p>
            <p className="text-[#6B7280] text-[13px] font-normal leading-tight">
              {category} · {weightNum} {unit} · {location.lat}, {location.lng}
            </p>
          </div>
          <button onClick={() => toast.dismiss(t)} className="text-[#9CA3AF] hover:text-[#6B7280]">
            <X className="w-4 h-4" />
          </button>
        </div>
      ), { duration: 4000 });

      onClose();
    } catch (err: any) {
      console.error('Insert error:', err);
      toast.error(err?.message ?? 'Failed to save your entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = !!category && !!weight && geoStatus === 'captured' && !isSubmitting;

  // ── JSX — pixel-identical to original ────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/45 md:p-4">
      <style>{`
        @keyframes geo-pin-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.18); }
        }
        .geo-pin-pulse { animation: geo-pin-pulse 1.2s ease-in-out infinite; }
        .geo-card-transition { transition: background 0.4s ease, border-color 0.4s ease; }
      `}</style>

      <div
        className="bg-white w-full md:max-w-[520px] max-h-[90vh] overflow-y-auto rounded-t-[16px] md:rounded-[12px] animate-in slide-in-from-bottom-full md:slide-in-from-bottom-0 md:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 md:p-8 pb-8">

          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-[#1F2937] text-[20px] font-medium mb-1">Log a waste entry</h2>
              <p className="text-[#6B7280] text-[14px] font-normal">Your location is captured automatically on submit.</p>
            </div>
            <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#6B7280]">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="h-[1px] bg-[#F3F4F6] mb-5" />

          <div className="space-y-5">

            {/* Category */}
            <div className="relative">
              <label className="block text-[#374151] text-[14px] font-medium mb-2">
                Waste category <span className="text-[#EF4444]">*</span>
              </label>
              <div
                className="h-[44px] border border-[#E5E7EB] rounded-lg px-3 flex items-center justify-between cursor-pointer bg-white"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className={category ? 'text-[#1F2937] text-[14px]' : 'text-[#9CA3AF] text-[14px]'}>
                  {category || 'Select a category'}
                </span>
                <ChevronDown className="w-4 h-4 text-[#9CA3AF]" />
              </div>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E7EB] rounded-lg py-1 z-10 shadow-sm max-h-[200px] overflow-y-auto">
                  {categories.map((c) => (
                    <div
                      key={c}
                      className="h-[36px] px-4 flex items-center justify-between hover:bg-[#F0FDF4] cursor-pointer text-[14px] text-[#1F2937]"
                      onClick={() => { setCategory(c); setIsDropdownOpen(false); }}
                    >
                      {c}
                      {category === c && <Check className="w-4 h-4 text-[#2E7D32]" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Weight */}
            <div>
              <label className="block text-[#374151] text-[14px] font-medium mb-2">
                Weight <span className="text-[#EF4444]">*</span>
              </label>
              <div className="flex">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0.00"
                  className="flex-grow h-[44px] border border-[#E5E7EB] border-r-0 rounded-l-lg px-3 text-right text-[#1F2937] text-[16px] outline-none focus:border-[#2E7D32]"
                />
                <div className="w-[100px] flex border border-[#E5E7EB] rounded-r-lg overflow-hidden bg-white">
                  <button
                    className={`flex-1 text-[13px] font-medium ${unit === 'kg' ? 'bg-[#2E7D32] text-white' : 'text-[#6B7280]'}`}
                    onClick={() => setUnit('kg')}
                  >kg</button>
                  <div className="w-[1px] bg-[#E5E7EB]" />
                  <button
                    className={`flex-1 text-[13px] font-medium ${unit === 'g' ? 'bg-[#2E7D32] text-white' : 'text-[#6B7280]'}`}
                    onClick={() => setUnit('g')}
                  >g</button>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[#374151] text-[14px] font-medium mb-2">
                Notes <span className="text-[#9CA3AF] text-[13px] font-normal">(Optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any details about this waste entry..."
                className="w-full h-[88px] border border-[#E5E7EB] rounded-lg p-3 text-[14px] text-[#1F2937] outline-none focus:border-[#2E7D32] resize-none"
              />
            </div>

            {/* Geo status card */}
            <div>
              {geoStatus === 'captured' && (
                <div
                  className="geo-card-transition bg-[#F0FDF4] border border-[#BBF7D0] rounded-[10px] p-[14px_16px] flex items-center cursor-default select-none"
                  onClick={() => toast.info('Location auto-captured via Geolocation API.', { duration: 3000 })}
                >
                  <MapPin className="w-[18px] h-[18px] text-[#10B981] mr-3 flex-shrink-0" />
                  <div className="flex-grow">
                    <p className="text-[#065F46] text-[14px] font-medium mb-0.5">Location captured</p>
                    <p className="text-[#059669] text-[13px] font-normal font-mono">
                      Lat {location?.lat} · Long {location?.lng}
                    </p>
                  </div>
                  <div className="bg-[#10B981] rounded-full p-0.5 flex-shrink-0">
                    <Check className="w-[14px] h-[14px] text-white" />
                  </div>
                </div>
              )}

              {geoStatus === 'pending' && (
                <div className="geo-card-transition bg-[#FFFBEB] border border-[#FDE68A] rounded-[10px] p-[14px_16px] flex items-center">
                  <MapPin className="w-[18px] h-[18px] text-[#D97706] mr-3 flex-shrink-0 geo-pin-pulse" />
                  <div className="flex-grow">
                    <p className="text-[#92400E] text-[14px] font-medium mb-0.5">Detecting location...</p>
                    <p className="text-[#B45309] text-[13px] font-normal">Please wait — this may take a few seconds.</p>
                  </div>
                </div>
              )}

              {geoStatus === 'error' && (
                <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-[10px] p-[14px_16px] flex items-center">
                  <XCircle className="w-[18px] h-[18px] text-[#EF4444] mr-3 flex-shrink-0" />
                  <div className="flex-grow">
                    <p className="text-[#7F1D1D] text-[14px] font-medium mb-0.5">Location unavailable</p>
                    <p className="text-[#B91C1C] text-[13px] font-normal">{geoErrorMsg}</p>
                  </div>
                </div>
              )}
            </div>

          </div>{/* /fields */}

          {/* Footer */}
          <div className="h-[1px] bg-[#F3F4F6] mt-6 mb-6 hidden md:block" />
          <div className="flex flex-col-reverse md:flex-row justify-end gap-3 mt-6 md:mt-0">
            <button
              onClick={onClose}
              className="w-full md:w-auto px-5 py-3 md:py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-[#374151] text-[15px] font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`w-full md:w-auto px-6 py-3 md:py-2.5 rounded-lg text-[15px] font-medium flex items-center justify-center gap-2 transition-colors
                ${!canSubmit
                  ? 'bg-[#D1D5DB] text-[#9CA3AF] cursor-not-allowed'
                  : 'bg-[#2E7D32] text-white hover:bg-[#1B5E20]'
                }`}
            >
              {isSubmitting
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                : <><Check className="w-4 h-4" /> Submit log</>
              }
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};