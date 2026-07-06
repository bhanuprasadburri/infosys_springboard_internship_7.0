import React, { useState } from 'react'
import './auth.css'

const roles = ['Admin', 'User']

export default function AuthPage({ mode, setMode, onAuth }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'User' })

  const handleChange = (key) => (event) => {
    setForm({ ...form, [key]: event.target.value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const user = {
      name: form.name || form.email.split('@')[0],
      email: form.email,
      role: form.role,
    }
    onAuth(user)
  }

  return (
    <div className="auth-shell">
      <div className="auth-card auth-login-card">
        <div className="auth-title">SentinelCore SecureOps</div>
        <div className="auth-tagline">Enterprise monitoring, compliance, and incident response.</div>
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            type="button"
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
            type="button"
            onClick={() => setMode('signup')}
          >
            Sign Up
          </button>
        </div>
        <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
        <p className="auth-intro">
          {mode === 'login'
            ? 'Sign in to access the SecureOps dashboard and monitoring tools.'
            : 'Create an admin or user profile to manage alerts, compliance, and incidents.'}
        </p>
        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="auth-field">
              <label htmlFor="name">Name</label>
              <input id="name" value={form.name} onChange={handleChange('name')} required />
            </div>
          )}
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={form.email} onChange={handleChange('email')} required />
          </div>
          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={form.password} onChange={handleChange('password')} required />
          </div>
          <div className="auth-field">
            <label htmlFor="role">Role</label>
            <select id="role" value={form.role} onChange={handleChange('role')}>
              {roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="auth-submit">
            {mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <div className="auth-footer">
          <span>
            {mode === 'login' ? 'New here?' : 'Already have an account?'}
          </span>
          <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Create account' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  )
}
