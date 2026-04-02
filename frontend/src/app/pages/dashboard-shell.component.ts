import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="layout">
      <aside class="sidebar">
        <div class="sidebar-brand">
          <span class="logo">MH</span>
          <div>
            <div class="title">Marketing Hub</div>
            <div class="subtitle">Dashboard</div>
          </div>
        </div>
        <nav>
          <a
            routerLink="/dashboard"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            >Analytics</a
          >
          <a routerLink="/dashboard/clients" routerLinkActive="active">Clients</a>
          <a routerLink="/dashboard/leads" routerLinkActive="active">Leads</a>
          <a routerLink="/dashboard/campaigns" routerLinkActive="active">Campaigns</a>
        </nav>
        <a class="swagger" href="http://localhost:5000/swagger" target="_blank" rel="noreferrer"
          >API docs</a
        >
      </aside>
      <main class="content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [
    `
      .layout {
        display: grid;
        grid-template-columns: 240px 1fr;
        min-height: 100vh;
      }
      .sidebar {
        background: linear-gradient(180deg, #0d2847 0%, #153a5c 100%);
        padding: 20px 16px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        color: #e8f1fb;
      }
      .sidebar-brand {
        display: flex;
        align-items: center;
        gap: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      }
      .logo {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: linear-gradient(135deg, #5c6bc0, #3949ab);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 13px;
      }
      .title {
        font-weight: 700;
        font-size: 1rem;
      }
      .subtitle {
        font-size: 0.75rem;
        opacity: 0.75;
      }
      nav {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .sidebar a {
        color: rgba(255, 255, 255, 0.85);
        text-decoration: none;
        padding: 10px 12px;
        border-radius: 8px;
        font-size: 0.9rem;
      }
      .sidebar a.active,
      .sidebar a:hover {
        background: rgba(255, 255, 255, 0.12);
        color: #fff;
      }
      .swagger {
        margin-top: auto;
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.65);
        text-decoration: none;
        padding: 8px 12px;
      }
      .swagger:hover {
        color: #fff;
      }
      .content {
        padding: 20px 24px 24px;
        background: linear-gradient(180deg, #dfe9f3 0%, #e8f0f8 40%, #f2f6fb 100%);
        overflow: auto;
      }
    `
  ]
})
export class DashboardShellComponent {}
