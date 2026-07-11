import { client } from '../../../sanity/client'
import TestTabs from '../../../components/TestTabs'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function IELTSListeningPage() {
  const tests = await client.fetch(`*[_type == "test" && type == "ielts_listening"] | order(testNumber asc)`)

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
            <span style={{ color: 'var(--color-text)', fontWeight: 700 }}>Listening</span>
          </div>

          {/* Hero */}
          <div className="tests-page__hero">
            <span style={{ position: 'relative', zIndex: 1 }}>
              <div className="badge badge-outline" style={{ color: 'rgba(255,255,255,0.9)', borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.15)', marginBottom: '16px' }}>
                <Icon name="headphones" /> IELTS Listening
              </div>
              <h1>IELTS Listening Practice Tests</h1>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>Practice with authentic audio recordings. 40 questions per test, 30 minutes duration.</p>
            </span>
          </div>

          <TestTabs testType="ielts" />

          {/* Module Quick Info */}
          <div className="grid-3" style={{ marginBottom: '36px' }}>
            <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-purple)' }}>40</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-muted)' }}>Questions per Test</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-teal)' }}>30 min</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-muted)' }}>Duration</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-orange)' }}>{tests.length}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-muted)' }}>Total Tests</div>
            </div>
          </div>

          {/* Tests List */}
          <div className="tests-grid">
            {tests.length === 0 && (
              <p>No tests available yet. Add some in the CMS!</p>
            )}
            {tests.map((test: any) => (
              <a href={`/ielts/listening/${test.testNumber}`} key={test._id} className="test-card">
                <div className="test-card__left">
                  <div className="test-card__num">{test.testNumber}</div>
                  <div className="test-card__info">
                    <h4>{test.title}</h4>
                    <p>
                      <span className="material-symbols-outlined" style={{ fontSize: '0.85rem', verticalAlign: 'middle' }}>timer</span> 30 min &nbsp;·&nbsp;
                      <span className="material-symbols-outlined" style={{ fontSize: '0.85rem', verticalAlign: 'middle' }}>assignment</span> 40 questions
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className={`badge badge-${test.difficulty === 'Beginner' ? 'green' : test.difficulty === 'Intermediate' ? 'orange' : 'red'}`} style={{ fontSize: '0.7rem' }}>{test.difficulty}</span>
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
