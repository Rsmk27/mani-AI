'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Key, ClipboardList, Terminal, LogOut, Menu, X, User, Loader2 } from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error('Error fetching user:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/login');
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'API Keys', href: '/dashboard/keys', icon: Key },
    { name: 'Audit Logs', href: '/dashboard/logs', icon: ClipboardList },
    { name: 'Playground & Docs', href: '/dashboard/playground', icon: Terminal },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#00f0ff] mb-4" />
        <p className="text-xs text-gray-500 font-mono">Loading developer environment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col md:flex-row text-gray-300">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#090d16] border-r border-gray-900/60 p-6 shrink-0 justify-between">
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 px-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00f0ff] to-[#3b82f6] p-[1px] flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#030712] rounded-[7px] flex items-center justify-center font-bold text-white text-sm">
                M
              </div>
            </div>
            <div>
              <span className="font-semibold text-sm text-white block leading-none">Mani AI</span>
              <span className="text-[9px] text-gray-600 uppercase tracking-widest font-mono">Developer Console</span>
            </div>
          </Link>

          {/* Nav List */}
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#00f0ff]/10 to-[#3b82f6]/5 border-l-2 border-[#00f0ff] text-white'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#00f0ff]' : 'text-gray-500'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card */}
        <div className="border-t border-gray-900/60 pt-4 flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00f0ff]/20 to-[#3b82f6]/20 flex items-center justify-center text-white border border-[#3b82f6]/20">
              <User className="w-4 h-4 text-[#00f0ff]" />
            </div>
            <div className="overflow-hidden">
              <span className="font-semibold text-xs text-white block truncate">{user?.name || 'Developer'}</span>
              <span className="text-[10px] text-gray-500 block truncate">{user?.email}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/10 rounded-lg transition-colors w-full text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Top Bar for Mobile */}
      <header className="md:hidden w-full bg-[#090d16] border-b border-gray-900/60 px-6 py-4 flex items-center justify-between z-20">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00f0ff] to-[#3b82f6] p-[1px] flex items-center justify-center">
            <div className="w-full h-full bg-[#030712] rounded-[7px] flex items-center justify-center font-bold text-white text-sm">
              M
            </div>
          </div>
          <span className="font-semibold text-sm text-white">Mani AI</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-400 hover:text-white focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 bottom-0 top-[65px] bg-[#030712] z-50 flex flex-col p-6 border-t border-gray-900 justify-between">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#00f0ff]/10 to-[#3b82f6]/5 border-l-2 border-[#00f0ff] text-white'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#00f0ff]' : 'text-gray-500'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-gray-900 pt-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00f0ff]/20 to-[#3b82f6]/20 flex items-center justify-center text-white border border-[#3b82f6]/20">
                <User className="w-4 h-4 text-[#00f0ff]" />
              </div>
              <div className="overflow-hidden">
                <span className="font-semibold text-xs text-white block truncate">{user?.name}</span>
                <span className="text-[10px] text-gray-500 block truncate">{user?.email}</span>
              </div>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-2 px-4 py-3 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/10 rounded-lg transition-colors w-full text-left"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-10 relative">
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
          {children}
        </div>
      </main>
    </div>
  );
}
