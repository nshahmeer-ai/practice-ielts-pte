import React from 'react'
import { client } from '../../sanity/client'

export const revalidate = 0 // Always fetch latest for admin dashboard

export default async function AdminDashboard() {
  const [listeningCount, readingCount, writingCount, speakingCount, pteCount] = await Promise.all([
    client.fetch(`count(*[_type == "ieltsListening"])`),
    client.fetch(`count(*[_type == "ieltsReading"])`),
    client.fetch(`count(*[_type == "ieltsWriting"])`),
    client.fetch(`count(*[_type == "ieltsSpeaking"])`),
    client.fetch(`count(*[_type == "pteTest"])`),
  ])

  return (
    <>
      <div className="admin-header">
        <h1>👋 Welcome Back, Admin</h1>
        <p>Here's what's happening on your portal today.</p>
      </div>

      <div className="admin-stats-grid">
        <div className="stat-card purple">
          <div className="stat-card-icon">
            <span className="material-symbols-outlined">headphones</span>
          </div>
          <h3>{listeningCount}</h3>
          <p>Listening Tests</p>
        </div>
        <div className="stat-card indigo">
          <div className="stat-card-icon">
            <span className="material-symbols-outlined">menu_book</span>
          </div>
          <h3>{readingCount}</h3>
          <p>Reading Tests</p>
        </div>
        <div className="stat-card teal">
          <div className="stat-card-icon">
            <span className="material-symbols-outlined">edit_note</span>
          </div>
          <h3>{writingCount}</h3>
          <p>Writing Tests</p>
        </div>
        <div className="stat-card orange">
          <div className="stat-card-icon">
            <span className="material-symbols-outlined">school</span>
          </div>
          <h3>{pteCount}</h3>
          <p>PTE Tests</p>
        </div>
      </div>

      <h2 className="section-title">Quick Actions</h2>
      <div className="quick-actions-grid">
        <a href="/admin/ielts-listening/create" className="action-card">
          <div className="action-card-icon">
            <span className="material-symbols-outlined">add_circle</span>
          </div>
          <h4>Post Listening Test</h4>
          <p>Add a new IELTS Listening Test</p>
        </a>
        <a href="/admin/ielts-reading/create" className="action-card">
          <div className="action-card-icon">
            <span className="material-symbols-outlined">post_add</span>
          </div>
          <h4>Post Reading Test</h4>
          <p>Add a new IELTS Reading Passage</p>
        </a>
        <a href="/admin/ielts-writing/create" className="action-card">
          <div className="action-card-icon">
            <span className="material-symbols-outlined">draw</span>
          </div>
          <h4>Post Writing Test</h4>
          <p>Add Task 1 & Task 2 prompts</p>
        </a>
        <a href="/admin/pte/create" className="action-card">
          <div className="action-card-icon">
            <span className="material-symbols-outlined">library_add</span>
          </div>
          <h4>Post PTE Test</h4>
          <p>Add new PTE Academic tasks</p>
        </a>
      </div>

      <div style={{ marginTop: '40px', background: 'linear-gradient(135deg, #1e3a8a, #312e81)', padding: '24px', borderRadius: '16px', color: 'white', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '12px', display: 'flex' }}>
          <span className="material-symbols-outlined">admin_panel_settings</span>
        </div>
        <div>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>Your Role: Super Admin</h4>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>You have full access to manage all content and tests on the PracticeHub platform.</p>
        </div>
      </div>
    </>
  )
}
