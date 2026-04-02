import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import type { EChartsOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';
import { ApiService } from '../api.service';
import {
  AnalyticsDashboardService,
  AnalyticsFilterState,
  KpiMetric
} from '../services/analytics-dashboard.service';
import { Campaign, Client } from '../models';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxEchartsDirective],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {
  loading = true;
  campaigns: Campaign[] = [];
  clients: Client[] = [];
  leadCount = 0;

  filter: AnalyticsFilterState = {
    start: '',
    end: '',
    campaignId: 'all',
    clientGroupId: 'all'
  };

  primaryKpis: KpiMetric[] = [];
  secondaryKpis: KpiMetric[] = [];
  frequencyValue = 0;

  chartImpressionsCpm: EChartsOption = {};
  chartClicksCpc: EChartsOption = {};
  chartSpend: EChartsOption = {};
  gaugeOption: EChartsOption = {};

  constructor(
    private readonly api: ApiService,
    private readonly analytics: AnalyticsDashboardService
  ) {}

  ngOnInit(): void {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    this.filter.start = start.toISOString().slice(0, 10);
    this.filter.end = end.toISOString().slice(0, 10);

    forkJoin([
      this.api.getClients(),
      this.api.getLeads(),
      this.api.getCampaigns()
    ]).subscribe({
      next: ([clients, leads, campaigns]) => {
        this.clients = clients;
        this.campaigns = campaigns;
        this.leadCount = leads.length;
        this.applyData(
          clients.length,
          leads.length,
          campaigns.filter(c => c.status === 'Active').length,
          campaigns.reduce((s, c) => s + (c.budget ?? 0), 0)
        );
      },
      error: () => {
        this.applyData(0, 0, 0, 0);
      }
    });
  }

  private applyData(
    clientCount: number,
    leadCount: number,
    activeCampaigns: number,
    totalBudget: number
  ): void {
    this.loading = false;
    this.refreshCharts({
      activeCampaigns,
      totalBudget,
      clientCount,
      leadCount
    });
  }

  onFilterChange(): void {
    this.refreshCharts({
      activeCampaigns: this.campaigns.filter(c => c.status === 'Active').length,
      totalBudget: this.campaigns.reduce((s, c) => s + (c.budget ?? 0), 0),
      clientCount: this.clients.length,
      leadCount: this.leadCount
    });
  }

  private refreshCharts(real: {
    activeCampaigns: number;
    totalBudget: number;
    clientCount: number;
    leadCount: number;
  }): void {
    const allKpis = this.analytics.buildKpis(this.filter, real);
    this.primaryKpis = this.analytics.getPrimaryKpis(allKpis);
    this.secondaryKpis = this.analytics.getSecondaryKpis(allKpis);
    this.frequencyValue = this.analytics.gaugeFrequencyValue(this.filter);
    this.gaugeOption = this.analytics.gaugeOptions(this.frequencyValue);
    this.chartImpressionsCpm = this.analytics.comboImpressionsCpm(this.filter);
    this.chartClicksCpc = this.analytics.comboClicksCpc(this.filter);
    this.chartSpend = this.analytics.areaSpend(this.filter);
  }
}
