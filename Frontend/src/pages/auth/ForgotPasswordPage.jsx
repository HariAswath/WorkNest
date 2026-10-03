import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import BorderGlow from '../../components/common/BorderGlow';
import { Mail, ArrowLeft, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide your email address.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await authApi.forgotPassword(email.trim());
      setSuccessMessage(res.message || 'Password reset instructions have been sent to your email.');
    } catch (err) {
      setError(err.message || 'Could not send reset email. Please verify your address.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0d0e12] bg-fine-grid text-slate-100 flex flex-col justify-center items-center px-4 py-12 selection:bg-amber-500/30 selection:text-white">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/[0.06] rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navigation / Back to Login */}
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
          {/* Header */}
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
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Forgot password?</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5">No worries, we'll send you recovery instructions</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-emerald-300 text-xs sm:text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
              <div className="flex-1 leading-snug">{successMessage}</div>
            </div>
          )}

          {/* Error Alert */}
          {error && !successMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs sm:text-sm animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1 leading-snug">{error}</div>
            </div>
          )}

          {/* Form */}
          {!successMessage ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2" htmlFor="email">
                  Registered Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Sending reset link...</span>
                    </>
                  ) : (
                    <span>Send Reset Instructions</span>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-[#111216] hover:bg-[#1a1d24] text-white font-semibold text-sm border border-white/10 transition-all"
              >
                Return to Login
              </Link>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-slate-400">
            Remember your password?{' '}
            <Link to="/login" className="text-amber-400 font-semibold hover:text-amber-300 transition-colors">
              Sign in
            </Link>
          </div>
        </BorderGlow>
      </div>
    </div>
  );
}
