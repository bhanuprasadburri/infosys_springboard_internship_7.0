import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_with_a_strong_secret';
const TOKEN_EXPIRY = '8h';

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email) {
  return typeof email === 'string' && emailRegex.test(email.trim().toLowerCase());
}

function validatePassword(password) {
  return (
    typeof password === 'string' &&
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

function sanitize(value) {
  return typeof value === 'string' ? value.trim() : '';
}

app.post('/api/auth/signup', async (req, res) => {
  try {
    const fullName = sanitize(req.body.fullName);
    const email = sanitize(req.body.email).toLowerCase();
    const password = sanitize(req.body.password);

    if (!fullName) {
      return res.status(400).json({ error: 'Full name is required.' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.' });
    }

    const [existingUsers] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
      [fullName, email, passwordHash]
    );

    const userId = (result && result.insertId) ? String(result.insertId) : undefined;
    const user = {
      id: userId ?? '',
      fullName,
      email,
      role: 'Viewer',
    };

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
    return res.status(201).json({ message: 'Account created successfully.', token, user });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Unable to create account. Please try again later.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const email = sanitize(req.body.email).toLowerCase();
    const password = sanitize(req.body.password);

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Password is required.' });
    }

    const [rows] = await pool.execute(
      'SELECT id, full_name, email, password_hash, role FROM users WHERE email = ?',
      [email]
    );

    const users = Array.isArray(rows) ? rows : [];
    const matchingUser = users[0];
    if (!matchingUser) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const validPassword = await bcrypt.compare(password, matchingUser.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = {
      id: String(matchingUser.id),
      fullName: matchingUser.full_name,
      email: matchingUser.email,
      role: matchingUser.role || 'Viewer',
    };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

    return res.json({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Unable to sign in. Please try again later.' });
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

app.get('/api/auth/me', authenticateToken, (req, res) => {
  return res.json({ user: req.user });
});

app.get('/api/health', (req, res) => {
  return res.json({ status: 'ok' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
  console.info(`SentinelCore auth server running on http://localhost:${PORT}`);
});
