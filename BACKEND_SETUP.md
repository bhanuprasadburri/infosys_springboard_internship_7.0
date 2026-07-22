# Backend Integration Setup & Guide

## Overview
The SentinelCore backend is a Node.js/Express REST API that persists data to JSON files. The frontend communicates with the backend via HTTP requests from `src/api/client.ts`.

## Architecture

```
Frontend (React + TypeScript)
     ↓
API Client (src/api/client.ts)
     ↓
Express Server (backend/server.js) — Port 3001
     ↓
JSON File Storage (backend/data/*.json)
```

## Setup & Installation

### Prerequisites
- Node.js 16+ installed
- Backend dependencies installed: `cd backend && npm install`
- Frontend dependencies installed: `npm install` (in root)

### Step 1: Seed the Database
Initialize backend data files:
```bash
cd backend
npm run seed
```

This creates/updates JSON files in `backend/data/`:
- `assets.json` — Infrastructure assets
- `alerts.json` — Security alerts
- `incidents.json` — Security incidents
- `vulnerabilities.json` — CVE vulnerabilities
- `audit-logs.json` — Audit trail
- `metrics.json` — System metrics

### Step 2: Start the Backend Server
```bash
cd backend
npm run dev  # With file watching
# OR
npm start    # Single run
```

Expected output:
```
✓ Backend server running at http://localhost:3001
✓ CORS enabled for frontend at http://localhost:5173
```

### Step 3: Start the Frontend Dev Server
In a new terminal (from root directory):
```bash
npm run dev
```

Expected output:
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
```

### Step 4: Run Integration Tests
In a third terminal:
```bash
cd backend
npm run test
```

This will:
1. Reseed the database
2. Start testing all API endpoints
3. Verify data persistence
4. Report any issues

## API Endpoints

All endpoints return JSON and use `http://localhost:3001/api` base URL.

### Health Check
```
GET /api/health
Response: { status: "ok", timestamp: "..." }
```

### Assets
```
GET /api/assets          — List all assets
POST /api/assets         — Create new asset
PUT /api/assets/:id      — Update asset
DELETE /api/assets/:id   — Delete asset
```

### Incidents
```
GET /api/incidents       — List all incidents
POST /api/incidents      — Create new incident
PUT /api/incidents/:id   — Update incident
DELETE /api/incidents/:id — Delete incident
```

### Vulnerabilities
```
GET /api/vulnerabilities    — List all vulnerabilities
POST /api/vulnerabilities   — Create new vulnerability
PUT /api/vulnerabilities/:id — Update vulnerability
```

### Alerts
```
GET /api/alerts      — List all alerts
POST /api/alerts     — Create new alert
```

### Audit Logs
```
GET /api/audit-logs    — List all audit logs
POST /api/audit-logs   — Create new audit log entry
```

### Metrics
```
GET /api/metrics     — Get system metrics
PUT /api/metrics     — Update metrics
```

## Data Flow & Integration

### Frontend Initialization (AppStateContext)
1. On mount, `AppStateContext.tsx` calls `Promise.all([getAssets(), getAlerts(), ...])` 
2. If backend is available, loads live data from server
3. If backend fails, falls back to mock data from `src/data/mockAssets.ts`
4. Sets React state with initial data

### Create Operations
```
User Action → React State Update → API POST → Save to JSON File
```

Example (Create Incident):
```typescript
// 1. Update local state immediately (optimistic)
setIncidents(prev => [newIncident, ...prev])

// 2. Sync to backend asynchronously
apiClient.createIncident(newIncident)
  .then(response => /* handle success */)
  .catch(error => /* handle failure */)

// 3. Backend receives POST, saves to incidents.json
```

### Update Operations
```
User Action → React State Update → API PUT → Update JSON File
```

### Data Persistence
- All data persists in `backend/data/*.json` files
- On server restart, data is reloaded from files
- Each JSON file is a simple array or object

## Configuration

### Frontend API URL
Set in `.env.local`:
```
VITE_API_URL=http://localhost:3001/api
```

### Backend Port
Edit `backend/server.js`:
```javascript
const PORT = 3001;  // Change this for different port
```

### CORS Configuration
Edit `backend/server.js`:
```javascript
app.use(cors());  // Allows all origins
// For production, restrict to specific domains:
// app.use(cors({ origin: 'https://yourdomain.com' }))
```

## Troubleshooting

### Issue: "Could not connect to backend"
**Solution**: Make sure backend is running on port 3001
```bash
cd backend && npm run dev
```

### Issue: "API Error: 404 Not Found"
**Solution**: Verify the endpoint path matches exactly
- Check `src/api/client.ts` for correct paths
- Check `backend/server.js` for matching routes

### Issue: "Data not persisting after restart"
**Solution**: Verify `backend/data/` directory exists and is writable
```bash
ls -la backend/data/  # Check files exist
npm run seed          # Reseed if necessary
```

### Issue: "CORS error in browser console"
**Solution**: Backend should have CORS enabled. If not:
1. Check `npm install cors` in backend
2. Verify `app.use(cors())` in server.js
3. Restart backend server

### Issue: "File naming mismatch" (audit-logs vs auditLogs)
**Solution**: Run `npm run seed` to create files with correct names
- API uses hyphenated names: `/api/audit-logs`
- Data files should match: `audit-logs.json`

## File Structure

```
backend/
  ├── server.js              # Express server with all routes
  ├── seed.js               # Database initialization script
  ├── test-integration.js   # Integration test suite
  ├── package.json          # Dependencies & scripts
  └── data/
      ├── assets.json       # 6 test assets
      ├── alerts.json       # 2 test alerts
      ├── incidents.json    # 23 test incidents
      ├── vulnerabilities.json  # 20 test vulnerabilities
      ├── audit-logs.json   # Initial audit trail
      └── metrics.json      # 4 system metrics
```

## Development Workflow

### Adding New Endpoint
1. Add to `backend/server.js`:
   ```javascript
   app.get('/api/newentity', (req, res) => {
     const data = readData('new-entity');
     res.json(data);
   });
   ```

2. Add to `backend/seed.js` mock data:
   ```javascript
   newEntity: [
     { id: 'NE-001', name: 'test', ... }
   ]
   ```

3. Add to `src/api/client.ts`:
   ```typescript
   getNewEntity: () => fetch(`${API_BASE}/newentity`).then(handleResponse)
   ```

4. Use in `src/context/AppStateContext.tsx`:
   ```typescript
   const [newEntities, setNewEntities] = useState([])
   // ... in useEffect and methods
   ```

### Testing Changes
1. Make code change
2. Reseed database: `npm run seed`
3. Restart backend: `npm run dev`
4. Reload frontend: F5 in browser
5. Run integration tests: `npm run test`

## Performance Notes
- JSON file I/O is synchronous (simple, but can block)
- For production, consider: PostgreSQL, MongoDB, or similar
- Current setup suitable for development & testing
- File size limits not an issue with ~100 records per entity

## Next Steps
- Run `npm run test` to verify all endpoints
- Check browser DevTools Network tab to see API calls
- Modify mock data in `backend/seed.js` to match your needs
- Deploy backend separately if needed (Docker, Heroku, Azure, etc.)
