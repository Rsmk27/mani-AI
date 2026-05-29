'use client';

import { useState, useEffect, useRef } from 'react';
import { Key, Terminal, Code, Play, Send, RefreshCw, Clipboard, ClipboardCheck, MessageSquare, Clock, Cpu, Loader2 } from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  keyDisplay: string;
  status: string;
  // We can let the developer input their raw key if they just generated it,
  // or we can simulate the request by telling the gateway about this key.
  // Wait, since we only store key hashes, the client doesn't know the raw key!
  // BUT to make the sandbox work, we can either:
  // 1. Let them paste a key they copied
  // 2. OR we can add a bypass helper in the sandbox that sends the API key ID to the sandbox endpoint,
  //    or since the gateway route needs the raw key in headers, they can paste their raw key to run!
  // Let's provide a text input for their API Key (or let them paste it), 
  // and explain that they can copy/paste the key they just generated to test it!
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function parseMarkdown(text: string) {
  if (!text) return '';

  // 1. Escape HTML
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 2. Code blocks: ```language ... ```
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre class="bg-gray-950 p-3 rounded-lg border border-gray-900 my-2 overflow-x-auto font-mono text-[11px] text-gray-300"><code class="language-${lang}">${code.trim()}</code></pre>`;
  });

  // 3. Inline code: `code`
  html = html.replace(/`([^`\n]+)`/g, '<code class="bg-gray-955 px-1.5 py-0.5 rounded border border-gray-900 font-mono text-[10px] text-[#00f0ff]">$1</code>');

  // 4. Bold: **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-extrabold text-white">$1</strong>');

  // 5. Bullet lists: * item or - item
  html = html.replace(/^(?:[*-]\s+)(.+)$/gm, '<li class="list-disc list-inside ml-2 my-1">$1</li>');

  // 6. Ordered lists: 1. item
  html = html.replace(/^(?:\d+\.\s+)(.+)$/gm, '<li class="list-decimal list-inside ml-2 my-1">$1</li>');

  // 7. Line breaks: \n
  html = html.split('\n').map(line => {
    if (line.startsWith('<li') || line.startsWith('<pre') || line.startsWith('<code') || line.startsWith('</pre>') || line.trim() === '') {
      return line;
    }
    return line + '<br/>';
  }).join('\n');

  return html;
}

export default function PlaygroundPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Playground states
  const [rawKeyInput, setRawKeyInput] = useState('');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! Paste your active raw API key above, type a message below, and press send to test authorization and response latency.' },
  ]);
  const [sandboxLoading, setSandboxLoading] = useState(false);
  const [lastLatency, setLastLatency] = useState<number | null>(null);
  const [lastTokens, setLastTokens] = useState<number | null>(null);
  const [lastModel, setLastModel] = useState<string | null>(null);

  // Docs states
  const [activeTab, setActiveTab] = useState<'curl' | 'js' | 'python'>('curl');
  const [copiedCode, setCopiedCode] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchKeys() {
      try {
        const res = await fetch('/api/keys');
        if (res.ok) {
          const data = await res.json();
          setKeys(data.keys);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchKeys();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sandboxLoading]);

  // Handle live API sandbox query
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    if (!rawKeyInput.trim()) {
      alert('Please paste your generated API key (e.g. mani_live_...) in the credentials header input first.');
      return;
    }

    const userMsg = prompt;
    setPrompt('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setSandboxLoading(true);

    const startTime = Date.now();

    try {
      const res = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${rawKeyInput.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mani-reasoning-v1',
          messages: [...messages.filter(m => m.content.substring(0, 5) !== 'Hello').map(m => ({ role: m.role, content: m.content })), { role: 'user', content: userMsg }],
        }),
      });

      const latency = Date.now() - startTime;
      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `❌ Error ${res.status}: ${data.error?.message || 'Gateway Authorization failed.'}`,
          },
        ]);
        setLastLatency(latency);
        setLastTokens(null);
        setLastModel(null);
        return;
      }

      const reply = data.choices[0].message.content;
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      setLastLatency(latency);
      setLastTokens(data.usage.total_tokens);
      setLastModel(data.model);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '❌ Connection error: Could not reach the API gateway.' },
      ]);
    } finally {
      setSandboxLoading(false);
    }
  };

  const getCodeSnippet = () => {
    const keyPlaceholder = rawKeyInput.trim() || 'mani_live_your_actual_api_key_goes_here';
    
    // Attempting to dynamically infer the host url for local cURL/JS scripting
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://api.rsmk.tech';

    switch (activeTab) {
      case 'curl':
        return `curl -X POST "${origin}/api/v1/chat" \\
  -H "Authorization: Bearer ${keyPlaceholder}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "mani-reasoning-v1",
    "messages": [
      { "role": "user", "content": "How does Mani AI routing work?" }
    ]
  }'`;
      case 'js':
        return `const response = await fetch('${origin}/api/v1/chat', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${keyPlaceholder}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'mani-reasoning-v1',
    messages: [
      { role: 'user', content: 'How does Mani AI routing work?' }
    ]
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);`;
      case 'python':
        return `import requests

url = "${origin}/api/v1/chat"
headers = {
    "Authorization": "Bearer ${keyPlaceholder}",
    "Content-Type": "application/json"
}
payload = {
    "model": "mani-reasoning-v1",
    "messages": [
        { "role": "user", "content": "How does Mani AI routing work?" }
    ]
}

response = requests.post(url, headers=headers, json=payload)
data = response.json()
print(data["choices"][0]["message"]["content"])`;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      { role: 'assistant', content: 'Chat history cleared. Paste your raw key and type a prompt below.' }
    ]);
    setLastLatency(null);
    setLastTokens(null);
    setLastModel(null);
  };

  return (
    <>
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Playground & Integration Docs</h2>
        <p className="text-xs text-gray-500 mt-1">Review endpoint parameters, copy integration templates, and test API credentials in real time.</p>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: API Documentation & Snippets (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Endpoint definition card */}
          <div className="glass-panel p-5 rounded-2xl border border-gray-800/80">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-[#00f0ff]" /> API Endpoint details
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-gray-500 font-mono block uppercase">Endpoint URL</span>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 font-bold font-mono text-[10px]">POST</span>
                  <code className="text-xs text-white font-mono break-all bg-gray-950/40 p-1 px-2 rounded border border-gray-900">/api/v1/chat</code>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-gray-500 font-mono block uppercase">Header Authentication</span>
                <code className="text-[11px] text-gray-400 font-mono block mt-1.5 p-2 bg-gray-950/40 border border-gray-900 rounded">
                  Authorization: Bearer mani_live_...
                </code>
              </div>
            </div>
          </div>

          {/* Code Snippets Card */}
          <div className="glass-panel p-5 rounded-2xl border border-gray-800/80 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-[#3b82f6]" /> Integration Code Snippets
                </h3>
                <button
                  onClick={handleCopyCode}
                  className={`p-1.5 rounded-lg border text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                    copiedCode
                      ? 'bg-green-500/10 border-green-500/30 text-green-400'
                      : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {copiedCode ? (
                    <>
                      <ClipboardCheck className="w-3.5 h-3.5" /> Copied
                    </>
                  ) : (
                    <>
                      <Clipboard className="w-3.5 h-3.5" /> Copy Code
                    </>
                  )}
                </button>
              </div>

              {/* Tabs selectors */}
              <div className="flex border-b border-gray-900 mb-4 text-xs">
                {['curl', 'js', 'python'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`pb-2 px-3 font-semibold transition-all cursor-pointer ${
                      activeTab === tab
                        ? 'text-[#00f0ff] border-b-2 border-[#00f0ff]'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {tab === 'curl' ? 'cURL' : tab === 'js' ? 'NodeJS' : 'Python'}
                  </button>
                ))}
              </div>

              {/* Snippet Code block */}
              <pre className="p-4 bg-[#090d16] border border-gray-900 rounded-xl overflow-x-auto font-mono text-[11px] text-gray-300 leading-relaxed max-h-[220px]">
                {getCodeSnippet()}
              </pre>
            </div>

            <p className="text-[10px] text-gray-600 mt-4 leading-relaxed">
              * Note: The code snippet automatically updates when you paste your API key in the credentials field on the right.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Sandbox Playground (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl border border-gray-800/80 flex flex-col justify-between shadow-2xl relative overflow-hidden min-h-[450px]">
          {/* Header */}
          <div className="p-4 border-b border-gray-900 bg-gray-950/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#a855f7]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Live API Sandbox</h3>
            </div>
            
            <button
              onClick={handleClearChat}
              className="text-[10px] font-semibold text-gray-500 hover:text-white cursor-pointer"
            >
              Clear Conversation
            </button>
          </div>

          {/* Sandbox API Key Paste field */}
          <div className="p-4 border-b border-gray-900 bg-gray-950/40">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">
              X-Gateway-Authorization Credentials Header
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Paste your raw API key here (e.g. mani_live_...)"
                value={rawKeyInput}
                onChange={(e) => setRawKeyInput(e.target.value)}
                className="w-full bg-gray-950/70 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00f0ff] font-mono"
              />
            </div>
          </div>

          {/* Sandbox conversation area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[300px]">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-gradient-to-tr from-[#3b82f6] to-[#00f0ff] text-black font-medium'
                      : m.content.substring(0, 7) === '❌ Error'
                        ? 'bg-red-950/20 border border-red-900/40 text-red-300'
                        : 'bg-gray-900 border border-gray-800 text-gray-300'
                  }`}
                >
                  {m.role === 'user' ? (
                    <p className="whitespace-pre-line">{m.content}</p>
                  ) : (
                    <div 
                      className="space-y-1.5 break-words"
                      dangerouslySetInnerHTML={{ __html: parseMarkdown(m.content) }}
                    />
                  )}
                </div>
              </div>
            ))}
            
            {sandboxLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl px-4 py-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Sandbox Metrics footer bar (shows on prompt answer) */}
          {(lastLatency !== null || lastTokens !== null) && (
            <div className="px-4 py-2 bg-gray-950/40 border-t border-gray-900 flex flex-wrap items-center gap-4 text-[10px] font-mono text-gray-500">
              {lastLatency !== null && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#00f0ff]" /> Latency: <strong className="text-white">{lastLatency}ms</strong>
                </span>
              )}
              {lastTokens !== null && (
                <span className="flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-[#3b82f6]" /> Total Tokens: <strong className="text-white">{lastTokens}</strong>
                </span>
              )}
              {lastModel !== null && (
                <span className="flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5 text-[#a855f7]" /> Model: <strong className="text-white">{lastModel}</strong>
                </span>
              )}
            </div>
          )}

          {/* Sandbox Input Form */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-900 bg-gray-950/20 flex gap-2">
            <input
              type="text"
              placeholder="Ask Mani AI something..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={sandboxLoading}
              className="flex-1 bg-gray-950/60 border border-gray-800 rounded-lg px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={sandboxLoading || !prompt.trim()}
              className="p-2.5 rounded-lg bg-gradient-to-r from-[#00f0ff] to-[#3b82f6] text-black hover:opacity-95 transition-all disabled:opacity-30 cursor-pointer flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
