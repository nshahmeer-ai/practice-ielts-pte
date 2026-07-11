import React from 'react'
import { notFound } from 'next/navigation'
import { client } from '../../sanity/client'
import type { Metadata } from 'next'

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
  const page = await client.fetch<HubPageData | null>(
    `*[_type == "hubPage" && slug.current == $testType][0]`,
    { testType: resolvedParams.testType }
  )

  if (!page) {
    return { title: 'Not Found' }
  }

  return {
    title: `${page.heroTitle} | PracticeHub`,
    description: page.heroDescription,
  }
}

export default async function DynamicHubPage({ params }: Props) {
  const resolvedParams = await params;
  
  // Fetch the page data from Sanity CMS
  const page = await client.fetch<HubPageData | null>(
    `*[_type == "hubPage" && slug.current == $testType][0]`,
    { testType: resolvedParams.testType }
  )

  if (!page) {
    notFound()
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
        <div className="hero__inner" style={{ padding: '60px 20px', textAlign: 'center' }}>
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
        </div>
      </section>

      <section className="section" style={{ padding: '40px 20px 80px', backgroundColor: 'var(--color-surface)' }}>
        <div className="section__inner" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {page.modules && page.modules.length > 0 ? (
              page.modules.map((mod, index) => (
                <div key={index} className="card hover-up" style={{ padding: '32px', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: `var(--color-${mod.themeColor || 'purple'}-light, #f0f0ff)`, color: `var(--color-${mod.themeColor || 'purple'})` }}>
                      <span className="material-symbols-outlined">{mod.icon || 'quiz'}</span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>{mod.title}</h3>
                  </div>
                  
                  <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', lineHeight: 1.6, flexGrow: 1, marginBottom: '24px' }}>
                    {mod.description}
                  </p>
                  
                  {mod.link && mod.link !== '#' ? (
                    <a href={mod.link} className={`btn btn-outline`} style={{ width: '100%', justifyContent: 'center', borderColor: `var(--color-${mod.themeColor || 'purple'})`, color: `var(--color-${mod.themeColor || 'purple'})` }}>
                      {mod.status || 'Start Practising'}
                    </a>
                  ) : (
                    <button className="btn" disabled style={{ width: '100%', justifyContent: 'center', backgroundColor: '#f1f1f1', color: '#999', border: 'none' }}>
                      {mod.status || 'Coming Soon'}
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: 'var(--color-muted)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '3rem', opacity: 0.2, marginBottom: '16px' }}>construction</span>
                <h3>We are building this content!</h3>
                <p>Check back soon for high-quality practice materials.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
