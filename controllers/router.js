/**
 * CONTROLLER: router.js
 * Hash-based SPA (Single Page Application) router.
 * Listens to URL hash changes and delegates rendering to controllers.
 *
 * Route format: #/exam/module/testNumber
 * Examples:
 *   #/                      → Home
 *   #/ielts                 → IELTS category page
 *   #/pte                   → PTE category page
 *   #/ielts/listening       → Listening test list
 *   #/ielts/listening/1     → Listening Test 1
 *   #/ielts/reading/1       → Reading Test 1
 *   #/ielts/writing/1       → Writing Test 1
 *   #/ielts/speaking/1      → Speaking Test 1
 */

const Router = {
  routes: {},
  currentRoute: null,

  /**
   * Register a route with a handler function
   * @param {string} path - route pattern (supports :param wildcards)
   * @param {function} handler - function(params) called when route matches
   */
  register(path, handler) {
    this.routes[path] = handler;
  },

  /**
   * Navigate to a route programmatically
   * @param {string} path
   */
  navigate(path) {
    window.location.hash = path;
  },

  /**
   * Get current hash as a path
   */
  getCurrentPath() {
    const hash = window.location.hash.replace(/^#\/?/, '');
    return '/' + (hash || '');
  },

  /**
   * Parse path against a route pattern, extract params
   * Returns params object or null if no match
   */
  matchRoute(pattern, path) {
    const patternParts = pattern.split('/').filter(Boolean);
    const pathParts    = path.split('/').filter(Boolean);

    if (patternParts.length !== pathParts.length) return null;

    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }
    return params;
  },

  /**
   * Resolve and execute the handler for the current path
   */
  resolve() {
    const currentPath = this.getCurrentPath();
    this.currentRoute = currentPath;

    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Try to match each registered route
    for (const [pattern, handler] of Object.entries(this.routes)) {
      const params = this.matchRoute(pattern, currentPath);
      if (params !== null) {
        try {
          handler(params);
        } catch (err) {
          console.error(`[Router] Error in handler for "${pattern}":`, err);
          App.renderError('An error occurred rendering this page.', err);
        }
        return;
      }
    }

    // No route matched — show 404
    App.renderError('Page not found.');
  },

  /**
   * Start the router — listen for hash changes
   */
  start() {
    window.addEventListener('hashchange', () => this.resolve());
    window.addEventListener('load', () => this.resolve());

    // Also resolve immediately in case page is already loaded
    this.resolve();
  }
};
