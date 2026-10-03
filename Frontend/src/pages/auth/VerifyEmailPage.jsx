import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import BorderGlow from '../../components/common/BorderGlow';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export default function VerifyEmailPage() {
  const { verificationToken } = useParams();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const runVerification = async () => {
      if (!verificationToken) {
        setStatus('error');
        setMessage('Verification token is missing.');
        return;
      }

      try {
        const res = await authApi.verifyEmail(verificationToken);
        setStatus('success');
        setMessage(res.message || 'Your email address has been verified successfully!');
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Token is invalid or has expired.');
      }
    };

    runVerification();
  }, [verificationToken]);

  return (
    <div className="relative min-h-screen bg-[#0d0e12] bg-fine-grid text-slate-100 flex flex-col justify-center items-center px-4 py-12 selection:bg-amber-500/30 selection:text-white">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/[0.06] rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <div className="flex justify-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
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
        </div>

        <BorderGlow
          borderRadius={24}
          backgroundColor="#16181d"
          glowColor={status === 'error' ? '0 80 60' : '45 90 55'}
          colors={status === 'error' ? ['#f43f5e', '#fb7185', '#fda4af'] : ['#f59e0b', '#fbbf24', '#d97706']}
          glowRadius={30}
          className="p-8 sm:p-10 shadow-2xl backdrop-blur-2xl text-center border border-white/5"
        >
          {status === 'verifying' && (
            <div className="py-6">
              <Loader2 className="w-12 h-12 text-amber-400 animate-spin mx-auto mb-4" />
              <h1 className="text-xl font-bold text-white">Verifying your email...</h1>
              <p className="text-sm text-slate-400 mt-2">Please wait while we confirm your credentials.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-black text-white">Email Verified!</h1>
              <p className="text-sm text-slate-300 mt-2 mb-8">{message}</p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
              >
                Continue to Sign in
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="py-4">
              <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-400 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-rose-500/20">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-black text-white">Verification Failed</h1>
              <p className="text-sm text-slate-300 mt-2 mb-8">{message}</p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#111216] hover:bg-[#1a1d24] text-white font-semibold text-sm border border-white/10 transition-all"
              >
                Back to Sign in
              </Link>
            </div>
          )}
        </BorderGlow>
      </div>
    </div>
  );
}
