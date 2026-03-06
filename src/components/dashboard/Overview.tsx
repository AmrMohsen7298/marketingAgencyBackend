'use client';

import { useEffect, useState } from 'react';
import { clientsApi, leadsApi, campaignsApi } from '@/lib/api';

export default function Overview() {
  const [stats, setStats] = useState({
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
    { label: 'Total Clients', value: stats.clients, icon: '👥', color: 'bg-blue-600' },
    { label: 'Total Leads', value: stats.leads, icon: '🎯', color: 'bg-green-600' },
    { label: 'Total Campaigns', value: stats.campaigns, icon: '📢', color: 'bg-purple-600' },
    { label: 'Active Campaigns', value: stats.activeCampaigns, icon: '⚡', color: 'bg-orange-600' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-lg">Loading stats...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`${stat.color} p-3 rounded-lg text-2xl`}>
                {stat.icon}
              </span>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-neutral-400 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a
              href="/dashboard/clients"
              className="block p-4 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition-colors"
            >
              <p className="text-white font-medium">Manage Clients</p>
              <p className="text-neutral-400 text-sm">Add, edit, or view client details</p>
            </a>
            <a
              href="/dashboard/leads"
              className="block p-4 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition-colors"
            >
              <p className="text-white font-medium">Track Leads</p>
              <p className="text-neutral-400 text-sm">Monitor and convert leads</p>
            </a>
            <a
              href="/dashboard/campaigns"
              className="block p-4 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition-colors"
            >
              <p className="text-white font-medium">Launch Campaigns</p>
              <p className="text-neutral-400 text-sm">Create and manage marketing campaigns</p>
            </a>
          </div>
        </div>

        <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
          <h3 className="text-lg font-semibold text-white mb-4">API Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-neutral-700 rounded-lg">
              <span className="text-white">Backend API</span>
              <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">Online</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-700 rounded-lg">
              <span className="text-white">Database</span>
              <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">Connected</span>
            </div>
            <div className="p-3 bg-neutral-700 rounded-lg">
              <p className="text-neutral-400 text-sm">API Base URL</p>
              <p className="text-white font-mono text-sm">http://localhost:5000/api</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
