import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { Lead, LeadStatus } from '../models';

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leads.component.html'
})
export class LeadsComponent implements OnInit {
  leads: Lead[] = [];
  loading = true;
  showForm = false;
  editingId: number | null = null;
  statuses = Object.values(LeadStatus);
  formData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    status: LeadStatus.New,
    source: '',
    notes: '',
    campaignId: undefined
  };

  constructor(private readonly api: ApiService) {}

  ngOnInit(): void {
    this.fetchLeads();
  }

  fetchLeads(): void {
    this.api.getLeads().subscribe({
      next: data => (this.leads = data),
      complete: () => (this.loading = false),
      error: () => (this.loading = false)
    });
  }

  save(): void {
    const request = this.editingId
      ? this.api.updateLead(this.editingId, this.formData)
      : this.api.createLead(this.formData);
    request.subscribe(() => {
      this.resetForm();
      this.fetchLeads();
    });
  }

  edit(lead: Lead): void {
    this.editingId = lead.id;
    this.formData = {
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      status: lead.status,
      source: lead.source,
      notes: lead.notes,
      campaignId: lead.campaignId
    };
    this.showForm = true;
  }

  remove(id: number): void {
    if (!confirm('Delete this lead?')) return;
    this.api.deleteLead(id).subscribe(() => this.fetchLeads());
  }

  startCreate(): void {
    this.resetForm();
    this.showForm = true;
  }

  resetForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.formData = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      status: LeadStatus.New,
      source: '',
      notes: '',
      campaignId: undefined
    };
  }
}
