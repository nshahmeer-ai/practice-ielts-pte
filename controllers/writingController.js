/**
 * CONTROLLER: writingController.js
 * Renders IELTS Writing test interface.
 */

const WritingController = {
  _timer: null,
  _seconds: 0,
  _testData: null,

  _icon(name, cls = '') {
    return `<span class="material-symbols-outlined${cls ? ' ' + cls : ''}">${name}</span>`;
  },

  render({ exam, testId }) {
    const id = parseInt(testId, 10);
    let testData;
    if (exam === 'ielts-gt') {
      testData = WritingModel.getGeneralTest(id);
    } else {
      testData = WritingModel.getIELTSTest(id);
    }
    this._testData = testData;
    this._seconds  = (testData.duration || 60) * 60;
    App.setTitle(`${testData.title} — Free Practice`);
    App.renderPage(this._buildHTML(testData, exam));
    this._bindEvents(testData, exam);
    this._startTimer();
  },

  _buildHTML(test, exam) {
    const tasks = test.tasks || [];
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
                ${this._icon('edit_note', 'icon-sm')} ${test.title}
              </div>
              <div class="exam-header__subtitle">${test.type} · ${test.duration} min total</div>
            </div>
          </div>
          <div class="exam-timer" id="exam-timer">
            <span class="exam-timer__icon">${this._icon('timer')}</span>
            <span id="timer-display">${this._formatTime(this._seconds)}</span>
          </div>
        </div>

        <!-- Instructions -->
        <div class="exam-instructions">
          <h3>${this._icon('info')} Writing Instructions</h3>
          <ul>
            <li>Task 1 should be completed in approximately <strong>20 minutes</strong> (min. 150 words).</li>
            <li>Task 2 should be completed in approximately <strong>40 minutes</strong> (min. 250 words).</li>
            <li>Task 2 carries more marks — manage your time accordingly.</li>
            <li>Write in an academic style. Do not use contractions.</li>
          </ul>
        </div>

        <!-- Tasks -->
        ${tasks.map((task, i) => this._buildTask(task, i, exam)).join('')}

        <!-- Sample Answer Reveal -->
        <div class="answers-reveal" id="sample-answers-reveal">
          <div class="answers-reveal__title">
            ${this._icon('rate_review')} Sample Answers
          </div>
          <div id="sample-answers-content"></div>
        </div>

        <!-- Action Bar -->
        <div class="show-answers-bar">
          <p>Finished? Review sample answers to compare your response.</p>
          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            <button class="btn btn-secondary btn-sm" id="btn-reset">
              ${this._icon('refresh')} Clear
            </button>
            <button class="btn btn-primary" id="btn-show-samples">
              ${this._icon('rate_review')} Show Sample Answers
            </button>
          </div>
        </div>

        <!-- Navigation -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:32px;flex-wrap:wrap;gap:14px;">
          <button class="btn btn-ghost" onclick="history.back()">
            ${this._icon('arrow_back')} Back to Test List
          </button>
          <div style="display:flex;gap:12px;">
            ${parseInt(this._testData?.id || 1) > 1 ? `<a href="#/${exam}/writing/${(this._testData?.id || 1) - 1}" class="btn btn-secondary">${this._icon('arrow_back')} Previous</a>` : ''}
            <a href="#/${exam}/writing/${(this._testData?.id || 1) + 1}" class="btn btn-primary">
              Next Test ${this._icon('arrow_forward')}
            </a>
          </div>
        </div>
      </div>
    </div>`;
  },

  _buildTask(task, index, exam) {
    const minWords  = task.taskNum === 1 ? 150 : 250;
    const timeAlloc = task.taskNum === 1 ? '20 minutes' : '40 minutes';

    return `
    <div class="task-block" style="margin-bottom:36px;" id="task-${task.taskNum}">

      <!-- Task Prompt -->
      <div class="writing-prompt">
        <h3>${this._icon('push_pin')} ${task.heading}</h3>
        <p style="font-size:0.82rem;color:var(--color-muted);margin-bottom:10px;display:flex;align-items:center;gap:6px;">
          ${this._icon('timer', 'icon-xs')} Suggested time: ${timeAlloc} &nbsp;·&nbsp;
          ${this._icon('edit', 'icon-xs')} Minimum: ${minWords} words
        </p>
        <p>${task.prompt}</p>
        ${task.chartDescription ? `
          <div style="background:rgba(255,255,255,0.6);border:var(--border);border-radius:var(--border-radius-sm);padding:12px;margin-top:12px;font-size:0.85rem;color:var(--color-muted);display:flex;gap:8px;align-items:flex-start;">
            ${this._icon('bar_chart', 'icon-sm')} <span><strong>Chart data:</strong> ${task.chartDescription}</span>
          </div>` : ''}
        ${task.imageUrl ? `<img src="${task.imageUrl}" alt="Writing Task Chart" style="max-height:260px;object-fit:contain;" />` : ''}
      </div>

      <!-- Writing Tips -->
      ${task.tips ? `
      <div style="background:var(--color-surface);border:var(--border);border-radius:var(--border-radius-sm);padding:16px;margin-bottom:16px;box-shadow:var(--shadow-sm);">
        <h5 style="margin-bottom:8px;font-size:0.85rem;display:flex;align-items:center;gap:6px;">
          ${this._icon('lightbulb', 'icon-xs')} Writing Tips
        </h5>
        <ul style="padding-left:18px;display:flex;flex-direction:column;gap:4px;">
          ${task.tips.map(tip => `<li style="font-size:0.82rem;color:var(--color-muted);list-style:disc;">${tip}</li>`).join('')}
        </ul>
      </div>` : ''}

      <p style="font-size:0.82rem;font-weight:700;color:var(--color-muted);margin-bottom:8px;">${task.instructions}</p>

      <!-- Textarea -->
      <textarea
        class="q-textarea"
        id="task-textarea-${task.taskNum}"
        data-task="${task.taskNum}"
        data-min-words="${minWords}"
        placeholder="Write your ${task.type === 'letter' ? 'letter' : task.taskNum === 1 ? 'report' : 'essay'} here..."></textarea>

      <!-- Word Counter -->
      <div class="word-counter">
        <span style="font-size:0.78rem;">Minimum: ${minWords} words</span>
        <span class="word-counter__count" id="word-count-${task.taskNum}">0 words</span>
      </div>

    </div>`;
  },

  _startTimer() {
    clearInterval(this._timer);
    const display = document.getElementById('timer-display');
    const timerEl = document.getElementById('exam-timer');
    this._timer = setInterval(() => {
      this._seconds--;
      if (display) display.textContent = this._formatTime(this._seconds);
      if (this._seconds <= 600 && this._seconds > 120) timerEl?.classList.add('warning');
      else if (this._seconds <= 120) { timerEl?.classList.remove('warning'); timerEl?.classList.add('danger'); }
      if (this._seconds <= 0) { clearInterval(this._timer); App.showToast('Time is up!', 'info'); }
    }, 1000);
  },

  _formatTime(secs) {
    const m = Math.floor(Math.max(0, secs) / 60).toString().padStart(2, '0');
    const s = (Math.max(0, secs) % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  },

  _countWords(text) {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  },

  _bindEvents(test, exam) {
    document.querySelectorAll('.q-textarea').forEach(ta => {
      const taskNum  = ta.dataset.task;
      const minWords = parseInt(ta.dataset.minWords, 10);
      const counter  = document.getElementById(`word-count-${taskNum}`);

      ta.addEventListener('input', () => {
        const count = this._countWords(ta.value);
        if (counter) {
          counter.textContent = `${count} words`;
          counter.className = 'word-counter__count';
          if (count < minWords * 0.8) counter.classList.add('warning');
          if (count >= minWords)      counter.classList.add('success');
        }
      });
    });

    document.getElementById('btn-show-samples')?.addEventListener('click', () => this._showSamples(test));

    document.getElementById('btn-reset')?.addEventListener('click', () => {
      document.querySelectorAll('.q-textarea').forEach(ta => {
        ta.value = '';
        const taskNum = ta.dataset.task;
        const counter = document.getElementById(`word-count-${taskNum}`);
        if (counter) { counter.textContent = '0 words'; counter.className = 'word-counter__count'; }
      });
      document.getElementById('sample-answers-reveal')?.classList.remove('is-visible');
      this._seconds = (this._testData?.duration || 60) * 60;
      clearInterval(this._timer);
      this._startTimer();
    });
  },

  _showSamples(test) {
    const tasks = test.tasks || [];
    const container = document.getElementById('sample-answers-content');
    if (container) {
      container.innerHTML = tasks.map(task => `
        <div style="margin-bottom:20px;">
          <h4 style="color:var(--color-purple);margin-bottom:8px;">Task ${task.taskNum} — Sample Answer</h4>
          ${task.sampleAnswer
            ? `<div style="background:var(--color-surface);border:var(--border);border-radius:var(--border-radius-sm);padding:16px;font-size:0.88rem;line-height:1.8;white-space:pre-line;">
                ${task.sampleAnswer}
               </div>
               <div style="margin-top:6px;font-size:0.78rem;color:var(--color-muted);">
                 Word count: ${this._countWords(task.sampleAnswer)} words
               </div>`
            : `<p style="font-size:0.88rem;color:var(--color-muted);">Sample answer not available for this test.</p>`}
        </div>`).join('');
    }
    document.getElementById('sample-answers-reveal')?.classList.add('is-visible');
    document.getElementById('sample-answers-reveal')?.scrollIntoView({ behavior: 'smooth' });
    App.showToast('Sample answers revealed.', 'success');
  }
};
