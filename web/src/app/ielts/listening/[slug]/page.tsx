'use client'

import React, { useState, useEffect, useRef } from 'react'
import { client } from '../../../../sanity/client'
import { PortableText } from '@portabletext/react'
import parse, { domToReact } from 'html-react-parser'
import './interactive-test.css'

export default function InteractiveListeningTest({ params }: { params: { slug: string } }) {
  const [test, setTest] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(30 * 60) // Default 30 mins
  const [isPlaying, setIsPlaying] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    async function fetchTest() {
      const data = await client.fetch(`*[_type == "ieltsListening" && slug.current == $slug][0]`, {
        slug: params.slug
      })
      if (data) {
        setTest(data)
        if (data.duration) setTimeLeft(data.duration * 60)
      }
      setLoading(false)
    }
    fetchTest()
  }, [params.slug])

  useEffect(() => {
    if (!isPlaying || submitted) return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isPlaying, submitted])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

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
    setIsPlaying(false)
    let correct = 0
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
    setScore(correct)
  }

  const getTotalQuestions = () => {
    return test?.questions?.length || 0;
  }

  if (loading) return <div className="test-loading">Loading Test Environment...</div>
  if (!test) return <div className="test-not-found">Test not found</div>

  return (
    <div className="interactive-test-layout">
      {/* Pinned Audio & Timer Bar */}
      <div className="test-header-bar">
        <div className="timer-display">
          <span className="material-symbols-outlined">timer</span>
          {formatTime(timeLeft)}
        </div>
        <div className="audio-player-container">
          {test.googleDriveAudioUrl ? (
            <iframe 
              src={test.googleDriveAudioUrl.replace('/view', '/preview')} 
              width="100%" 
              height="60" 
              allow="autoplay"
              onLoad={() => setIsPlaying(true)}
            ></iframe>
          ) : test.audioUrl ? (
            <audio controls onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} className="custom-audio">
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

        <div className="questions-container">
          {test.questions?.map((q: any) => (
            <div key={q._key} className={`question-block ${submitted ? 'submitted' : ''}`}>
              <div className="question-header">
                <span className="q-num">{q.questionNumber}.</span>
                <span className="q-text">{q.questionText}</span>
              </div>

              {q.googleDriveImageContext && (
                <div className="q-image-context" style={{ marginBottom: '24px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <img src={q.googleDriveImageContext.replace('/view', '/preview')} alt="Question Context" style={{ width: '100%', height: 'auto', display: 'block' }} />
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

              {submitted && (
                <div className={`grading-feedback ${(() => {
                  const userAns = (answers[q.questionNumber] || '').toLowerCase().trim()
                  const correctAns = (q.correctAnswer || '').toLowerCase().trim()
                  if (q.questionType === 'Multiple Select') {
                    const userArr = userAns.split(',').map((s: string) => s.trim()).filter(Boolean).sort()
                    const correctArr = correctAns.split(',').map((s: string) => s.trim()).filter(Boolean).sort()
                    return JSON.stringify(userArr) === JSON.stringify(correctArr) ? 'correct' : 'incorrect'
                  }
                  return userAns === correctAns ? 'correct' : 'incorrect'
                })()}`}>
                  <div className="status">
                    {(() => {
                      const userAns = (answers[q.questionNumber] || '').toLowerCase().trim()
                      const correctAns = (q.correctAnswer || '').toLowerCase().trim()
                      let isCorrect = false;
                      if (q.questionType === 'Multiple Select') {
                        const userArr = userAns.split(',').map((s: string) => s.trim()).filter(Boolean).sort()
                        const correctArr = correctAns.split(',').map((s: string) => s.trim()).filter(Boolean).sort()
                        isCorrect = JSON.stringify(userArr) === JSON.stringify(correctArr)
                      } else {
                        isCorrect = userAns === correctAns
                      }
                      return isCorrect ? (
                        <><span className="material-symbols-outlined">check_circle</span> Correct</>
                      ) : (
                        <><span className="material-symbols-outlined">cancel</span> Incorrect</>
                      )
                    })()}
                  </div>
                  <div className="correct-answer-reveal">
                    Correct Answer: <strong>{q.correctAnswer}</strong>
                  </div>
                  {q.explanation && (
                    <div className="explanation">
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {!submitted ? (
          <button className="submit-test-btn" onClick={handleSubmit}>Submit Test</button>
        ) : (
          <div className="results-panel">
            <h2>Test Complete</h2>
            <div className="score-display">
              <span className="score-number">{score} / {getTotalQuestions()}</span>
              <span className="score-label">Correct Answers</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
