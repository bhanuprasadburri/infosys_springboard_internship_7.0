# SentinelCore SecureOps

SentinelCore SecureOps is a TypeScript-based React frontend built with Vite and Material UI. It simulates an enterprise security operations console with a dark security aesthetic, mock authentication, and end-to-end app navigation.

## Features

- Protected login and signup flow using mock authentication
- Dashboard with asset health, resource metrics, and alert feed
- Asset inventory filtering and status monitoring
- Incidents page with triage workflow and live incident tracking
- Vulnerabilities page with CVE risk ratings and patch status
- Audit page with log filtering and activity review
- Compliance page with framework coverage and report generation
- DevSecOps page with security review status and pipeline insights
- Reusable MUI components for cards, tables, badges, sidebar navigation, and top bar

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Notes

- All data is mock/sample data stored locally in the app.
- Authentication is simulated in the React context; there is no backend API.
- The app is styled with Material UI and uses React Router for protected routes.
