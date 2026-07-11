import React from 'react'
import { notFound } from 'next/navigation'
import { client } from '../../sanity/client'
import type { Metadata } from 'next'
import TestTabs from '../../components/TestTabs'

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
          { title: 'IELTS Listening', description: 'Practice listening tests with audio tracks and instant scoring.', icon: 'headphones', themeColor: 'teal', link: '/ielts/listening', status: 'Start Practising' },
          { title: 'IELTS Reading', description: 'Academic and General training reading passages with detailed answers.', icon: 'menu_book', themeColor: 'purple', link: '/ielts/reading', status: 'Start Practising' },
          { title: 'IELTS Writing', description: 'Task 1 and Task 2 practice with model answers and strategies.', icon: 'edit_note', themeColor: 'orange', link: '/ielts/writing', status: 'Start Practising' },
          { title: 'IELTS Speaking', description: 'Real speaking test questions and sample responses.', icon: 'mic', themeColor: 'green', link: '/ielts/speaking', status: 'Start Practising' },
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
          <h1 className="hero__title">{page.heroTitle}</h1>
          <p className="hero__subtitle" style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
            {page.heroDescription}
          </p>

          <TestTabs testType={resolvedParams.testType} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {page.modules && page.modules.length > 0 ? (
              page.modules.map((mod, index) => (
                <div key={index} className="card hover-up" style={{ padding: '32px 24px', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: `var(--color-${mod.themeColor || 'purple'}-light, #f0f0ff)`, color: `var(--color-${mod.themeColor || 'purple'})`, marginBottom: '16px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>{mod.icon || 'quiz'}</span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 12px 0', color: '#1a1a2e' }}>{mod.title}</h3>
                  
                  <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', lineHeight: 1.6, flexGrow: 1, marginBottom: '24px' }}>
                    {mod.description}
                  </p>
                  
                  {mod.link && mod.link !== '#' ? (
                    <a href={mod.link} className={`btn btn-outline btn-sm`} style={{ width: '100%', justifyContent: 'center', borderColor: `var(--color-${mod.themeColor || 'purple'})`, color: `var(--color-${mod.themeColor || 'purple'})`, padding: '8px' }}>
                      {mod.status || 'Start Practising'}
                    </a>
                  ) : (
                    <button className="btn btn-sm" disabled style={{ width: '100%', justifyContent: 'center', backgroundColor: '#f1f1f1', color: '#999', border: 'none', padding: '8px' }}>
                      {mod.status || 'Coming Soon'}
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px', color: 'var(--color-muted)', backgroundColor: '#fff', borderRadius: '16px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', opacity: 0.2, marginBottom: '12px' }}>construction</span>
                <h3>We are building this content!</h3>
                <p style={{ fontSize: '0.9rem' }}>Check back soon for high-quality practice materials.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
