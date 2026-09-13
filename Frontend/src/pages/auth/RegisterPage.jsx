import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BorderGlow from '../../components/common/BorderGlow';
import { Eye, EyeOff, ArrowLeft, Lock, Mail, User, AlertCircle, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, authError, setAuthError } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'username' ? value.toLowerCase().replace(/\s+/g, '') : value,
    }));
    setLocalError('');
    if (authError) setAuthError(null);
  };

  // Password requirements calculation
  const hasLength = formData.password.length >= 6;
  const hasNumber = /\d/.test(formData.password);
  const hasUpperOrSpecial = /[A-Z!@#$%^&*(),.?":{}|<>]/.test(formData.password);

  const calculateStrength = () => {
    let score = 0;
    if (formData.password.length >= 6) score++;
    if (formData.password.length >= 10) score++;
    if (hasNumber) score++;
    if (hasUpperOrSpecial) score++;
    return score;
  };

  const strength = calculateStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || formData.username.length < 3) {
      setLocalError('Username must be at least 3 characters in lowercase.');
      return;
    }

    if (!formData.email.trim()) {
      setLocalError('Please provide a valid email address.');
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    setLocalError('');
    setSuccessMessage('');

    const res = await register(formData.email.trim(), formData.username.trim(), formData.password);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage(res.message || 'Registration successful! Verification email has been sent.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      setLocalError(res.error || 'Failed to create account. Username or email may already exist.');
    }
  };

  const displayError = localError || authError;

  return (
    <div className="relative min-h-screen bg-[#07090e] bg-fine-grid text-slate-100 flex flex-col justify-center items-center px-4 py-12 selection:bg-indigo-500/30 selection:text-white">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Top Navigation / Back to Home */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to WorkNest
        </Link>
      </div>

      {/* Auth Card with Multi-Color BorderGlow */}
      <div className="w-full max-w-md z-10">
        <BorderGlow
          borderRadius={24}
          backgroundColor="#0a0e1a"
          glowColor="270 85 65"
          colors={['#c084fc', '#818cf8', '#38bdf8']}
          glowRadius={30}
          className="p-8 sm:p-10 shadow-2xl backdrop-blur-2xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center p-1 shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tight text-white">WorkNest</span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Create your account</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5">Start organizing high-velocity team workspaces</p>
          </div>

          {/* Success Notification */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-emerald-300 text-xs sm:text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
              <div className="flex-1">
                <div className="font-bold mb-0.5">Account Created!</div>
                <div className="text-emerald-400/90 leading-snug">{successMessage}</div>
                <div className="text-[11px] text-emerald-500/70 mt-2">Redirecting to login...</div>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {displayError && !successMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs sm:text-sm animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1 leading-snug">{displayError}</div>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="alex_dev"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Lowercase letters, numbers, and underscores (min 3 chars)</p>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 focus:outline-none cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {formData.password && (
                <div className="mt-2.5 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          strength >= step
                            ? strength <= 2
                              ? 'bg-amber-400'
                              : 'bg-emerald-400'
                            : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-indigo-400" />
                      {hasLength ? '✓ 6+ characters' : '• At least 6 characters'}
                    </span>
                    <span>
                      {strength <= 1 && 'Weak'}
                      {strength === 2 && 'Fair'}
                      {strength === 3 && 'Good'}
                      {strength >= 4 && 'Strong'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating workspace account...</span>
                  </>
                ) : (
                  <span>Create WorkNest Account</span>
                )}
              </button>
            </div>
          </form>

          {/* Footer link to Login */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors underline-offset-4 hover:underline">
              Sign in
            </Link>
          </div>
        </BorderGlow>
      </div>
    </div>
  );
}
