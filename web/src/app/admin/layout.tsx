import React from 'react'
import './admin.css'

export const metadata = {
  title: 'Admin Dashboard | Insight English Institute'
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Hide the public navbar and footer globally when in admin mode */}
      <style>{`
        .navbar, .footer { display: none !important; }
        #app-container { min-height: 0 !important; padding: 0 !important; }
        body { background-color: var(--admin-bg) !important; }
      `}</style>
      
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-logo">
            <span className="material-symbols-outlined">shield_person</span>
            Admin CMS
          </div>
          <nav className="admin-nav">
            <a href="/admin" className="admin-nav-item active">
              <span className="material-symbols-outlined">dashboard</span>
              Dashboard
            </a>
            <a href="/admin/ielts-listening" className="admin-nav-item">
              <span className="material-symbols-outlined">headphones</span>
              IELTS Listening
            </a>
            <a href="/admin/ielts-reading" className="admin-nav-item">
              <span className="material-symbols-outlined">menu_book</span>
              IELTS Reading
            </a>
            <a href="/studio/structure/ieltsWriting" className="admin-nav-item" target="_blank" rel="noopener noreferrer">
              <span className="material-symbols-outlined">edit_note</span>
              IELTS Writing
            </a>
            <a href="/studio/structure/ieltsSpeaking" className="admin-nav-item" target="_blank" rel="noopener noreferrer">
              <span className="material-symbols-outlined">mic</span>
              IELTS Speaking
            </a>
            <a href="/studio/structure/pteTest" className="admin-nav-item" target="_blank" rel="noopener noreferrer">
              <span className="material-symbols-outlined">school</span>
              PTE Academic
            </a>
            
            <div style={{ flex: 1 }}></div>
            
            <div style={{ padding: '0 16px', marginTop: 'auto' }}>
              <div style={{ background: 'white', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '32px', height: '32px', background: '#1f2937', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Admin User</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>Super Admin</div>
                </div>
              </div>
              <a href="/" className="admin-btn admin-btn-secondary" style={{ width: '100%', justifyContent: 'center', marginBottom: '8px' }}>
                <span className="material-symbols-outlined">open_in_new</span> Go to Site
              </a>
              <a href="/admin/logout" className="admin-btn" style={{ width: '100%', justifyContent: 'center', background: '#fee2e2', color: '#b91c1c', border: 'none' }}>
                <span className="material-symbols-outlined">logout</span> Logout
              </a>
            </div>
          </nav>
        </aside>
        
        <main className="admin-main">
          {children}
        </main>
      </div>
    </>
  )
}
