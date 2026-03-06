'use client';

import { useEffect, useState } from 'react';
import { campaignsApi, Campaign, CampaignStatus, clientsApi, Client } from '@/lib/api';

const statusColors: Record<CampaignStatus, { bg: string; text: string; border: string }> = {
  Draft: { bg: 'bg-zinc-500/20', text: 'text-zinc-400', border: 'border-zinc-500/30' },
  Active: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  Paused: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  Completed: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  Cancelled: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
};

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    status: CampaignStatus.Draft,
    budget: 0,
    startDate: '',
    endDate: '',
    clientId: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [campaignsData, clientsData] = await Promise.all([
          campaignsApi.getAll(),
          clientsApi.getAll(),
        ]);
        setCampaigns(campaignsData);
        setClients(clientsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      ...formData,
      budget: Number(formData.budget),
      clientId: Number(formData.clientId),
    };
    if (editingCampaign) {
      updateCampaign(editingCampaign.id, data);
    } else {
      createCampaign(data);
    }
  }

  async function createCampaign(data: typeof formData) {
    try {
      await campaignsApi.create(data);
      setShowForm(false);
      setFormData({
        name: '',
        description: '',
        type: '',
        status: CampaignStatus.Draft,
        budget: 0,
        startDate: '',
        endDate: '',
        clientId: 0,
      });
      const campaignsData = await campaignsApi.getAll();
      setCampaigns(campaignsData);
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  }

  async function updateCampaign(id: number, data: typeof formData) {
    try {
      await campaignsApi.update(id, data);
      setShowForm(false);
      setEditingCampaign(null);
      setFormData({
        name: '',
        description: '',
        type: '',
        status: CampaignStatus.Draft,
        budget: 0,
        startDate: '',
        endDate: '',
        clientId: 0,
      });
      const campaignsData = await campaignsApi.getAll();
      setCampaigns(campaignsData);
    } catch (error) {
      console.error('Failed to update campaign:', error);
    }
  }

  async function deleteCampaign(id: number) {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    try {
      await campaignsApi.delete(id);
      const campaignsData = await campaignsApi.getAll();
      setCampaigns(campaignsData);
    } catch (error) {
      console.error('Failed to delete campaign:', error);
    }
  }

  function startEdit(campaign: Campaign) {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      description: campaign.description,
      type: campaign.type,
      status: campaign.status as CampaignStatus,
      budget: campaign.budget,
      startDate: campaign.startDate ? campaign.startDate.split('T')[0] : '',
      endDate: campaign.endDate ? campaign.endDate.split('T')[0] : '',
      clientId: campaign.clientId,
    });
    setShowForm(true);
  }

  function startCreate() {
    setEditingCampaign(null);
    setFormData({
      name: '',
      description: '',
      type: '',
      status: CampaignStatus.Draft,
      budget: 0,
      startDate: '',
      endDate: '',
      clientId: clients.length > 0 ? clients[0].id : 0,
    });
    setShowForm(true);
  }

  function getClientName(clientId: number) {
    const client = clients.find((c) => c.id === clientId);
    return client?.name || 'Unknown';
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center animate-slide-in">
        <div>
          <h2 className="text-3xl font-bold text-white">Campaigns</h2>
          <p className="text-zinc-400 mt-1">Create and manage your marketing campaigns</p>
        </div>
        <button
          onClick={startCreate}
          disabled={clients.length === 0}
          className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium shadow-lg shadow-purple-600/20 btn-press disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          + Add Campaign
        </button>
      </div>

      {clients.length === 0 && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-yellow-400 flex items-center gap-3 animate-fade-in">
          <span className="text-xl">⚠️</span>
          Please add a client first before creating campaigns.
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-[#1a1a1a] p-8 rounded-2xl w-full max-w-md border border-[#2a2a2a] shadow-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <h3 className="text-xl font-bold text-white mb-6">
              {editingCampaign ? 'Edit Campaign' : 'Add New Campaign'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Campaign Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#252525] text-white rounded-xl border border-[#3a3a3a] focus:border-purple-500 focus:outline-none input-focus"
                  required
                  placeholder="Summer Sale 2024"
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 bg-[#252525] text-white rounded-xl border border-[#3a3a3a] focus:border-purple-500 focus:outline-none input-focus resize-none"
                  placeholder="Campaign description..."
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Type</label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="Email, Social, PPC, Content"
                  className="w-full px-4 py-3 bg-[#252525] text-white rounded-xl border border-[#3a3a3a] focus:border-purple-500 focus:outline-none input-focus"
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Client</label>
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-[#252525] text-white rounded-xl border border-[#3a3a3a] focus:border-purple-500 focus:outline-none input-focus"
                  required
                >
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as CampaignStatus })}
                  className="w-full px-4 py-3 bg-[#252525] text-white rounded-xl border border-[#3a3a3a] focus:border-purple-500 focus:outline-none input-focus"
                >
                  {Object.values(CampaignStatus).map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Budget ($)</label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-[#252525] text-white rounded-xl border border-[#3a3a3a] focus:border-purple-500 focus:outline-none input-focus"
                  placeholder="5000"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-sm mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 bg-[#252525] text-white rounded-xl border border-[#3a3a3a] focus:border-purple-500 focus:outline-none input-focus"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-sm mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-3 bg-[#252525] text-white rounded-xl border border-[#3a3a3a] focus:border-purple-500 focus:outline-none input-focus"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium btn-press"
                >
                  {editingCampaign ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-3 bg-[#252525] text-white rounded-xl hover:bg-[#303030] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Campaigns Table */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#252525]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Budget</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {campaigns.map((campaign) => {
                const statusStyle = statusColors[campaign.status as CampaignStatus] || statusColors.Draft;
                return (
                  <tr key={campaign.id} className="table-row-hover">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white">
                          📢
                        </div>
                        <span className="text-white font-medium">{campaign.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">{getClientName(campaign.clientId)}</td>
                    <td className="px-6 py-4 text-zinc-400">{campaign.type}</td>
                    <td className="px-6 py-4">
                      <span className={`status-badge ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-300 font-medium">${campaign.budget.toLocaleString()}</td>
                    <td className="px-6 py-4 text-zinc-400 text-sm">
                      {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : '-'} - {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEdit(campaign)}
                          className="px-3 py-1.5 text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteCampaign(campaign.id)}
                          className="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {campaigns.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">📢</span>
                      <p className="text-zinc-400">No campaigns found</p>
                      <p className="text-zinc-500 text-sm">Add a client first, then create a campaign!</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
