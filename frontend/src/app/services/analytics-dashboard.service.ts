import { Injectable } from '@angular/core';
import type { EChartsOption } from 'echarts';

export interface AnalyticsFilterState {
  start: string;
  end: string;
  campaignId: number | 'all';
  clientGroupId: number | 'all';
}

export interface KpiMetric {
  label: string;
  value: string;
  trendPct: number;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsDashboardService {
  /** Deterministic pseudo-random 0..1 from integer seed */
  private rnd(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  private hashFilter(f: AnalyticsFilterState): number {
    const sid =
      f.campaignId === 'all' ? 0 : f.campaignId;
    const gid =
      f.clientGroupId === 'all' ? 0 : f.clientGroupId;
    const t = new Date(f.start).getTime() + new Date(f.end).getTime();
    return Math.floor(t / 86400000) + sid * 997 + gid * 1009;
  }

  buildKpis(
    filter: AnalyticsFilterState,
    real: {
      activeCampaigns: number;
      totalBudget: number;
      clientCount: number;
      leadCount: number;
    }
  ): KpiMetric[] {
    const h = this.hashFilter(filter);
    const t = (i: number) => (this.rnd(h + i) - 0.45) * 40;

    const fmtK = (n: number) =>
      n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toFixed(1);
    const fmtMoney = (n: number) =>
      n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toFixed(2);

    const impressions = 70000 + this.rnd(h + 1) * 40000;
    const clicks = impressions * (0.1 + this.rnd(h + 2) * 0.05);
    const spend = real.totalBudget > 0 ? real.totalBudget * (0.8 + this.rnd(h + 3) * 0.4) : 1200 + this.rnd(h + 3) * 600;
    const reach = 300 + this.rnd(h + 4) * 300;
    const lpClicks = clicks * 0.95;
    const ctr = (clicks / impressions) * 100;
    const cpm = (spend / impressions) * 1000;
    const cpc = spend / Math.max(clicks, 1);

    return [
      { label: 'Impressions', value: fmtK(impressions), trendPct: t(10) },
      { label: 'Clicks', value: fmtK(clicks), trendPct: t(11) },
      { label: 'Amount spend', value: fmtMoney(spend), trendPct: t(12) },
      { label: 'Avg daily reach', value: reach.toFixed(1), trendPct: t(13) },
      { label: 'Landing page clicks', value: Math.round(lpClicks).toLocaleString(), trendPct: t(14) },
      { label: 'CTR', value: `${ctr.toFixed(2)}%`, trendPct: t(15) },
      { label: 'CPM', value: cpm.toFixed(2), trendPct: t(16) },
      { label: 'CPC', value: cpc.toFixed(2), trendPct: t(17) },
      {
        label: 'Active campaigns',
        value: String(real.activeCampaigns),
        trendPct: t(18)
      },
      {
        label: 'CRM clients',
        value: String(real.clientCount),
        trendPct: t(19)
      },
      {
        label: 'Leads in pipeline',
        value: String(real.leadCount),
        trendPct: t(20)
      },
      {
        label: 'Budget allocated',
        value: `$${real.totalBudget.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
        trendPct: t(21)
      }
    ];
  }

  /** First 8 KPIs = ad-style metrics; remaining four are CRM hooks (optional second row) */
  getPrimaryKpis(kpis: KpiMetric[]): KpiMetric[] {
    return kpis.slice(0, 8);
  }

  getSecondaryKpis(kpis: KpiMetric[]): KpiMetric[] {
    return kpis.slice(8, 12);
  }

  gaugeFrequencyValue(filter: AnalyticsFilterState): number {
    const h = this.hashFilter(filter);
    return 0.5 + this.rnd(h + 30) * 3.5;
  }

  private dayLabels(start: string, end: string): string[] {
    const a = new Date(start);
    const b = new Date(end);
    const out: string[] = [];
    for (let d = new Date(a); d <= b; d.setDate(d.getDate() + 1)) {
      out.push(
        d.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short'
        })
      );
      if (out.length > 31) break;
    }
    if (out.length === 0) {
      out.push('—');
    }
    return out;
  }

  private seriesForRange(
    filter: AnalyticsFilterState,
    base: number,
    variance: number,
    offset: number
  ): number[] {
    const labels = this.dayLabels(filter.start, filter.end);
    const h = this.hashFilter(filter);
    return labels.map((_, i) => {
      const v =
        base +
        this.rnd(h + offset + i) * variance -
        variance / 2 +
        Math.sin(i / 3 + offset) * (variance / 4);
      return Math.max(0, v);
    });
  }

  comboImpressionsCpm(filter: AnalyticsFilterState): EChartsOption {
    const categories = this.dayLabels(filter.start, filter.end);
    const impressions = this.seriesForRange(filter, 6000, 3500, 40);
    const cpm = this.seriesForRange(filter, 14, 10, 50).map(v => v / 1);

    return {
      color: ['#1e3a5f', '#e57373'],
      tooltip: { trigger: 'axis' },
      legend: { data: ['Impressions', 'CPM'], bottom: 0 },
      grid: { left: 48, right: 48, top: 32, bottom: 56 },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: { rotate: 45, fontSize: 10 }
      },
      yAxis: [
        {
          type: 'value',
          name: 'Impressions',
          splitLine: { lineStyle: { type: 'dashed', color: '#e0e0e0' } }
        },
        {
          type: 'value',
          name: 'CPM',
          splitLine: { show: false }
        }
      ],
      series: [
        {
          name: 'Impressions',
          type: 'bar',
          data: impressions,
          barMaxWidth: 28
        },
        {
          name: 'CPM',
          type: 'line',
          yAxisIndex: 1,
          data: cpm,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6
        }
      ]
    };
  }

  comboClicksCpc(filter: AnalyticsFilterState): EChartsOption {
    const categories = this.dayLabels(filter.start, filter.end);
    const clicks = this.seriesForRange(filter, 900, 400, 60);
    const cpc = this.seriesForRange(filter, 0.12, 0.08, 70).map(v => v / 1);

    return {
      color: ['#78909c', '#5e35b1'],
      tooltip: { trigger: 'axis' },
      legend: { data: ['Clicks', 'CPC'], bottom: 0 },
      grid: { left: 48, right: 48, top: 32, bottom: 56 },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: { rotate: 45, fontSize: 10 }
      },
      yAxis: [
        {
          type: 'value',
          name: 'Clicks',
          splitLine: { lineStyle: { type: 'dashed', color: '#e0e0e0' } }
        },
        {
          type: 'value',
          name: 'CPC',
          splitLine: { show: false }
        }
      ],
      series: [
        {
          name: 'Clicks',
          type: 'bar',
          data: clicks,
          barMaxWidth: 28
        },
        {
          name: 'CPC',
          type: 'line',
          yAxisIndex: 1,
          data: cpc,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6
        }
      ]
    };
  }

  areaSpend(filter: AnalyticsFilterState): EChartsOption {
    const categories = this.dayLabels(filter.start, filter.end);
    const spend = this.seriesForRange(filter, 45, 25, 80);

    return {
      color: ['#1976d2'],
      tooltip: { trigger: 'axis' },
      grid: { left: 48, right: 24, top: 24, bottom: 40 },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: categories,
        axisLabel: { rotate: 45, fontSize: 10 }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { type: 'dashed', color: '#e0e0e0' } }
      },
      series: [
        {
          name: 'Amount spent',
          type: 'line',
          data: spend,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(25, 118, 210, 0.35)' },
                { offset: 1, color: 'rgba(25, 118, 210, 0.02)' }
              ]
            }
          }
        }
      ]
    };
  }

  gaugeOptions(value: number): EChartsOption {
    return {
      series: [
        {
          type: 'gauge',
          startAngle: 200,
          endAngle: -20,
          min: 0,
          max: 8,
          splitNumber: 8,
          axisLine: {
            lineStyle: {
              width: 14,
              color: [
                [0.25, '#7e57c2'],
                [0.5, '#5c6bc0'],
                [0.75, '#42a5f5'],
                [1, '#29b6f6']
              ]
            }
          },
          pointer: { length: '65%', width: 5 },
          axisTick: { show: false },
          splitLine: { show: true, length: 10 },
          axisLabel: { distance: 12, fontSize: 10 },
          detail: { show: false },
          data: [{ value, name: 'freq' }]
        }
      ]
    };
  }
}
