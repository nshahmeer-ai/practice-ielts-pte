export default function Home() {
  const Icon = ({ name, cls = '' }: { name: string; cls?: string }) => (
    <span className={`material-symbols-outlined ${cls}`}>{name}</span>
  )

  const ModuleCard = ({ iconName, name, color, href, meta }: any) => (
    <a href={href} className={`card card--${color}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className={`card__icon card__icon--${color}`}>
        <span className="material-symbols-outlined icon-lg">{iconName}</span>
      </div>
      <h4 className="card__title">{name}</h4>
      <p className="card__desc">IELTS {name} practice tests with authentic questions.</p>
      <div className="card__meta">
        <span className="material-symbols-outlined icon-xs">schedule</span> {meta}
      </div>
    </a>
  )

  const FeatureItem = ({ iconName, iconBg, title, desc }: any) => (
    <div className="feature-item">
      <div className="feature-item__icon" style={{ background: iconBg }}>
        <span className="material-symbols-outlined icon-lg">{iconName}</span>
      </div>
      <div>
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
    </div>
  )

  const Testimonial = ({ name, score, avatarBg, text }: any) => {
    const initial = name.charAt(0)
    return (
      <div className="testimonial-card">
        <div className="testimonial-card__stars">
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="material-symbols-outlined" style={{ color: 'var(--color-yellow)', fontSize: '1rem' }}>star</span>
          ))}
        </div>
        <p className="testimonial-card__text">{text}</p>
        <div className="testimonial-card__author">
          <div className="testimonial-card__avatar" style={{ background: avatarBg }}>{initial}</div>
          <div>
            <div className="testimonial-card__name">{name}</div>
            <div className="testimonial-card__score">
              <span className="material-symbols-outlined" style={{ fontSize: '0.9rem', verticalAlign: 'middle', color: 'var(--color-green)' }}>emoji_events</span>
              {score}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,400,0,0&display=block" rel="stylesheet" />
      
      {/* ═══ HERO SECTION ═══ */}
      <section className="hero">
        <div className="hero__inner">
          <div className="hero__tag">
            <span className="hero__tag-dot"></span>
            2026 Edition — Updated Tests Available
          </div>
          <h1 className="hero__title">
            Master <em>IELTS &amp; PTE</em> with Free Practice Tests
          </h1>
          <p className="hero__subtitle">
            Access 200+ authentic practice tests for IELTS and PTE Academic.
            Listen to real audio recordings, complete timed exams, and instantly
            check your answers — all for free.
          </p>
          <div className="hero__ctas">
            <a href="/ielts/listening" className="btn btn-hero btn-hero-solid btn-lg">
              <Icon name="headphones" /> Start IELTS Practice
            </a>
            <a href="/pte/speaking" className="btn btn-hero btn-lg">
              <Icon name="work" /> Start PTE Practice
            </a>
          </div>
          <div className="hero__stats">
            <div className="stat-card">
              <div className="stat-card__num">200+</div>
              <div className="stat-card__label">Practice Tests</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__num">8,000+</div>
              <div className="stat-card__label">Questions</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__num">4</div>
              <div className="stat-card__label">IELTS Modules</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__num">Free</div>
              <div className="stat-card__label">Forever</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ EXAM CATEGORIES ═══ */}
      <section className="exam-categories">
        <div className="exam-categories__inner">
          <div className="section-header">
            <div className="section-header__tag"><Icon name="library_books" /> Choose Your Exam</div>
            <h2>Select Your Practice Path</h2>
            <p>Choose from IELTS, PTE Academic, TOEFL iBT, OET, or the Duolingo English Test. All modules available.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <a href="/ielts" className="category-card category-card--ielts">
              <div className="category-card__icon"><Icon name="school" cls="icon-xl" /></div>
              <h3 className="category-card__title">IELTS Practice</h3>
              <p className="category-card__desc">International English Language Testing System — 20+ tests per module with full audio and answers.</p>
              <div className="category-card__skills">
                <span className="skill-tag"><Icon name="headphones" cls="icon-xs" /> Listening</span>
                <span className="skill-tag"><Icon name="menu_book" cls="icon-xs" /> Reading</span>
                <span className="skill-tag"><Icon name="edit_note" cls="icon-xs" /> Writing</span>
                <span className="skill-tag"><Icon name="mic" cls="icon-xs" /> Speaking</span>
              </div>
            </a>
            <a href="/pte" className="category-card category-card--pte">
              <div className="category-card__icon"><Icon name="work" cls="icon-xl" /></div>
              <h3 className="category-card__title">PTE Academic</h3>
              <p className="category-card__desc">Pearson Test of English — AI-scored exam with computer-based format. 15+ practice tests per section.</p>
              <div className="category-card__skills">
                <span className="skill-tag"><Icon name="mic" cls="icon-xs" /> Speaking</span>
                <span className="skill-tag"><Icon name="menu_book" cls="icon-xs" /> Reading</span>
                <span className="skill-tag"><Icon name="headphones" cls="icon-xs" /> Listening</span>
              </div>
            </a>
            <a href="/toefl" className="category-card category-card--toefl">
              <div className="category-card__icon"><Icon name="language" cls="icon-xl" /></div>
              <h3 className="category-card__title">TOEFL iBT</h3>
              <p className="category-card__desc">Test of English as a Foreign Language — Practice academic English skills for university admissions.</p>
              <div className="category-card__skills">
                <span className="skill-tag"><Icon name="menu_book" cls="icon-xs" /> Reading</span>
                <span className="skill-tag"><Icon name="headphones" cls="icon-xs" /> Listening</span>
                <span className="skill-tag"><Icon name="mic" cls="icon-xs" /> Speaking</span>
                <span className="skill-tag"><Icon name="edit_note" cls="icon-xs" /> Writing</span>
              </div>
            </a>
            <a href="/oet" className="category-card category-card--oet">
              <div className="category-card__icon"><Icon name="public" cls="icon-xl" /></div>
              <h3 className="category-card__title">OET Practice</h3>
              <p className="category-card__desc">Occupational English Test — Healthcare-specific English language test for medical professionals.</p>
              <div className="category-card__skills">
                <span className="skill-tag"><Icon name="headphones" cls="icon-xs" /> Listening</span>
                <span className="skill-tag"><Icon name="menu_book" cls="icon-xs" /> Reading</span>
                <span className="skill-tag"><Icon name="edit_note" cls="icon-xs" /> Writing</span>
                <span className="skill-tag"><Icon name="mic" cls="icon-xs" /> Speaking</span>
              </div>
            </a>
            <a href="/duolingo" className="category-card category-card--duolingo">
              <div className="category-card__icon"><Icon name="spellcheck" cls="icon-xl" /></div>
              <h3 className="category-card__title">Duolingo</h3>
              <p className="category-card__desc">Duolingo English Test — Fast, convenient, and affordable online English proficiency test.</p>
              <div className="category-card__skills">
                <span className="skill-tag"><Icon name="spellcheck" cls="icon-xs" /> Literacy</span>
                <span className="skill-tag"><Icon name="forum" cls="icon-xs" /> Conversation</span>
                <span className="skill-tag"><Icon name="headphones" cls="icon-xs" /> Comprehension</span>
                <span className="skill-tag"><Icon name="mic" cls="icon-xs" /> Production</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ═══ MODULE QUICK ACCESS ═══ */}
      <section className="p-section" style={{ background: 'var(--color-surface)', paddingTop: '60px', paddingBottom: '60px' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-header__tag"><Icon name="bolt" /> Quick Access</div>
            <h2>Jump to a Module</h2>
          </div>
          <div className="grid-4">
            <ModuleCard iconName="headphones" name="Listening" color="teal" href="/ielts/listening" meta="40 Questions · 30 Min" />
            <ModuleCard iconName="menu_book" name="Reading" color="purple" href="/ielts/reading" meta="40 Questions · 60 Min" />
            <ModuleCard iconName="edit_note" name="Writing" color="orange" href="/ielts/writing" meta="Task 1 + Task 2 · 60 Min" />
            <ModuleCard iconName="mic" name="Speaking" color="green" href="/ielts/speaking" meta="3 Parts · 11–14 Min" />
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="features">
        <div className="features__inner">
          <div className="section-header">
            <div className="section-header__tag"><Icon name="verified" /> Why Choose Us</div>
            <h2>Everything You Need to Succeed</h2>
            <p>Our platform is built to give you the most authentic IELTS and PTE practice experience possible.</p>
          </div>
          <div className="grid-3">
            <FeatureItem iconName="headphones" iconBg="#E8F4FF" title="Real Audio Files" desc="Listen to authentic audio recordings via Google Drive or direct uploads. No synthetic voices." />
            <FeatureItem iconName="timer" iconBg="#FFF0E8" title="Timed Exams" desc="Practice under exam conditions with accurate countdown timers for each module." />
            <FeatureItem iconName="fact_check" iconBg="#E8FFF4" title="Instant Answer Keys" desc="Reveal detailed answer keys after completing each test with one click." />
            <FeatureItem iconName="bar_chart" iconBg="#EDE8FF" title="Word Counter" desc="Writing tasks include a live word counter to help you hit the required minimums." />
            <FeatureItem iconName="devices" iconBg="#FFF8E0" title="Mobile Friendly" desc="Practice on any device. Fully responsive design optimised for phones and tablets." />
            <FeatureItem iconName="all_inclusive" iconBg="#F0E6FF" title="Completely Free" desc="No account required, no subscription, no hidden fees. All 200+ tests are free forever." />
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="how-it-works">
        <div className="how-it-works__inner">
          <div className="section-header">
            <div className="section-header__tag"><Icon name="checklist" /> How It Works</div>
            <h2>Start Practising in 4 Simple Steps</h2>
          </div>
          <div className="steps-grid">
            <div className="step-item" data-step="1">
              <div className="step-item__icon"><Icon name="my_location" cls="icon-2xl" /></div>
              <h4>Choose Your Test</h4>
              <p>Select IELTS or PTE, then pick your module — Listening, Reading, Writing, or Speaking.</p>
            </div>
            <div className="step-item" data-step="2">
              <div className="step-item__icon"><Icon name="play_circle" cls="icon-2xl" /></div>
              <h4>Start the Test</h4>
              <p>The timer starts automatically. Listen to the audio, read the passage, or write your response.</p>
            </div>
            <div className="step-item" data-step="3">
              <div className="step-item__icon"><Icon name="check_circle" cls="icon-2xl" /></div>
              <h4>Check Answers</h4>
              <p>Click "Show Answers" when done to reveal the full answer key and see how you performed.</p>
            </div>
            <div className="step-item" data-step="4">
              <div className="step-item__icon"><Icon name="refresh" cls="icon-2xl" /></div>
              <h4>Practice More</h4>
              <p>Move to the next test or switch modules. Track your progress and target weak areas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="testimonials">
        <div className="testimonials__inner">
          <div className="section-header">
            <div className="section-header__tag"><Icon name="star" /> Student Success</div>
            <h2>Real Results from Real Students</h2>
          </div>
          <div className="grid-3">
            <Testimonial name="Sarah K." score="IELTS Band 8.5" avatarBg="#EDE8FF" text="This platform helped me achieve my target band score in just 6 weeks of daily practice. The audio quality is excellent and the questions are just like the real exam." />
            <Testimonial name="Ahmed R." score="PTE Score 82" avatarBg="#E8F4FF" text="The writing section with the word counter was a game-changer. I could finally track my word count in real time. Highly recommend for PTE preparation." />
            <Testimonial name="Priya M." score="IELTS Band 7.5" avatarBg="#E8FFF4" text="I practiced speaking every day using the cue cards. The Part 2 topics are very close to what came in my actual test. Great resource!" />
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section className="p-section" style={{ background: 'var(--hero-gradient)', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ color: '#fff', marginBottom: '16px' }}>Ready to Achieve Your Target Score?</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '32px', fontSize: '1.05rem' }}>
            Start practising now — no registration needed. 200+ tests waiting for you.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <a href="/ielts/listening" className="btn btn-hero btn-hero-solid btn-lg"><Icon name="headphones" /> IELTS Listening</a>
            <a href="/ielts/reading" className="btn btn-hero btn-lg"><Icon name="menu_book" /> IELTS Reading</a>
            <a href="/pte/speaking" className="btn btn-hero btn-lg"><Icon name="mic" /> PTE Speaking</a>
          </div>
        </div>
      </section>
    </>
  )
}
