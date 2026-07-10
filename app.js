/**
 * APP.JS — Main Application Bootstrap
 * Initialises the MVC application: sets up the router, registers routes,
 * renders the shell (navbar + footer), and provides global utilities.
 */

const App = {

  // ─── Shell References ─────────────────────────────────────────────────
  _mainEl: null,
  _toastContainer: null,

  /**
   * Boot the application
   */
  init() {
    this._mainEl = document.getElementById('main-content');
    this._toastContainer = document.getElementById('toast-container');
    if (!this._mainEl) {
      console.error('[App] #main-content element not found!');
      return;
    }

    this._registerRoutes();
    Router.start();
    this._bindGlobalEvents();
  },

  // ─── Route Registration ───────────────────────────────────────────────

  _registerRoutes() {
    // Home
    Router.register('/', () => HomeController.render());

    // Exam category pages
    Router.register('/:exam', ({ exam }) => {
      if (['ielts', 'pte'].includes(exam)) {
        TestController.renderExam({ exam });
      } else {
        this.renderError('Exam not found.');
      }
    });

    // Module listings
    Router.register('/:exam/:module', ({ exam, module: mod }) => {
      if (!['ielts', 'pte'].includes(exam)) return this.renderError('Exam not found.');

      const validModules = ['listening', 'reading', 'writing', 'speaking'];
      if (!validModules.includes(mod)) return this.renderError('Module not found.');

      TestController.renderModuleListing({ exam, module: mod });
    });

    // Individual tests — Listening
    Router.register('/:exam/listening/:id', ({ exam, id }) => {
      this._clearTimer();
      ListeningController.render({ exam, testId: id });
    });

    // Individual tests — Reading
    Router.register('/:exam/reading/:id', ({ exam, id }) => {
      this._clearTimer();
      ReadingController.render({ exam, testId: id });
    });

    // Individual tests — Writing
    Router.register('/:exam/writing/:id', ({ exam, id }) => {
      this._clearTimer();
      WritingController.render({ exam, testId: id });
    });

    // Individual tests — Speaking
    Router.register('/:exam/speaking/:id', ({ exam, id }) => {
      SpeakingController.render({ exam, testId: id });
    });
  },

  // ─── View Rendering ───────────────────────────────────────────────────

  /**
   * Inject page HTML into the main content area
   * @param {string} html
   */
  renderPage(html) {
    if (this._mainEl) {
      this._mainEl.innerHTML = html;
      this._mainEl.classList.remove('page-fade-in');
      void this._mainEl.offsetWidth; // trigger reflow
      this._mainEl.classList.add('page-fade-in');
    }
  },

  /**
   * Render an error / 404 page
   * @param {string} message
   */
  renderError(message = 'Page not found.', error = null) {
    this.renderPage(`
      <div class="error-page page-fade-in" style="max-width: 800px; margin: 0 auto; text-align: center;">
        <div style="font-size:5rem;">😕</div>
        <h2>${message}</h2>
        <p>The page you're looking for doesn't exist or an error occurred.</p>
        ${error ? `<pre style="text-align:left; background:#fff0f0; color:#d00; padding:16px; border-radius:8px; margin-top:20px; overflow-x:auto;">${error.stack || error}</pre>` : ''}
        <br><a href="#/" class="btn btn-primary btn-lg" style="margin-top:24px;">← Go Home</a>
      </div>
    `);
  },

  /**
   * Set the document title
   * @param {string} title
   */
  setTitle(title) {
    document.title = title + ' | Practice IELTS & PTE';
  },

  // ─── Global UI Utilities ──────────────────────────────────────────────

  /**
   * Show a toast notification
   * @param {string} message
   * @param {'success'|'error'|'info'} type
   * @param {number} duration - ms before auto-dismiss
   */
  showToast(message, type = 'info', duration = 3500) {
    if (!this._toastContainer) return;

    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
    this._toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideInRight 0.3s ease reverse both';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  // ─── Global Event Binding ─────────────────────────────────────────────

  _bindGlobalEvents() {
    // Mobile hamburger menu
    const hamburger   = document.getElementById('nav-hamburger');
    const mobileMenu  = document.getElementById('mobile-menu');
    const mobileClose = document.getElementById('mobile-menu-close');

    hamburger?.addEventListener('click', () => mobileMenu?.classList.add('is-open'));
    mobileClose?.addEventListener('click', () => mobileMenu?.classList.remove('is-open'));
    mobileMenu?.querySelectorAll('a, .nav-sticker').forEach(el => {
      el.addEventListener('click', () => mobileMenu.classList.remove('is-open'));
    });

    // Back to top button
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) backToTop?.classList.add('visible');
      else backToTop?.classList.remove('visible');
    }, { passive: true });
    backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Active nav link highlighting
    window.addEventListener('hashchange', () => this._updateActiveNav());
    this._updateActiveNav();
  },

  _updateActiveNav() {
    const hash = window.location.hash;
    document.querySelectorAll('[data-nav-href]').forEach(el => {
      el.classList.remove('nav-sticker--active');
      if (hash === '' && el.dataset.navHref === '#/') {
        el.classList.add('nav-sticker--active');
      } else if (hash && el.dataset.navHref && hash.startsWith(el.dataset.navHref) && el.dataset.navHref !== '#/') {
        el.classList.add('nav-sticker--active');
      }
    });
  },

  /**
   * Clear any active timers from exam controllers on route change
   */
  _clearTimer() {
    [ListeningController, ReadingController, WritingController].forEach(ctrl => {
      if (ctrl._timer) {
        clearInterval(ctrl._timer);
        ctrl._timer = null;
      }
    });
  }
};

// ─── Boot when DOM is ready ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => App.init());
