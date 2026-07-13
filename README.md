# SentinelCore SecureOps

SentinelCore SecureOps is a TypeScript React application built with Vite and Material UI. It simulates a modern security operations console with role-based access, mock authentication, incident workflows, audit logging, and compliance review.

## Features

- Mock authentication with login, signup, forgot password, and persisted session storage
- Protected routing for authenticated dashboards and security pages
- Role-based permission checks for actions like patching, assigning, exporting, reviewing, and closing incidents
- Dashboard with asset health, resource metrics, alerts, and action workflow links
- Asset inventory management with search, filtering, sorting, pagination, and review logging
- Incident tracking with investigation, assignment, notes, recommended action execution, resolve/close workflow, and shared audit logs
- Vulnerabilities management with CVE search, severity/status filtering, patch-status sorting, pagination, and audit trail
- Audit log viewer with action/date filters and page navigation
- Compliance reporting with reactive framework status, report exports, and history tracking
- DevSecOps review page with security check workflows and historical review feed
- Shared global state via `AppStateContext` for assets, incidents, vulnerabilities, alerts, metrics, and audit logs

## Project structure

- `src/auth` — authentication context and protected route wrapper
- `src/context` — shared app state provider
- `src/pages` — app pages for dashboard, assets, incidents, vulnerabilities, audit, compliance, and DevSecOps
- `src/components` — reusable UI components such as sidebar, top bar, tables, cards, and alerts feed
- `src/data` — mock domain data for assets, alerts, incidents, vulnerabilities, policies, reports, and audit logs
- `src/types` — shared TypeScript types and domain models

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the app in your browser at:

```text
http://localhost:5173
```

## Scripts

- `npm install` — install project dependencies
- `npm run dev` — start the development server
- `npm run build` — build the app for production
- `npm.cmd run build` — Windows-specific production build command
- `npm run preview` — preview the production build locally

## Validation

This app has been validated using:

```bash
npx tsc --noEmit
npx vite build
```

## Notes

- Data is mock/sample only and exists entirely in the frontend.
- Authentication is simulated in React context and does not include a backend service.
- Role permissions are enforced in the UI for security actions.
- Audit logs are stored in shared state and used across pages for review and reporting.
