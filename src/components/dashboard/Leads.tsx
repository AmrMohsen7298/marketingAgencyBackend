'use client';

import { useEffect, useState } from 'react';
import { leadsApi, Lead, LeadStatus } from '@/lib/api';

const statusColors: Record<LeadStatus, string> = {
  New: 'bg-blue-600',
  Contacted: 'bg-yellow-600',
  Qualified: 'bg-purple-600',
  Proposal: 'bg-orange-600',
  Negotiation: 'bg-cyan-600',
  Won: 'bg-green-600',
  Lost: 'bg-red-600',
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
    return <div className="text-white">Loading leads...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Leads</h2>
        <button
          onClick={startCreate}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          + Add Lead
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-neutral-800 p-6 rounded-xl w-full max-w-md border border-neutral-700 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingLead ? 'Edit Lead' : 'Add New Lead'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 text-sm mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 text-sm mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-neutral-400 text-sm mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-neutral-400 text-sm mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-400 text-sm mb-1">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-400 text-sm mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStatus })}
                  className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                >
                  {Object.values(LeadStatus).map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-neutral-400 text-sm mb-1">Source</label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  placeholder="Website, Social, Referral, etc."
                  className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-400 text-sm mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {editingLead ? 'Update' : 'Create'}
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

      {/* Leads Table */}
      <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase">Source</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-neutral-700/50">
                <td className="px-6 py-4 text-white">
                  {lead.firstName} {lead.lastName}
                </td>
                <td className="px-6 py-4 text-neutral-300">{lead.email}</td>
                <td className="px-6 py-4 text-neutral-300">{lead.company}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded ${statusColors[lead.status as LeadStatus] || 'bg-gray-600'} text-white`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-neutral-300">{lead.source}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => startEdit(lead)}
                    className="text-blue-400 hover:text-blue-300 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteLead(lead.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-neutral-400">
                  No leads found. Add one to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
