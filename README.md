# SentinelCore SecureOps

A modern, dark-mode security operations dashboard for monitoring assets, incidents, vulnerabilities, compliance posture, and DevSecOps review workflows.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Available Commands](#available-commands)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## Overview

SentinelCore SecureOps is a React + TypeScript application that simulates a security operations center experience for teams managing infrastructure health, incident response, vulnerability remediation, and audit readiness. It is designed for security analysts, administrators, and operations stakeholders who need a polished interface for tracking live risk signals and workflow actions.

The project combines a responsive frontend with a lightweight backend API layer for persistence and testing. Its goal is to provide a practical, recruiter-friendly demonstration of secure dashboard design, role-aware interactions, and operational workflow management.

## Features

### Authentication

- Separate admin and user authentication experiences
- Protected routes for authenticated access
- Session persistence through browser storage
- User signup flow with password validation and duplicate email checks
- Admin login with designated credentials

### User Features

- Dashboard with health metrics, alert summaries, and asset overview cards
- Asset inventory with search, filtering, sorting, and pagination
- Incident tracking with assignment, investigation, note-taking, and resolution workflows
- Vulnerability management with CVE-based views, filtering, patch actions, and risk reporting
- Audit log review with searchable, filterable timeline entries
- Compliance reporting and security report generation
- DevSecOps review workflow with compliance check execution

### Admin Features

- Role-aware permission handling for patching, assigning, exporting, reviewing, and closing actions
- Incident escalation workflows from the dashboard
- Compliance export actions and audit logging

### UI/UX

- Dark-themed modern interface using Material UI
- Responsive layout for desktop and tablet usage
- Reusable dashboard components such as stat cards, sidebars, tables, and drawers
- Toast feedback and modal-based workflows for actions

### Security & Operational Flow

- Permission-based action restriction for different roles
- Audit trail logging for critical operations
- Risk and compliance status visualization

## Tech Stack

| Category | Technologies |
| --- | --- |
| Frontend | React, TypeScript, Vite |
| UI Library | Material UI, Emotion |
| Routing | React Router DOM |
| Charts / Visualization | Recharts |
| Backend | Node.js, Express |
| Data Storage | JSON-based local data files and API persistence |
| Authentication | Custom session-based auth flow with local storage |
| Build Tools | TypeScript Compiler, Vite |
| Package Management | npm |

## Project Architecture

The application follows a modular single-page application architecture:

- The frontend is rendered through React components organized by feature and page.
- Global application state is managed in the app state context and shared across dashboard modules.
- Authentication is handled through a dedicated context provider with route protection.
- The UI interacts with a lightweight API client that communicates with the Express backend when available.
- If the backend is unavailable, the app falls back to mock data for local development and demonstration.

### Authentication Flow

1. A user selects either admin or user access.
2. Credentials are validated locally in the app flow.
3. A session is created and stored in browser storage.
4. Protected routes redirect unauthenticated users to the login experience.

## Folder Structure

```text
sentinelcore-secureops/
├── backend/
│   ├── data/
│   ├── seed.js
│   ├── server.js
│   └── test-integration.js
├── public/
├── src/
│   ├── api/
│   ├── assets/
│   ├── auth/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── pages/
│   ├── types/
│   └── utils/
├── .env.local
├── package.json
├── README.md
└── vite.config.js
```

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd sentinelcore-secureops
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

## Running the Project

### Start the backend

From the backend folder:

```bash
cd backend
npm run dev
```

This starts the Express API server for asset, incident, vulnerability, audit, and health endpoints.

### Start the frontend

From the project root:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

The backend API will typically be served at:

```text
http://localhost:3001/api
```

## Available Commands

### Root project

- `npm install` — install frontend dependencies
- `npm run dev` — launch the Vite development server
- `npm run build` — create a production build
- `npm run preview` — preview the production build locally

### Backend

- `cd backend && npm run dev` — start the backend in watch mode
- `cd backend && npm run start` — start the backend server
- `cd backend && npm run seed` — seed backend JSON data
- `cd backend && npm test` — run backend integration tests

## Environment Variables

The project currently uses one frontend environment variable:

| Variable | Description |
| --- | --- |
| VITE_API_URL | Base URL for the backend API. Default is http://localhost:3001/api |

A sample value is already defined in the local environment file:

```env
VITE_API_URL=http://localhost:3001/api
```

## Usage

1. Open the app and choose between admin and user access.
2. Sign in with the appropriate credentials or create a user account.
3. Navigate through the dashboard to inspect assets, incidents, vulnerabilities, and audit history.
4. Use available actions such as reviewing assets, escalating incidents, patching vulnerabilities, and exporting compliance reports.
5. Review the audit trail and compliance pages to monitor operational status.

## Screenshots

Placeholder images for future documentation:

```text
docs/images/home.png
docs/images/login.png
docs/images/dashboard.png
docs/images/incidents.png
docs/images/compliance.png
```

## Future Enhancements

Potential improvements for future releases include:

- Real backend authentication with secure token-based sessions
- Persistent database integration instead of local JSON files
- Role-based access control backed by a real authorization service
- Advanced charts and analytics for SOC reporting
- Notification center and email/SMS alert integration
- CI/CD workflow and automated testing for frontend and backend

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes and test them locally.
4. Submit a pull request with a clear summary of the improvement.

## License

This project is licensed under the MIT License.

Copyright (c) 2026 Bhanu Prasad Burri

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. INFRINGEMENT. IN NO EVENT
SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.

## Author

### Bhanu Prasad Burri

Computer Science Engineering Student

- GitHub: https://github.com/bhanuprasadburri
- LinkedIn: https://www.linkedin.com/in/yourprofile
- Email: bhanuburri28@gmail.com
