import React from 'react'
import { notFound } from 'next/navigation'
import { client } from '../../../../sanity/client'
import type { Metadata } from 'next'

export const revalidate = 60

type Props = {
  params: Promise<{ bookSlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const book = await client.fetch(`*[_type == "ieltsBook" && slug.current == $bookSlug][0] { title, description }`, {
    bookSlug: resolvedParams.bookSlug
  })
  
  if (!book) return { title: 'Book Not Found' }
  return { title: `${book.title} | Practice Tests`, description: book.description }
}

export default async function BookPage({ params }: Props) {
  const resolvedParams = await params;
  
  const book = await client.fetch(`*[_type == "ieltsBook" && slug.current == $bookSlug][0] {
    _id,
    title,
    description,
    "imageUrl": coverImage.asset->url
  }`, { bookSlug: resolvedParams.bookSlug })

  if (!book) {
    notFound()
  }

  // Fetch all tests that belong to this book
  const tests = await client.fetch(`*[_type == "ieltsTest" && book._ref == $bookId] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    "hasListening": defined(listening),
    "hasReading": defined(reading),
    "hasWriting": defined(writing),
    "hasSpeaking": defined(speaking)
  }`, { bookId: book._id })

  return (
    <>
      <section className="hero" style={{ padding: '60px 20px 40px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div className="hero__inner" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '40px', alignItems: 'center' }}>
          {book.imageUrl ? (
             <img src={book.imageUrl} alt={book.title} style={{ width: '200px', height: '280px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
          ) : (
             <div style={{ width: '200px', height: '280px', backgroundColor: '#e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
               <span className="material-symbols-outlined" style={{ fontSize: '5rem', color: '#94a3b8' }}>menu_book</span>
             </div>
          )}
          
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <a href="/ielts" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>IELTS Hub</a>
              <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', color: '#94a3b8' }}>chevron_right</span>
              <span style={{ color: '#64748b' }}>{book.title}</span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 16px 0', color: '#1e293b' }}>{book.title}</h1>
            {book.description && <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>{book.description}</p>}
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 20px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '32px', color: '#1e293b' }}>Practice Tests</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {tests.length > 0 ? (
            tests.map((test: any, i: number) => (
              <a key={test._id} href={`/ielts/test/${test.slug}`} className="card hover-up" style={{ display: 'flex', alignItems: 'center', padding: '24px 32px', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--color-primary-light, #eff6ff)', color: 'var(--color-primary, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800, marginRight: '24px' }}>
                  {i + 1}
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.3rem', color: '#1e293b' }}>{test.title}</h3>
                  <div style={{ display: 'flex', gap: '16px', color: '#64748b', fontSize: '0.9rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: test.hasListening ? 1 : 0.4 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>headphones</span> Listening
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: test.hasReading ? 1 : 0.4 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>menu_book</span> Reading
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: test.hasWriting ? 1 : 0.4 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>edit_note</span> Writing
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: test.hasSpeaking ? 1 : 0.4 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>mic</span> Speaking
                    </span>
                  </div>
                </div>
                
                <div style={{ color: 'var(--color-primary, #3b82f6)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>arrow_circle_right</span>
                </div>
              </a>
            ))
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '12px', border: '2px dashed #e2e8f0' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: '#94a3b8', marginBottom: '12px' }}>note_add</span>
              <h3 style={{ color: '#475569', margin: '0 0 8px 0' }}>No Tests Available</h3>
              <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>This book doesn't have any tests yet. Create an IELTS Test in the CMS and link it to this book.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
