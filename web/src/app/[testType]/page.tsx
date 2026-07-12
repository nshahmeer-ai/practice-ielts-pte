import React from 'react'
import { notFound } from 'next/navigation'
import { client } from '../../sanity/client'
import type { Metadata } from 'next'
import TestSearchBar from '../../components/TestSearchBar'

export const revalidate = 60 // Revalidate every minute

type HubPageData = {
  title: string;
  slug: { current: string };
  heroTitle: string;
  heroDescription: string;
  heroIcon: string;
  themeColor: string;
  modules: {
    title: string;
    description: string;
    icon: string;
    themeColor: string;
    link: string;
    status: string;
  }[];
}

type Props = {
  params: Promise<{ testType: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  let page = await client.fetch<HubPageData | null>(
    `*[_type == "hubPage" && slug.current == $testType][0]`,
    { testType: resolvedParams.testType }
  )

  if (!page) {
    if (resolvedParams.testType === 'ielts') {
      page = { heroTitle: 'Master the IELTS', heroDescription: 'Free, high-quality IELTS practice tests.' } as HubPageData
    } else {
      return { title: 'Not Found' }
    }
  }

  return {
    title: `${page.heroTitle} | Insight English Institute`,
    description: page.heroDescription,
  }
}

export default async function DynamicHubPage({ params }: Props) {
  const resolvedParams = await params;
  
  // Fetch the page data from Sanity CMS
  let page = await client.fetch<HubPageData | null>(
    `*[_type == "hubPage" && slug.current == $testType][0]`,
    { testType: resolvedParams.testType }
  )

  let books: any[] = [];
  let tests: any[] = [];
  if (resolvedParams.testType === 'ielts') {
    books = await client.fetch(`*[_type == "ieltsBook"] | order(order desc, _createdAt desc) {
      _id,
      title,
      "slug": slug.current,
      description,
      "imageUrl": coverImage.asset->url
    }`);

    tests = await client.fetch(`*[_type == "ieltsTest"] {
      _id,
      title,
      "slug": slug.current,
      "bookId": book._ref,
      "listeningSlug": listening->slug.current,
      "readingSlug": reading->slug.current,
      "writingSlug": writing->slug.current,
      "speakingSlug": speaking->slug.current
    }`);
  }

  if (!page) {
    if (resolvedParams.testType === 'ielts') {
      page = {
        title: 'IELTS Hub',
        slug: { current: 'ielts' },
        heroTitle: 'Master the IELTS',
        heroDescription: 'Free, high-quality IELTS practice tests. Improve your listening, reading, writing, and speaking skills with our comprehensive materials.',
        heroIcon: 'school',
        themeColor: 'purple',
        modules: [
          { title: 'Listening', description: 'Audio & Scoring', icon: 'headphones', themeColor: 'teal', link: '/ielts/listening', status: 'Start Practising' },
          { title: 'Reading', description: 'Passages & Answers', icon: 'menu_book', themeColor: 'purple', link: '/ielts/reading', status: 'Start Practising' },
          { title: 'Writing', description: 'Task 1 & Task 2', icon: 'edit_note', themeColor: 'orange', link: '/ielts/writing', status: 'Start Practising' },
          { title: 'Speaking', description: 'Questions & Samples', icon: 'mic', themeColor: 'green', link: '/ielts/speaking', status: 'Start Practising' },
        ]
      }
    } else {
      notFound()
    }
  }

  // Helper to map color names to CSS classes if needed
  const getBadgeClass = (color: string) => {
    switch (color) {
      case 'purple': return 'badge-purple';
      case 'teal': return 'badge-teal';
      case 'orange': return 'badge-orange';
      case 'green': return 'badge-green';
      case 'pink': return 'badge-pink';
      default: return 'badge-purple';
    }
  }

  return (
    <>
      <section className="hero">
        <div className="hero__inner" style={{ padding: '60px 20px 100px', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <span className={`badge ${getBadgeClass(page.themeColor)}`}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', marginRight: '6px', verticalAlign: 'text-bottom' }}>
                {page.heroIcon || 'school'}
              </span>
              {page.title.toUpperCase()}
            </span>
          </div>
          <h1 className="hero__title" style={{ margin: '0 auto 24px' }}>{page.heroTitle}</h1>
          <p className="hero__subtitle" style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
            {page.heroDescription}
          </p>

          {resolvedParams.testType === 'ielts' && (
            <TestSearchBar books={books} tests={tests} />
          )}

          {/* HORIZONTAL MODULES BAR */}
          {page.modules && page.modules.length > 0 ? (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#0c262a', // Dark green matching screenshot
              borderRadius: '12px',
              padding: '16px 32px',
              gap: '24px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              margin: '0 auto'
            }}>
              {page.modules.map((mod, index) => (
                <a 
                  key={index} 
                  href={mod.link && mod.link !== '#' ? mod.link : '#'}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    textDecoration: 'none',
                    color: '#fff',
                    opacity: mod.link && mod.link !== '#' ? 1 : 0.5,
                    cursor: mod.link && mod.link !== '#' ? 'pointer' : 'not-allowed',
                    transition: 'transform 0.2s, opacity 0.2s',
                    flex: '1 1 auto',
                    minWidth: '180px'
                  }}
                  className={mod.link && mod.link !== '#' ? 'hover-scale-slight' : ''}
                >
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    border: '1.5px solid rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    flexShrink: 0
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.3rem' }}>{mod.icon || 'quiz'}</span>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <h3 style={{ margin: '0 0 2px 0', fontSize: '1.05rem', fontWeight: 700 }}>{mod.title}</h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>{mod.description}</p>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-muted)', backgroundColor: '#fff', borderRadius: '16px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', opacity: 0.2, marginBottom: '12px' }}>construction</span>
              <h3>We are building this content!</h3>
              <p style={{ fontSize: '0.9rem' }}>Check back soon for high-quality practice materials.</p>
            </div>
          )}
          
          {/* --- NEW SECTION: IELTS BOOKS --- */}
          {resolvedParams.testType === 'ielts' && (
            <div style={{ marginTop: '80px', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 8px 0', color: '#1a1a2e' }}>IELTS Practice Books</h2>
                  <p style={{ color: 'var(--color-muted)', margin: 0, fontSize: '1.05rem' }}>Select a book to view its 4 complete practice tests.</p>
                </div>
              </div>

              {/* We will fetch and map books here. Since this is an async component, we can do the fetch directly. */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
                {books.length > 0 ? (
                  books.map((book: any) => (
                    <a key={book._id} href={`/ielts/book/${book.slug}`} className="card hover-up" style={{ display: 'block', textDecoration: 'none', backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)' }}>
                      <div style={{ height: '160px', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        {book.imageUrl ? (
                          <img src={book.imageUrl} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: '#cbd5e1' }}>menu_book</span>
                        )}
                      </div>
                      <div style={{ padding: '20px' }}>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#1a1a2e' }}>{book.title}</h3>
                        {book.description && <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{book.description}</p>}
                      </div>
                    </a>
                  ))
                ) : (
                  <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '12px', border: '2px dashed #e2e8f0' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: '#94a3b8', marginBottom: '12px' }}>library_books</span>
                    <h3 style={{ color: '#475569', margin: '0 0 8px 0' }}>No Books Available</h3>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>Create some IELTS Books in the CMS to see them here.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
