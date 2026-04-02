import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { Client } from '../models';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients.component.html'
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  loading = true;
  showForm = false;
  editingId: number | null = null;
  formData = { name: '', email: '', phone: '', company: '', industry: '' };

  constructor(private readonly api: ApiService) {}

  ngOnInit(): void {
    this.fetchClients();
  }

  fetchClients(): void {
    this.api.getClients().subscribe({
      next: data => (this.clients = data),
      complete: () => (this.loading = false),
      error: () => (this.loading = false)
    });
  }

  save(): void {
    const request = this.editingId
      ? this.api.updateClient(this.editingId, this.formData)
      : this.api.createClient(this.formData);

    request.subscribe(() => {
      this.resetForm();
      this.fetchClients();
    });
  }

  edit(client: Client): void {
    this.editingId = client.id;
    this.formData = {
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
      industry: client.industry
    };
    this.showForm = true;
  }

  remove(id: number): void {
    if (!confirm('Delete this client?')) return;
    this.api.deleteClient(id).subscribe(() => this.fetchClients());
  }

  startCreate(): void {
    this.resetForm();
    this.showForm = true;
  }

  resetForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.formData = { name: '', email: '', phone: '', company: '', industry: '' };
  }
}
