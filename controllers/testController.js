/**
 * CONTROLLER: testController.js
 * Renders exam category pages and test listing pages.
 */

const TestController = {

  _icon(name, cls = '') {
    return `<span class="material-symbols-outlined${cls ? ' ' + cls : ''}">${name}</span>`;
  },

  renderExam({ exam }) {
    const examData = TestsModel[exam];
    if (!examData) return App.renderError('Exam not found.');
    App.setTitle(`${examData.name} Practice Tests — Free Online`);
    App.renderPage(this._buildExamPage(examData));
    this._bindEvents();
  },

  renderModuleListing({ exam, module: mod }) {
    const examData   = TestsModel[exam];
    const moduleData = examData?.modules[mod];
    if (!examData || !moduleData) return App.renderError('Module not found.');
    const tests = TestsModel.getTestList(exam, mod, moduleData.totalTests || 20);
    App.setTitle(`${examData.name} ${moduleData.name} Practice Tests`);
    App.renderPage(this._buildModuleListing(examData, moduleData, tests));
    this._bindEvents();
  },

  // ─── Private Builders ────────────────────────────────────────────────

  _buildExamPage(exam) {
    const modules = Object.values(exam.modules);

    return `
    <div class="tests-page">
      <div class="tests-page__inner">

        <!-- Hero Banner -->
        <div class="tests-page__hero">
          <span style="position:relative;z-index:1;">
            <div class="badge badge-outline" style="color:rgba(255,255,255,0.9);border-color:rgba(255,255,255,0.3);margin-bottom:16px;background:rgba(255,255,255,0.15);">
              ${this._icon(exam.id === 'ielts' ? 'school' : 'work')} ${exam.name}
            </div>
            <h1>${exam.fullName}</h1>
            <p>${exam.description}</p>
          </span>
        </div>

        <!-- Module Cards -->
        <div class="section-header" style="margin-bottom:28px;">
          <div class="section-header__tag">${this._icon('grid_view')} Select a Module</div>
          <h2>Choose Your ${exam.name} Module</h2>
        </div>
        <div class="grid-2" style="max-width:800px;margin:0 auto 48px;">
          ${modules.map(m => this._buildModuleCard(exam, m)).join('')}
        </div>

        <!-- Band / Score Info -->
        ${exam.id === 'ielts' ? this._buildBandInfo() : this._buildPTEScoreInfo()}

      </div>
    </div>`;
  },

  _moduleIconMap: {
    listening: 'headphones',
    reading:   'menu_book',
    writing:   'edit_note',
    speaking:  'mic'
  },

  _buildModuleCard(exam, module) {
    const colorClass = `card--${module.color}`;
    const href  = `#/${exam.id}/${module.id}`;
    const count = module.totalTests || 15;
    const iconName = this._moduleIconMap[module.id] || 'assignment';

    return `
    <a href="${href}" class="card ${colorClass}" style="text-decoration:none;color:inherit;">
      <div class="card__icon card__icon--${module.color}">
        <span class="material-symbols-outlined icon-lg">${iconName}</span>
      </div>
      <h3 class="card__title">${module.name}</h3>
      <p class="card__desc">${module.description}</p>
      <div class="card__meta">
        <span>${this._icon('assignment', 'icon-xs')} ${count} Tests</span>
        ${module.duration ? `<span>${this._icon('timer', 'icon-xs')} ${module.duration} min</span>` : ''}
      </div>
      <div style="margin-top:16px;">
        <span class="btn btn-primary btn-sm" style="pointer-events:none;">Start Practice ${this._icon('arrow_forward', 'icon-xs')}</span>
      </div>
    </a>`;
  },

  _buildModuleListing(exam, module, tests) {
    const iconName = this._moduleIconMap[module.id] || 'assignment';

    return `
    <div class="tests-page">
      <div class="tests-page__inner">

        <!-- Breadcrumb -->
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:20px;font-size:0.85rem;">
          <a href="#/" style="color:var(--color-muted);">Home</a>
          <span class="material-symbols-outlined" style="font-size:0.9rem;color:var(--color-muted);">chevron_right</span>
          <a href="#/${exam.id}" style="color:var(--color-muted);">${exam.name}</a>
          <span class="material-symbols-outlined" style="font-size:0.9rem;color:var(--color-muted);">chevron_right</span>
          <span style="color:var(--color-text);font-weight:700;">${module.name}</span>
        </div>

        <!-- Hero -->
        <div class="tests-page__hero">
          <span style="position:relative;z-index:1;">
            <div class="badge badge-outline" style="color:rgba(255,255,255,0.9);border-color:rgba(255,255,255,0.3);background:rgba(255,255,255,0.15);margin-bottom:16px;">
              ${this._icon(iconName)} ${exam.name} ${module.name}
            </div>
            <h1>${exam.name} ${module.name} Practice Tests</h1>
            <p style="color:rgba(255,255,255,0.8);">${module.description}</p>
          </span>
        </div>

        <!-- Module Quick Info -->
        <div class="grid-3" style="margin-bottom:36px;">
          ${module.totalQuestions ? `
          <div class="card" style="text-align:center;padding:20px;">
            <div style="font-size:1.8rem;font-weight:800;color:var(--color-purple);">${module.totalQuestions}</div>
            <div style="font-size:0.82rem;color:var(--color-muted);">Questions per Test</div>
          </div>` : ''}
          <div class="card" style="text-align:center;padding:20px;">
            <div style="font-size:1.8rem;font-weight:800;color:var(--color-teal);">${module.duration} min</div>
            <div style="font-size:0.82rem;color:var(--color-muted);">Duration</div>
          </div>
          <div class="card" style="text-align:center;padding:20px;">
            <div style="font-size:1.8rem;font-weight:800;color:var(--color-orange);">${tests.length}</div>
            <div style="font-size:0.82rem;color:var(--color-muted);">Total Tests</div>
          </div>
        </div>

        <!-- Difficulty Filter Tabs -->
        <div class="tabs" id="difficulty-tabs">
          <button class="tab-btn active" data-filter="all">All Tests</button>
          <button class="tab-btn" data-filter="Beginner">
            <span class="material-symbols-outlined icon-xs" style="color:var(--color-green);">circle</span> Beginner
          </button>
          <button class="tab-btn" data-filter="Intermediate">
            <span class="material-symbols-outlined icon-xs" style="color:var(--color-orange);">circle</span> Intermediate
          </button>
          <button class="tab-btn" data-filter="Advanced">
            <span class="material-symbols-outlined icon-xs" style="color:var(--color-red);">circle</span> Advanced
          </button>
        </div>

        <!-- Tests List -->
        <div class="tests-grid" id="tests-grid">
          ${tests.map(t => this._buildTestCard(exam, module, t)).join('')}
        </div>

      </div>
    </div>`;
  },

  _buildTestCard(exam, module, test) {
    const href = `#/${exam.id}/${module.id}/${test.id}`;
    return `
    <a href="${href}" class="test-card" data-difficulty="${test.difficulty}">
      <div class="test-card__left">
        <div class="test-card__num">${test.id}</div>
        <div class="test-card__info">
          <h4>${test.shortTitle}</h4>
          <p>
            <span class="material-symbols-outlined" style="font-size:0.85rem;vertical-align:middle;">timer</span> ${test.duration} min &nbsp;·&nbsp;
            <span class="material-symbols-outlined" style="font-size:0.85rem;vertical-align:middle;">assignment</span> ${test.questions} questions
          </p>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:10px;">
        <span class="badge badge-${test.difficultyColor}" style="font-size:0.7rem;">${test.difficulty}</span>
        <span class="test-card__arrow material-symbols-outlined">arrow_forward</span>
      </div>
    </a>`;
  },

  _buildBandInfo() {
    return `
    <div class="card" style="background:linear-gradient(135deg,#EDE8FF,#E8F4FF);margin-top:24px;">
      <h3 style="margin-bottom:16px;">
        <span class="material-symbols-outlined icon-md" style="vertical-align:middle;color:var(--color-purple);">bar_chart</span>
        IELTS Band Score Guide
      </h3>
      <div class="grid-4" style="gap:12px;">
        ${[['9', 'Expert', 'green'],['8–8.5','Very Good','teal'],['7–7.5','Good','purple'],['6–6.5','Competent','orange']].map(([b,l,c]) => `
          <div class="card" style="text-align:center;padding:16px;box-shadow:3px 3px 0px 0px var(--color-${c});">
            <div style="font-size:1.6rem;font-weight:800;color:var(--color-${c});">${b}</div>
            <div style="font-size:0.8rem;color:var(--color-muted);margin-top:4px;">${l}</div>
          </div>`).join('')}
      </div>
    </div>`;
  },

  _buildPTEScoreInfo() {
    return `
    <div class="card" style="background:linear-gradient(135deg,#E8F4FF,#EDE8FF);margin-top:24px;">
      <h3 style="margin-bottom:16px;">
        <span class="material-symbols-outlined icon-md" style="vertical-align:middle;color:var(--color-teal);">bar_chart</span>
        PTE Score Guide
      </h3>
      <div class="grid-4" style="gap:12px;">
        ${[['90','Expert','green'],['79–89','Excellent','teal'],['65–78','Good','purple'],['50–64','Pass','orange']].map(([s,l,c]) => `
          <div class="card" style="text-align:center;padding:16px;box-shadow:3px 3px 0px 0px var(--color-${c});">
            <div style="font-size:1.6rem;font-weight:800;color:var(--color-${c});">${s}</div>
            <div style="font-size:0.8rem;color:var(--color-muted);margin-top:4px;">${l}</div>
          </div>`).join('')}
      </div>
    </div>`;
  },

  _bindEvents() {
    const tabs = document.getElementById('difficulty-tabs');
    if (!tabs) return;
    tabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;
      tabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('#tests-grid .test-card').forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.difficulty === filter) ? '' : 'none';
      });
    });
  }
};
