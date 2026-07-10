/**
 * CONTROLLER: speakingController.js
 * Renders IELTS and PTE Speaking test interface.
 */

const SpeakingController = {
  _testData: null,

  _icon(name, cls = '') {
    return `<span class="material-symbols-outlined${cls ? ' ' + cls : ''}">${name}</span>`;
  },

  render({ exam, testId }) {
    const id = parseInt(testId, 10);
    const testData = exam === 'pte'
      ? SpeakingModel.getPTETest(id)
      : SpeakingModel.getIELTSTest(id);

    this._testData = testData;
    App.setTitle(`${testData.title} — Free Practice`);
    App.renderPage(this._buildHTML(testData, exam));
    this._bindEvents(testData, exam);
  },

  _buildHTML(test, exam) {
    const parts = test.parts || [];
    return `
    <div class="exam-page page-fade-in">
      <div class="exam-page__inner">

        <!-- Header -->
        <div class="exam-header">
          <div class="exam-header__left">
            <button class="exam-header__back" onclick="history.back()">
              ${this._icon('arrow_back')} Back
            </button>
            <div>
              <div class="exam-header__title">
                ${this._icon('mic', 'icon-sm')} ${test.title}
              </div>
              <div class="exam-header__subtitle">${parts.length} Parts · ~${test.duration} min</div>
            </div>
          </div>
          <span class="badge badge-green" style="font-size:0.8rem;">
            ${this._icon('mic', 'icon-xs')} Speaking Practice
          </span>
        </div>

        <!-- Instructions -->
        <div class="exam-instructions">
          <h3>${this._icon('info')} Speaking Instructions</h3>
          <ul>
            ${exam === 'ielts' ? `
            <li>Part 1: Answer questions on familiar topics for 4–5 minutes.</li>
            <li>Part 2: Prepare a 1-minute response, then speak for 1–2 minutes about the cue card topic.</li>
            <li>Part 3: Engage in an in-depth discussion on abstract topics related to Part 2.</li>
            <li>Try to speak at a natural pace. Aim to extend your answers with reasons and examples.</li>` : `
            <li>Practice each task type by reading the prompt aloud.</li>
            <li>Record yourself if possible to identify areas for improvement.</li>
            <li>Focus on fluency, pronunciation, and content accuracy.</li>`}
            <li>There is no time limit for this practice mode — use it to build confidence.</li>
          </ul>
        </div>

        <!-- Parts -->
        ${parts.map((part, i) => this._buildPart(part, i, exam)).join('')}

        <!-- Tips Panel -->
        <div class="card card--teal" style="margin-top:32px;">
          <h4 style="margin-bottom:16px;display:flex;align-items:center;gap:8px;">
            ${this._icon('tips_and_updates')} General Speaking Tips
          </h4>
          <div class="grid-2" style="gap:12px;">
            ${[
              ['record_voice_over', 'Speak clearly', 'Open your mouth fully. Slow down slightly and project your voice.'],
              ['spellcheck', 'Use varied vocabulary', 'Avoid repeating the same words. Use synonyms and collocations.'],
              ['link', 'Link your ideas', 'Use connectors: Moreover, Furthermore, In contrast, As a result...'],
              ['refresh', 'Practice daily', '15 minutes of speaking practice every day beats 2 hours once a week.']
            ].map(([iconName, title, desc]) => `
              <div style="display:flex;gap:12px;align-items:flex-start;padding:12px;background:rgba(255,255,255,0.5);border-radius:10px;border:1.5px solid rgba(26,26,46,0.15);">
                <span class="material-symbols-outlined icon-lg" style="flex-shrink:0;color:var(--color-teal);">${iconName}</span>
                <div>
                  <h5 style="margin-bottom:4px;">${title}</h5>
                  <p style="font-size:0.8rem;">${desc}</p>
                </div>
              </div>`).join('')}
          </div>
        </div>

        <!-- Navigation -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:32px;flex-wrap:wrap;gap:14px;">
          <button class="btn btn-ghost" onclick="history.back()">
            ${this._icon('arrow_back')} Back to Test List
          </button>
          <div style="display:flex;gap:12px;">
            ${parseInt(this._testData?.id || 1) > 1 ? `<a href="#/${exam}/speaking/${(this._testData?.id || 1) - 1}" class="btn btn-secondary">${this._icon('arrow_back')} Previous</a>` : ''}
            <a href="#/${exam}/speaking/${(this._testData?.id || 1) + 1}" class="btn btn-primary">
              Next Test ${this._icon('arrow_forward')}
            </a>
          </div>
        </div>
      </div>
    </div>`;
  },

  _partIconMap: {
    1: 'waving_hand',
    2: 'record_voice_over',
    3: 'forum'
  },

  _buildPart(part, index, exam) {
    const partIcon = part.icon ? null : (this._partIconMap[part.id] || 'mic');

    return `
    <div class="speaking-part" style="margin-bottom:32px;" id="part-${part.id}">
      <div class="q-section-title">
        ${this._icon(partIcon || 'mic')} ${part.title}
        <span style="margin-left:auto;font-size:0.78rem;color:var(--color-muted);font-weight:400;">
          ${this._icon('schedule', 'icon-xs')} ${part.duration}
        </span>
      </div>
      <p style="font-size:0.88rem;color:var(--color-muted);margin-bottom:16px;font-style:italic;">${part.instructions}</p>

      <!-- Cue Card (Part 2) -->
      ${part.cueCard ? `
      <div class="speaking-card">
        <div class="speaking-card__icon">${this._icon('credit_card', 'icon-3xl')}</div>
        <h3>Task Card</h3>
        <p style="font-size:1rem;font-weight:700;color:var(--color-text);margin-bottom:12px;">${part.cueCard.topic}</p>
        <div style="text-align:left;background:rgba(255,255,255,0.6);border:var(--border);border-radius:var(--border-radius-sm);padding:16px;margin-bottom:16px;">
          <p style="font-size:0.82rem;font-weight:700;color:var(--color-muted);margin-bottom:8px;">You should say:</p>
          <ul style="padding-left:20px;display:flex;flex-direction:column;gap:6px;">
            ${(part.cueCard.bullets || []).map(b => `
              <li style="font-size:0.88rem;list-style:disc;color:var(--color-text);">${b}</li>`).join('')}
          </ul>
        </div>
        <div style="display:flex;align-items:center;gap:12px;justify-content:center;flex-wrap:wrap;">
          <button class="btn btn-green btn-sm" id="btn-prep-timer">
            ${this._icon('timer')} Start 1-min Prep Timer
          </button>
          <button class="btn btn-teal btn-sm" id="btn-speak-timer">
            ${this._icon('mic')} Start 2-min Speaking Timer
          </button>
        </div>
        <div id="cue-timer-display" style="margin-top:12px;font-size:1.2rem;font-weight:700;color:var(--color-text);"></div>
      </div>` : ''}

      <!-- Questions -->
      ${part.questions ? `
      <div class="speaking-questions">
        ${(part.questions || []).map((q, qi) => `
          <div class="question-block" style="cursor:default;" id="sq-${index}-${qi}">
            <div class="question-block__num">${qi + 1}</div>
            <p class="question-block__text" style="margin-bottom:0;">${q}</p>
          </div>`).join('')}
      </div>` : ''}

      <!-- PTE prompts -->
      ${part.prompts ? `
      <div class="speaking-prompts">
        ${(part.prompts || []).map((prompt, pi) => `
          <div class="question-block" id="sp-${index}-${pi}">
            <div class="question-block__num">${pi + 1}</div>
            <p class="question-block__text" style="font-size:1rem;line-height:1.8;">"${prompt}"</p>
          </div>`).join('')}
      </div>` : ''}

      <!-- Tips -->
      ${part.tips ? `
      <div style="background:var(--color-surface);border:var(--border);border-radius:var(--border-radius-sm);padding:14px;margin-top:12px;box-shadow:var(--shadow-sm);">
        <h5 style="margin-bottom:8px;font-size:0.82rem;display:flex;align-items:center;gap:6px;">
          ${this._icon('lightbulb', 'icon-xs')} Tips for ${part.title}
        </h5>
        <ul style="padding-left:18px;display:flex;flex-direction:column;gap:4px;">
          ${part.tips.map(t => `<li style="font-size:0.8rem;color:var(--color-muted);list-style:disc;">${t}</li>`).join('')}
        </ul>
      </div>` : ''}

    </div>`;
  },

  _bindEvents(test, exam) {
    let cueTimerInterval = null;

    document.getElementById('btn-prep-timer')?.addEventListener('click', () => {
      clearInterval(cueTimerInterval);
      let secs = 60;
      const display = document.getElementById('cue-timer-display');
      if (display) {
        display.innerHTML = `${this._icon('timer')} Preparation: ${secs}s`;
        cueTimerInterval = setInterval(() => {
          secs--;
          display.innerHTML = `${this._icon('timer')} Preparation: ${secs}s`;
          if (secs <= 0) {
            clearInterval(cueTimerInterval);
            display.innerHTML = `${this._icon('mic')} Time to speak!`;
            App.showToast('Preparation time is up — start speaking now!', 'info');
          }
        }, 1000);
      }
    });

    document.getElementById('btn-speak-timer')?.addEventListener('click', () => {
      clearInterval(cueTimerInterval);
      let secs = 120;
      const display = document.getElementById('cue-timer-display');
      if (display) {
        display.innerHTML = `${this._icon('mic')} Speaking: 2:00`;
        cueTimerInterval = setInterval(() => {
          secs--;
          const m = Math.floor(secs / 60).toString().padStart(2, '0');
          const s = (secs % 60).toString().padStart(2, '0');
          display.innerHTML = `${this._icon('mic')} Speaking: ${m}:${s}`;
          if (secs <= 0) {
            clearInterval(cueTimerInterval);
            display.innerHTML = `${this._icon('check_circle')} Time is up!`;
            App.showToast('Speaking time is up!', 'success');
          }
        }, 1000);
      }
    });
  }
};
