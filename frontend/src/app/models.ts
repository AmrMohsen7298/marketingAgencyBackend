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

export enum LeadStatus {
  New = 'New',
  Contacted = 'Contacted',
  Qualified = 'Qualified',
  Proposal = 'Proposal',
  Negotiation = 'Negotiation',
  Won = 'Won',
  Lost = 'Lost'
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

export enum CampaignStatus {
  Draft = 'Draft',
  Active = 'Active',
  Paused = 'Paused',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
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
