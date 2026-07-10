'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const Icon = ({ name, cls = '' }: { name: string; cls?: string }) => (
  <span className={`material-symbols-outlined ${cls}`}>{name}</span>
)

export default function ListeningExamUI({ test }: { test: any }) {
  const [seconds, setSeconds] = useState(30 * 60)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showAnswers, setShowAnswers] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(!!test.audioDriveEmbed)
  
  const totalQuestions = test.sections?.reduce((acc: number, s: any) => acc + (s.questions?.length || 0), 0) || 40

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const rs = (s % 60).toString().padStart(2, '0')
    return `${m}:${rs}`
  }

  const handleInputChange = (qNum: string, value: string) => {
    setAnswers(prev => ({ ...prev, [qNum]: value }))
  }

  const reset = () => {
    setAnswers({})
    setShowAnswers(false)
    setSeconds(30 * 60)
  }

  const answeredCount = Object.keys(answers).filter(k => answers[k]?.trim().length > 0).length
  const progressPct = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,400,0,0&display=block" rel="stylesheet" />
      <div className="exam-page page-fade-in">
        <div className="exam-page__inner">
          
          {/* Header */}
          <div className="exam-header">
            <div className="exam-header__left">
              <Link href="/ielts/listening" className="exam-header__back">
                <Icon name="arrow_back" /> Back
              </Link>
              <div>
                <div className="exam-header__title">
                  <Icon name="headphones" cls="icon-sm" /> {test.title}
                </div>
                <div className="exam-header__subtitle">{test.sections?.length || 4} Sections · {totalQuestions} Questions</div>
              </div>
            </div>
            <div className={`exam-timer ${seconds <= 300 && seconds > 60 ? 'warning' : seconds <= 60 ? 'danger' : ''}`}>
              <span className="exam-timer__icon"><Icon name="timer" /></span>
              <span>{formatTime(seconds)}</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="exam-instructions">
            <h3><Icon name="info" /> Instructions</h3>
            <ul>
              <li>Press <strong>Play</strong> on the audio player below to begin.</li>
              <li>Read each question before the relevant section of audio begins.</li>
              <li>Write your answers as you listen.</li>
              <li>When finished, click <strong>"Show Answers"</strong> to see the answer key.</li>
            </ul>
          </div>

          {/* Audio Player */}
          <div className="audio-player">
            <div className="audio-player__header">
              <div className="audio-player__icon"><Icon name="headphones" cls="icon-lg" /></div>
              <div className="audio-player__info">
                <h4>{test.title} — Audio</h4>
                <p>Listen to the audio and answer the questions below.</p>
              </div>
            </div>
            {audioLoaded && test.audioDriveEmbed ? (
              <>
                <iframe src={test.audioDriveEmbed} className="audio-embed-frame" allow="autoplay" allowFullScreen style={{ height: '80px', width: '100%' }}></iframe>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Icon name="folder_open" cls="icon-xs" /> Audio via Google Drive. If it doesn't play,
                  <a href={test.audioDriveEmbed} target="_blank" rel="noreferrer" style={{ color: 'var(--color-teal)' }}>open in a new tab</a>.
                </p>
              </>
            ) : (
              <div style={{ background: 'var(--color-bg)', border: 'var(--border)', borderRadius: 'var(--border-radius-sm)', padding: '16px', textAlign: 'center', marginBottom: '12px' }}>
                <Icon name="audio_file" cls="icon-xl" />
                <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', marginBottom: '4px' }}>No audio loaded for this test yet.</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                  Add your Google Drive preview URL in the CMS.
                </p>
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="progress-bar" style={{ marginBottom: '8px' }}>
            <div className="progress-bar__fill" style={{ width: `${progressPct}%` }}></div>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: '24px' }}>
            {answeredCount} of {totalQuestions} questions answered
          </div>

          {/* Sections & Questions */}
          {test.sections?.map((section: any, sIdx: number) => (
            <div key={sIdx} className="exam-section">
              <div className="q-section-title">
                <Icon name="folder_open" /> {section.title}
              </div>
              <div style={{ color: '#444', marginBottom: '24px' }}>
                {section.content}
              </div>

              {section.questions?.map((q: any, qIdx: number) => {
                const isCorrect = answers[qIdx]?.toLowerCase().trim() === q.correctAnswer?.toLowerCase().trim()
                const isIncorrect = showAnswers && !isCorrect

                return (
                  <div key={qIdx} className="question-block">
                    <div className="question-block__num">{qIdx + 1}</div>
                    <p className="question-block__text">{q.questionText}</p>
                    {q.questionType === 'MCQ' ? (
                      <div className="q-options">
                        {q.options?.map((opt: string, oIdx: number) => (
                          <div 
                            key={oIdx} 
                            onClick={() => handleInputChange(qIdx.toString(), opt)}
                            className={`q-option ${answers[qIdx] === opt ? 'selected' : ''} ${showAnswers && opt === q.correctAnswer ? 'correct' : showAnswers && answers[qIdx] === opt && opt !== q.correctAnswer ? 'incorrect' : ''}`}
                          >
                            <span className="q-option-letter">{String.fromCharCode(65 + oIdx)}</span>
                            {opt}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <input 
                        type="text" 
                        className={`q-input ${showAnswers ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
                        value={answers[qIdx] || ''}
                        onChange={(e) => handleInputChange(qIdx.toString(), e.target.value)}
                        placeholder="Write your answer here" 
                      />
                    )}
                  </div>
                )
              })}
            </div>
          ))}

          {/* Show Answers */}
          <div className="show-answers-bar">
            <p>Finished? Check your answers below.</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button className="btn btn-secondary btn-sm" onClick={reset}>
                <Icon name="refresh" /> Reset
              </button>
              <button className="btn btn-primary" onClick={() => setShowAnswers(true)}>
                <Icon name="fact_check" /> Show Answers
              </button>
            </div>
          </div>

          {showAnswers && (
            <div className="answers-reveal is-visible" style={{ marginTop: '24px' }}>
              <div className="answers-reveal__title">
                <Icon name="assignment_turned_in" /> Answer Key
              </div>
              <div className="answers-reveal__list">
                {test.sections?.map((section: any, sIdx: number) => 
                  section.questions?.map((q: any, qIdx: number) => (
                    <div key={qIdx} className="answers-reveal__item">
                      <strong>{qIdx + 1}.</strong> {q.correctAnswer}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
