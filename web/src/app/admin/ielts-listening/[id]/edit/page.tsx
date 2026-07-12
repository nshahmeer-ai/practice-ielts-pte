'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { updateListeningTest } from '../../create/actions'
import { client } from '../../../../../sanity/client'
import '../../../admin.css'

export default function EditIeltsListening({ params }: { params: any }) {
  const router = useRouter()
  const resolvedParams = params instanceof Promise ? React.use(params) : params;
  const id = resolvedParams?.id;

  const [loadingData, setLoadingData] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [testData, setTestData] = useState({
    title: '',
    passageContent: '',
    googleDriveAudioUrl: '',
    rawAnswerKey: ''
  })

  useEffect(() => {
    async function fetchTest() {
      if (!id) return;
      try {
        const data = await client.fetch(`*[_type == "ieltsListening" && _id == $id][0]`, { id })
        if (data) {
          setTestData({
            title: data.title || '',
            passageContent: data.passageContent || '',
            googleDriveAudioUrl: data.googleDriveAudioUrl || '',
            rawAnswerKey: data.rawAnswerKey || ''
          })
        }
      } catch (err) {
        console.error("Failed to fetch test", err)
        setError("Failed to load existing test data")
      } finally {
        setLoadingData(false)
      }
    }
    fetchTest()
  }, [id])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await updateListeningTest(id, testData)
      
      if (res.success) {
        setLoading(false)
        router.push('/admin/ielts-listening')
        router.refresh()
      } else {
        setError(res.error || 'Failed to update test')
        setLoading(false)
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
      setLoading(false)
    }
  }

  if (loadingData) return <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>Loading test data...</div>

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <Link href="/admin/ielts-listening" style={{ color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', marginBottom: '8px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span> Back to Tests
          </Link>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Edit Listening Test</h1>
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
          
          <div style={{ display: 'grid', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#334155' }}>Test Title</label>
              <input 
                type="text" 
                required 
                placeholder="e.g., IELTS Listening Practice Test 1"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px' }}
                value={testData.title}
                onChange={e => setTestData({...testData, title: e.target.value})}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#334155' }}>Audio Track (Google Drive URL)</label>
              <input 
                type="url" 
                required 
                placeholder="Paste the shareable Google Drive audio link"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px' }}
                value={testData.googleDriveAudioUrl}
                onChange={e => setTestData({...testData, googleDriveAudioUrl: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Passage Content */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid var(--admin-border)', paddingBottom: '12px', marginBottom: '24px' }}>Context / Reading Content</h2>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#334155' }}>Passage or Table (HTML/Text)</label>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>Paste text or HTML tables. To insert an inline fill-in-the-blank input for Question 1, simply type <strong>[[1]]</strong> where the blank should be. The system will automatically convert it into an interactive box.</p>
            <div 
              contentEditable
              onBlur={(e) => setTestData({...testData, passageContent: e.currentTarget.innerHTML})}
              onPaste={handlePaste}
              suppressContentEditableWarning={true}
              dangerouslySetInnerHTML={{ __html: testData.passageContent }}
              style={{ 
                width: '100%', 
                minHeight: '300px', 
                padding: '16px', 
                borderRadius: '8px', 
                border: '1px solid #cbd5e1', 
                fontSize: '15px', 
                fontFamily: 'sans-serif',
                backgroundColor: 'white',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap'
              }}
            />
          </div>
        </div>

        {/* Answer Key */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--admin-border)', paddingBottom: '12px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Answer Key (1-40)</h2>
          </div>
          
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#334155' }}>Paste the list of correct answers</label>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>This will automatically generate a 1-40 Answer Sheet for the student. Please paste the answers in sequence.</p>
            <textarea 
              required
              rows={40}
              placeholder="1. Fish&#10;2. Roof&#10;3. Spanish"
              style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', fontFamily: 'monospace' }}
              value={testData.rawAnswerKey}
              onChange={e => setTestData({...testData, rawAnswerKey: e.target.value})}
            />
          </div>
        </div>

        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <Link href="/admin/ielts-listening" style={{ padding: '14px 24px', borderRadius: '8px', border: '1px solid #cbd5e1', color: '#475569', textDecoration: 'none', fontWeight: '600' }}>
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={loading}
            style={{ padding: '14px 32px', borderRadius: '8px', background: '#2563eb', color: 'white', border: 'none', fontWeight: '600', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
