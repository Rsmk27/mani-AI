'use client';

import { useState, useEffect } from 'react';
import { Key, Plus, Trash2, Clipboard, ClipboardCheck, Edit2, Check, X, ToggleLeft, ToggleRight, Loader2, AlertCircle } from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  keyDisplay: string;
  status: string;
  rateLimit: number;
  requestCount: number;
  createdAt: string;
  lastUsed: string | null;
}

export default function KeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal states
  const [showGenModal, setShowGenModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyLimit, setNewKeyLimit] = useState(100);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Edit states
  const [editingKeyId, setEditingKeyId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState('');

  const fetchKeys = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/keys');
      if (!res.ok) throw new Error('Failed to fetch keys');
      const data = await res.json();
      setKeys(data.keys);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Could not load API keys');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName, rateLimit: newKeyLimit }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create key');
      }

      const data = await res.json();
      setKeys([data.apiKey, ...keys]);
      setGeneratedKey(data.apiKey.rawKey);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate key');
    }
  };

  const handleCopy = () => {
    if (!generatedKey) return;
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleStatus = async (key: ApiKey) => {
    const nextStatus = key.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const res = await fetch(`/api/keys/${key.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');
      
      setKeys(keys.map((k) => (k.id === key.id ? { ...k, status: nextStatus } : k)));
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Status toggle failed');
    }
  };

  const handleSaveName = async (id: string) => {
    if (!editNameValue.trim()) return;
    try {
      const res = await fetch(`/api/keys/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editNameValue }),
      });

      if (!res.ok) throw new Error('Failed to update name');
      
      setKeys(keys.map((k) => (k.id === id ? { ...k, name: editNameValue } : k)));
      setEditingKeyId(null);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to update key name');
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to revoke this API key? This action is permanent and any application using this key will immediately fail authorization.')) return;
    try {
      const res = await fetch(`/api/keys/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to revoke key');
      
      setKeys(keys.filter((k) => k.id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to revoke key');
    }
  };

  const closeGenModal = () => {
    setShowGenModal(false);
    setNewKeyName('');
    setNewKeyLimit(100);
    setGeneratedKey(null);
  };

  return (
    <>
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">API Key Management</h2>
          <p className="text-xs text-gray-500 mt-1">Generate new access tokens and manage active credentials for Mani AI routing.</p>
        </div>
        <button
          onClick={() => setShowGenModal(true)}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#00f0ff] to-[#3b82f6] text-black text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-105 shadow-lg shadow-[#00f0ff]/10 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3px]" />
          Create New Key
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-950/20 border border-red-900/40 text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Keys List */}
      <div className="glass-panel rounded-2xl border border-gray-800/80 overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-xs text-gray-500 font-mono flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-[#00f0ff] mr-2" />
            Loading credential records...
          </div>
        ) : keys.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center text-gray-500 p-6">
            <Key className="w-10 h-10 text-gray-700 mb-4" />
            <h4 className="text-sm font-bold text-white mb-1">No API keys generated</h4>
            <p className="text-xs text-gray-500 max-w-sm leading-relaxed mb-6">
              Create a unique API key to start making authorized queries to the Mani AI centralized gateway.
            </p>
            <button
              onClick={() => setShowGenModal(true)}
              className="px-3.5 py-2 rounded-lg border border-gray-850 hover:border-gray-750 bg-gray-900/20 text-xs font-semibold text-white hover:bg-gray-900 transition-colors cursor-pointer"
            >
              Generate your first key
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-900 bg-gray-950/20 text-xs uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-4 font-semibold">Key Details</th>
                  <th className="px-6 py-4 font-semibold">Token Display</th>
                  <th className="px-6 py-4 font-semibold">Rate Limit</th>
                  <th className="px-6 py-4 font-semibold">Total Queries</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Created / Last Used</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900/40 text-xs text-gray-300">
                {keys.map((key) => (
                  <tr key={key.id} className="hover:bg-gray-900/10 transition-colors">
                    <td className="px-6 py-4">
                      {editingKeyId === key.id ? (
                        <div className="flex items-center gap-1.5 max-w-[200px]">
                          <input
                            type="text"
                            value={editNameValue}
                            onChange={(e) => setEditNameValue(e.target.value)}
                            className="bg-gray-950/60 border border-gray-800 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#3b82f6] w-full font-sans"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveName(key.id)}
                            className="p-1 rounded bg-green-500/10 text-green-400 hover:bg-green-500/20 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingKeyId(null)}
                            className="p-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{key.name}</span>
                          <button
                            onClick={() => {
                              setEditingKeyId(key.id);
                              setEditNameValue(key.name);
                            }}
                            className="p-1 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 font-mono text-[11px] text-gray-400">
                      {key.keyDisplay}
                    </td>

                    <td className="px-6 py-4 font-mono text-[11px] text-gray-400">
                      {key.rateLimit} req/day
                    </td>

                    <td className="px-6 py-4 font-mono text-[11px] text-gray-400">
                      {key.requestCount}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(key)}
                        className={`flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                          key.status === 'ACTIVE' ? 'text-green-400' : 'text-gray-500'
                        }`}
                      >
                        {key.status === 'ACTIVE' ? (
                          <>
                            <ToggleRight className="w-6 h-6 text-green-400" />
                            Active
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-6 h-6 text-gray-600" />
                            Disabled
                          </>
                        )}
                      </button>
                    </td>

                    <td className="px-6 py-4 font-mono text-[10px] text-gray-500 space-y-0.5">
                      <div>Created: {new Date(key.createdAt).toLocaleDateString()}</div>
                      <div>
                        Last used:{' '}
                        {key.lastUsed
                          ? new Date(key.lastUsed).toLocaleDateString() + ' ' + new Date(key.lastUsed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : 'Never'}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteKey(key.id)}
                        className="p-2 rounded-lg bg-red-950/10 border border-red-900/20 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal - Generate Key */}
      {showGenModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-lg glass-panel rounded-2xl border border-gray-800/90 shadow-2xl p-6 relative">
            <button
              onClick={closeGenModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!generatedKey ? (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-1">Generate API Key</h3>
                  <p className="text-xs text-gray-500">Create a credentials key to authenticate applications using Mani AI routing.</p>
                </div>

                <form onSubmit={handleGenerateKey} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Key Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Production Application Router"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      className="w-full bg-gray-950/50 border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#3b82f6] transition-colors font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Daily Rate Limit</label>
                    <select
                      value={newKeyLimit}
                      onChange={(e) => setNewKeyLimit(parseInt(e.target.value, 10))}
                      className="w-full bg-gray-950/50 border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#3b82f6] transition-colors font-sans"
                    >
                      <option value={100}>Free Tier (100 req/day)</option>
                      <option value={1000}>Developer Tier (1,000 req/day)</option>
                      <option value={5000}>Production Tier (5,000 req/day)</option>
                      <option value={50000}>Enterprise Tier (50,000 req/day)</option>
                    </select>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      type="button"
                      onClick={closeGenModal}
                      className="flex-1 py-2 px-4 rounded-lg border border-gray-800 hover:bg-gray-900 text-xs font-semibold text-white transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-[#00f0ff] to-[#3b82f6] text-black text-xs font-bold transition-all hover:opacity-95 cursor-pointer"
                    >
                      Generate Key
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-0.5">Key Created Successfully</h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">RSMK Cryptographic System</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-yellow-950/20 border border-yellow-900/30 text-yellow-400 text-xs leading-relaxed mb-6">
                  <strong>Warning:</strong> Copy this API key and store it securely. For security reasons, we do not store the raw key in our database, so <strong>you will not be able to view it again.</strong>
                </div>

                <div className="flex items-center gap-2 p-3 bg-gray-950/60 border border-gray-800 rounded-xl mb-6">
                  <code className="text-xs text-white font-mono flex-1 break-all select-all p-1 block">
                    {generatedKey}
                  </code>
                  <button
                    onClick={handleCopy}
                    className={`p-2 rounded-lg border transition-all cursor-pointer ${
                      copied
                        ? 'bg-green-500/10 border-green-500/30 text-green-400'
                        : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {copied ? <ClipboardCheck className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  onClick={closeGenModal}
                  className="w-full py-2 px-4 rounded-lg bg-gray-900 border border-gray-800 hover:bg-gray-900/70 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  I've saved this key, close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
