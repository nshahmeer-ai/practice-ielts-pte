'use client'

import React, { useState } from 'react'
import { loginAdmin } from './actions'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const res = await loginAdmin(password)
      if (res.error) {
        setError(res.error)
      } else {
        // Success! Redirect to the dashboard
        window.location.href = '/admin'
      }
    } catch (err: any) {
      setError('An error occurred during login.')
    }
    setLoading(false)
  }

  return (
    <>
      <style>{`
        .admin-sidebar { display: none !important; }
        .admin-main { 
          padding: 0 !important; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          min-height: 100vh;
          background: var(--admin-bg);
        }
      `}</style>
      
      <div style={{ width: '100%', maxWidth: '400px', background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', background: '#EDE8FF', color: 'var(--color-purple)', borderRadius: '16px', marginBottom: '16px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>lock</span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 8px 0', color: '#1f2937' }}>Admin CMS</h1>
          <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>Enter your master password to access the dashboard.</p>
        </div>
        
        <form onSubmit={handleLogin}>
          {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem', fontWeight: 600 }}>{error}</div>}
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', marginBottom: '8px', letterSpacing: '0.05em' }}>Password</label>
            <input 
              type="password" 
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoFocus
            />
          </div>
          
          <button type="submit" disabled={loading} className="admin-btn admin-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <a href="/" style={{ color: '#6b7280', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>&larr; Back to Website</a>
        </div>
      </div>
    </>
  )
}
