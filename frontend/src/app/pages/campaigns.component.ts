import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { Campaign, CampaignStatus, Client } from '../models';

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './campaigns.component.html'
})
export class CampaignsComponent implements OnInit {
  campaigns: Campaign[] = [];
  clients: Client[] = [];
  loading = true;
  showForm = false;
  editingId: number | null = null;
  statuses = Object.values(CampaignStatus);
  formData: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'> = {
    name: '',
    description: '',
    type: '',
    status: CampaignStatus.Draft,
    budget: 0,
    startDate: '',
    endDate: '',
    clientId: 0
  };

  constructor(private readonly api: ApiService) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.api.getClients().subscribe(clients => (this.clients = clients));
    this.api.getCampaigns().subscribe({
      next: data => (this.campaigns = data),
      complete: () => (this.loading = false),
      error: () => (this.loading = false)
    });
  }

  save(): void {
    const request = this.editingId
      ? this.api.updateCampaign(this.editingId, this.formData)
      : this.api.createCampaign(this.formData);
    request.subscribe(() => {
      this.resetForm();
      this.refresh();
    });
  }

  edit(campaign: Campaign): void {
    this.editingId = campaign.id;
    this.formData = {
      name: campaign.name,
      description: campaign.description,
      type: campaign.type,
      status: campaign.status,
      budget: campaign.budget,
      startDate: campaign.startDate?.split('T')[0] ?? '',
      endDate: campaign.endDate?.split('T')[0] ?? '',
      clientId: campaign.clientId
    };
    this.showForm = true;
  }

  remove(id: number): void {
    if (!confirm('Delete this campaign?')) return;
    this.api.deleteCampaign(id).subscribe(() => this.refresh());
  }

  startCreate(): void {
    this.resetForm();
    this.formData.clientId = this.clients[0]?.id ?? 0;
    this.showForm = true;
  }

  clientName(id: number): string {
    return this.clients.find(c => c.id === id)?.name ?? 'Unknown';
  }

  resetForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.formData = {
      name: '',
      description: '',
      type: '',
      status: CampaignStatus.Draft,
      budget: 0,
      startDate: '',
      endDate: '',
      clientId: 0
    };
  }
}
