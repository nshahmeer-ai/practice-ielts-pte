'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createReadingTest } from '../actions'
import '../../admin.css'

export default function CreateIeltsReading() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  
  const [testData, setTestData] = useState({
    title: '',
    examTrack: 'Academic',
    duration: 60,
    passages: [
      { passageTitle: 'Part 1', passageText: '', questionsContent: '', rawAnswerKey: '' },
      { passageTitle: 'Part 2', passageText: '', questionsContent: '', rawAnswerKey: '' },
      { passageTitle: 'Part 3', passageText: '', questionsContent: '', rawAnswerKey: '' }
    ]
  })

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    let html = e.clipboardData.getData('text/html')
    if (html) {
      // Sanitize pasted content to prevent copyright/style carry-over
      html = html.replace(/class="[^"]*"/gi, '')
      html = html.replace(/style="[^"]*"/gi, '')
      html = html.replace(/id="[^"]*"/gi, '')
      html = html.replace(/bgcolor="[^"]*"/gi, '')
      html = html.replace(/color="[^"]*"/gi, '')
      html = html.replace(/face="[^"]*"/gi, '')
      document.execCommand('insertHTML', false, html)
    } else {
      const text = e.clipboardData.getData('text/plain')
      document.execCommand('insertText', false, text)
    }
  }

  const updatePassage = (index: number, field: string, value: string) => {
    const newPassages = [...testData.passages]
    newPassages[index] = { ...newPassages[index], [field]: value }
    setTestData({ ...testData, passages: newPassages })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await createReadingTest(testData)
      
      if (res.success) {
        setLoading(false)
        router.push('/admin/ielts-reading')
        router.refresh()
      } else {
        setError(res.error || 'Failed to create test')
        setLoading(false)
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <Link href="/admin/ielts-reading" style={{ color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', marginBottom: '8px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span> Back to Tests
          </Link>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Create Reading Test</h1>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '32px', borderRadius: '12px', border: '1px solid var(--admin-border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
        
        {/* Basic Info */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid var(--admin-border)', paddingBottom: '12px', marginBottom: '24px' }}>General Information</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#334155' }}>Test Title</label>
              <input 
                type="text" 
                required 
                placeholder="e.g., IELTS Reading Practice Test 1"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px' }}
                value={testData.title}
                onChange={e => setTestData({...testData, title: e.target.value})}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#334155' }}>Exam Track</label>
              <select
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px' }}
                value={testData.examTrack}
                onChange={e => setTestData({...testData, examTrack: e.target.value})}
              >
                <option value="Academic">Academic</option>
                <option value="General Training">General Training</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#334155' }}>Duration (mins)</label>
              <input 
                type="number" 
                required 
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px' }}
                value={testData.duration}
                onChange={e => setTestData({...testData, duration: parseInt(e.target.value)})}
              />
            </div>
          </div>
        </div>

        {/* Passages Tabs */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--admin-border)', marginBottom: '24px' }}>
            {testData.passages.map((p, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveTab(index)}
                style={{
                  padding: '12px 24px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === index ? '2px solid var(--color-primary, #6366f1)' : '2px solid transparent',
                  color: activeTab === index ? 'var(--color-primary, #6366f1)' : '#64748b',
                  fontWeight: activeTab === index ? 'bold' : 'normal',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                {p.passageTitle || `Passage ${index + 1}`}
              </button>
            ))}
          </div>

          <div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#334155' }}>Passage Title</label>
              <input 
                type="text" 
                required 
                placeholder="e.g., The History of Glass"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px' }}
                value={testData.passages[activeTab].passageTitle}
                onChange={e => updatePassage(activeTab, 'passageTitle', e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              
              {/* Left Pane: Reading Passage */}
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#334155' }}>Reading Passage (Left Pane)</label>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>Paste the actual article text/HTML here.</p>
                <div 
                  contentEditable
                  onBlur={(e) => updatePassage(activeTab, 'passageText', e.currentTarget.innerHTML)}
                  onPaste={handlePaste}
                  suppressContentEditableWarning={true}
                  style={{ 
                    width: '100%', 
                    height: '400px', 
                    padding: '16px', 
                    borderRadius: '8px', 
                    border: '1px solid #cbd5e1', 
                    fontSize: '15px', 
                    backgroundColor: '#f8fafc',
                    overflowY: 'auto',
                  }}
                />
              </div>

              {/* Right Pane: Questions */}
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#334155' }}>Questions Content (Right Pane)</label>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>Paste HTML. Type <strong>[[1]]</strong> for question 1 input boxes.</p>
                <div 
                  contentEditable
                  onBlur={(e) => updatePassage(activeTab, 'questionsContent', e.currentTarget.innerHTML)}
                  onPaste={handlePaste}
                  suppressContentEditableWarning={true}
                  style={{ 
                    width: '100%', 
                    height: '400px', 
                    padding: '16px', 
                    borderRadius: '8px', 
                    border: '1px solid #cbd5e1', 
                    fontSize: '15px', 
                    backgroundColor: '#f8fafc',
                    overflowY: 'auto',
                  }}
                />
              </div>
            </div>

            {/* Answer Key */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#334155' }}>Raw Answer Key</label>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>Paste the correct answers for this specific passage (e.g., 1. Answer).</p>
              <textarea 
                rows={10}
                placeholder="1. Answer&#10;2. Answer"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', resize: 'vertical' }}
                value={testData.passages[activeTab].rawAnswerKey}
                onChange={e => updatePassage(activeTab, 'rawAnswerKey', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--admin-border)', paddingTop: '24px', marginTop: '24px' }}>
          <button 
            type="submit" 
            disabled={loading}
            className="admin-btn"
            style={{ padding: '12px 32px', fontSize: '16px', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Publishing...' : 'Publish Reading Test'}
          </button>
        </div>

      </form>
    </div>
  )
}
