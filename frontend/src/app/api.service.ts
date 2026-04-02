import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Campaign, Client, Lead } from './models';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api`;

  constructor(private readonly http: HttpClient) {}

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.baseUrl}/clients`);
  }

  createClient(payload: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Observable<Client> {
    return this.http.post<Client>(`${this.baseUrl}/clients`, payload);
  }

  updateClient(id: number, payload: Partial<Client>): Observable<Client> {
    return this.http.put<Client>(`${this.baseUrl}/clients/${id}`, payload);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/clients/${id}`);
  }

  getLeads(): Observable<Lead[]> {
    return this.http.get<Lead[]>(`${this.baseUrl}/leads`);
  }

  createLead(payload: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Observable<Lead> {
    return this.http.post<Lead>(`${this.baseUrl}/leads`, payload);
  }

  updateLead(id: number, payload: Partial<Lead>): Observable<Lead> {
    return this.http.put<Lead>(`${this.baseUrl}/leads/${id}`, payload);
  }

  deleteLead(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/leads/${id}`);
  }

  getCampaigns(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.baseUrl}/campaigns`);
  }

  createCampaign(payload: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Observable<Campaign> {
    return this.http.post<Campaign>(`${this.baseUrl}/campaigns`, payload);
  }

  updateCampaign(id: number, payload: Partial<Campaign>): Observable<Campaign> {
    return this.http.put<Campaign>(`${this.baseUrl}/campaigns/${id}`, payload);
  }

  deleteCampaign(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/campaigns/${id}`);
  }
}
