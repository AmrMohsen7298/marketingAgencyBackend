import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="home">
      <h1>Marketing Agency Dashboard</h1>
      <a routerLink="/dashboard">Go to Dashboard</a>
    </div>
  `,
  styles: [`.home { min-height: 100vh; display:flex; align-items:center; justify-content:center; flex-direction:column; gap: 10px; } a { color:#7db4ff; }`]
})
export class HomeComponent {}
