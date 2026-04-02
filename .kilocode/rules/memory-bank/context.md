# Active Context: Angular SPA + .NET API

## Current State

**Project Status**: ✅ Frontend migrated from Next.js to Angular

The repository now uses an Angular SPA frontend in `frontend/` and a .NET 8 backend in `backend/`. The previous Next.js frontend files were removed from active use.

## Recently Completed

- [x] Scaffolded Angular 19 standalone app in `frontend/`
- [x] Ported dashboard routes (`/dashboard`, `/dashboard/clients`, `/dashboard/leads`, `/dashboard/campaigns`)
- [x] Implemented Angular `ApiService` with HttpClient for clients/leads/campaigns
- [x] Added Angular environment config for API base URL
- [x] Updated backend CORS to allow `http://localhost:4200`
- [x] Removed Next.js frontend files and switched root npm scripts to Angular
- [x] LinkedIn-style analytics dashboard on `/dashboard` (ECharts: KPIs, gauge, combo + area charts; filters; demo ad metrics + live CRM totals from API)

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `frontend/src/app` | Angular routes/pages/services | ✅ Active |
| `frontend/src/environments` | API base URL environment config | ✅ Active |
| `backend/Program.cs` | API host + CORS policy | ✅ Updated |
| `.kilocode/` | AI context & recipes | ✅ Active |

## Current Focus

The Angular migration is complete. Next steps:

1. Replace demo ad metrics with real reporting data if/when backend exposes it
2. Add Angular tests for API services and dashboard pages
3. Configure deployment pipeline for `frontend/dist/frontend`

## Quick Start Guide

### Start frontend

Run from repo root:
```bash
npm start
```

### Build frontend

```bash
npm run build
```

### Backend API

Run the .NET backend in `backend/` and ensure API is reachable at `http://localhost:5000`.

## Available Recipes

| Recipe | File | Use Case |
|--------|------|----------|
| Add Database | `.kilocode/recipes/add-database.md` | Additional persistence features |

## Pending Improvements

- [ ] Add Angular unit/integration tests
- [ ] Add frontend lint/format CI checks
- [ ] Add production environment API URL strategy

## Session History

| Date | Changes |
|------|---------|
| 2026-04-01 | Migrated frontend from Next.js to Angular SPA |
