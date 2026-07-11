import { client } from '../../../sanity/client'
import TestTabs from '../../../components/TestTabs'
import TestTrackToggle from '../../../components/TestTrackToggle'

export const revalidate = 60 // Revalidate every 60 seconds

type Props = {
  searchParams: Promise<{ track?: string }>
}

export default async function IELTSWritingPage({ searchParams }: Props) {
  const resolvedParams = await searchParams
  const track = resolvedParams?.track || 'Academic'
  
  const tests = await client.fetch(
    `*[_type == "ieltsWriting" && examTrack == $track] | order(_createdAt asc)`,
    { track }
  )

  const Icon = ({ name, cls = '' }: { name: string; cls?: string }) => (
    <span className={`material-symbols-outlined ${cls}`}>{name}</span>
  )

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,400,0,0&display=block" rel="stylesheet" />
      <div className="tests-page">
        <div className="tests-page__inner">

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px', fontSize: '0.85rem' }}>
            <a href="/" style={{ color: 'var(--color-muted)' }}>Home</a>
            <Icon name="chevron_right" cls="icon-xs" />
            <a href="/ielts" style={{ color: 'var(--color-muted)' }}>IELTS</a>
            <Icon name="chevron_right" cls="icon-xs" />
            <span style={{ color: 'var(--color-text)', fontWeight: 700 }}>Writing</span>
          </div>

          {/* Hero */}
          <div className="tests-page__hero">
            <span style={{ position: 'relative', zIndex: 1 }}>
              <div className="badge badge-outline" style={{ color: 'rgba(255,255,255,0.9)', borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.15)', marginBottom: '16px' }}>
                <Icon name="edit_note" /> IELTS Writing
              </div>
              <h1>IELTS Writing Practice Tests</h1>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                Master the IELTS Writing module. Task 1 and Task 2 with sample answers and grading criteria. 60 minutes duration.
              </p>
            </span>
          </div>

          <TestTabs testType="ielts" />
          
          <TestTrackToggle />

          {/* Module Quick Info */}
          <div className="grid-3" style={{ marginBottom: '36px' }}>
            <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-purple)' }}>2</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-muted)' }}>Tasks per Test</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-teal)' }}>60 min</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-muted)' }}>Duration</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-orange)' }}>{tests.length}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-muted)' }}>Available Tests</div>
            </div>
          </div>

          {/* Tests List */}
          <div className="tests-grid">
            {tests.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px', color: 'var(--color-muted)', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', opacity: 0.2, marginBottom: '12px' }}>edit_note</span>
                <h3>No {track} Tests Available</h3>
                <p style={{ fontSize: '0.9rem' }}>Add some {track} Writing tests in the Sanity CMS!</p>
              </div>
            )}
            {tests.map((test: any, index: number) => (
              <a href={`/ielts/writing/${test._id}`} key={test._id} className="test-card">
                <div className="test-card__left">
                  <div className="test-card__num">{index + 1}</div>
                  <div className="test-card__info">
                    <h4>{test.title}</h4>
                    <p>
                      <span className="material-symbols-outlined" style={{ fontSize: '0.85rem', verticalAlign: 'middle' }}>timer</span> {test.duration || 60} min &nbsp;·&nbsp;
                      <span className="material-symbols-outlined" style={{ fontSize: '0.85rem', verticalAlign: 'middle' }}>edit_note</span> 2 tasks
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="test-card__arrow material-symbols-outlined">arrow_forward</span>
                </div>
              </a>
            ))}
          </div>

        </div>
      </div>
    </>
  )
}
