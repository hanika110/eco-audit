import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Leaf, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import bgImage from "../../imports/GREEN.jpg";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email.";
    if (!password) errs.password = "Password is required.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-[#F0F7F0]">
      {/* Background image */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Left panel — desktop only */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative z-10 p-12 xl:p-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#2E7D32] flex items-center justify-center shadow-lg">
            <Leaf className="w-6 h-6 text-white" fill="white" />
          </div>
          <div>
            <span className="text-[#1F2937] text-2xl font-bold tracking-tight leading-none block">EcoAudit</span>
            <span className="text-[#4CAF50] text-xs font-semibold tracking-wide uppercase">Environmental Platform</span>
          </div>
        </div>

        {/* Center content */}
        <div className="space-y-6 max-w-md">
          {/* Eco illustration cluster */}
          <div className="relative w-64 h-64">
            <EcoIllustration />
          </div>

          <div className="space-y-3">
            <h1 className="text-[42px] font-bold text-[#1F2937] leading-tight">
              Where Waste Meets<br />
              <span className="text-[#2E7D32]">Accountability</span>
            </h1>
            <p className="text-[#4B5563] text-lg leading-relaxed">
              Join the community in creating verified, data-driven environmental impact.
            </p>
          </div>

          {/* Stats strip */}
          <div className="flex gap-6">
            {[
              { value: "12K+", label: "Audits Logged" },
              { value: "340t", label: "Waste Tracked" },
              { value: "98%", label: "Verified Data" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-[#2E7D32]">{s.value}</div>
                <div className="text-xs text-[#6B7280] font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom trust note */}
        <p className="text-xs text-[#9CA3AF]">
          Verified environmental data · Open community platform
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2.5 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-[#2E7D32] flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-[#1F2937] text-xl font-bold">EcoAudit</span>
          </div>

          {/* Glass card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 xl:p-10">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-[#1F2937]">Welcome back</h2>
              <p className="text-[#6B7280] text-sm mt-1">Sign in to your EcoAudit account</p>
            </div>

            {/* Global error */}
            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: undefined })); }}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 rounded-xl border text-[#1F2937] placeholder-[#9CA3AF] bg-[#F9FAF9] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32] transition text-sm ${
                    fieldErrors.email ? "border-red-400" : "border-[#D1FAE5]"
                  }`}
                />
                {fieldErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-[#374151]">Password</label>
                  <button
                    type="button"
                    className="text-xs text-[#2E7D32] hover:text-[#1B5E20] font-medium transition-colors"
                    onClick={() => setError("Password reset is not available in demo mode.")}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: undefined })); }}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 pr-11 rounded-xl border text-[#1F2937] placeholder-[#9CA3AF] bg-[#F9FAF9] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32] transition text-sm ${
                      fieldErrors.password ? "border-red-400" : "border-[#D1FAE5]"
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                    onClick={() => setShowPassword((p) => !p)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] active:scale-[0.98] text-white font-semibold text-sm transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 shadow-lg shadow-[#2E7D32]/25"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Demo hint */}
            <div className="mt-4 bg-[#E8F5E9] rounded-xl px-4 py-3 text-xs text-[#2E7D32]">
              <span className="font-semibold">Demo:</span> Create an account first, then sign in with those credentials.
            </div>

            <p className="text-center text-sm text-[#6B7280] mt-6">
              {"Don't have an account? "}
              <Link to="/register" className="text-[#2E7D32] font-semibold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EcoIllustration() {
  return (
    <svg viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Earth circle */}
      <circle cx="130" cy="130" r="90" fill="#C8E6C9" opacity="0.6" />
      <circle cx="130" cy="130" r="70" fill="#A5D6A7" opacity="0.5" />

      {/* Continent blobs */}
      <ellipse cx="110" cy="115" rx="28" ry="22" fill="#2E7D32" opacity="0.7" transform="rotate(-15 110 115)" />
      <ellipse cx="150" cy="140" rx="22" ry="18" fill="#388E3C" opacity="0.6" transform="rotate(10 150 140)" />
      <ellipse cx="118" cy="150" rx="12" ry="10" fill="#43A047" opacity="0.5" />

      {/* Large leaf top-right */}
      <path
        d="M185 55 C185 55 220 75 210 115 C200 155 170 160 155 145 C140 130 145 95 165 80 C175 72 185 55 185 55Z"
        fill="#4CAF50"
        opacity="0.85"
      />
      <path d="M185 55 L163 138" stroke="#2E7D32" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

      {/* Small leaf left */}
      <path
        d="M60 90 C60 90 40 110 52 132 C64 154 85 150 90 135 C95 120 80 105 68 98 C64 95 60 90 60 90Z"
        fill="#66BB6A"
        opacity="0.75"
      />
      <path d="M60 90 L87 140" stroke="#2E7D32" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />

      {/* Tiny sprout bottom-left */}
      <path d="M80 195 Q80 175 90 168" stroke="#388E3C" strokeWidth="2" strokeLinecap="round" fill="none" />
      <ellipse cx="96" cy="163" rx="9" ry="6" fill="#81C784" transform="rotate(-30 96 163)" />
      <ellipse cx="85" cy="162" rx="8" ry="5" fill="#A5D6A7" transform="rotate(20 85 162)" />

      {/* Recycling arrows */}
      <g transform="translate(170, 175) scale(0.9)" opacity="0.75">
        <path d="M18 2 L22 8 L14 8 Z" fill="#2E7D32" />
        <path d="M22 8 A14 14 0 0 1 8 26" stroke="#2E7D32" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M2 22 L6 28 L-2 28 Z" fill="#2E7D32" transform="rotate(120 2 22)" />
        <path d="M6 28 A14 14 0 0 1 26 14" stroke="#2E7D32" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M28 16 L24 10 L32 10 Z" fill="#2E7D32" transform="rotate(240 28 16)" />
        <path d="M24 10 A14 14 0 0 1 4 24" stroke="#2E7D32" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </g>

      {/* Floating dots */}
      <circle cx="55" cy="55" r="5" fill="#A5D6A7" opacity="0.7" />
      <circle cx="210" cy="195" r="4" fill="#C8E6C9" opacity="0.8" />
      <circle cx="200" cy="60" r="3" fill="#81C784" opacity="0.6" />
      <circle cx="45" cy="175" r="3.5" fill="#66BB6A" opacity="0.5" />
    </svg>
  );
}
