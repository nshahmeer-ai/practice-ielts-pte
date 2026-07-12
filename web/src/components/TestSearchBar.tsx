'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'

type Book = {
  _id: string;
  title: string;
  slug: string;
}

type Test = {
  _id: string;
  title: string;
  slug: string;
  bookId: string;
  listeningSlug?: string;
  readingSlug?: string;
  writingSlug?: string;
  speakingSlug?: string;
}

type Props = {
  books: Book[];
  tests: Test[];
}

export default function TestSearchBar({ books, tests }: Props) {
  const router = useRouter()
  
  const [selectedBookId, setSelectedBookId] = useState('')
  const [selectedTestId, setSelectedTestId] = useState('')
  const [selectedModule, setSelectedModule] = useState('')

  // Reset test and module when book changes
  useEffect(() => {
    setSelectedTestId('')
    setSelectedModule('')
  }, [selectedBookId])

  // Reset module when test changes
  useEffect(() => {
    setSelectedModule('')
  }, [selectedTestId])

  const availableTests = useMemo(() => {
    if (!selectedBookId) return []
    return tests.filter(t => t.bookId === selectedBookId).sort((a, b) => a.title.localeCompare(b.title))
  }, [selectedBookId, tests])

  const selectedTest = useMemo(() => {
    return tests.find(t => t._id === selectedTestId)
  }, [selectedTestId, tests])

  const handleSearch = () => {
    if (selectedModule && selectedTest) {
      // Navigate to specific module
      const slug = selectedTest[`${selectedModule}Slug` as keyof Test]
      if (slug) {
        router.push(`/ielts/${selectedModule}/${slug}`)
      } else {
        alert(`This test does not have a ${selectedModule} module configured yet.`)
      }
    } else if (selectedTestId) {
      // Navigate to test page
      const test = tests.find(t => t._id === selectedTestId)
      if (test) router.push(`/ielts/test/${test.slug}`)
    } else if (selectedBookId) {
      // Navigate to book page
      const book = books.find(b => b._id === selectedBookId)
      if (book) router.push(`/ielts/book/${book.slug}`)
    }
  }

  // Common select styling
  const selectStyle: React.CSSProperties = {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid var(--color-border, #e2e8f0)',
    backgroundColor: '#fff',
    fontSize: '0.95rem',
    color: '#1e293b',
    flex: '1',
    minWidth: '160px',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '16px'
  }

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(12px)',
      padding: '12px',
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
      border: '1px solid rgba(255,255,255,0.5)',
      maxWidth: '1000px',
      margin: '0 auto 40px'
    }}>
      
      {/* Book Select */}
      <select 
        value={selectedBookId} 
        onChange={e => setSelectedBookId(e.target.value)}
        style={selectStyle}
      >
        <option value="">Select Book...</option>
        {books.map(b => (
          <option key={b._id} value={b._id}>{b.title}</option>
        ))}
      </select>

      {/* Test Select */}
      <select 
        value={selectedTestId} 
        onChange={e => setSelectedTestId(e.target.value)}
        style={{...selectStyle, opacity: selectedBookId ? 1 : 0.6}}
        disabled={!selectedBookId}
      >
        <option value="">Select Test...</option>
        {availableTests.map(t => (
          <option key={t._id} value={t._id}>{t.title}</option>
        ))}
      </select>

      {/* Module Select */}
      <select 
        value={selectedModule} 
        onChange={e => setSelectedModule(e.target.value)}
        style={{...selectStyle, opacity: selectedTestId ? 1 : 0.6}}
        disabled={!selectedTestId}
      >
        <option value="">Select Module...</option>
        <option value="listening">Listening</option>
        <option value="reading">Reading</option>
        <option value="writing">Writing</option>
        <option value="speaking">Speaking</option>
      </select>

      {/* Search Button */}
      <button 
        onClick={handleSearch}
        disabled={!selectedBookId}
        style={{
          padding: '12px 32px',
          backgroundColor: selectedBookId ? 'var(--color-primary, #6366f1)' : '#94a3b8',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: selectedBookId ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>search</span>
        Go
      </button>

    </div>
  )
}
