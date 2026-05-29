import Link from 'next/link';
import { Shield, Cpu, Activity, ArrowRight, Code } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-gradient-radial">
      {/* Background glowing blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#3b82f6]/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-[#a855f7]/5 blur-[100px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00f0ff] via-[#3b82f6] to-[#a855f7] p-[1px] flex items-center justify-center shadow-lg shadow-[#00f0ff]/10">
            <div className="w-full h-full bg-[#030712] rounded-[11px] flex items-center justify-center font-bold text-lg text-white">
              M
            </div>
          </div>
          <div>
            <h1 className="font-semibold text-lg tracking-tight text-white flex items-center gap-1.5">
              Mani AI <span className="text-xs px-2 py-0.5 rounded-full bg-[#3b82f6]/20 text-[#00f0ff] border border-[#3b82f6]/30 font-medium">Gateway</span>
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">RSMK Technologies</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/login?tab=register" className="relative group px-4 py-2 rounded-lg bg-gradient-to-r from-[#00f0ff] via-[#3b82f6] to-[#a855f7] p-[1px] text-xs font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0">
            <span className="absolute inset-0 bg-[#030712] rounded-[7px] group-hover:opacity-0 transition-opacity" />
            <span className="relative z-10 flex items-center gap-1">Get API Access <ArrowRight className="w-3.5 h-3.5" /></span>
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 flex flex-col items-center justify-center text-center z-10">
        <div className="mb-6 px-3 py-1 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-xs text-[#00f0ff] font-mono tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
          Mani AI API Infrastructure - Production Ready
        </div>
        
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
          The Centralized <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#3b82f6] to-[#a855f7]">Intelligence Router</span>
        </h2>
        
        <p className="text-base md:text-lg text-gray-400 max-w-2xl mb-10 leading-relaxed">
          Secure, generate, and monitor developer credentials for Mani AI. Route requests to advanced LLMs, configure strict rate limits, and track latency analytics in real-time.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <Link href="/login" className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#00f0ff] to-[#3b82f6] text-sm font-semibold text-black hover:opacity-95 shadow-xl transition-all hover:scale-105">
            Launch Developer Console
          </Link>
          <a href="#code" className="px-6 py-3 rounded-lg bg-gray-900/60 border border-gray-800 text-sm font-semibold text-white hover:bg-gray-900 transition-all flex items-center gap-2">
            <Code className="w-4 h-4 text-[#00f0ff]" /> View API Integration
          </a>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="glass-panel p-6 rounded-2xl border border-gray-800/80 hover:border-[#00f0ff]/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/20 flex items-center justify-center mb-4 text-[#00f0ff]">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00f0ff] transition-colors">SHA-256 Hashed Keys</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              We never store raw API keys. Treat credentials like passwords using standard cryptographic hash validation.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-gray-800/80 hover:border-[#3b82f6]/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center mb-4 text-[#3b82f6]">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#3b82f6] transition-colors">Simulated Chat Gateway</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Query our OpenAPI-compatible `/api/v1/chat` endpoint and receive rich JSON responses in milliseconds.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-gray-800/80 hover:border-[#a855f7]/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-[#a855f7]/10 border border-[#a855f7]/20 flex items-center justify-center mb-4 text-[#a855f7]">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#a855f7] transition-colors">Real-Time Analytics</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Analyze request rates, error codes, and response times. Check active statuses and logs instantly.
            </p>
          </div>
        </div>

        {/* Integration Preview Code Block */}
        <div id="code" className="w-full max-w-3xl mt-20 text-left">
          <div className="flex items-center justify-between px-4 py-3 bg-[#0d1117] border border-gray-800 rounded-t-xl">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="text-xs text-gray-500 font-mono ml-2">curl-request.sh</span>
            </div>
            <span className="text-[10px] text-[#00f0ff] font-mono uppercase tracking-widest">GETWAY</span>
          </div>
          <pre className="p-6 bg-[#090d16] border-x border-b border-gray-800 rounded-b-xl overflow-x-auto font-mono text-sm text-gray-300">
{`curl -X POST https://api.rsmk.tech/api/v1/chat \\
  -H "Authorization: Bearer mani_live_4a1c5d9e..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "mani-reasoning-v1",
    "messages": [
      { "role": "user", "content": "How does Mani AI routing work?" }
    ]
  }'`}
          </pre>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-gray-900/50 mt-16 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 z-10">
        <p>© 2026 RSMK Technologies. All rights reserved.</p>
        <p className="font-mono text-gray-600">v1.0.0 (Production / Next.js 16)</p>
      </footer>
    </div>
  );
}
