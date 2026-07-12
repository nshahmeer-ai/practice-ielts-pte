'use client'

import React, { useState, useEffect } from 'react'
import { client } from '../../../sanity/client'
import Link from 'next/link'
import { deleteReadingTest } from './actions'
import '../admin.css'

export default function IeltsReadingAdmin() {
  const [tests, setTests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTests() {
      const data = await client.fetch(`*[_type == "ieltsReading"] | order(_createdAt desc)`)
      setTests(data)
      setLoading(false)
    }
    fetchTests()
  }, [])

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>IELTS Reading Tests</h1>
          <p style={{ color: 'var(--admin-text-muted)' }}>Manage your computerized IELTS Reading tests.</p>
        </div>
        <Link href="/admin/ielts-reading/create" className="admin-btn" style={{ padding: '12px 24px', fontSize: '16px' }}>
          <span className="material-symbols-outlined">add</span> Create New Test
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--admin-text-muted)' }}>Loading tests...</div>
      ) : tests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px', background: 'white', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#cbd5e1', marginBottom: '16px' }}>menu_book</span>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>No Tests Found</h3>
          <p style={{ color: 'var(--admin-text-muted)', marginBottom: '24px' }}>You haven't created any IELTS Reading tests yet.</p>
          <Link href="/admin/ielts-reading/create" className="admin-btn">Create Your First Test</Link>
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--admin-border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--admin-border)', textAlign: 'left' }}>
                <th style={{ padding: '16px 24px', fontWeight: '600', color: '#475569' }}>Test Title</th>
                <th style={{ padding: '16px 24px', fontWeight: '600', color: '#475569' }}>Passages</th>
                <th style={{ padding: '16px 24px', fontWeight: '600', color: '#475569' }}>Duration</th>
                <th style={{ padding: '16px 24px', fontWeight: '600', color: '#475569' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map(test => (
                <tr key={test._id} style={{ borderBottom: '1px solid var(--admin-border)' }}>
                  <td style={{ padding: '16px 24px', fontWeight: '500' }}>{test.title}</td>
                  <td style={{ padding: '16px 24px', color: '#64748b' }}>{test.passages?.length || 0} Passages</td>
                  <td style={{ padding: '16px 24px', color: '#64748b' }}>{test.duration} mins</td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link href={`/ielts/reading/${test.slug?.current}`} target="_blank" className="admin-btn admin-btn-secondary" style={{ padding: '6px 12px', fontSize: '14px' }}>
                        Preview
                      </Link>
                      <button 
                        onClick={() => alert("Editing will be added momentarily.")}
                        className="admin-btn" style={{ padding: '6px 12px', fontSize: '14px', background: '#f1f5f9', color: '#3b82f6', border: '1px solid #bfdbfe' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={async () => {
                          if (confirm('Are you sure you want to permanently delete this test?')) {
                            setLoading(true)
                            await deleteReadingTest(test._id)
                            setTests(tests.filter(t => t._id !== test._id))
                            setLoading(false)
                          }
                        }}
                        className="admin-btn admin-btn-danger" 
                        style={{ padding: '6px 12px', fontSize: '14px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
