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

## Backend Setup

The project now includes a lightweight Node.js + Express backend in `/server` that persists user accounts in MySQL for the user signup/login flow. Admin login remains frontend-only and unchanged.

### Server files
- `/server/server.js` — Express app and auth routes
- `/server/db.js` — MySQL connection pool
- `/server/schema.sql` — database/table creation script
- `/server/.env.example` — environment variable template

### Install and run
1. Install the backend dependencies:
   ```bash
   cd server
   npm install
   ```
# SentinelCore SecureOps — Enterprise Security Operations Platform

A compact security operations dashboard demonstrating role-aware authentication and a MySQL-backed user flow alongside a rich React UI for monitoring assets, incidents, vulnerabilities, and audit workflows.

## Overview

SentinelCore SecureOps provides a polished frontend experience for security operations use-cases (asset health, alerts, incidents, vulnerabilities, and audit traces). It is intended as a demo/portfolio project: user accounts are persisted in a local MySQL database through a lightweight Node.js/Express backend; other domain data shown in the UI is provided by mock fixtures and frontend state.

## Implemented Features

The list below reflects what is implemented in the repository today.

- Authentication
  - Admin login (frontend-only, hardcoded credential check)
  - User Sign Up (persists to MySQL)
  - User Login (verifies credentials, issues JWT)
  - `GET /api/auth/me` — token verification
  - Session persistence in browser storage

- Frontend UI (mock-backed/persistent mix)
  - Asset list and detail views
  - Alerts feed and stat cards
  - Incident list, creation and status workflows (UI-driven)
  - Vulnerability list and detail views
  - Audit log viewer and export UI (mock data)
  - Charts and metrics using Recharts

Note: Except for authentication, most domain data relies on frontend mock data and the app will fall back to those mocks if API endpoints are not available.

## Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React, TypeScript, Vite, Material UI (@mui), Emotion, Recharts |
| Backend    | Node.js, Express, JWT (jsonwebtoken), bcrypt, mysql2 |
| Database   | MySQL (tested with XAMPP/local MySQL) |
| State      | React Context API (AuthProvider, AppStateContext) |

(Dependencies verified in `package.json` and `server/package.json`.)

## Repository Structure (key files)

```
.
├── index.html
├── package.json           # frontend scripts & dependencies
├── vite.config.js
├── README.md
├── .env.local             # frontend env (VITE_API_URL)
├── server/                # backend
│   ├── server.js
│   ├── db.js
│   ├── package.json
│   └── schema.sql
└── src/                   # frontend source
    ├── api/
    │   └── client.ts
    ├── auth/
    │   ├── AuthContext.tsx
    │   └── ProtectedRoute.tsx
    ├── components/
    ├── context/
    │   └── AppStateContext.tsx
    ├── data/
    │   └── mockAssets.ts
    ├── pages/
    │   ├── Login.tsx
    │   ├── SignUp.tsx
    │   ├── AdminLogin.tsx
    │   └── Dashboard.tsx
    └── utils/
        └── authUtils.ts
```

## Prerequisites

- Node.js (LTS recommended — tested with Node 18+)
- npm
- MySQL server (XAMPP or equivalent) running on `localhost:3306`

## Setup & Installation

1. Clone the repository and install frontend deps:

```bash
git clone <repo-url>
cd infosys_springboard_internship_7.0
npm install
```

2. Install backend deps:

```bash
cd server
npm install
cd ..
```

3. Configure backend environment (create `server/.env` from `server/.env.example`) and set your DB credentials.

4. Create the database schema (CLI or phpMyAdmin):

```bash
# Using mysql CLI
mysql -u root < server/schema.sql
# or with password
mysql -u root -p < server/schema.sql
```

5. Start backend (separate terminal):

```bash
cd server
npm run dev
```

6. Start frontend (new terminal):

```bash
cd ..
npm run dev
```

Frontend: http://localhost:5173
Backend API: http://localhost:3001/api

## Environment Variables

Create `server/.env` (do not commit). Keys used by the server:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`
- `FRONTEND_URL`
- `PORT`

Frontend uses:
- `VITE_API_URL` (defined in `.env.local` or environment)

## Authentication Notes

- Admin login is a frontend-only hardcoded credential (for demo use).
- User registration persists to the `users` table in MySQL; passwords are hashed with `bcrypt` before storage.
- User login returns a JWT that the frontend uses for authenticated requests and session persistence.

## API Endpoints (implemented)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/health | Health check |
| POST   | /api/auth/signup | Register a new user (MySQL) |
| POST   | /api/auth/login | Authenticate user, return JWT |
| GET    | /api/auth/me | Validate token and return user payload |

## NPM Scripts

Frontend (`package.json`):
- `dev` — start Vite dev server
- `build` — TypeScript check and build
- `preview` — preview production build

Backend (`server/package.json`):
- `dev` — start server (`node server.js`)
- `start` — start server

## Known Limitations

- Admin credentials are hardcoded and not secure for production.
- Domain data (assets, incidents, vulnerabilities, audit logs) are primarily mock-backed; persistent CRUD beyond auth is not implemented.
- Dependency audit warnings may exist; run `npm audit` to inspect and optionally update packages.

## Quick Smoke Tests

Health check:

```bash
curl http://localhost:3001/api/health
# -> { "status": "ok" }
```

Signup / Login (PowerShell example):

```powershell
$signup = @{ fullName='Demo User'; email='demo+local@example.com'; password='Aa1!testuser' } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3001/api/auth/signup" -Method Post -ContentType 'application/json' -Body $signup

$login = @{ email='demo+local@example.com'; password='Aa1!testuser' } | ConvertTo-Json
$l = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method Post -ContentType 'application/json' -Body $login

$headers = @{ Authorization = "Bearer $($l.token)" }
Invoke-RestMethod -Uri "http://localhost:3001/api/auth/me" -Method Get -Headers $headers
```

## License

License: Not yet specified

---

If you want, I can add a short CONTRIBUTING section, a developer quickstart, or commit this README update for you. Let me know which option you prefer.

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
- LinkedIn: https://www.linkedin.com/in/bhanu-prasad-burri/
- Email: bhanuburri28@gmail.com
