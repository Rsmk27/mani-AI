'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

function LoginFields() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'register') {
      setActiveTab('register');
    } else {
      setActiveTab('login');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = activeTab === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = activeTab === 'login' ? { email, password } : { name, email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl border border-gray-800/80 p-8 shadow-2xl relative overflow-hidden">
      {/* Top Tabs */}
      <div className="flex border-b border-gray-800 mb-6">
        <button
          onClick={() => {
            setActiveTab('login');
            setError('');
          }}
          className={`flex-1 pb-3 text-sm font-semibold transition-all ${
            activeTab === 'login'
              ? 'text-[#00f0ff] border-b-2 border-[#00f0ff]'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => {
            setActiveTab('register');
            setError('');
          }}
          className={`flex-1 pb-3 text-sm font-semibold transition-all ${
            activeTab === 'register'
              ? 'text-[#00f0ff] border-b-2 border-[#00f0ff]'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Register
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-950/30 border border-red-900/50 text-xs text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {activeTab === 'register' && (
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-gray-950/50 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#3b82f6] transition-colors"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full bg-gray-950/50 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#3b82f6] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-950/50 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#3b82f6] transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-2.5 rounded-lg bg-gradient-to-r from-[#00f0ff] to-[#3b82f6] hover:opacity-95 text-black font-semibold text-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Please wait...
            </>
          ) : activeTab === 'login' ? (
            <>
              Sign In <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              Create Account <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-600 mt-6 uppercase tracking-wider font-mono">
        <ShieldCheck className="w-3.5 h-3.5 text-gray-700" /> Secure Developer Authentication
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-radial px-6 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#3b82f6]/5 blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-md z-10">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-4 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#00f0ff] to-[#3b82f6] p-[1px] flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#030712] rounded-[8px] flex items-center justify-center font-bold text-white text-base">
                M
              </div>
            </div>
            <span className="font-semibold text-lg text-white">Mani AI</span>
          </Link>
          <h2 className="text-xl font-bold text-white">Developer Platform</h2>
          <p className="text-xs text-gray-500 mt-1">RSMK Technologies Infrastructure</p>
        </div>

        <Suspense fallback={
          <div className="glass-panel rounded-2xl border border-gray-800/80 p-8 shadow-2xl flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#00f0ff]" />
            <p className="text-xs text-gray-500 mt-3 font-mono">Initializing Authentication...</p>
          </div>
        }>
          <LoginFields />
        </Suspense>
      </div>
    </div>
  );
}
