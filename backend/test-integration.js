#!/usr/bin/env node

/**
 * Backend Integration Test Suite
 * Tests all API endpoints and data persistence
 */

const http = require('http');

const API_BASE = 'http://localhost:3001';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

let testsPassed = 0;
let testsFailed = 0;

// Helper: make HTTP requests
function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: `/api${normalizedPath}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// Test wrapper
async function test(name, fn) {
  try {
    await fn();
    console.log(`  ${colors.green}✓${colors.reset} ${name}`);
    testsPassed++;
  } catch (error) {
    console.log(`  ${colors.red}✗${colors.reset} ${name}`);
    console.log(`    ${colors.red}${error.message}${colors.reset}`);
    testsFailed++;
  }
}

// Assertion helpers
function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) throw new Error(`${message}: expected ${expected}, got ${actual}`);
}

async function runTests() {
  console.log(`\n${colors.cyan}=== Backend Integration Tests ===${colors.reset}\n`);

  // Health check
  console.log('Health Check:');
  await test('GET /api/health', async () => {
    const res = await makeRequest('GET', '/health');
    assertEqual(res.status, 200, 'Health check status');
    assert(res.data.status === 'ok', 'Health check response');
  });

  // Auth flows
  console.log('\nAuth:' );
  await test('POST /api/auth/admin/login', async () => {
    const res = await makeRequest('POST', '/auth/admin/login', { email: 'bhanu@gmail.com', password: 'Bhanu@' });
    assertEqual(res.status, 200, 'Admin login status');
    assert(res.data.user.email === 'bhanu@gmail.com', 'Admin response should include the admin email');
    assert(res.data.token, 'Admin response should include a token');
  });

  await test('POST /api/auth/user/signup', async () => {
    const newUser = { fullName: 'Test User', email: 'test.user@example.com', password: 'Test@1234' };
    const res = await makeRequest('POST', '/auth/user/signup', newUser);
    assertEqual(res.status, 201, 'User signup status');
    assert(res.data.user.email === newUser.email, 'Signup response should include the created email');
    assert(res.data.token, 'Signup response should include a token');
  });

  await test('POST /api/auth/user/login', async () => {
    const res = await makeRequest('POST', '/auth/user/login', { email: 'test.user@example.com', password: 'Test@1234' });
    assertEqual(res.status, 200, 'User login status');
    assert(res.data.user.email === 'test.user@example.com', 'Login response should include the registered email');
    assert(res.data.token, 'Login response should include a token');
  });

  // Assets
  console.log('\nAssets:');
  await test('GET /api/assets', async () => {
    const res = await makeRequest('GET', '/assets');
    assertEqual(res.status, 200, 'GET assets status');
    assert(Array.isArray(res.data), 'Assets should be array');
    assert(res.data.length > 0, 'Should have seeded assets');
  });

  await test('POST /api/assets', async () => {
    const newAsset = { name: 'test-asset', type: 'server', status: 'healthy', environment: 'test' };
    const res = await makeRequest('POST', '/assets', newAsset);
    assertEqual(res.status, 201, 'POST assets status');
    assert(res.data.id, 'Response should have ID');
  });

  // Incidents
  console.log('\nIncidents:');
  await test('GET /api/incidents', async () => {
    const res = await makeRequest('GET', '/incidents');
    assertEqual(res.status, 200, 'GET incidents status');
    assert(Array.isArray(res.data), 'Incidents should be array');
  });

  await test('POST /api/incidents', async () => {
    const newIncident = { title: 'Test Incident', severity: 'high', status: 'Open', assignedTeam: 'Test Team', affectedAsset: 'test-asset', slaHours: 4 };
    const res = await makeRequest('POST', '/incidents', newIncident);
    assertEqual(res.status, 201, 'POST incidents status');
    assert(res.data.id, 'Response should have ID');
  });

  // Vulnerabilities
  console.log('\nVulnerabilities:');
  await test('GET /api/vulnerabilities', async () => {
    const res = await makeRequest('GET', '/vulnerabilities');
    assertEqual(res.status, 200, 'GET vulnerabilities status');
    assert(Array.isArray(res.data), 'Vulnerabilities should be array');
    assert(res.data.length > 0, 'Should have seeded vulnerabilities');
  });

  // Alerts
  console.log('\nAlerts:');
  await test('GET /api/alerts', async () => {
    const res = await makeRequest('GET', '/alerts');
    assertEqual(res.status, 200, 'GET alerts status');
    assert(Array.isArray(res.data), 'Alerts should be array');
  });

  // Audit Logs
  console.log('\nAudit Logs:');
  await test('GET /api/audit-logs', async () => {
    const res = await makeRequest('GET', '/audit-logs');
    assertEqual(res.status, 200, 'GET audit-logs status');
    assert(Array.isArray(res.data), 'Audit logs should be array');
    assert(res.data.length > 0, 'Should have seeded audit logs');
  });

  await test('POST /api/audit-logs', async () => {
    const newLog = { action: 'Test Action', user: 'Test User', timestamp: '12:00 PM', date: new Date().toISOString().slice(0, 10), source: 'Test' };
    const res = await makeRequest('POST', '/audit-logs', newLog);
    assertEqual(res.status, 201, 'POST audit-logs status');
    assert(res.data.id, 'Response should have ID');
  });

  // Metrics
  console.log('\nMetrics:');
  await test('GET /api/metrics', async () => {
    const res = await makeRequest('GET', '/metrics');
    assertEqual(res.status, 200, 'GET metrics status');
    assert(Array.isArray(res.data), 'Metrics should be array');
  });

  // Summary
  console.log(`\n${colors.cyan}=== Test Summary ===${colors.reset}`);
  console.log(`  ${colors.green}Passed: ${testsPassed}${colors.reset}`);
  if (testsFailed > 0) {
    console.log(`  ${colors.red}Failed: ${testsFailed}${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`  ${colors.green}All tests passed!${colors.reset}\n`);
    process.exit(0);
  }
}

// Wait for server and run tests
console.log(`${colors.yellow}Waiting for server to be ready...${colors.reset}`);
let retries = 10;
const checkServer = setInterval(async () => {
  try {
    await makeRequest('GET', '/health');
    clearInterval(checkServer);
    runTests();
  } catch (error) {
    retries--;
    if (retries === 0) {
      console.error(`${colors.red}✗ Could not connect to backend at ${API_BASE}/api${colors.reset}`);
      console.error(`${colors.yellow}Make sure the backend server is running: node backend/server.js${colors.reset}`);
      process.exit(1);
    }
  }
}, 500);
