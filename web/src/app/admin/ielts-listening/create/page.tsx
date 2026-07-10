'use client'

import React, { useState } from 'react'
import { createIELTSListeningTest } from '../../actions'

export default function CreateListeningTest() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    audioUrl: '',
    duration: 30,
    sections: [
      {
        title: 'Section 1 — Questions 1-10',
        context: '',
        questions: [
          { questionNumber: 1, questionText: '', questionType: 'Multiple Choice', options: '', correctAnswer: '' }
        ]
      }
    ]
  })

  const addSection = () => {
    setFormData({
      ...formData,
      sections: [
        ...formData.sections,
        {
          title: \`Section \${formData.sections.length + 1}\`,
          context: '',
          questions: [{ questionNumber: 1, questionText: '', questionType: 'Multiple Choice', options: '', correctAnswer: '' }]
        }
      ]
    })
  }

  const addQuestion = (sectionIndex: number) => {
    const newSections = [...formData.sections]
    const lastQNum = newSections[sectionIndex].questions.length > 0 
      ? newSections[sectionIndex].questions[newSections[sectionIndex].questions.length - 1].questionNumber 
      : 0
    newSections[sectionIndex].questions.push({
      questionNumber: lastQNum + 1,
      questionText: '',
      questionType: 'Multiple Choice',
      options: '',
      correctAnswer: ''
    })
    setFormData({ ...formData, sections: newSections })
  }

  const handleQuestionChange = (sIndex: number, qIndex: number, field: string, value: string) => {
    const newSections = [...formData.sections]
    newSections[sIndex].questions[qIndex] = { ...newSections[sIndex].questions[qIndex], [field]: value }
    setFormData({ ...formData, sections: newSections })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await createIELTSListeningTest(formData)
      setSuccess('Test successfully created and published!')
      // Reset form or redirect
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="admin-top-actions">
        <a href="/admin" className="admin-btn admin-btn-secondary" style={{ padding: '8px 16px' }}>
          <span className="material-symbols-outlined">arrow_back</span> Cancel
        </a>
        <button onClick={handleSubmit} disabled={loading} className="admin-btn admin-btn-primary">
          {loading ? 'Publishing...' : 'Publish Test'}
        </button>
      </div>

      {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>{error}</div>}
      {success && <div style={{ background: '#dcfce3', color: '#15803d', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>{success}</div>}

      <div className="admin-form-container">
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="admin-form-card" style={{ padding: '0' }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Test Posting Title..." 
              style={{ fontSize: '2rem', fontWeight: 800, border: 'none', padding: '24px', color: 'var(--color-indigo)', borderRadius: '16px' }}
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="admin-form-card">
            <div className="admin-form-title">
              <span className="material-symbols-outlined">description</span> Test Content
            </div>
            
            {formData.sections.map((section, sIndex) => (
              <div key={sIndex} className="admin-dynamic-list">
                <div className="admin-dynamic-list-header">
                  <span>{section.title}</span>
                </div>
                
                <div className="form-group">
                  <label>Section Context / Instructions</label>
                  <textarea 
                    className="form-control" 
                    placeholder="Enter transcript, map details, or instructions..."
                    value={section.context}
                    onChange={e => {
                      const newSections = [...formData.sections]
                      newSections[sIndex].context = e.target.value
                      setFormData({ ...formData, sections: newSections })
                    }}
                  />
                </div>

                <div style={{ marginTop: '24px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-indigo)', textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>Questions</label>
                  {section.questions.map((q, qIndex) => (
                    <div key={qIndex} style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'flex-start' }}>
                      <input 
                        type="number" 
                        className="form-control" 
                        style={{ width: '80px' }} 
                        placeholder="Q#" 
                        value={q.questionNumber}
                        onChange={e => handleQuestionChange(sIndex, qIndex, 'questionNumber', e.target.value)}
                      />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Question Text" 
                          value={q.questionText}
                          onChange={e => handleQuestionChange(sIndex, qIndex, 'questionText', e.target.value)}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <select className="form-control" style={{ width: '180px' }} value={q.questionType} onChange={e => handleQuestionChange(sIndex, qIndex, 'questionType', e.target.value)}>
                            <option>Multiple Choice</option>
                            <option>Fill in the Blank</option>
                            <option>Matching</option>
                          </select>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Options (comma separated)" 
                            value={q.options}
                            onChange={e => handleQuestionChange(sIndex, qIndex, 'options', e.target.value)}
                          />
                        </div>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Correct Answer" 
                          style={{ border: '1px solid var(--color-teal)' }}
                          value={q.correctAnswer}
                          onChange={e => handleQuestionChange(sIndex, qIndex, 'correctAnswer', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => addQuestion(sIndex)} className="admin-btn admin-btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                    + Add Question
                  </button>
                </div>
              </div>
            ))}

            <button type="button" onClick={addSection} className="admin-btn admin-btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              + Add Another Section
            </button>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="admin-form-card">
            <div className="admin-form-title">
              <span className="material-symbols-outlined">settings</span> Test Settings
            </div>
            
            <div className="form-group">
              <label>Duration (Minutes)</label>
              <input 
                type="number" 
                className="form-control" 
                value={formData.duration}
                onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              />
            </div>
            
            <div className="form-group">
              <label>Difficulty</label>
              <select className="form-control">
                <option>Academic</option>
                <option>General Training</option>
              </select>
            </div>
          </div>

          <div className="admin-form-card">
            <div className="admin-form-title">
              <span className="material-symbols-outlined">perm_media</span> Media & Links
            </div>
            
            <div className="form-group">
              <label>Audio File URL</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Google Drive link or MP3..." 
                value={formData.audioUrl}
                onChange={e => setFormData({ ...formData, audioUrl: e.target.value })}
              />
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '8px' }}>Paste direct audio link for the listening test player.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
