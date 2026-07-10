/**
 * CONTROLLER: homeController.js
 * Renders the home page — hero, exam categories, features, steps, testimonials.
 */

const HomeController = {

  render() {
    App.setTitle('Practice IELTS & PTE — Free Tests Online');
    App.renderPage(this._buildHTML());
    this._bindEvents();
  },

  _icon(name, cls = '') {
    return `<span class="material-symbols-outlined${cls ? ' ' + cls : ''}">${name}</span>`;
  },

  _buildHTML() {
    return `
    <!-- ═══ HERO SECTION ═══ -->
    <section class="hero">
      <div class="hero__inner">
        <div class="hero__tag">
          <span class="hero__tag-dot"></span>
          2026 Edition — Updated Tests Available
        </div>
        <h1 class="hero__title">
          Master <em>IELTS &amp; PTE</em> with Free Practice Tests
        </h1>
        <p class="hero__subtitle">
          Access 200+ authentic practice tests for IELTS and PTE Academic.
          Listen to real audio recordings, complete timed exams, and instantly
          check your answers — all for free.
        </p>
        <div class="hero__ctas">
          <a href="#/ielts/listening" class="btn btn-hero btn-hero-solid btn-lg">
            ${this._icon('headphones')} Start IELTS Practice
          </a>
          <a href="#/pte/speaking" class="btn btn-hero btn-lg">
            ${this._icon('work')} Start PTE Practice
          </a>
        </div>
        <div class="hero__stats">
          <div class="stat-card">
            <div class="stat-card__num">200+</div>
            <div class="stat-card__label">Practice Tests</div>
          </div>
          <div class="stat-card">
            <div class="stat-card__num">8,000+</div>
            <div class="stat-card__label">Questions</div>
          </div>
          <div class="stat-card">
            <div class="stat-card__num">4</div>
            <div class="stat-card__label">IELTS Modules</div>
          </div>
          <div class="stat-card">
            <div class="stat-card__num">Free</div>
            <div class="stat-card__label">Forever</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ EXAM CATEGORIES ═══ -->
    <section class="exam-categories">
      <div class="exam-categories__inner">
        <div class="section-header">
          <div class="section-header__tag">${this._icon('library_books')} Choose Your Exam</div>
          <h2>Select Your Practice Path</h2>
          <p>Choose from IELTS Academic, IELTS General Training, or PTE Academic. All modules available.</p>
        </div>
        <div class="grid-2" style="max-width:860px;margin:0 auto;">
          <a href="#/ielts" class="category-card category-card--ielts">
            <div class="category-card__icon">${this._icon('school', 'icon-xl')}</div>
            <h3 class="category-card__title">IELTS Practice</h3>
            <p class="category-card__desc">International English Language Testing System — 20+ tests per module with full audio and answers.</p>
            <div class="category-card__skills">
              <span class="skill-tag">${this._icon('headphones', 'icon-xs')} Listening</span>
              <span class="skill-tag">${this._icon('menu_book', 'icon-xs')} Reading</span>
              <span class="skill-tag">${this._icon('edit_note', 'icon-xs')} Writing</span>
              <span class="skill-tag">${this._icon('mic', 'icon-xs')} Speaking</span>
            </div>
          </a>
          <a href="#/pte" class="category-card category-card--pte">
            <div class="category-card__icon">${this._icon('work', 'icon-xl')}</div>
            <h3 class="category-card__title">PTE Academic</h3>
            <p class="category-card__desc">Pearson Test of English — AI-scored exam with computer-based format. 15+ practice tests per section.</p>
            <div class="category-card__skills">
              <span class="skill-tag">${this._icon('mic', 'icon-xs')} Speaking</span>
              <span class="skill-tag">${this._icon('menu_book', 'icon-xs')} Reading</span>
              <span class="skill-tag">${this._icon('headphones', 'icon-xs')} Listening</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- ═══ MODULE QUICK ACCESS ═══ -->
    <section class="p-section" style="background: var(--color-surface); padding-top:60px;padding-bottom:60px;">
      <div class="container">
        <div class="section-header">
          <div class="section-header__tag">${this._icon('bolt')} Quick Access</div>
          <h2>Jump to a Module</h2>
        </div>
        <div class="grid-4">
          ${this._moduleCard('headphones', 'Listening', 'listening', 'teal', '#/ielts/listening', '40 Questions · 30 Min')}
          ${this._moduleCard('menu_book', 'Reading',   'reading',   'purple', '#/ielts/reading',   '40 Questions · 60 Min')}
          ${this._moduleCard('edit_note', 'Writing',   'writing',   'orange', '#/ielts/writing',   'Task 1 + Task 2 · 60 Min')}
          ${this._moduleCard('mic', 'Speaking',  'speaking',  'green',  '#/ielts/speaking',  '3 Parts · 11–14 Min')}
        </div>
      </div>
    </section>

    <!-- ═══ FEATURES ═══ -->
    <section class="features">
      <div class="features__inner">
        <div class="section-header">
          <div class="section-header__tag">${this._icon('verified')} Why Choose Us</div>
          <h2>Everything You Need to Succeed</h2>
          <p>Our platform is built to give you the most authentic IELTS and PTE practice experience possible.</p>
        </div>
        <div class="grid-3">
          ${this._featureItem('headphones', '#E8F4FF', 'Real Audio Files', 'Listen to authentic audio recordings via Google Drive or direct uploads. No synthetic voices.')}
          ${this._featureItem('timer', '#FFF0E8', 'Timed Exams', 'Practice under exam conditions with accurate countdown timers for each module.')}
          ${this._featureItem('fact_check', '#E8FFF4', 'Instant Answer Keys', 'Reveal detailed answer keys after completing each test with one click.')}
          ${this._featureItem('bar_chart', '#EDE8FF', 'Word Counter', 'Writing tasks include a live word counter to help you hit the required minimums.')}
          ${this._featureItem('devices', '#FFF8E0', 'Mobile Friendly', 'Practice on any device. Fully responsive design optimised for phones and tablets.')}
          ${this._featureItem('all_inclusive', '#F0E6FF', 'Completely Free', 'No account required, no subscription, no hidden fees. All 200+ tests are free forever.')}
        </div>
      </div>
    </section>

    <!-- ═══ HOW IT WORKS ═══ -->
    <section class="how-it-works">
      <div class="how-it-works__inner">
        <div class="section-header">
          <div class="section-header__tag">${this._icon('checklist')} How It Works</div>
          <h2>Start Practising in 4 Simple Steps</h2>
        </div>
        <div class="steps-grid">
          <div class="step-item" data-step="1">
            <div class="step-item__icon">${this._icon('my_location', 'icon-2xl')}</div>
            <h4>Choose Your Test</h4>
            <p>Select IELTS or PTE, then pick your module — Listening, Reading, Writing, or Speaking.</p>
          </div>
          <div class="step-item" data-step="2">
            <div class="step-item__icon">${this._icon('play_circle', 'icon-2xl')}</div>
            <h4>Start the Test</h4>
            <p>The timer starts automatically. Listen to the audio, read the passage, or write your response.</p>
          </div>
          <div class="step-item" data-step="3">
            <div class="step-item__icon">${this._icon('check_circle', 'icon-2xl')}</div>
            <h4>Check Answers</h4>
            <p>Click "Show Answers" when done to reveal the full answer key and see how you performed.</p>
          </div>
          <div class="step-item" data-step="4">
            <div class="step-item__icon">${this._icon('refresh', 'icon-2xl')}</div>
            <h4>Practice More</h4>
            <p>Move to the next test or switch modules. Track your progress and target weak areas.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ TESTIMONIALS ═══ -->
    <section class="testimonials">
      <div class="testimonials__inner">
        <div class="section-header">
          <div class="section-header__tag">${this._icon('star')} Student Success</div>
          <h2>Real Results from Real Students</h2>
        </div>
        <div class="grid-3">
          ${this._testimonial('Sarah K.', 'IELTS Band 8.5', '#EDE8FF',
            '"This platform helped me achieve my target band score in just 6 weeks of daily practice. The audio quality is excellent and the questions are just like the real exam."')}
          ${this._testimonial('Ahmed R.', 'PTE Score 82', '#E8F4FF',
            '"The writing section with the word counter was a game-changer. I could finally track my word count in real time. Highly recommend for PTE preparation."')}
          ${this._testimonial('Priya M.', 'IELTS Band 7.5', '#E8FFF4',
            '"I practiced speaking every day using the cue cards. The Part 2 topics are very close to what came in my actual test. Great resource!"')}
        </div>
      </div>
    </section>

    <!-- ═══ CTA BANNER ═══ -->
    <section class="p-section" style="background: var(--hero-gradient); text-align: center;">
      <div class="container">
        <h2 style="color:#fff; margin-bottom:16px;">Ready to Achieve Your Target Score?</h2>
        <p style="color:rgba(255,255,255,0.8); margin-bottom:32px; font-size:1.05rem;">
          Start practising now — no registration needed. 200+ tests waiting for you.
        </p>
        <div style="display:flex; justify-content:center; gap:16px; flex-wrap:wrap;">
          <a href="#/ielts/listening" class="btn btn-hero btn-hero-solid btn-lg">${this._icon('headphones')} IELTS Listening</a>
          <a href="#/ielts/reading"   class="btn btn-hero btn-lg">${this._icon('menu_book')} IELTS Reading</a>
          <a href="#/pte/speaking"    class="btn btn-hero btn-lg">${this._icon('mic')} PTE Speaking</a>
        </div>
      </div>
    </section>`;
  },

  _moduleCard(iconName, name, module, color, href, meta) {
    return `
      <a href="${href}" class="card card--${color}" style="text-decoration:none;color:inherit;">
        <div class="card__icon card__icon--${color}">
          <span class="material-symbols-outlined icon-lg">${iconName}</span>
        </div>
        <h4 class="card__title">${name}</h4>
        <p class="card__desc">IELTS ${name} practice tests with authentic questions.</p>
        <div class="card__meta">
          <span class="material-symbols-outlined icon-xs">schedule</span> ${meta}
        </div>
      </a>`;
  },

  _featureItem(iconName, iconBg, title, desc) {
    return `
      <div class="feature-item">
        <div class="feature-item__icon" style="background:${iconBg};">
          <span class="material-symbols-outlined icon-lg">${iconName}</span>
        </div>
        <div>
          <h4>${title}</h4>
          <p>${desc}</p>
        </div>
      </div>`;
  },

  _testimonial(name, score, avatarBg, text) {
    const initial = name.charAt(0);
    const stars = Array(5).fill('<span class="material-symbols-outlined" style="color:var(--color-yellow);font-size:1rem;">star</span>').join('');
    return `
      <div class="testimonial-card">
        <div class="testimonial-card__stars">${stars}</div>
        <p class="testimonial-card__text">${text}</p>
        <div class="testimonial-card__author">
          <div class="testimonial-card__avatar" style="background:${avatarBg};">${initial}</div>
          <div>
            <div class="testimonial-card__name">${name}</div>
            <div class="testimonial-card__score">
              <span class="material-symbols-outlined" style="font-size:0.9rem;vertical-align:middle;color:var(--color-green);">emoji_events</span>
              ${score}
            </div>
          </div>
        </div>
      </div>`;
  },

  _bindEvents() {}
};
