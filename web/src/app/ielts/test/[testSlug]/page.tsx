import React from 'react'
import { notFound } from 'next/navigation'
import { client } from '../../../../sanity/client'
import type { Metadata } from 'next'

export const revalidate = 60

type Props = {
  params: Promise<{ testSlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const test = await client.fetch(`*[_type == "ieltsTest" && slug.current == $testSlug][0] { title, book->{title} }`, {
    testSlug: resolvedParams.testSlug
  })
  
  if (!test) return { title: 'Test Not Found' }
  return { title: `${test.title} | ${test.book?.title || 'IELTS'}` }
}

export default async function TestPage({ params }: Props) {
  const resolvedParams = await params;
  
  const test = await client.fetch(`*[_type == "ieltsTest" && slug.current == $testSlug][0] {
    _id,
    title,
    book->{
      title,
      "slug": slug.current
    },
    listening->{ title, "slug": slug.current },
    reading->{ title, "slug": slug.current },
    writing->{ title, "slug": slug.current },
    speaking->{ title, "slug": slug.current }
  }`, { testSlug: resolvedParams.testSlug })

  if (!test) {
    notFound()
  }

  const modules = [
    { 
      id: 'listening', 
      title: 'Listening', 
      icon: 'headphones', 
      color: 'teal', 
      data: test.listening,
      link: test.listening ? `/ielts/listening/${test.listening.slug}` : null,
      desc: '30 minutes, 40 questions'
    },
    { 
      id: 'reading', 
      title: 'Reading', 
      icon: 'menu_book', 
      color: 'purple', 
      data: test.reading,
      link: test.reading ? `/ielts/reading/${test.reading.slug}` : null,
      desc: '60 minutes, 40 questions'
    },
    { 
      id: 'writing', 
      title: 'Writing', 
      icon: 'edit_note', 
      color: 'orange', 
      data: test.writing,
      link: test.writing ? `/ielts/writing/${test.writing.slug}` : null,
      desc: '60 minutes, 2 tasks'
    },
    { 
      id: 'speaking', 
      title: 'Speaking', 
      icon: 'mic', 
      color: 'green', 
      data: test.speaking,
      link: test.speaking ? `/ielts/speaking/${test.speaking.slug}` : null,
      desc: '11-14 minutes, 3 parts'
    }
  ]

  return (
    <>
      <section className="hero" style={{ padding: '60px 20px 40px', backgroundColor: '#1e293b', color: '#fff' }}>
        <div className="hero__inner" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.95rem' }}>
            <a href="/ielts" style={{ color: '#94a3b8', textDecoration: 'none' }}>IELTS Hub</a>
            <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', color: '#64748b' }}>chevron_right</span>
            {test.book && (
              <>
                <a href={`/ielts/book/${test.book.slug}`} style={{ color: '#94a3b8', textDecoration: 'none' }}>{test.book.title}</a>
                <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', color: '#64748b' }}>chevron_right</span>
              </>
            )}
            <span style={{ color: '#f8fafc', fontWeight: 600 }}>{test.title}</span>
          </div>
          
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, margin: '0 0 16px 0', color: '#f8fafc' }}>
            {test.book?.title} - {test.title}
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#cbd5e1', maxWidth: '600px', margin: 0 }}>
            Complete the 4 modules below to get your estimated IELTS band score.
          </p>
        </div>
      </section>

      <section style={{ padding: '60px 20px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {modules.map((mod) => (
            <div key={mod.id} className="card hover-up" style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '24px', flex: 1 }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: `var(--color-${mod.color}-light, #f0fdf4)`, color: `var(--color-${mod.color}, #16a34a)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.8rem' }}>{mod.icon}</span>
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 8px 0', color: '#1e293b' }}>{mod.title}</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>{mod.desc}</p>
                {mod.data && (
                  <p style={{ margin: '12px 0 0 0', color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic' }}>"{mod.data.title}"</p>
                )}
              </div>
              
              <div style={{ padding: '16px 24px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                {mod.link ? (
                  <a href={mod.link} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', borderColor: `var(--color-${mod.color})`, color: `var(--color-${mod.color})` }}>
                    Start {mod.title}
                  </a>
                ) : (
                  <button className="btn" disabled style={{ width: '100%', justifyContent: 'center', backgroundColor: '#e2e8f0', color: '#94a3b8', border: 'none', cursor: 'not-allowed' }}>
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
