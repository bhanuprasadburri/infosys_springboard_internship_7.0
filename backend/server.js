const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DATA_DIR = path.join(__dirname, 'data');

app.use(cors());
app.use(bodyParser.json());

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// Helper: read JSON data file
const readData = (filename) => {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

// Helper: write JSON data file
const writeData = (filename, data) => {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// ============ AUTH ============
const adminCredential = {
  email: 'bhanu@gmail.com',
  password: 'Bhanu@',
};

const userStore = [];

const createToken = (mode, user) => `${mode}-${user.email}-${Date.now()}`;

app.post('/api/auth/admin/login', (req, res) => {
  const { email, password } = req.body || {};
  if (email === adminCredential.email && password === adminCredential.password) {
    const user = { id: 'admin-1', fullName: 'Admin User', email, role: 'Security Admin' };
    return res.json({ user, token: createToken('admin', user) });
  }
  return res.status(401).json({ message: 'Invalid Admin Credentials.' });
});

app.post('/api/auth/user/signup', (req, res) => {
  const { fullName, email, password } = req.body || {};
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  const normalizedEmail = String(email).trim().toLowerCase();
  if (userStore.some((entry) => entry.email === normalizedEmail)) {
    return res.status(409).json({ message: 'An account with that email already exists.' });
  }
  const user = { id: `user-${Date.now()}`, fullName: String(fullName).trim(), email: normalizedEmail, password: String(password) };
  userStore.push(user);
  return res.status(201).json({ user: { ...user, password: undefined }, token: createToken('user', user) });
});

app.post('/api/auth/user/login', (req, res) => {
  const { email, password } = req.body || {};
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const user = userStore.find((entry) => entry.email === normalizedEmail && entry.password === String(password || ''));
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }
  return res.json({ user: { ...user, password: undefined }, token: createToken('user', user) });
});

// ============ ASSETS ============
app.get('/api/assets', (req, res) => {
  const assets = readData('assets');
  res.json(assets);
});

app.post('/api/assets', (req, res) => {
  const assets = readData('assets');
  const newAsset = { ...req.body, id: `AST-${Date.now()}` };
  assets.push(newAsset);
  writeData('assets', assets);
  res.status(201).json(newAsset);
});

app.put('/api/assets/:id', (req, res) => {
  const assets = readData('assets');
  const index = assets.findIndex((a) => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Asset not found' });
  assets[index] = { ...assets[index], ...req.body };
  writeData('assets', assets);
  res.json(assets[index]);
});

app.delete('/api/assets/:id', (req, res) => {
  let assets = readData('assets');
  assets = assets.filter((a) => a.id !== req.params.id);
  writeData('assets', assets);
  res.json({ success: true });
});

// ============ ALERTS ============
app.get('/api/alerts', (req, res) => {
  const alerts = readData('alerts');
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alerts = readData('alerts');
  const newAlert = { ...req.body, id: `ALT-${Date.now()}` };
  alerts.push(newAlert);
  writeData('alerts', alerts);
  res.status(201).json(newAlert);
});

// ============ INCIDENTS ============
app.get('/api/incidents', (req, res) => {
  const incidents = readData('incidents');
  res.json(incidents);
});

app.post('/api/incidents', (req, res) => {
  const incidents = readData('incidents');
  const newIncident = { ...req.body, id: `INC-${Date.now()}` };
  incidents.push(newIncident);
  writeData('incidents', incidents);
  res.status(201).json(newIncident);
});

app.put('/api/incidents/:id', (req, res) => {
  const incidents = readData('incidents');
  const index = incidents.findIndex((i) => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Incident not found' });
  incidents[index] = { ...incidents[index], ...req.body };
  writeData('incidents', incidents);
  res.json(incidents[index]);
});

app.delete('/api/incidents/:id', (req, res) => {
  let incidents = readData('incidents');
  incidents = incidents.filter((i) => i.id !== req.params.id);
  writeData('incidents', incidents);
  res.json({ success: true });
});

// ============ VULNERABILITIES ============
app.get('/api/vulnerabilities', (req, res) => {
  const vulnerabilities = readData('vulnerabilities');
  res.json(vulnerabilities);
});

app.post('/api/vulnerabilities', (req, res) => {
  const vulnerabilities = readData('vulnerabilities');
  const newVulnerability = { ...req.body, id: `VUL-${Date.now()}` };
  vulnerabilities.push(newVulnerability);
  writeData('vulnerabilities', vulnerabilities);
  res.status(201).json(newVulnerability);
});

app.put('/api/vulnerabilities/:id', (req, res) => {
  const vulnerabilities = readData('vulnerabilities');
  const index = vulnerabilities.findIndex((v) => v.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Vulnerability not found' });
  vulnerabilities[index] = { ...vulnerabilities[index], ...req.body };
  writeData('vulnerabilities', vulnerabilities);
  res.json(vulnerabilities[index]);
});

// ============ AUDIT LOGS ============
app.get('/api/audit-logs', (req, res) => {
  const auditLogs = readData('audit-logs');
  res.json(auditLogs);
});

app.post('/api/audit-logs', (req, res) => {
  const auditLogs = readData('audit-logs');
  const newLog = { ...req.body, id: `AUD-${Date.now()}` };
  auditLogs.unshift(newLog);
  writeData('audit-logs', auditLogs);
  res.status(201).json(newLog);
});

// ============ METRICS ============
app.get('/api/metrics', (req, res) => {
  const metrics = readData('metrics');
  res.json(metrics);
});

app.put('/api/metrics', (req, res) => {
  writeData('metrics', req.body);
  res.json(req.body);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✓ Backend server running at http://localhost:${PORT}`);
  console.log(`✓ CORS enabled for frontend at http://localhost:5173`);
});
