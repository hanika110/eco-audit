import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Leaf, Eye, EyeOff, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import bgImage from "../../imports/GREEN.jpg";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const clearField = (key: string) =>
    setFieldErrors((p) => { const n = { ...p }; delete n[key]; return n; });

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Full name is required.";
    if (!email.trim()) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email.";
    if (!password) errs.password = "Password is required.";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters.";
    if (!confirm) errs.confirm = "Please confirm your password.";
    else if (password !== confirm) errs.confirm = "Passwords do not match.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      setSuccess(true);
      setTimeout(() => navigate("/", { replace: true }), 1200);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const strengthScore = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9!@#$%^&*]/.test(password)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strengthScore];
  const strengthColor = ["", "bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-[#4CAF50]"][strengthScore];

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-[#F0F7F0]">
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative z-10 p-12 xl:p-16">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#2E7D32] flex items-center justify-center shadow-lg">
            <Leaf className="w-6 h-6 text-white" fill="white" />
          </div>
          <div>
            <span className="text-[#1F2937] text-2xl font-bold tracking-tight leading-none block">EcoAudit</span>
            <span className="text-[#4CAF50] text-xs font-semibold tracking-wide uppercase">Environmental Platform</span>
          </div>
        </div>

        <div className="space-y-6 max-w-md">
          <div className="relative w-64 h-64">
            <RegisterIllustration />
          </div>
          <div className="space-y-3">
            <h1 className="text-[38px] font-bold text-[#1F2937] leading-tight">
              Start Making a<br />
              <span className="text-[#2E7D32]">Real Difference</span>
            </h1>
            <p className="text-[#4B5563] text-lg leading-relaxed">
              Join the community in creating verified, data-driven environmental impact.
            </p>
          </div>
          <div className="space-y-3">
            {[
              "Log and verify waste audits in seconds",
              "Track your environmental impact over time",
              "Contribute to open community data",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#4CAF50] shrink-0" />
                <span className="text-[#374151] text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-[#9CA3AF]">
          Verified environmental data · Open community platform
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          <div className="flex lg:hidden items-center gap-2.5 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-[#2E7D32] flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-[#1F2937] text-xl font-bold">EcoAudit</span>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 xl:p-10">
            {success ? (
              <div className="flex flex-col items-center gap-4 py-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-[#2E7D32]" />
                </div>
                <h2 className="text-xl font-bold text-[#1F2937]">Account Created!</h2>
                <p className="text-[#6B7280] text-sm">Redirecting to your dashboard…</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-[#1F2937]">Create Account</h2>
                  <p className="text-[#6B7280] text-sm mt-1">Join EcoAudit to start making an impact</p>
                </div>

                {error && (
                  <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-[#374151] mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => { setName(e.target.value); clearField("name"); }}
                      placeholder="Jane Smith"
                      className={`w-full px-4 py-3 rounded-xl border text-[#1F2937] placeholder-[#9CA3AF] bg-[#F9FAF9] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32] transition text-sm ${
                        fieldErrors.name ? "border-red-400" : "border-[#D1FAE5]"
                      }`}
                    />
                    {fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-[#374151] mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); clearField("email"); }}
                      placeholder="you@example.com"
                      className={`w-full px-4 py-3 rounded-xl border text-[#1F2937] placeholder-[#9CA3AF] bg-[#F9FAF9] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32] transition text-sm ${
                        fieldErrors.email ? "border-red-400" : "border-[#D1FAE5]"
                      }`}
                    />
                    {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-semibold text-[#374151] mb-1.5">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); clearField("password"); }}
                        placeholder="Min. 6 characters"
                        className={`w-full px-4 py-3 pr-11 rounded-xl border text-[#1F2937] placeholder-[#9CA3AF] bg-[#F9FAF9] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32] transition text-sm ${
                          fieldErrors.password ? "border-red-400" : "border-[#D1FAE5]"
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
                        onClick={() => setShowPassword((p) => !p)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {/* Strength meter */}
                    {password && (
                      <div className="mt-2 space-y-1">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                i <= strengthScore ? strengthColor : "bg-[#E5E7EB]"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-[#6B7280]">{strengthLabel}</p>
                      </div>
                    )}
                    {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-semibold text-[#374151] mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={confirm}
                        onChange={(e) => { setConfirm(e.target.value); clearField("confirm"); }}
                        placeholder="Re-enter your password"
                        className={`w-full px-4 py-3 pr-11 rounded-xl border text-[#1F2937] placeholder-[#9CA3AF] bg-[#F9FAF9] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32] transition text-sm ${
                          fieldErrors.confirm ? "border-red-400" : "border-[#D1FAE5]"
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
                        onClick={() => setShowConfirm((p) => !p)}
                        tabIndex={-1}
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {fieldErrors.confirm && <p className="text-red-500 text-xs mt-1">{fieldErrors.confirm}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] active:scale-[0.98] text-white font-semibold text-sm transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1 shadow-lg shadow-[#2E7D32]/25"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating Account…
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                <p className="text-center text-sm text-[#6B7280] mt-6">
                  Already have an account?{" "}
                  <Link to="/login" className="text-[#2E7D32] font-semibold hover:underline">
                    Sign In
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RegisterIllustration() {
  return (
    <svg viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Background circle */}
      <circle cx="130" cy="130" r="95" fill="#C8E6C9" opacity="0.4" />

      {/* Central plant pot */}
      <rect x="110" y="165" width="40" height="30" rx="6" fill="#795548" opacity="0.7" />
      <rect x="105" y="160" width="50" height="10" rx="5" fill="#6D4C41" opacity="0.8" />
      {/* Soil */}
      <ellipse cx="130" cy="162" rx="22" ry="5" fill="#5D4037" opacity="0.5" />

      {/* Main stem */}
      <path d="M130 162 Q130 140 125 120" stroke="#388E3C" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Left leaf */}
      <path d="M125 135 C125 135 95 125 92 105 C105 100 125 115 125 135Z" fill="#4CAF50" opacity="0.85" />
      <path d="M125 135 L100 107" stroke="#2E7D32" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />

      {/* Right leaf */}
      <path d="M123 125 C123 125 150 112 155 92 C142 88 123 105 123 125Z" fill="#66BB6A" opacity="0.8" />
      <path d="M123 125 L150 94" stroke="#2E7D32" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />

      {/* Top leaf */}
      <path d="M125 118 C125 118 118 88 130 72 C142 88 135 118 125 118Z" fill="#81C784" opacity="0.75" />
      <path d="M125 118 L130 76" stroke="#2E7D32" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />

      {/* Sprout buds */}
      <circle cx="118" cy="108" r="5" fill="#A5D6A7" opacity="0.8" />
      <circle cx="140" cy="100" r="4" fill="#C8E6C9" opacity="0.9" />

      {/* Stars / sparkles */}
      {[
        [65, 75], [195, 80], [55, 185], [200, 170], [170, 50],
      ].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx},${cy})`} opacity="0.6">
          <line x1="0" y1="-6" x2="0" y2="6" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="-6" y1="0" x2="6" y2="0" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="-4" y1="-4" x2="4" y2="4" stroke="#A5D6A7" strokeWidth="1" strokeLinecap="round" />
          <line x1="4" y1="-4" x2="-4" y2="4" stroke="#A5D6A7" strokeWidth="1" strokeLinecap="round" />
        </g>
      ))}

      {/* Floating dots */}
      <circle cx="80" cy="110" r="4" fill="#C8E6C9" opacity="0.7" />
      <circle cx="185" cy="140" r="5" fill="#A5D6A7" opacity="0.6" />
      <circle cx="165" cy="195" r="3" fill="#81C784" opacity="0.5" />
    </svg>
  );
}
