'use client';

import { useState, useEffect } from 'react';
import { ClipboardList, Filter, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface ApiLog {
  id: string;
  endpoint: string;
  timestamp: string;
  responseTime: number;
  statusCode: number;
  ipAddress: string | null;
  userAgent: string | null;
  errorMessage: string | null;
  apiKey: {
    name: string;
    keyDisplay: string;
  };
}

interface ApiKey {
  id: string;
  name: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  
  // Filter states
  const [filterKeyId, setFilterKeyId] = useState('');
  const [filterStatusCode, setFilterStatusCode] = useState('');
  const [filterEndpoint, setFilterEndpoint] = useState('');

  const fetchKeys = async () => {
    try {
      const res = await fetch('/api/keys');
      if (res.ok) {
        const data = await res.json();
        setKeys(data.keys);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLogs = async (currentPage = page) => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      query.set('page', currentPage.toString());
      query.set('limit', '15');
      if (filterKeyId) query.set('apiKeyId', filterKeyId);
      if (filterStatusCode) query.set('statusCode', filterStatusCode);
      if (filterEndpoint) query.set('endpoint', filterEndpoint);

      const res = await fetch(`/api/logs?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch logs');
      const data = await res.json();
      setLogs(data.logs);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  useEffect(() => {
    fetchLogs(page);
  }, [page, filterKeyId, filterStatusCode, filterEndpoint]);

  const handleResetFilters = () => {
    setFilterKeyId('');
    setFilterStatusCode('');
    setFilterEndpoint('');
    setPage(1);
  };

  return (
    <>
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Audit Request Logs</h2>
        <p className="text-xs text-gray-500 mt-1">Detailed history of all API calls, security events, and latency checks for Mani AI.</p>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-gray-800/80 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
        <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
          <Filter className="w-4 h-4 text-[#00f0ff]" />
          Filter Logs
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto md:flex-1 md:mx-6">
          {/* Key Filter */}
          <select
            value={filterKeyId}
            onChange={(e) => {
              setFilterKeyId(e.target.value);
              setPage(1);
            }}
            className="bg-gray-950/50 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3b82f6]"
          >
            <option value="">All API Keys</option>
            {keys.map((k) => (
              <option key={k.id} value={k.id}>
                {k.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatusCode}
            onChange={(e) => {
              setFilterStatusCode(e.target.value);
              setPage(1);
            }}
            className="bg-gray-950/50 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3b82f6]"
          >
            <option value="">All Statuses</option>
            <option value="200">200 OK (Success)</option>
            <option value="400">400 Bad Request</option>
            <option value="401">401 Unauthorized (Auth fail)</option>
            <option value="403">403 Forbidden (Disabled key)</option>
            <option value="429">429 Rate Limited</option>
            <option value="500">500 Internal Error</option>
          </select>

          {/* Endpoint Filter */}
          <input
            type="text"
            placeholder="Search endpoint..."
            value={filterEndpoint}
            onChange={(e) => {
              setFilterEndpoint(e.target.value);
              setPage(1);
            }}
            className="bg-gray-950/50 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#3b82f6]"
          />
        </div>

        <button
          onClick={handleResetFilters}
          className="text-xs font-semibold text-gray-400 hover:text-white transition-colors underline whitespace-nowrap self-end md:self-center cursor-pointer"
        >
          Reset Filters
        </button>
      </div>

      {/* Logs Table */}
      <div className="glass-panel rounded-2xl border border-gray-800/80 overflow-hidden shadow-xl">
        {loading && logs.length === 0 ? (
          <div className="py-20 text-center text-xs text-gray-500 font-mono flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-[#00f0ff] mr-2" />
            Reading access logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center text-gray-500 p-6">
            <ClipboardList className="w-10 h-10 text-gray-700 mb-4" />
            <h4 className="text-sm font-bold text-white mb-1">No logs found</h4>
            <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
              No API request logs match your current filter settings, or you haven't queried the API yet.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-900 bg-gray-950/20 text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-6 py-4 font-semibold">Timestamp</th>
                    <th className="px-6 py-4 font-semibold">API Key</th>
                    <th className="px-6 py-4 font-semibold">Endpoint</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Latency</th>
                    <th className="px-6 py-4 font-semibold">Network IP</th>
                    <th className="px-6 py-4 font-semibold">User Agent / Error Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-900/40 text-xs text-gray-300">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-900/10 transition-colors">
                      <td className="px-6 py-4 font-mono text-[10px] text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-white block">{log.apiKey.name}</span>
                        <span className="text-[10px] text-gray-500 font-mono">{log.apiKey.keyDisplay}</span>
                      </td>
                      <td className="px-6 py-4 font-mono text-[11px]">
                        {log.endpoint}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          log.statusCode < 300 
                            ? 'bg-green-500/10 text-green-400 border border-green-500/10' 
                            : log.statusCode < 400 
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/10'
                              : 'bg-red-500/10 text-red-400 border border-red-500/10'
                        }`}>
                          {log.statusCode}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-[11px] text-gray-400">
                        {log.responseTime}ms
                      </td>
                      <td className="px-6 py-4 font-mono text-[10px] text-gray-500">
                        {log.ipAddress || '127.0.0.1'}
                      </td>
                      <td className="px-6 py-4 max-w-xs overflow-hidden text-ellipsis">
                        {log.statusCode >= 400 ? (
                          <span className="text-red-400 block font-semibold truncate" title={log.errorMessage || ''}>
                            Err: {log.errorMessage}
                          </span>
                        ) : (
                          <span className="text-gray-500 block truncate" title={log.userAgent || ''}>
                            {log.userAgent}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-900 bg-gray-950/20">
                <span className="text-xs text-gray-500 font-mono">
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    className="p-1.5 rounded-lg border border-gray-800 bg-gray-900/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    className="p-1.5 rounded-lg border border-gray-800 bg-gray-900/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
