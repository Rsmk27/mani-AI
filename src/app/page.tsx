import Link from 'next/link';
import { Shield, Cpu, Activity, ArrowRight, Code, Terminal, Layers, Server, Globe, ExternalLink, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const faqItems = [
    {
      q: "What is Project Mani?",
      a: "Project Mani is the core intelligence layer built by RSMK Technologies. It functions as a centralized gateway routing semantic queries to advanced models like llama-3.3-70b-versatile, incorporating user context and chat history dynamically."
    },
    {
      q: "Who is RSMK Technologies?",
      a: "RSMK Technologies is a systems engineering enterprise focusing on foundational AI systems, low-latency API routers, secure cryptographic identity, and high-fidelity developer tools."
    },
    {
      q: "How secure is the API Key management system?",
      a: "Highly secure. We treat API keys like passwords. They are hashed using SHA-256 prior to database storage. The raw key token (e.g. mani_live_...) is shown to the user exactly once during creation and can never be retrieved again."
    },
    {
      q: "What endpoints are currently active?",
      a: "The production chat router is active at /api/v1/chat. It accepts OpenAI-compatible payloads (model, messages, temperature) and proxies them to the private core model routing cluster after key and rate-limit verification."
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden bg-[#030712] text-gray-300">
      {/* Visual background glows */}
      <div className="absolute top-[10%] left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#00f0ff]/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#3b82f6]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-1/3 w-[600px] h-[600px] rounded-full bg-[#a855f7]/3 blur-[150px] pointer-events-none" />

      {/* Sticky Header Nav */}
      <header className="sticky top-0 w-full bg-[#030712]/80 backdrop-blur-md border-b border-gray-900/60 z-50">
        <div className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00f0ff] via-[#3b82f6] to-[#a855f7] p-[1px] flex items-center justify-center shadow-lg shadow-[#00f0ff]/10">
              <div className="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center font-extrabold text-sm text-white">
                M
              </div>
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5 leading-none">
                Mani AI <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#3b82f6]/20 text-[#00f0ff] border border-[#3b82f6]/30 font-semibold uppercase tracking-wider font-mono">Gateway</span>
              </h1>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono font-bold">RSMK Technologies</span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-gray-400">
            <a href="#rsmk" className="hover:text-white transition-colors">RSMK Vision</a>
            <a href="#mani-core" className="hover:text-white transition-colors">Mani Core</a>
            <a href="#features" className="hover:text-white transition-colors">Gateway Features</a>
            <a href="#developer" className="hover:text-white transition-colors">API Docs</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs font-semibold text-gray-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/login?tab=register" className="relative group px-4 py-2 rounded-lg bg-gradient-to-r from-[#00f0ff] via-[#3b82f6] to-[#a855f7] p-[1px] text-xs font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5">
              <span className="absolute inset-0 bg-[#030712] rounded-[7px] group-hover:opacity-0 transition-opacity" />
              <span className="relative z-10 flex items-center gap-1">Get API Access <ArrowRight className="w-3 h-3" /></span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col gap-24 z-10">
        
        {/* Section 1: Hero */}
        <section className="text-center py-12 flex flex-col items-center justify-center max-w-4xl mx-auto">
          <div className="mb-6 px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/20 text-[10px] text-[#00f0ff] font-mono tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
            Distributed Cognitive Platform
          </div>

          <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
            Centralized Access to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#3b82f6] to-[#a855f7]">Mani AI Core Infrastructure</span>
          </h2>

          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mb-10 leading-relaxed">
            Generate cryptographically secure API keys, manage daily quotas, track request latencies, and route developer queries directly to Project Mani's intelligence router.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/login" className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#00f0ff] to-[#3b82f6] text-xs font-bold text-black hover:opacity-95 shadow-xl transition-transform hover:scale-105">
              Launch Developer Console
            </Link>
            <a href="#developer" className="px-6 py-3 rounded-lg bg-gray-900/60 border border-gray-800 hover:bg-gray-900 text-xs font-semibold text-white transition-colors flex items-center gap-1.5">
              <Code className="w-4 h-4 text-[#00f0ff]" /> API Integration Guide
            </a>
          </div>
        </section>

        {/* Section 2: RSMK Technologies Ethos & Vision */}
        <section id="rsmk" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center scroll-mt-24">
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-bold text-[#3b82f6] uppercase tracking-widest font-mono">Systems Laboratory</div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              RSMK Technologies: Engineering the Foundations
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              At RSMK Technologies, we reject superficial AI wrappers. We construct the core infrastructure, database systems, and low-latency API layers necessary to drive state-of-the-art cognitive products. 
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Our engineering values prioritize data safety, secure authentication, and architectural speed. From optimizing local SQLite engines via modern WASM client drivers, to routing high-throughput queries, RSMK builds for absolute developer trust and scale.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <CheckCircle2 className="w-4 h-4 text-[#00f0ff] shrink-0" /> Zero plain-text credentials
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <CheckCircle2 className="w-4 h-4 text-[#00f0ff] shrink-0" /> Real-time gateway logs
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <CheckCircle2 className="w-4 h-4 text-[#00f0ff] shrink-0" /> High-concurrency routing
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <CheckCircle2 className="w-4 h-4 text-[#00f0ff] shrink-0" /> Adaptive rate limiting
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-gray-800/80 relative overflow-hidden bg-gradient-to-br from-gray-950 to-gray-900/60">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#3b82f6]/10 rounded-full blur-2xl" />
            <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">Engineering Spec</h4>
            <div className="space-y-4 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-gray-900">
                <span className="text-gray-500">Gateway Layer:</span>
                <span className="text-white">Next.js Edge Proxy</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-900">
                <span className="text-gray-500">Security Standard:</span>
                <span className="text-white">HMAC & SHA-256 Hashing</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-900">
                <span className="text-gray-500">Database Engine:</span>
                <span className="text-white">Prisma v7 + SQLite WASM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-900">
                <span className="text-gray-500">Routing Environment:</span>
                <span className="text-white flex items-center gap-1">
                  Secure API Cluster <Server className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Project Mani Core (Live Service Integration) */}
        <section id="mani-core" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center scroll-mt-24">
          <div className="lg:col-span-5 order-last lg:order-first glass-panel p-6 rounded-2xl border border-gray-800/80 bg-gradient-to-tr from-gray-950/90 to-gray-900/60 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#a855f7]/10 rounded-full blur-2xl" />
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-4 h-4 text-[#00f0ff]" />
              <h4 className="text-xs font-mono text-white uppercase tracking-wider">Gateway Processing Pipeline</h4>
            </div>
            
            <div className="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gradient-to-b before:from-[#00f0ff] before:via-[#3b82f6] before:to-[#a855f7]">
              {/* Step 1 */}
              <div className="relative pl-10 flex items-start gap-3 group">
                <div className="absolute left-0 w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00f0ff] to-[#3b82f6] p-[1px] flex items-center justify-center shadow-md shadow-[#00f0ff]/10">
                  <div className="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center font-mono text-[11px] font-bold text-white">
                    1
                  </div>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white font-mono uppercase tracking-wide">Authentication Hashing</h5>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                    Verify incoming headers, hash the bearer API key using cryptographically secure SHA-256, and validate identity.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative pl-10 flex items-start gap-3 group">
                <div className="absolute left-0 w-9 h-9 rounded-xl bg-gradient-to-tr from-[#3b82f6] to-[#a855f7] p-[1px] flex items-center justify-center shadow-md">
                  <div className="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center font-mono text-[11px] font-bold text-white">
                    2
                  </div>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white font-mono uppercase tracking-wide">Rate-Limit Validation</h5>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                    Check daily execution budgets and concurrent usage spikes against key-specific quotas to prevent service abuse.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative pl-10 flex items-start gap-3 group">
                <div className="absolute left-0 w-9 h-9 rounded-xl bg-gradient-to-tr from-[#a855f7] to-[#00f0ff] p-[1px] flex items-center justify-center shadow-md">
                  <div className="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center font-mono text-[11px] font-bold text-white">
                    3
                  </div>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white font-mono uppercase tracking-wide">Context Assembly</h5>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                    Re-construct the user context, history payloads, and dynamic system state for the model router.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative pl-10 flex items-start gap-3 group">
                <div className="absolute left-0 w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00f0ff] to-[#a855f7] p-[1px] flex items-center justify-center shadow-md">
                  <div className="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center font-mono text-[11px] font-bold text-white">
                    4
                  </div>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white font-mono uppercase tracking-wide">Inference & Logging</h5>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                    Generate completions from the underlying LLM engine and asynchronously log response latencies to the audit database.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-bold text-[#a855f7] uppercase tracking-widest font-mono">Centralized Router</div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Project Mani: The Semantic Intelligence Layer
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Project Mani is not a static assistant. It serves as a unified routing node, processing user commands, combining them with rich application states (like `siteContext`), and maintaining a coherent conversational thread (`history`) to output high-fidelity responses.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              When developers invoke the gateway, the system maps their OpenAI-compatible messages structure directly to the Mani Core endpoint payload. It securely handles the transaction, evaluates performance metrics, and logs the query for auditable analytics.
            </p>
          </div>
        </section>

        {/* Section 4: Key Platform Features */}
        <section id="features" className="space-y-12 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="text-xs font-bold text-[#00f0ff] uppercase tracking-widest font-mono">Console Benefits</div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Designed for Secure Operations</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              We provide the tools developers need to scale Mani AI securely across their systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-gray-800/80 hover:border-[#00f0ff]/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/20 flex items-center justify-center text-[#00f0ff] mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Cryptographic Keys</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Tokens are verified by matching secure SHA-256 hashes in our database, defending your credentials against exposure or database leaks.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-gray-800/80 hover:border-[#3b82f6]/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center text-[#3b82f6] mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Adaptive Limits</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Assign daily limits (ranging from 100 to 50,000 requests/day) to individual keys to protect downstream resources.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-gray-800/80 hover:border-[#a855f7]/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#a855f7]/10 border border-[#a855f7]/20 flex items-center justify-center text-[#a855f7] mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Full Audits & Logs</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Every request logs user-agents, network IPs, status codes, and exact gateway latency in milliseconds.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: API Documentation Snippets */}
        <section id="developer" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center scroll-mt-24">
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-bold text-[#00f0ff] uppercase tracking-widest font-mono">Developer Guide</div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Standard Integration Snippet
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Mani AI Gateway is a drop-in replacement for standard model completion clients. Authorize your requests using the standard Bearer header convention:
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-[#00f0ff]/10 text-[#00f0ff] mt-0.5">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-white block">Compatible JSON Schema</span>
                  <p className="text-xs text-gray-500 mt-0.5">Accepts and returns standard choices, message roles, and token counts.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-[#00f0ff]/10 text-[#00f0ff] mt-0.5">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-white block">Proxy Payload Translation</span>
                  <p className="text-xs text-gray-500 mt-0.5">The gateway translates the query, merges contexts, and queries llama-3.3-70b-versatile dynamically.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 bg-[#0d1117] border border-gray-800 rounded-t-xl">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-[10px] text-gray-500 font-mono ml-2">fetch-query.js</span>
              </div>
              <span className="text-[10px] text-[#00f0ff] font-mono uppercase tracking-widest">Gateway</span>
            </div>
            <pre className="p-5 bg-[#090d16] border-x border-b border-gray-800 rounded-b-xl overflow-x-auto font-mono text-xs text-gray-300">
{`const response = await fetch('https://api.rsmk.dev/v1/chat', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer mani_live_f3a7c...',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'mani-reasoning-v1',
    messages: [
      { role: 'user', content: 'What is BudgetBuddy?' }
    ]
  })
});

const result = await response.json();
console.log(result.choices[0].message.content);`}
            </pre>
          </div>
        </section>

        {/* Section 6: FAQ Section */}
        <section id="faq" className="space-y-12 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="text-xs font-bold text-[#a855f7] uppercase tracking-widest font-mono">Support Desk</div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Frequently Asked Questions</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Quick answers regarding credentialing, system design, and platform availability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqItems.map((item, idx) => (
              <div key={idx} className="glass-panel p-5 rounded-2xl border border-gray-800/60 hover:border-gray-800 transition-colors">
                <h4 className="font-bold text-sm text-white mb-2 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#00f0ff] shrink-0" />
                  {item.q}
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed pl-6">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full bg-[#090d16] border-t border-gray-900/60 mt-24">
        <div className="w-full max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#00f0ff] to-[#3b82f6] p-[1px] flex items-center justify-center">
              <div className="w-full h-full bg-[#030712] rounded-[6px] flex items-center justify-center font-black text-xs text-white">
                M
              </div>
            </div>
            <div>
              <span className="font-bold text-white block">Mani AI Gateway</span>
              <span className="text-[10px] text-gray-600 block font-mono">By RSMK Technologies</span>
            </div>
          </div>

          <p className="text-center md:text-left">
            © 2026 RSMK Technologies. All rights reserved. Built with Next.js 16 and Prisma 7.
          </p>

          <div className="flex gap-4 font-mono text-[10px]">
            <span className="text-gray-600 flex items-center gap-1">
              Systems Online <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
