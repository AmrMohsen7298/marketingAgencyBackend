import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { DashboardShellComponent } from './pages/dashboard-shell.component';
import { OverviewComponent } from './pages/overview.component';
import { ClientsComponent } from './pages/clients.component';
import { LeadsComponent } from './pages/leads.component';
import { CampaignsComponent } from './pages/campaigns.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'dashboard',
    component: DashboardShellComponent,
    children: [
      { path: '', component: OverviewComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'leads', component: LeadsComponent },
      { path: 'campaigns', component: CampaignsComponent }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
