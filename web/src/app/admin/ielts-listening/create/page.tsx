'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createListeningTest } from './actions'
import '../../admin.css'

export default function CreateIeltsListening() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [testData, setTestData] = useState({
    title: '',
    duration: 30,
    passageContent: '',
    googleDriveAudioUrl: '',
    questions: [
      {
        questionNumber: 1,
        questionText: '',
        questionType: 'Fill in the Blank',
        options: '',
        correctAnswer: '',
        explanation: '',
        googleDriveImageContext: ''
      }
    ]
  })

  const handleAddQuestion = () => {
    setTestData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionNumber: prev.questions.length + 1,
          questionText: '',
          questionType: 'Fill in the Blank',
          options: '',
          correctAnswer: '',
          explanation: '',
          googleDriveImageContext: ''
        }
      ]
    }))
  }

  const handleQuestionChange = (index: number, field: string, value: any) => {
    setTestData(prev => {
      const newQs = [...prev.questions]
      newQs[index] = { ...newQs[index], [field]: value }
      return { ...prev, questions: newQs }
    })
  }

  const handleRemoveQuestion = (index: number) => {
    setTestData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index).map((q, i) => ({ ...q, questionNumber: i + 1 }))
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await createListeningTest(testData)
      
      if (res.success) {
        router.push('/admin/ielts-listening')
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
          <Link href="/admin/ielts-listening" style={{ color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', marginBottom: '8px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span> Back to Tests
          </Link>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Create Listening Test</h1>
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
            
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#334155' }}>Duration (minutes)</label>
              <input 
                type="number" 
                required 
                min="1"
                style={{ width: '200px', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px' }}
                value={testData.duration}
                onChange={e => setTestData({...testData, duration: parseInt(e.target.value)})}
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
            <textarea 
              placeholder="E.g., Good for people who are especially keen on (1) [[1]]"
              style={{ width: '100%', minHeight: '300px', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', fontFamily: 'monospace' }}
              value={testData.passageContent}
              onChange={e => setTestData({...testData, passageContent: e.target.value})}
            />
          </div>
        </div>

        {/* Questions Array */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--admin-border)', paddingBottom: '12px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Questions</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {testData.questions.map((q, index) => (
              <div key={index} style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                  <button type="button" onClick={() => handleRemoveQuestion(index)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
                  </button>
                </div>
                
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: '#0f172a' }}>Question {q.questionNumber}</h3>

                <div style={{ display: 'grid', gap: '16px' }}>
                  
                  {/* Context Image */}
                  <div>
                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', fontSize: '14px', color: '#475569' }}>Context Image (Google Drive URL) - Optional</label>
                    <input 
                      type="url" 
                      placeholder="Map or Diagram Link for this question"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                      value={q.googleDriveImageContext}
                      onChange={e => handleQuestionChange(index, 'googleDriveImageContext', e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', fontSize: '14px', color: '#475569' }}>Question Text</label>
                      <input 
                        type="text" 
                        required 
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                        value={q.questionText}
                        onChange={e => handleQuestionChange(index, 'questionText', e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', fontSize: '14px', color: '#475569' }}>Question Type</label>
                      <select 
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', background: 'white' }}
                        value={q.questionType}
                        onChange={e => handleQuestionChange(index, 'questionType', e.target.value)}
                      >
                        <option value="Fill in the Blank">Fill in the Blank</option>
                        <option value="Multiple Choice">Multiple Choice</option>
                        <option value="Matching">Matching</option>
                        <option value="Map Labeling">Map Labeling</option>
                        <option value="Multiple Select">Multiple Select</option>
                      </select>
                    </div>
                  </div>

                  {(q.questionType === 'Multiple Choice' || q.questionType === 'Multiple Select') && (
                    <div>
                      <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', fontSize: '14px', color: '#475569' }}>Options (Comma Separated)</label>
                      <input 
                        type="text" 
                        placeholder="e.g., A, B, C, D"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                        value={q.options}
                        onChange={e => handleQuestionChange(index, 'options', e.target.value)}
                      />
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', fontSize: '14px', color: '#475569' }}>Correct Answer</label>
                      <input 
                        type="text" 
                        required 
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', borderLeft: '3px solid #22c55e' }}
                        value={q.correctAnswer}
                        onChange={e => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', fontSize: '14px', color: '#475569' }}>Explanation (Optional)</label>
                      <input 
                        type="text" 
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                        value={q.explanation}
                        onChange={e => handleQuestionChange(index, 'explanation', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            type="button" 
            onClick={handleAddQuestion}
            style={{ marginTop: '24px', width: '100%', padding: '16px', background: '#f1f5f9', border: '2px dashed #cbd5e1', borderRadius: '12px', color: '#475569', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '16px' }}
          >
            <span className="material-symbols-outlined">add_circle</span>
            Add Question
          </button>
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
            {loading ? 'Publishing...' : 'Publish Test'}
          </button>
        </div>
      </form>
    </div>
  )
}
