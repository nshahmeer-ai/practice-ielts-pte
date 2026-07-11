import React from 'react'

export const metadata = {
  title: 'PTE Practice Tests | Insight English Institute',
  description: 'Free PTE Academic Practice Tests with instant scoring.',
}

export default function PTEPage() {
  return (
    <>
      <section className="hero-section" style={{ minHeight: '50vh', padding: '120px 24px 60px', background: 'linear-gradient(135deg, #f0e6ff, #e8f4ff)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-header__tag">
              <span className="material-symbols-outlined">school</span> PTE Academic
            </div>
            <h2 className="hero-title">Master the PTE Academic</h2>
            <p className="hero-desc" style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
              Practice real PTE questions including Read Aloud, Describe Image, Summarize Spoken Text, and more.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
            
            <a href="#" className="card card--purple" style={{ textDecoration: 'none' }}>
              <div className="card__icon card__icon--purple">
                <span className="material-symbols-outlined">mic</span>
              </div>
              <h3 className="card__title">Speaking & Writing</h3>
              <p className="card__desc">Practice Read Aloud, Repeat Sentence, Describe Image, Essay, and more.</p>
              <div className="card__meta">
                <span style={{ color: 'var(--color-purple)' }}>Coming Soon &rarr;</span>
              </div>
            </a>
            
            <a href="#" className="card card--teal" style={{ textDecoration: 'none' }}>
              <div className="card__icon card__icon--teal">
                <span className="material-symbols-outlined">menu_book</span>
              </div>
              <h3 className="card__title">Reading</h3>
              <p className="card__desc">Multiple Choice, Re-order Paragraphs, Fill in the Blanks.</p>
              <div className="card__meta">
                <span style={{ color: 'var(--color-teal)' }}>Coming Soon &rarr;</span>
              </div>
            </a>
            
            <a href="#" className="card card--orange" style={{ textDecoration: 'none' }}>
              <div className="card__icon card__icon--orange">
                <span className="material-symbols-outlined">headphones</span>
              </div>
              <h3 className="card__title">Listening</h3>
              <p className="card__desc">Summarize Spoken Text, Highlight Incorrect Words, Write from Dictation.</p>
              <div className="card__meta">
                <span style={{ color: 'var(--color-orange)' }}>Coming Soon &rarr;</span>
              </div>
            </a>
            
          </div>
        </div>
      </section>
    </>
  )
}
