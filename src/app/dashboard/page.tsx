'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Key, Activity, ShieldCheck, Clock, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

interface Stats {
  totalRequests: number;
  activeKeys: number;
  successRate: number;
  averageLatency: number;
}

interface ChartPoint {
  date: string;
  requests: number;
  errors: number;
}

interface RecentLog {
  id: string;
  endpoint: string;
  timestamp: string;
  responseTime: number;
  statusCode: number;
  apiKey: {
    name: string;
    keyDisplay: string;
  };
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [recentLogs, setRecentLogs] = useState<RecentLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const analyticsRes = await fetch('/api/analytics');
      if (!analyticsRes.ok) throw new Error('Failed to fetch analytics data');
      const analyticsData = await analyticsRes.json();
      setStats(analyticsData.stats);
      setChartData(analyticsData.chartData);

      const logsRes = await fetch('/api/logs?limit=5');
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setRecentLogs(logsData.logs);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getSvgCoordinates = () => {
    const height = 180;
    const width = 500;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 20;
    const usableWidth = width - paddingLeft - paddingRight;
    const usableHeight = height - paddingTop - paddingBottom;

    if (chartData.length === 0) {
      return {
        linePath: '',
        areaPath: '',
        points: [],
        maxVal: 5,
        height,
        width,
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingBottom,
        usableHeight,
        usableWidth
      };
    }

    const maxVal = Math.max(...chartData.map((d) => d.requests), 5);
    const xStep = usableWidth / (chartData.length - 1);

    const points = chartData.map((d, i) => {
      const x = paddingLeft + i * xStep;
      const y = paddingTop + usableHeight - (d.requests / maxVal) * usableHeight;
      return { x, y, ...d };
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = `
      ${linePath} 
      L ${points[points.length - 1].x} ${height - paddingBottom} 
      L ${points[0].x} ${height - paddingBottom} 
      Z
    `;

    return { linePath, areaPath, points, maxVal, height, width, paddingLeft, paddingRight, paddingTop, paddingBottom, usableHeight, usableWidth };
  };

  const svgData = getSvgCoordinates();

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Overview Dashboard</h2>
          <p className="text-xs text-gray-500 mt-1">Platform-wide statistics and usage tracking for Mani AI.</p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg border border-gray-800 hover:border-gray-700 text-xs font-semibold flex items-center gap-1.5 bg-gray-900/20 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Stats
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-950/20 border border-red-900/40 text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-gray-800/80 hover:border-gray-800 transition-colors">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Keys</span>
            <div className="p-2 rounded-xl bg-[#00f0ff]/5 border border-[#00f0ff]/10 text-[#00f0ff]">
              <Key className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{stats?.activeKeys || 0}</p>
          <span className="text-[10px] text-gray-500 mt-1 block">Keys active in console</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-800/80 hover:border-gray-800 transition-colors">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Requests</span>
            <div className="p-2 rounded-xl bg-[#3b82f6]/5 border border-[#3b82f6]/10 text-[#3b82f6]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{stats?.totalRequests || 0}</p>
          <span className="text-[10px] text-gray-500 mt-1 block">Total API calls recorded</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-800/80 hover:border-gray-800 transition-colors">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Success Rate</span>
            <div className="p-2 rounded-xl bg-green-500/5 border border-green-500/10 text-green-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{stats?.successRate ?? 100}%</p>
          <span className="text-[10px] text-gray-500 mt-1 block">Response code &lt; 400</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-800/80 hover:border-gray-800 transition-colors">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Avg Latency</span>
            <div className="p-2 rounded-xl bg-[#a855f7]/5 border border-[#a855f7]/10 text-[#a855f7]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{stats?.averageLatency || 0}<span className="text-xs text-gray-500 font-medium ml-1">ms</span></p>
          <span className="text-[10px] text-gray-500 mt-1 block">Average response speed</span>
        </div>
      </div>

      {/* Analytics Chart & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Chart Card */}
        <div className="glass-panel lg:col-span-2 p-6 rounded-2xl border border-gray-800/80 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">API Requests Trend</h3>
            <p className="text-xs text-gray-500">Daily API call count over the last 7 days</p>
          </div>

          <div className="my-6 relative flex justify-center">
            {chartData.length === 0 || !svgData.linePath ? (
              <div className="h-44 flex flex-col items-center justify-center text-gray-600">
                <Activity className="w-8 h-8 mb-2" />
                <p className="text-xs font-mono">No API logs recorded yet</p>
              </div>
            ) : (
              <svg viewBox={`0 0 ${svgData.width} ${svgData.height}`} className="w-full max-h-44">
                <defs>
                  <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Y-axis gridlines & labels */}
                {[0, 0.5, 1].map((ratio, idx) => {
                  const yVal = svgData.height - 20 - ratio * svgData.usableHeight;
                  const labelVal = Math.round(ratio * svgData.maxVal);
                  return (
                    <g key={idx}>
                      <line x1={40} y1={yVal} x2={svgData.width - 20} y2={yVal} stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
                      <text x={10} y={yVal + 4} fill="#4b5563" fontSize={10} fontFamily="monospace">{labelVal}</text>
                    </g>
                  );
                })}

                {/* Shaded Area Fill */}
                <path d={svgData.areaPath} fill="url(#chart-gradient)" />

                {/* Colored Line */}
                <path d={svgData.linePath} fill="none" stroke="#00f0ff" strokeWidth={2.5} strokeLinecap="round" />

                {/* Plot dots & tooltips */}
                {svgData.points.map((p, idx) => (
                  <g key={idx} className="group/dot">
                    <circle cx={p.x} cy={p.y} r={4} fill="#030712" stroke="#00f0ff" strokeWidth={2.5} />
                    <circle cx={p.x} cy={p.y} r={8} fill="#00f0ff" className="opacity-0 hover:opacity-20 transition-opacity cursor-pointer" />
                    <g className="opacity-0 group-hover/dot:opacity-100 transition-opacity pointer-events-none">
                      <rect x={p.x - 20} y={p.y - 25} width={40} height={16} rx={4} fill="#090d16" stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
                      <text x={p.x} y={p.y - 14} fill="#fff" fontSize={9} textAnchor="middle" fontFamily="monospace">{p.requests}</text>
                    </g>
                  </g>
                ))}

                {/* X-axis labels */}
                {svgData.points.map((p, idx) => (
                  <text key={idx} x={p.x} y={svgData.height - 4} fill="#4b5563" fontSize={9} textAnchor="middle" fontFamily="sans-serif">
                    {p.date}
                  </text>
                ))}
              </svg>
            )}
          </div>

          <div className="flex items-center gap-4 text-[10px] text-gray-500 font-mono">
            <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-[#00f0ff] rounded-sm" /> Requests</span>
          </div>
        </div>

        {/* Recent Activity List Card */}
        <div className="glass-panel p-6 rounded-2xl border border-gray-800/80 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Recent Activity</h3>
            <p className="text-xs text-gray-500 mb-4">Latest gateway requests</p>
            
            <div className="flex flex-col gap-3">
              {recentLogs.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-600 font-mono border border-dashed border-gray-800 rounded-xl">
                  No activity logged.
                </div>
              ) : (
                recentLogs.map((log) => (
                  <div key={log.id} className="flex justify-between items-center p-2.5 rounded-lg bg-gray-950/30 border border-gray-900/60 hover:border-gray-900 transition-colors">
                    <div>
                      <span className="font-semibold text-xs text-white block truncate max-w-[120px]">{log.endpoint}</span>
                      <span className="text-[10px] text-gray-500 block font-mono">{log.apiKey.name} ({log.apiKey.keyDisplay})</span>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold font-mono ${
                        log.statusCode < 400 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {log.statusCode}
                      </span>
                      <span className="text-[9px] text-gray-500 block mt-0.5 font-mono">{log.responseTime}ms</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link href="/dashboard/logs" className="mt-4 text-xs font-semibold text-[#00f0ff] hover:text-[#3b82f6] transition-colors flex items-center gap-1 self-start">
            View full audit logs <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </>
  );
}
