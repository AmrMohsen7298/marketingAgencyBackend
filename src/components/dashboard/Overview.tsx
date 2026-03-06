'use client';

import { useEffect, useState } from 'react';
import { clientsApi, leadsApi, campaignsApi } from '@/lib/api';

interface Stats {
  clients: number;
  leads: number;
  campaigns: number;
  activeCampaigns: number;
}

export default function Overview() {
  const [stats, setStats] = useState<Stats>({
    clients: 0,
    leads: 0,
    campaigns: 0,
    activeCampaigns: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [clients, leads, campaigns] = await Promise.all([
          clientsApi.getAll(),
          leadsApi.getAll(),
          campaignsApi.getAll(),
        ]);
        
        const activeCampaigns = campaigns.filter((c: any) => c.status === 'Active').length;
        
        setStats({
          clients: clients.length,
          leads: leads.length,
          campaigns: campaigns.length,
          activeCampaigns,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, []);

  const statCards = [
    { 
      label: 'Total Clients', 
      value: stats.clients, 
      icon: '👥', 
      color: 'from-blue-500 to-blue-600',
      bgGlow: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    { 
      label: 'Total Leads', 
      value: stats.leads, 
      icon: '🎯', 
      color: 'from-green-500 to-green-600',
      bgGlow: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    { 
      label: 'Total Campaigns', 
      value: stats.campaigns, 
      icon: '📢', 
      color: 'from-purple-500 to-purple-600',
      bgGlow: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    { 
      label: 'Active Campaigns', 
      value: stats.activeCampaigns, 
      icon: '⚡', 
      color: 'from-orange-500 to-orange-600',
      bgGlow: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400">Loading stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-slide-in">
        <h2 className="text-3xl font-bold text-white">Dashboard Overview</h2>
        <p className="text-zinc-400 mt-1">Welcome back! Here&apos;s what&apos;s happening with your marketing.</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className={`relative bg-[#1a1a1a] rounded-2xl p-6 border ${stat.borderColor} card-hover overflow-hidden`}
          >
            {/* Glow effect */}
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bgGlow} rounded-full blur-2xl -translate-y-1/2 translate-x-1/2`} />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
              </div>
              <p className="text-4xl font-bold text-white">{stat.value}</p>
              <p className="text-zinc-500 text-sm mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a] animate-fade-in" style={{ animationDelay: '200ms' }}>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>🚀</span>
            Quick Actions
          </h3>
          <div className="space-y-3">
            <a
              href="/dashboard/clients"
              className="group flex items-center gap-4 p-4 bg-[#252525] rounded-xl hover:bg-[#2a2a2a] transition-all duration-200"
            >
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                <span className="text-xl">👥</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Manage Clients</p>
                <p className="text-zinc-500 text-sm">Add, edit, or view client details</p>
              </div>
              <svg className="w-5 h-5 text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="/dashboard/leads"
              className="group flex items-center gap-4 p-4 bg-[#252525] rounded-xl hover:bg-[#2a2a2a] transition-all duration-200"
            >
              <div className="p-2 rounded-lg bg-green-500/20 text-green-400 group-hover:scale-110 transition-transform">
                <span className="text-xl">🎯</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Track Leads</p>
                <p className="text-zinc-500 text-sm">Monitor and convert leads</p>
              </div>
              <svg className="w-5 h-5 text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="/dashboard/campaigns"
              className="group flex items-center gap-4 p-4 bg-[#252525] rounded-xl hover:bg-[#2a2a2a] transition-all duration-200"
            >
              <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                <span className="text-xl">📢</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Launch Campaigns</p>
                <p className="text-zinc-500 text-sm">Create and manage marketing campaigns</p>
              </div>
              <svg className="w-5 h-5 text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* API Status */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a] animate-fade-in" style={{ animationDelay: '300ms' }}>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>💻</span>
            System Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#252525] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-white">Backend API</span>
              </div>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-medium rounded-lg">Online</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#252525] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-white">Database</span>
              </div>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-medium rounded-lg">Connected</span>
            </div>
            <div className="p-4 bg-[#252525] rounded-xl">
              <p className="text-zinc-500 text-sm mb-1">API Base URL</p>
              <p className="text-zinc-300 font-mono text-sm">http://localhost:5000/api</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
