'use client';

import { useEffect, useState } from 'react';
import { campaignsApi, Campaign, CampaignStatus, clientsApi, Client } from '@/lib/api';

const statusColors: Record<CampaignStatus, string> = {
  Draft: 'bg-gray-600',
  Active: 'bg-green-600',
  Paused: 'bg-yellow-600',
  Completed: 'bg-blue-600',
  Cancelled: 'bg-red-600',
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
    return <div className="text-white">Loading campaigns...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Campaigns</h2>
        <button
          onClick={startCreate}
          disabled={clients.length === 0}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Add Campaign
        </button>
      </div>

      {clients.length === 0 && (
        <div className="mb-4 p-4 bg-yellow-600/20 border border-yellow-600 rounded-lg text-yellow-400">
          Please add a client first before creating campaigns.
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-neutral-800 p-6 rounded-xl w-full max-w-md border border-neutral-700 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingCampaign ? 'Edit Campaign' : 'Add New Campaign'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-neutral-400 text-sm mb-1">Campaign Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-neutral-400 text-sm mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-400 text-sm mb-1">Type</label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="Email, Social, PPC, Content"
                  className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-400 text-sm mb-1">Client</label>
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                  required
                >
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-neutral-400 text-sm mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as CampaignStatus })}
                  className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                >
                  {Object.values(CampaignStatus).map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-neutral-400 text-sm mb-1">Budget ($)</label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 text-sm mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 text-sm mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {editingCampaign ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Campaigns Table */}
      <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase">Budget</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase">Dates</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700">
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-neutral-700/50">
                <td className="px-6 py-4 text-white">{campaign.name}</td>
                <td className="px-6 py-4 text-neutral-300">{getClientName(campaign.clientId)}</td>
                <td className="px-6 py-4 text-neutral-300">{campaign.type}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded ${statusColors[campaign.status as CampaignStatus] || 'bg-gray-600'} text-white`}>
                    {campaign.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-neutral-300">${campaign.budget.toLocaleString()}</td>
                <td className="px-6 py-4 text-neutral-300 text-sm">
                  {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : '-'} - {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => startEdit(campaign)}
                    className="text-blue-400 hover:text-blue-300 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCampaign(campaign.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {campaigns.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-neutral-400">
                  No campaigns found. Add a client first, then create a campaign!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
