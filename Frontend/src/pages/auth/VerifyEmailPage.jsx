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
    <div className="relative min-h-screen bg-[#07090e] bg-fine-grid text-slate-100 flex flex-col justify-center items-center px-4 py-12 selection:bg-indigo-500/30 selection:text-white">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <BorderGlow
          borderRadius={24}
          backgroundColor="#0a0e1a"
          glowColor={status === 'error' ? '0 80 60' : '150 80 60'}
          colors={status === 'error' ? ['#f43f5e', '#fb7185', '#fda4af'] : ['#34d399', '#38bdf8', '#818cf8']}
          glowRadius={30}
          className="p-8 sm:p-10 shadow-2xl backdrop-blur-2xl text-center"
        >
          {status === 'verifying' && (
            <div className="py-6">
              <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mx-auto mb-4" />
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
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all"
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
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-all"
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
