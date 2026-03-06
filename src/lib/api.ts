const API_BASE = 'http://localhost:5000/api';

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  status: LeadStatus;
  source: string;
  notes: string;
  campaignId?: number;
  createdAt: string;
  updatedAt: string;
}

export enum LeadStatus {
  New = 'New',
  Contacted = 'Contacted',
  Qualified = 'Qualified',
  Proposal = 'Proposal',
  Negotiation = 'Negotiation',
  Won = 'Won',
  Lost = 'Lost'
}

export interface Campaign {
  id: number;
  name: string;
  description: string;
  type: string;
  status: CampaignStatus;
  budget: number;
  startDate: string;
  endDate: string;
  clientId: number;
  createdAt: string;
  updatedAt: string;
}

export enum CampaignStatus {
  Draft = 'Draft',
  Active = 'Active',
  Paused = 'Paused',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Clients API
export const clientsApi = {
  getAll: () => fetchApi<Client[]>('/clients'),
  getById: (id: number) => fetchApi<Client>(`/clients/${id}`),
  create: (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) =>
    fetchApi<Client>('/clients', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Client>) =>
    fetchApi<Client>(`/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchApi<void>(`/clients/${id}`, { method: 'DELETE' }),
};

// Leads API
export const leadsApi = {
  getAll: () => fetchApi<Lead[]>('/leads'),
  getById: (id: number) => fetchApi<Lead>(`/leads/${id}`),
  create: (data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) =>
    fetchApi<Lead>('/leads', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Lead>) =>
    fetchApi<Lead>(`/leads/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchApi<void>(`/leads/${id}`, { method: 'DELETE' }),
};

// Campaigns API
export const campaignsApi = {
  getAll: () => fetchApi<Campaign[]>('/campaigns'),
  getById: (id: number) => fetchApi<Campaign>(`/campaigns/${id}`),
  create: (data: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>) =>
    fetchApi<Campaign>('/campaigns', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Campaign>) =>
    fetchApi<Campaign>(`/campaigns/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchApi<void>(`/campaigns/${id}`, { method: 'DELETE' }),
};
