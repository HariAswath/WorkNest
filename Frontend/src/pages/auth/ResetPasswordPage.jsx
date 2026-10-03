import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import BorderGlow from '../../components/common/BorderGlow';
import { Eye, EyeOff, ArrowLeft, Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const { resetToken } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await authApi.resetPassword(resetToken, password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Token is invalid or has expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0d0e12] bg-fine-grid text-slate-100 flex flex-col justify-center items-center px-4 py-12 selection:bg-amber-500/30 selection:text-white">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/[0.06] rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navigation */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between z-10">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Sign in
        </Link>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md z-10">
        <BorderGlow
          borderRadius={24}
          backgroundColor="#16181d"
          glowColor="45 90 55"
          colors={['#f59e0b', '#fbbf24', '#d97706']}
          glowRadius={30}
          className="p-8 sm:p-10 shadow-2xl backdrop-blur-2xl border border-white/5"
        >
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-[#111216] border border-white/10 flex items-center justify-center p-1 shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
                <img
                  src="/logo.png"
                  alt="WorkNest Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-white">WorkNest</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              </div>
            </Link>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Set new password</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5">Must be at least 6 characters long</p>
          </div>

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-emerald-300 text-xs sm:text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
              <div className="flex-1">
                <div className="font-bold">Password Reset Successful!</div>
                <div className="mt-1 text-slate-300">Redirecting to login...</div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs sm:text-sm animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1 leading-snug">{error}</div>
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2" htmlFor="newPassword">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Updating password...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </BorderGlow>
      </div>
    </div>
  );
}
