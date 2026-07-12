'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { client } from '../../../../sanity/client'
import { PortableText } from '@portabletext/react'
import parse, { domToReact } from 'html-react-parser'
import '../../listening/[slug]/interactive-test.css' // Reuse listening styles if needed

export default function InteractiveReadingClient({ initialTest }: { initialTest: any }) {
  const [test, setTest] = useState<any>(initialTest)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  
  // Timer State (60 minutes = 3600 seconds)
  const [timeLeft, setTimeLeft] = useState(test?.duration ? test.duration * 60 : 3600)
  const [currentPassageIndex, setCurrentPassageIndex] = useState(0)

  // Timer logic
  useEffect(() => {
    if (submitted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft, submitted])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
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
    let correct = 0
    
    test?.passages?.forEach((passage: any) => {
      passage.questions?.forEach((q: any) => {
        const userAns = (answers[q.questionNumber] || '').toLowerCase().trim()
        const correctAns = (q.correctAnswer || '').toLowerCase().trim()
        
        if (q.questionType === 'Multiple Select') {
          const userArr = userAns.split(',').map((s: string) => s.trim()).filter(Boolean).sort()
          const correctArr = correctAns.split(',').map((s: string) => s.trim()).filter(Boolean).sort()
          if (JSON.stringify(userArr) === JSON.stringify(correctArr)) correct++
        } else if (correctAns.includes('/')) {
           const possibleAnswers = correctAns.split('/').map((s: string) => s.trim())
           if (possibleAnswers.includes(userAns)) correct++
        } else {
          if (userAns === correctAns) correct++
        }
      })
    })
    setScore(correct)
  }

  const getTotalQuestions = () => {
    let total = 0
    test?.passages?.forEach((passage: any) => {
      total += passage.questions?.length || 0
    })
    return total
  }

  const getBandScore = (score: number, total: number) => {
    if (total === 0) return '0.0'
    const isAcademic = test?.examTrack === 'Academic'
    
    // Simplified IELTS Band Score mapping for 40 questions
    // This is an approximation. Academic and General have different curves.
    if (isAcademic) {
      if (score >= 39) return '9.0'
      if (score >= 37) return '8.5'
      if (score >= 35) return '8.0'
      if (score >= 33) return '7.5'
      if (score >= 30) return '7.0'
      if (score >= 27) return '6.5'
      if (score >= 23) return '6.0'
      if (score >= 19) return '5.5'
      if (score >= 15) return '5.0'
      if (score >= 13) return '4.5'
      if (score >= 10) return '4.0'
      if (score >= 8) return '3.5'
      if (score >= 6) return '3.0'
      return '0.0'
    } else {
      // General Training mapping
      if (score >= 40) return '9.0'
      if (score >= 39) return '8.5'
      if (score >= 37) return '8.0'
      if (score >= 36) return '7.5'
      if (score >= 34) return '7.0'
      if (score >= 32) return '6.5'
      if (score >= 30) return '6.0'
      if (score >= 27) return '5.5'
      if (score >= 23) return '5.0'
      if (score >= 19) return '4.5'
      if (score >= 15) return '4.0'
      if (score >= 12) return '3.5'
      if (score >= 9) return '3.0'
      return '0.0'
    }
  }

  const currentPassage = test?.passages?.[currentPassageIndex]

  const parsedQuestions = useMemo(() => {
    if (!currentPassage?.questionsContent) return null;
    let inputCounter = 1;
    const htmlWithTags = currentPassage.questionsContent.replace(/\[\[(\d+)\]\]/g, '<inline-question data-id="$1"></inline-question>')
    
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
                defaultValue={answers[qNum] || ''}
                onChange={(e) => handleAnswerChange(qNum, e.target.value)}
                disabled={submitted}
              />
            </span>
          )
        }

        if (domNode.name === 'input') {
          let qNum = inputCounter;
          const nameAttr = domNode.attribs?.name || domNode.attribs?.id || '';
          const match = nameAttr.match(/\d+/);
          if (match) {
            qNum = parseInt(match[0]);
          } else {
            inputCounter++;
          }

          const typeAttr = domNode.attribs?.type;
          let valueAttr = domNode.attribs?.value || '';

          if (typeAttr === 'radio' || typeAttr === 'checkbox') {
             // Handle radio/checkbox logic
             const isRadio = typeAttr === 'radio'
             const currentAns = answers[qNum] || ''
             let isChecked = false
             
             if (isRadio) {
               isChecked = currentAns === valueAttr
             } else {
               isChecked = currentAns.split(',').map(s=>s.trim()).includes(valueAttr)
             }
             
             return (
               <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: submitted ? 'default' : 'pointer', marginRight: '16px', marginBottom: '8px' }}>
                 <input
                   type={isRadio ? 'radio' : 'checkbox'}
                   name={`question_${qNum}`}
                   value={valueAttr}
                   checked={isChecked}
                   onChange={(e) => {
                     if (isRadio) {
                       handleAnswerChange(qNum, valueAttr)
                     } else {
                       handleCheckboxChange(qNum, valueAttr, e.target.checked)
                     }
                   }}
                   disabled={submitted}
                   style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
                 />
                 <span style={{ fontSize: '15px' }}>{valueAttr}</span>
               </label>
             )
          }

          return (
            <input
              type="text"
              name={`question_${qNum}`}
              className={`fill-blank-input inline-input ${submitted ? 'submitted' : ''}`}
              defaultValue={answers[qNum] || ''}
              onChange={(e) => handleAnswerChange(qNum, e.target.value)}
              disabled={submitted}
              style={{
                width: '150px',
                padding: '6px 12px',
                borderRadius: '4px',
                border: '2px solid #cbd5e1',
                fontSize: '15px',
                outline: 'none',
                marginLeft: '8px',
                marginRight: '8px'
              }}
            />
          )
        }

        if (domNode.name === 'table') {
          return (
            <div className="table-responsive" style={{ margin: '24px 0', overflowX: 'auto' }}>
              <table className="ielts-table" style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #cbd5e1' }}>
                {domToReact(domNode.children as any, options)}
              </table>
            </div>
          )
        }

        if (domNode.name === 'th' || domNode.name === 'td') {
          return React.createElement(
            domNode.name,
            {
              style: {
                border: '1px solid #cbd5e1',
                padding: '12px 16px',
                textAlign: 'left',
                ...((domNode.attribs as any)?.style || {})
              }
            },
            domToReact(domNode.children as any, options)
          )
        }
      }
    }
    return parse(htmlWithTags, options)
  }, [currentPassage?.questionsContent, answers, submitted])

  if (!test) return <div>Loading test...</div>

  const totalQuestions = getTotalQuestions()
  const bandScore = getBandScore(score, totalQuestions)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Top Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', backgroundColor: '#1e293b', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: '#38bdf8' }}>menu_book</span>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{test.title}</h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>IELTS Reading - Computer Delivered</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: timeLeft <= 300 ? '#ef4444' : '#334155', padding: '8px 16px', borderRadius: '8px', transition: 'background-color 0.3s' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>schedule</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'monospace' }}>{formatTime(timeLeft)}</span>
          </div>
          
          {!submitted ? (
            <button 
              onClick={handleSubmit}
              className="btn"
              style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}
            >
              Submit Test
            </button>
          ) : (
             <div style={{ padding: '8px 16px', backgroundColor: '#38bdf8', borderRadius: '8px', fontWeight: 700 }}>
               Score: {score} / {totalQuestions} (Band {bandScore})
             </div>
          )}
        </div>
      </header>

      {/* Main Split Content */}
      <main style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Pane: Reading Passage */}
        <div style={{ flex: 1, backgroundColor: '#fff', borderRight: '2px solid #e2e8f0', overflowY: 'auto', padding: '32px', position: 'relative' }}>
          {currentPassage ? (
            <div className="prose" style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #f1f5f9' }}>
                {currentPassage.passageTitle}
              </h2>
              {currentPassage.passageText ? (
                <div 
                  style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#334155' }}
                  dangerouslySetInnerHTML={{ __html: currentPassage.passageText }}
                />
              ) : (
                <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No reading text provided for this passage.</p>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginTop: '100px', color: '#94a3b8' }}>Select a passage to begin.</div>
          )}
        </div>

        {/* Right Pane: Questions */}
        <div style={{ flex: 1, backgroundColor: '#f8fafc', overflowY: 'auto', padding: '32px' }}>
          {currentPassage ? (
            <div className="questions-container" style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
               {submitted && (
                  <div style={{ padding: '16px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#166534', marginBottom: '24px' }}>
                    <strong>Passage Questions Graded!</strong> Review your answers below.
                  </div>
               )}
               
               <div style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#1e293b' }}>
                 {parsedQuestions || <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No questions content provided for this passage.</p>}
               </div>
               
               {/* Display Explanations if submitted */}
               {submitted && currentPassage.questions && currentPassage.questions.length > 0 && (
                 <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '2px solid #e2e8f0' }}>
                   <h3 style={{ fontSize: '1.4rem', color: '#0f172a', marginBottom: '24px' }}>Answer Key & Explanations</h3>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                     {currentPassage.questions.map((q: any) => {
                       const userAns = (answers[q.questionNumber] || '').toLowerCase().trim()
                       const correctAns = (q.correctAnswer || '').toLowerCase().trim()
                       let isCorrect = false
                       if (q.questionType === 'Multiple Select') {
                          const userArr = userAns.split(',').map((s: string) => s.trim()).filter(Boolean).sort()
                          const correctArr = correctAns.split(',').map((s: string) => s.trim()).filter(Boolean).sort()
                          isCorrect = JSON.stringify(userArr) === JSON.stringify(correctArr)
                       } else if (correctAns.includes('/')) {
                          const possibleAnswers = correctAns.split('/').map((s: string) => s.trim())
                          isCorrect = possibleAnswers.includes(userAns)
                       } else {
                          isCorrect = userAns === correctAns
                       }

                       return (
                         <div key={q.questionNumber} style={{ padding: '16px', borderRadius: '8px', backgroundColor: isCorrect ? '#f0fdf4' : '#fef2f2', border: `1px solid ${isCorrect ? '#bbf7d0' : '#fecaca'}` }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                             <span style={{ fontWeight: 700, color: '#1e293b' }}>Question {q.questionNumber}</span>
                             <span className="material-symbols-outlined" style={{ color: isCorrect ? '#16a34a' : '#dc2626' }}>
                               {isCorrect ? 'check_circle' : 'cancel'}
                             </span>
                           </div>
                           <div style={{ display: 'flex', gap: '24px', fontSize: '0.95rem' }}>
                             <div><span style={{ color: '#64748b' }}>Your Answer:</span> <strong>{answers[q.questionNumber] || '---'}</strong></div>
                             <div><span style={{ color: '#64748b' }}>Correct Answer:</span> <strong>{q.correctAnswer}</strong></div>
                           </div>
                           {q.explanation && (
                             <div style={{ marginTop: '12px', fontSize: '0.9rem', color: '#475569', backgroundColor: '#fff', padding: '12px', borderRadius: '6px' }}>
                               <strong>Explanation:</strong> {q.explanation}
                             </div>
                           )}
                         </div>
                       )
                     })}
                   </div>
                 </div>
               )}
            </div>
          ) : null}
        </div>
      </main>

      {/* Bottom Navigation */}
      <footer style={{ backgroundColor: '#fff', borderTop: '1px solid #e2e8f0', padding: '16px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px', boxShadow: '0 -4px 12px rgba(0,0,0,0.05)', zIndex: 10 }}>
        
        <button 
          onClick={() => setCurrentPassageIndex(p => Math.max(0, p - 1))}
          disabled={currentPassageIndex === 0}
          style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: currentPassageIndex === 0 ? '#cbd5e1' : '#475569', cursor: currentPassageIndex === 0 ? 'not-allowed' : 'pointer' }}
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          {test?.passages?.map((p: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setCurrentPassageIndex(idx)}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: currentPassageIndex === idx ? 'var(--color-primary, #6366f1)' : '#e2e8f0',
                color: currentPassageIndex === idx ? '#fff' : '#64748b',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Part {idx + 1}
            </button>
          ))}
        </div>

        <button 
          onClick={() => setCurrentPassageIndex(p => Math.min((test?.passages?.length || 1) - 1, p + 1))}
          disabled={currentPassageIndex === (test?.passages?.length || 1) - 1}
          style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: currentPassageIndex === (test?.passages?.length || 1) - 1 ? '#cbd5e1' : '#475569', cursor: currentPassageIndex === (test?.passages?.length || 1) - 1 ? 'not-allowed' : 'pointer' }}
        >
          <span className="material-symbols-outlined">arrow_forward_ios</span>
        </button>
      </footer>

    </div>
  )
}
