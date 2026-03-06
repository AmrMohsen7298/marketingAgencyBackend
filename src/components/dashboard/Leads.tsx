'use client';

import { useEffect, useState } from 'react';
import { leadsApi, Lead, LeadStatus } from '@/lib/api';

const statusColors: Record<LeadStatus, { bg: string; text: string; border: string }> = {
  New: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  Contacted: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  Qualified: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  Proposal: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
  Negotiation: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  Won: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  Lost: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
};

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    status: LeadStatus.New,
    source: '',
    notes: '',
    campaignId: undefined as number | undefined,
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      const data = await leadsApi.getAll();
      setLeads(data);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingLead) {
      updateLead(editingLead.id, formData);
    } else {
      createLead(formData);
    }
  }

  async function createLead(data: typeof formData) {
    try {
      await leadsApi.create(data);
      setShowForm(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        status: LeadStatus.New,
        source: '',
        notes: '',
        campaignId: undefined,
      });
      fetchLeads();
    } catch (error) {
      console.error('Failed to create lead:', error);
    }
  }

  async function updateLead(id: number, data: typeof formData) {
    try {
      await leadsApi.update(id, data);
      setShowForm(false);
      setEditingLead(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        status: LeadStatus.New,
        source: '',
        notes: '',
        campaignId: undefined,
      });
      fetchLeads();
    } catch (error) {
      console.error('Failed to update lead:', error);
    }
  }

  async function deleteLead(id: number) {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      await leadsApi.delete(id);
      fetchLeads();
    } catch (error) {
      console.error('Failed to delete lead:', error);
    }
  }

  function startEdit(lead: Lead) {
    setEditingLead(lead);
    setFormData({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      status: lead.status as LeadStatus,
      source: lead.source,
      notes: lead.notes,
      campaignId: lead.campaignId,
    });
    setShowForm(true);
  }

  function startCreate() {
    setEditingLead(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      status: LeadStatus.New,
      source: '',
      notes: '',
      campaignId: undefined,
    });
    setShowForm(true);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center animate-slide-in">
        <div>
          <h2 className="text-3xl font-bold text-white">Leads</h2>
          <p className="text-zinc-400 mt-1">Track and manage your sales leads</p>
        </div>
        <button
          onClick={startCreate}
          className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg shadow-green-600/20 btn-press"
        >
          + Add Lead
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-[#1a1a1a] p-8 rounded-2xl w-full max-w-md border border-[#2a2a2a] shadow-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <h3 className="text-xl font-bold text-white mb-6">
              {editingLead ? 'Edit Lead' : 'Add New Lead'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-sm mb-2">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 bg-[#252525] text-white rounded-xl border border-[#3a3a3a] focus:border-green-500 focus:outline-none input-focus"
                    required
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-sm mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 bg-[#252525] text-white rounded-xl border border-[#3a3a3a] focus:border-green-500 focus:outline-none input-focus"
                    required
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#252525] text-white rounded-xl border border-[#3a3a3a] focus:border-green-500 focus:outline-none input-focus"
                  required
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-[#252525] text-white rounded-xl border border-[#3a3a3a] focus:border-green-500 focus:outline-none input-focus"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 bg-[#252525] text-white rounded-xl border border-[#3a3a3a] focus:border-green-500 focus:outline-none input-focus"
                  placeholder="Acme Inc."
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStatus })}
                  className="w-full px-4 py-3 bg-[#252525] text-white rounded-xl border border-[#3a3a3a] focus:border-green-500 focus:outline-none input-focus"
                >
                  {Object.values(LeadStatus).map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Source</label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  placeholder="Website, Social, Referral, etc."
                  className="w-full px-4 py-3 bg-[#252525] text-white rounded-xl border border-[#3a3a3a] focus:border-green-500 focus:outline-none input-focus"
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#252525] text-white rounded-xl border border-[#3a3a3a] focus:border-green-500 focus:outline-none input-focus resize-none"
                  placeholder="Additional notes..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium btn-press"
                >
                  {editingLead ? 'Update' : 'Create'}
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

      {/* Leads Table */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#252525]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Source</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {leads.map((lead) => {
                const statusStyle = statusColors[lead.status as LeadStatus] || statusColors.New;
                return (
                  <tr key={lead.id} className="table-row-hover">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-medium">
                          {lead.firstName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-medium">{lead.firstName} {lead.lastName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">{lead.email}</td>
                    <td className="px-6 py-4 text-zinc-400">{lead.company}</td>
                    <td className="px-6 py-4">
                      <span className={`status-badge ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">{lead.source}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEdit(lead)}
                          className="px-3 py-1.5 text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteLead(lead.id)}
                          className="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">🎯</span>
                      <p className="text-zinc-400">No leads found</p>
                      <p className="text-zinc-500 text-sm">Add a lead to get started!</p>
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
