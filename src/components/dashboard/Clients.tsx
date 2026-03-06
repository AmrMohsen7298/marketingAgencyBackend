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
    return <div className="text-white">Loading clients...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Clients</h2>
        <button
          onClick={startCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Client
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-neutral-800 p-6 rounded-xl w-full max-w-md border border-neutral-700">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingClient ? 'Edit Client' : 'Add New Client'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-neutral-400 text-sm mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                  required
                />
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
                <label className="block text-neutral-400 text-sm mb-1">Industry</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingClient ? 'Update' : 'Create'}
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

      {/* Clients Table */}
      <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase">Industry</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-neutral-700/50">
                <td className="px-6 py-4 text-white">{client.name}</td>
                <td className="px-6 py-4 text-neutral-300">{client.email}</td>
                <td className="px-6 py-4 text-neutral-300">{client.company}</td>
                <td className="px-6 py-4 text-neutral-300">{client.industry}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => startEdit(client)}
                    className="text-blue-400 hover:text-blue-300 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteClient(client.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-neutral-400">
                  No clients found. Add one to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
