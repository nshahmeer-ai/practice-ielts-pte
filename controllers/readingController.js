/**
 * CONTROLLER: readingController.js
 * Renders IELTS and PTE Reading test interface.
 */

const ReadingController = {
  _timer: null,
  _seconds: 0,
  _testData: null,

  _icon(name, cls = '') {
    return `<span class="material-symbols-outlined${cls ? ' ' + cls : ''}">${name}</span>`;
  },

  render({ exam, testId }) {
    const id = parseInt(testId, 10);
    const testData = exam === 'pte' ? ReadingModel.getPTETest(id) : ReadingModel.getIELTSTest(id);
    this._testData = testData;
    this._seconds  = (testData.duration || 60) * 60;
    App.setTitle(`${testData.title} — Free Practice`);
    App.renderPage(this._buildHTML(testData, exam));
    this._bindEvents(testData);
    this._startTimer();
  },

  _buildHTML(test, exam) {
    const passages = test.passages || [];
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
                ${this._icon('menu_book', 'icon-sm')} ${test.title}
              </div>
              <div class="exam-header__subtitle">${test.type} · ${test.duration} min</div>
            </div>
          </div>
          <div class="exam-timer" id="exam-timer">
            <span class="exam-timer__icon">${this._icon('timer')}</span>
            <span id="timer-display">${this._formatTime(this._seconds)}</span>
          </div>
        </div>

        <!-- Instructions -->
        <div class="exam-instructions">
          <h3>${this._icon('info')} Reading Instructions</h3>
          <ul>
            <li>Read each passage carefully before attempting the questions.</li>
            <li>Answers must be based solely on the information in the passage.</li>
            <li>For True/False/Not Given: <strong>TRUE</strong> = passage agrees; <strong>FALSE</strong> = passage contradicts; <strong>NOT GIVEN</strong> = not mentioned.</li>
            <li>Manage your time: approximately 20 minutes per passage.</li>
          </ul>
        </div>

        <!-- Progress -->
        <div class="progress-bar" style="margin-bottom:8px;">
          <div class="progress-bar__fill" id="exam-progress" style="width:0%;"></div>
        </div>
        <div style="font-size:0.8rem;color:var(--color-muted);margin-bottom:24px;" id="progress-text">0 questions answered</div>

        <!-- Passages -->
        ${passages.map((p, pi) => this._buildPassage(p, pi)).join('')}

        <!-- Show Answers Bar -->
        <div class="show-answers-bar">
          <p>Finished reading? Check your answers below.</p>
          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            <button class="btn btn-secondary btn-sm" id="btn-reset">
              ${this._icon('refresh')} Reset
            </button>
            <button class="btn btn-primary" id="btn-show-answers">
              ${this._icon('fact_check')} Show Answers
            </button>
          </div>
        </div>

        <!-- Answers Reveal -->
        <div class="answers-reveal" id="answers-reveal">
          <div class="answers-reveal__title">
            ${this._icon('assignment_turned_in')} Answer Key
          </div>
          <div class="answers-reveal__list" id="answers-list"></div>
        </div>

        <!-- Navigation -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:32px;flex-wrap:wrap;gap:14px;">
          <button class="btn btn-ghost" onclick="history.back()">
            ${this._icon('arrow_back')} Back to Test List
          </button>
          <div style="display:flex;gap:12px;">
            ${parseInt(this._testData?.id || 1) > 1 ? `<a href="#/${exam}/reading/${(this._testData?.id || 1) - 1}" class="btn btn-secondary">${this._icon('arrow_back')} Previous</a>` : ''}
            <a href="#/${exam}/reading/${(this._testData?.id || 1) + 1}" class="btn btn-primary">
              Next Test ${this._icon('arrow_forward')}
            </a>
          </div>
        </div>
      </div>
    </div>`;
  },

  _buildPassage(passage, passageIndex) {
    let passageContent = '';
    if (passage.isHtml) {
        let rawText = passage.text || '';
        const junkKeywords = [
          'FacebookWhatsAppRedditXWeChatBloggerGmailTelegramPinboardLineShare',
          'Discover more', 'Exam Preparation Resources', 'Audio Practice Tests', 'IELTS Test Preparation',
          'Listening Comprehension Course', 'IELTS Speaking Practice', 'Student Support Services',
          'Study Group Finder', 'Exam Study Guides', 'IELTS Listening practice', 'IELTS Academic Reading',
          'IELTS Writing Tasks', 'Books & Literature', 'Student Accommodation Service', 'IELTS test prep',
          'Reading Comprehension Questions', 'Makkar Cue Cards', 'IELTS Master Subscription',
          'Practice Test Kits', 'Quiz Generation Tool', 'Exam Preparation Materials', 'IELTS Speaking Prep',
          'IELTS Exam Strategy', 'IELTS speaking resources', 'Listening Comprehension Questions'
        ];
        junkKeywords.forEach(kw => {
          rawText = rawText.replace(new RegExp(kw, 'gi'), '');
        });
        rawText = rawText.replace(/<div[^>]*>\s*<\/div>/gi, '');
        passageContent = rawText;
    } else {
        passageContent = (passage.text || '').split('\\n').filter(Boolean).map(para => `<p>${para}</p>`).join('');
    }

    return `
    <div class="passage-block" style="margin-bottom:40px;">
      <div class="reading-passage" id="passage-${passage.id}">
        <h3>${this._icon('article', 'icon-sm')} Passage ${passageIndex + 1}: ${passage.title}</h3>
        ${passageContent}
      </div>
      ${(passage.questions || []).map(qset => this._buildQuestionSet(qset)).join('')}
    </div>`;
  },

  _buildQuestionSet(qset) {
    const items = qset.items || [];
    return `
    <div class="q-set-block" style="margin-bottom:28px;">
      <div class="q-section-title">${this._icon('edit_note')} ${qset.title}</div>
      <p style="font-size:0.88rem;color:var(--color-muted);margin-bottom:16px;font-style:italic;">${qset.instructions || ''}</p>
      ${items.map(q => {
        if (qset.type === 'tfng') return this._buildTFNG(q);
        if (qset.type === 'mcq')  return this._buildMCQ(q);
        return this._buildInputQuestion(q);
      }).join('')}
    </div>`;
  },

  _buildTFNG(q) {
    return `
    <div class="question-block" id="q-block-${q.num}">
      <div class="question-block__num">${q.num}</div>
      <p class="question-block__text">${q.text}</p>
      <div class="q-options" id="q-opts-${q.num}" data-qnum="${q.num}" data-answer="${q.answer}">
        ${['TRUE', 'FALSE', 'NOT GIVEN'].map(opt => `
          <div class="q-option" data-value="${opt}">
            <span class="q-option-letter" style="width:auto;padding:0 8px;font-size:0.72rem;">${opt}</span>
          </div>`).join('')}
      </div>
    </div>`;
  },

  _buildMCQ(q) {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    return `
    <div class="question-block" id="q-block-${q.num}">
      <div class="question-block__num">${q.num}</div>
      <p class="question-block__text">${q.text}</p>
      <div class="q-options" id="q-opts-${q.num}" data-qnum="${q.num}" data-answer="${q.answer}">
        ${(q.options || []).map((opt, i) => `
          <div class="q-option" data-value="${letters[i]}">
            <span class="q-option-letter" style="flex-shrink: 0; margin-top: 2px;">${letters[i]}</span>
            <span style="flex: 1; word-break: break-word; line-height: 1.5;">${opt.replace(/^\s*[A-H][\.\)\-]?\s+/i, '')}</span>
          </div>`).join('')}
      </div>
    </div>`;
  },

  _buildInputQuestion(q) {
    return `
    <div class="question-block" id="q-block-${q.num}">
      <div class="question-block__num">${q.num}</div>
      <p class="question-block__text">${q.text}</p>
      <input type="text" class="q-input" id="q-input-${q.num}"
        data-qnum="${q.num}" data-answer="${q.answer}"
        placeholder="Write your answer" autocomplete="off" />
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

  _bindEvents(test) {
    document.querySelectorAll('.q-options').forEach(grp => {
      grp.addEventListener('click', e => {
        const opt = e.target.closest('.q-option');
        if (!opt) return;
        grp.querySelectorAll('.q-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        this._updateProgress(test);
      });
    });
    document.querySelectorAll('.q-input').forEach(inp => inp.addEventListener('input', () => this._updateProgress(test)));
    document.getElementById('btn-show-answers')?.addEventListener('click', () => this._showAnswers(test));
    document.getElementById('btn-reset')?.addEventListener('click', () => this._reset(test));
  },

  _updateProgress(test) {
    const total = test.passages?.reduce((acc, p) =>
      acc + (p.questions?.reduce((a2, qs) => a2 + (qs.items?.length || 0), 0) || 0), 0) || 13;
    let answered = 0;
    document.querySelectorAll('.q-input').forEach(i => { if (i.value.trim()) answered++; });
    document.querySelectorAll('.q-options').forEach(g => { if (g.querySelector('.selected')) answered++; });
    const pct = Math.round((answered / total) * 100);
    const bar = document.getElementById('exam-progress');
    const txt = document.getElementById('progress-text');
    if (bar) bar.style.width = pct + '%';
    if (txt) txt.textContent = `${answered} of ${total} questions answered`;
  },

  _showAnswers(test) {
    document.querySelectorAll('.q-input').forEach(inp => {
      const correct = inp.dataset.answer?.trim().toUpperCase();
      const given   = inp.value.trim().toUpperCase();
      inp.classList.add(given === correct ? 'correct' : 'incorrect');
    });
    document.querySelectorAll('.q-options').forEach(grp => {
      const correct = grp.dataset.answer;
      grp.querySelectorAll('.q-option').forEach(opt => {
        if (opt.dataset.value === correct) opt.classList.add('correct');
        else if (opt.classList.contains('selected')) opt.classList.add('incorrect');
      });
    });
    const allAnswers = [];
    test.passages?.forEach(p => p.questions?.forEach(qs => qs.items?.forEach(q => allAnswers.push(q))));
    const list = document.getElementById('answers-list');
    if (list) {
      list.innerHTML = allAnswers.map(a => `
        <div class="answers-reveal__item"><strong>${a.num}.</strong> ${a.answer}</div>`).join('');
    }
    document.getElementById('answers-reveal')?.classList.add('is-visible');
    document.getElementById('answers-reveal')?.scrollIntoView({ behavior: 'smooth' });
    App.showToast('Answers revealed.', 'success');
  },

  _reset(test) {
    document.querySelectorAll('.q-input').forEach(i => { i.value = ''; i.classList.remove('correct', 'incorrect'); });
    document.querySelectorAll('.q-option').forEach(o => o.classList.remove('selected', 'correct', 'incorrect'));
    document.getElementById('answers-reveal')?.classList.remove('is-visible');
    this._seconds = (this._testData?.duration || 60) * 60;
    clearInterval(this._timer);
    this._startTimer();
    this._updateProgress(test);
  }
};
