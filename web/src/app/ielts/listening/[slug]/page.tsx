'use client'

import React, { useState, useEffect, useRef } from 'react'
import { client } from '../../../../sanity/client'
import { PortableText } from '@portabletext/react'
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
      if (userAns === correctAns) correct++
    })
    setScore(correct)
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

        <div className="questions-container">
          {test.questions?.map((q: any) => (
            <div key={q._key} className={`question-block ${submitted ? 'submitted' : ''}`}>
              <div className="question-header">
                <span className="q-num">{q.questionNumber}.</span>
                <span className="q-text">{q.questionText}</span>
              </div>

              {q.googleDriveImageContext && (
                <div className="q-image-context">
                  <img src={q.googleDriveImageContext.replace('/view', '/preview')} alt="Question Context" />
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
                <div className={`grading-feedback ${answers[q.questionNumber]?.toLowerCase().trim() === q.correctAnswer?.toLowerCase().trim() ? 'correct' : 'incorrect'}`}>
                  <div className="status">
                    {answers[q.questionNumber]?.toLowerCase().trim() === q.correctAnswer?.toLowerCase().trim() ? (
                      <><span className="material-symbols-outlined">check_circle</span> Correct</>
                    ) : (
                      <><span className="material-symbols-outlined">cancel</span> Incorrect</>
                    )}
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
              <span className="score-number">{score} / {test.questions?.length || 0}</span>
              <span className="score-label">Correct Answers</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
