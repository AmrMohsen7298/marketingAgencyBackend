'use client';

import { useEffect, useState } from 'react';
import { clientsApi, Client } from '@/lib/api';

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    industry: '',
  });

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      const data = await clientsApi.getAll();
      setClients(data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingClient) {
      updateClient(editingClient.id, formData);
    } else {
      createClient(formData);
    }
  }

  async function createClient(data: typeof formData) {
    try {
      await clientsApi.create(data);
      setShowForm(false);
      setFormData({ name: '', email: '', phone: '', company: '', industry: '' });
      fetchClients();
    } catch (error) {
      console.error('Failed to create client:', error);
    }
  }

  async function updateClient(id: number, data: typeof formData) {
    try {
      await clientsApi.update(id, data);
      setShowForm(false);
      setEditingClient(null);
      setFormData({ name: '', email: '', phone: '', company: '', industry: '' });
      fetchClients();
    } catch (error) {
      console.error('Failed to update client:', error);
    }
  }

  async function deleteClient(id: number) {
    if (!confirm('Are you sure you want to delete this client?')) return;
    try {
      await clientsApi.delete(id);
      fetchClients();
    } catch (error) {
      console.error('Failed to delete client:', error);
    }
  }

  function startEdit(client: Client) {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
      industry: client.industry,
    });
    setShowForm(true);
  }

  function startCreate() {
    setEditingClient(null);
    setFormData({ name: '', email: '', phone: '', company: '', industry: '' });
    setShowForm(true);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400">Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center animate-slide-in">
        <div>
          <h2 className="text-3xl font-bold text-white">Clients</h2>
          <p className="text-zinc-400 mt-1">Manage your client relationships</p>
        </div>
        <button
          onClick={startCreate}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg shadow-blue-600/20 btn-press"
        >
          + Add Client
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-[#1a1a1a] p-8 rounded-2xl w-full max-w-md border border-[#2a2a2a] shadow-2xl animate-scale-in">
            <h3 className="text-xl font-bold text-white mb-6">
              {editingClient ? 'Edit Client' : 'Add New Client'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#252525] text-white rounded-xl border border-[#3a3a3a focus:border-blue-500 focus:outline-none input-focus"
                  required
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#252525] text-white rounded-xl border border-[#3a3a3a] focus:border-blue-500 focus:outline-none input-focus"
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
                  className="w-full px-4 py-3 bg-[#252525] text-white rounded-xl border border-[#3a3a3a] focus:border-blue-500 focus:outline-none input-focus"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 bg-[#252525] text-white rounded-xl border border-[#3a3a3a] focus:border-blue-500 focus:outline-none input-focus"
                  placeholder="Acme Inc."
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Industry</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-3 bg-[#252525] text-white rounded-xl border border-[#3a3a3a] focus:border-blue-500 focus:outline-none input-focus"
                  placeholder="Technology"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium btn-press"
                >
                  {editingClient ? 'Update' : 'Create'}
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

      {/* Clients Table */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#252525]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Industry</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {clients.map((client) => (
                <tr key={client.id} className="table-row-hover">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white font-medium">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">{client.email}</td>
                  <td className="px-6 py-4 text-zinc-400">{client.company}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-[#252525] text-zinc-300 text-sm rounded-lg">{client.industry}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEdit(client)}
                        className="px-3 py-1.5 text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteClient(client.id)}
                        className="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">👥</span>
                      <p className="text-zinc-400">No clients found</p>
                      <p className="text-zinc-500 text-sm">Add a client to get started!</p>
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
