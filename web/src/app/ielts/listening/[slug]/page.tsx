'use client'

import React, { useState, useEffect, useRef } from 'react'
import { client } from '../../../../sanity/client'
import { PortableText } from '@portabletext/react'
import parse, { domToReact } from 'html-react-parser'
import './interactive-test.css'

export default function InteractiveListeningTest({ params }: { params: any }) {
  // In newer Next.js versions, params might be a Promise
  const resolvedParams = params instanceof Promise ? React.use(params) : params;
  const slug = resolvedParams?.slug;

  const [test, setTest] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    async function fetchTest() {
      if (!slug) return;
      try {
        const data = await client.fetch(`*[_type == "ieltsListening" && slug.current == $slug][0]`, {
          slug: slug
        })
        if (data) {
          setTest(data)
        }
      } catch (err) {
        console.error("Failed to fetch test:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchTest()
  }, [slug])

  const handleAnswerChange = (questionNumber: number, value: string) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [questionNumber]: value }))
  }

  const handleCheckboxChange = (questionNumber: number, option: string, isChecked: boolean) => {
    if (submitted) return
    setAnswers(prev => {
      const current = prev[questionNumber] ? prev[questionNumber].split(',').map(s => s.trim()) : []
      if (isChecked) {
        return { ...prev, [questionNumber]: [...current, option].sort().join(', ') }
      } else {
        return { ...prev, [questionNumber]: current.filter(o => o !== option).join(', ') }
      }
    })
  }

  const handleSubmit = () => {
    setSubmitted(true)
    let correct = 0
    
    if (test?.rawAnswerKey) {
      test.rawAnswerKey.split('\n').map((l: string) => l.trim()).filter(Boolean).forEach((line: string, index: number) => {
        const qNum = index + 1;
        const userAns = (answers[qNum] || '').toLowerCase().trim();
        const correctAns = line.replace(/^\d+[\.\)\-]?\s*/, '').toLowerCase().trim();
        
        if (correctAns.includes(',')) {
          const userArr = userAns.split(',').map((s: string) => s.trim()).filter(Boolean).sort()
          const correctArr = correctAns.split(',').map((s: string) => s.trim()).filter(Boolean).sort()
          if (JSON.stringify(userArr) === JSON.stringify(correctArr)) correct++
        } else if (correctAns.includes('/')) {
          const possibleAnswers = correctAns.split('/').map((s: string) => s.trim())
          if (possibleAnswers.includes(userAns)) correct++
        } else {
          if (userAns === correctAns) correct++
        }
      });
    } else {
      test?.questions?.forEach((q: any) => {
        const userAns = (answers[q.questionNumber] || '').toLowerCase().trim()
        const correctAns = (q.correctAnswer || '').toLowerCase().trim()
        
        if (q.questionType === 'Multiple Select') {
          const userArr = userAns.split(',').map((s: string) => s.trim()).filter(Boolean).sort()
          const correctArr = correctAns.split(',').map((s: string) => s.trim()).filter(Boolean).sort()
          if (JSON.stringify(userArr) === JSON.stringify(correctArr)) correct++
        } else {
          if (userAns === correctAns) correct++
        }
      })
    }
    setScore(correct)
  }

  const getTotalQuestions = () => {
    if (test?.rawAnswerKey) {
      return test.rawAnswerKey.split('\n').map((l: string) => l.trim()).filter(Boolean).length;
    }
    return test?.questions?.length || 0;
  }

  const getBandScore = (score: number, total: number) => {
    if (total === 0) return '0.0'
    const equivalentScore = Math.round((score / total) * 40)
    if (equivalentScore >= 39) return '9.0'
    if (equivalentScore >= 37) return '8.5'
    if (equivalentScore >= 35) return '8.0'
    if (equivalentScore >= 32) return '7.5'
    if (equivalentScore >= 30) return '7.0'
    if (equivalentScore >= 26) return '6.5'
    if (equivalentScore >= 23) return '6.0'
    if (equivalentScore >= 18) return '5.5'
    if (equivalentScore >= 16) return '5.0'
    if (equivalentScore >= 13) return '4.5'
    if (equivalentScore >= 10) return '4.0'
    if (equivalentScore >= 7) return '3.5'
    if (equivalentScore >= 5) return '3.0'
    return '0.0'
  }

  const getDriveDirectUrl = (url: string) => {
    if (!url) return '';
    const match = url.match(/\/d\/(.*?)\//) || url.match(/id=(.*?)(&|$)/);
    const id = match ? match[1] : null;
    return id ? `https://drive.google.com/uc?export=download&id=${id}` : url;
  }

  if (loading) return <div className="test-loading">Loading Test Environment...</div>
  if (!test) return <div className="test-not-found">Test not found</div>

  return (
    <div 
      className="interactive-test-layout"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
    >
      {/* Pinned Audio & Timer Bar */}
      <div className="test-header-bar">
        <div style={{ flex: 1 }}></div>
        <div className="audio-player-container" style={{ position: 'relative' }}>
          {test.googleDriveAudioUrl ? (
            <>
              {/* Anti-Popout Blocker */}
              <div style={{ position: 'absolute', top: 0, right: 0, width: '60px', height: '100%', background: '#1e293b', zIndex: 10 }}></div>
              <iframe 
                src={test.googleDriveAudioUrl.replace('/view', '/preview')} 
                width="100%" 
                height="60" 
                allow="autoplay"
                style={{ border: 'none', borderRadius: '8px', overflow: 'hidden' }}
              ></iframe>
            </>
          ) : test.audioUrl ? (
            <audio 
              controls 
              controlsList="nodownload noplaybackrate"
              onEnded={handleSubmit} 
              className="custom-audio"
              onContextMenu={(e) => e.preventDefault()}
            >
              <source src={test.audioUrl} type="audio/mpeg" />
            </audio>
          ) : (
            <div>No audio provided</div>
          )}
        </div>
      </div>

      <div className="test-content-container">
        <h1 className="test-title">{test.title}</h1>
        <p className="test-instructions">Complete the questions below as you listen.</p>

        {test.passageContent && (
          <div className="passage-content" style={{ marginBottom: '40px', background: 'white', padding: '32px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)', fontSize: '16px', lineHeight: '1.6', overflowX: 'auto' }}>
            {(() => {
              // Replace [[X]] with custom element
              const htmlWithTags = test.passageContent.replace(/\[\[(\d+)\]\]/g, '<inline-question data-id="$1"></inline-question>')
              
              const options = {
                replace: (domNode: any) => {
                  if (domNode.name === 'inline-question') {
                    const qNum = parseInt(domNode.attribs['data-id'])
                    
                    return (
                      <span className="inline-question-wrapper" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', margin: '0 4px' }}>
                        <strong style={{ color: '#64748b', fontSize: '14px' }}>({qNum})</strong>
                        <input
                          type="text"
                          style={{
                            width: '150px',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            border: '2px solid #cbd5e1',
                            fontSize: '15px',
                            outline: 'none',
                            transition: 'border-color 0.2s',
                            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                          }}
                          className={`fill-blank-input inline-input ${submitted ? 'submitted' : ''}`}
                          value={answers[qNum] || ''}
                          onChange={(e) => handleAnswerChange(qNum, e.target.value)}
                          disabled={submitted}
                        />
                      </span>
                    )
                  }
                }
              }

              return parse(htmlWithTags, options)
            })()}
          </div>
        )}



        {/* Legacy Questions (Fallback) */}
        {!test.rawAnswerKey && test.questions && (
          <div className="questions-container">
            {test.questions.map((q: any) => (
              <div key={q._key} className={`question-block ${submitted ? 'submitted' : ''}`}>
                <div className="question-header">
                  <span className="q-num">{q.questionNumber}.</span>
                  <span className="q-text">{q.questionText}</span>
                </div>

                {q.googleDriveImageContext && (
                  <div className="q-image-context" style={{ marginBottom: '24px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <img 
                      src={getDriveDirectUrl(q.googleDriveImageContext)} 
                      alt="Question Context" 
                      style={{ width: '100%', height: 'auto', display: 'block', pointerEvents: 'none' }} 
                      onDragStart={(e) => e.preventDefault()}
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  </div>
                )}

                <div className="q-input-area">
                  {q.questionType === 'Multiple Choice' ? (
                    <div className="options-list">
                      {q.options?.split(',').map((opt: string) => {
                        const optionText = opt.trim()
                        return (
                          <label key={optionText} className="option-label">
                            <input 
                              type="radio" 
                              name={`q-${q.questionNumber}`}
                              value={optionText}
                              checked={answers[q.questionNumber] === optionText}
                              onChange={(e) => handleAnswerChange(q.questionNumber, e.target.value)}
                              disabled={submitted}
                            />
                            {optionText}
                          </label>
                        )
                      })}
                    </div>
                  ) : q.questionType === 'Multiple Select' ? (
                    <div className="options-list">
                      {q.options?.split(',').map((opt: string) => {
                        const optionText = opt.trim()
                        const isChecked = answers[q.questionNumber]?.includes(optionText) || false
                        return (
                          <label key={optionText} className="option-label">
                            <input 
                              type="checkbox" 
                              name={`q-${q.questionNumber}`}
                              value={optionText}
                              checked={isChecked}
                              onChange={(e) => handleCheckboxChange(q.questionNumber, optionText, e.target.checked)}
                              disabled={submitted}
                            />
                            {optionText}
                          </label>
                        )
                      })}
                    </div>
                  ) : test.passageContent?.includes(`[[${q.questionNumber}]]`) ? (
                    <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '6px', color: '#64748b', fontSize: '14px', border: '1px dashed #cbd5e1' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '6px' }}>edit_note</span>
                      <em>Answer this question inline in the passage above.</em>
                    </div>
                  ) : (
                    <input 
                      type="text" 
                      className="fill-blank-input" 
                      placeholder="Type answer..." 
                      value={answers[q.questionNumber] || ''}
                      onChange={(e) => handleAnswerChange(q.questionNumber, e.target.value)}
                      disabled={submitted}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!submitted ? (
          <button className="submit-test-btn" onClick={handleSubmit}>Submit Test</button>
        ) : (
          <div className="results-panel">
            <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Test Complete</h2>
            <p style={{ color: '#94a3b8', marginBottom: '32px' }}>Here is your detailed performance breakdown.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '12px' }}>
                <div className="score-number">{score} / {getTotalQuestions()}</div>
                <div className="score-label">Raw Score</div>
              </div>
              <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                <div className="score-number" style={{ color: '#38bdf8' }}>{getBandScore(score, getTotalQuestions())}</div>
                <div className="score-label" style={{ color: '#7dd3fc' }}>Estimated IELTS Band</div>
              </div>
            </div>

            <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>Mistake Matcher</h3>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                    <th style={{ padding: '12px', color: '#94a3b8' }}>#</th>
                    <th style={{ padding: '12px', color: '#94a3b8' }}>Your Answer</th>
                    <th style={{ padding: '12px', color: '#94a3b8' }}>Correct Answer</th>
                    <th style={{ padding: '12px', color: '#94a3b8' }}>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {test.rawAnswerKey ? test.rawAnswerKey.split('\n').map((l: string) => l.trim()).filter(Boolean).map((line: string, index: number) => {
                    const qNum = index + 1
                    const userAns = (answers[qNum] || '').trim()
                    const correctAns = line.replace(/^\d+[\.\)\-]?\s*/, '').trim()
                    
                    // Simple fuzzy matching (case insensitive, allow multiple select comma separation logic implicitly by splitting/sorting if it has commas)
                    let isCorrect = false
                    if (correctAns.includes(',')) {
                      const userArr = userAns.toLowerCase().split(',').map((s: string) => s.trim()).filter(Boolean).sort()
                      const correctArr = correctAns.toLowerCase().split(',').map((s: string) => s.trim()).filter(Boolean).sort()
                      isCorrect = JSON.stringify(userArr) === JSON.stringify(correctArr)
                    } else if (correctAns.includes('/')) {
                      // Support answers like "Roof / Roofs"
                      const possibleAnswers = correctAns.toLowerCase().split('/').map((s: string) => s.trim())
                      isCorrect = possibleAnswers.includes(userAns.toLowerCase())
                    } else {
                      isCorrect = userAns.toLowerCase() === correctAns.toLowerCase()
                    }

                    return (
                      <tr key={qNum} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{qNum}</td>
                        <td style={{ padding: '12px', color: userAns ? 'white' : '#64748b' }}>{userAns || '(no answer)'}</td>
                        <td style={{ padding: '12px', color: '#a7f3d0' }}>{correctAns}</td>
                        <td style={{ padding: '12px' }}>
                          {isCorrect ? (
                            <span style={{ display: 'inline-block', padding: '4px 8px', background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>✅ Correct</span>
                          ) : (
                            <span style={{ display: 'inline-block', padding: '4px 8px', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>❌ Incorrect</span>
                          )}
                        </td>
                      </tr>
                    )
                  }) : test.questions?.map((q: any) => {
                    const userAns = (answers[q.questionNumber] || '').trim()
                    const correctAns = (q.correctAnswer || '').trim()
                    let isCorrect = false
                    
                    if (q.questionType === 'Multiple Select') {
                      const userArr = userAns.toLowerCase().split(',').map((s: string) => s.trim()).filter(Boolean).sort()
                      const correctArr = correctAns.toLowerCase().split(',').map((s: string) => s.trim()).filter(Boolean).sort()
                      isCorrect = JSON.stringify(userArr) === JSON.stringify(correctArr)
                    } else {
                      isCorrect = userAns.toLowerCase() === correctAns.toLowerCase()
                    }

                    return (
                      <tr key={q._key} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{q.questionNumber}</td>
                        <td style={{ padding: '12px', color: userAns ? 'white' : '#64748b' }}>{userAns || '(no answer)'}</td>
                        <td style={{ padding: '12px', color: '#a7f3d0' }}>{correctAns}</td>
                        <td style={{ padding: '12px' }}>
                          {isCorrect ? (
                            <span style={{ display: 'inline-block', padding: '4px 8px', background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>✅ Correct</span>
                          ) : (
                            <span style={{ display: 'inline-block', padding: '4px 8px', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>❌ Incorrect</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
