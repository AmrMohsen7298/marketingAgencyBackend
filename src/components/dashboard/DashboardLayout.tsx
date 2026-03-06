'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: '📊' },
  { href: '/dashboard/clients', label: 'Clients', icon: '👥' },
  { href: '/dashboard/leads', label: 'Leads', icon: '🎯' },
  { href: '/dashboard/campaigns', label: 'Campaigns', icon: '📢' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#171717] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a1a1a] border-r border-[#2a2a2a] flex flex-col fixed h-full">
        {/* Logo Section */}
        <div className="p-6 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg">
              🚀
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Marketing Hub</h1>
              <p className="text-xs text-zinc-500">Dashboard</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/20'
                        : 'text-zinc-400 hover:bg-[#2a2a2a] hover:text-white'
                    }`}
                  >
                    <span className={`text-lg transition-transform duration-200 ${!isActive && 'group-hover:scale-110'}`}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse-slow" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Footer */}
        <div className="p-4 border-t border-[#2a2a2a]">
          <a
            href="http://localhost:5000/swagger"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-zinc-500 hover:text-white hover:bg-[#2a2a2a] transition-all duration-200 group"
          >
            <span className="text-lg">🔗</span>
            <span>API Documentation</span>
            <svg 
              className="ml-auto w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
