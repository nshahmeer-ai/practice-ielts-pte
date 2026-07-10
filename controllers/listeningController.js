/**
 * CONTROLLER: listeningController.js
 * Renders the IELTS and PTE Listening test exam interface.
 */

const ListeningController = {
  _timer: null,
  _seconds: 0,
  _testData: null,

  _icon(name, cls = '') {
    return `<span class="material-symbols-outlined${cls ? ' ' + cls : ''}">${name}</span>`;
  },

  render({ exam, testId }) {
    const id = parseInt(testId, 10);
    const testData = exam === 'pte'
      ? ListeningModel.getPTETest(id)
      : ListeningModel.getIELTSTest(id);

    this._testData = testData;
    this._seconds  = (testData.duration || 30) * 60;

    App.setTitle(`${testData.title} — Free Practice`);
    App.renderPage(this._buildHTML(testData, exam));
    this._bindEvents(testData, exam);
    this._startTimer();
  },

  _buildHTML(test, exam) {
    const totalQ = test.sections?.reduce((acc, s) => acc + (s.questions?.length || 0), 0) || 40;
    return `
    <div class="exam-page page-fade-in">
      <div class="exam-page__inner">

        <!-- Exam Header -->
        <div class="exam-header">
          <div class="exam-header__left">
            <button class="exam-header__back" onclick="history.back()">
              ${this._icon('arrow_back')} Back
            </button>
            <div>
              <div class="exam-header__title">
                ${this._icon('headphones', 'icon-sm')} ${test.title}
              </div>
              <div class="exam-header__subtitle">${test.sections?.length || 4} Sections · ${totalQ} Questions</div>
            </div>
          </div>
          <div class="exam-timer" id="exam-timer">
            <span class="exam-timer__icon">${this._icon('timer')}</span>
            <span id="timer-display">${this._formatTime(this._seconds)}</span>
          </div>
        </div>

        <!-- Instructions -->
        <div class="exam-instructions">
          <h3>${this._icon('info')} Instructions</h3>
          <ul>
            <li>Press <strong>Play</strong> on the audio player below to begin — the audio plays once only in the real exam.</li>
            <li>Read each question before the relevant section of audio begins.</li>
            <li>Write your answers as you listen (you may type them below).</li>
            <li>Transfer your answers carefully. Spelling matters.</li>
            <li>When finished, click <strong>"Show Answers"</strong> to see the answer key.</li>
          </ul>
        </div>

        <!-- Audio Player -->
        <div class="audio-player" id="audio-player-block">
          <div class="audio-player__header">
            <div class="audio-player__icon">${this._icon('headphones', 'icon-lg')}</div>
            <div class="audio-player__info">
              <h4>${test.audioLabel || test.title + ' — Audio'}</h4>
              <p>Listen to the audio and answer the questions below.</p>
            </div>
          </div>
          ${this._buildAudioPlayer(test)}
        </div>

        <!-- Progress Bar -->
        <div class="progress-bar" style="margin-bottom:8px;">
          <div class="progress-bar__fill" id="exam-progress" style="width:0%;"></div>
        </div>
        <div style="font-size:0.8rem;color:var(--color-muted);margin-bottom:24px;" id="progress-text">
          0 of ${totalQ} questions answered
        </div>

        <!-- Test Paper -->
        ${(() => {
            let rawText = test.sections?.[0]?.questions?.[0]?.raw_test_text;
            const isHtml = test.sections?.[0]?.questions?.[0]?.isHtml;
            if (!rawText) return '';
            
            // Clean up common injected ad text and share buttons that slipped into the HTML
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
            
            // Also clean up stray empty divs left behind by the ad removal
            rawText = rawText.replace(/<div[^>]*>\s*<\/div>/gi, '');
            
            let content = isHtml ? rawText : rawText.split('\n').filter(Boolean).map(para => `<p style="margin-bottom:12px; line-height:1.6; color:#444;">${para}</p>`).join('');
            
            return `
            <div class="reading-passage" style="margin-bottom: 40px; padding: 24px; background: #fafafa; border-radius: 8px; border: 1px solid #e0e0e0; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);">
              <h3 style="margin-bottom: 16px; display: flex; align-items: center; gap: 8px; color: #333;">
                <span class="material-symbols-outlined">article</span> Listening Test Paper
              </h3>
              <div class="test-paper-content" style="color:#444;">
                ${content}
              </div>
            </div>`;
        })()}

        <!-- Sections -->
        ${(test.sections || []).map(s => this._buildSection(s)).join('')}

        <!-- Show Answers Bar -->
        <div class="show-answers-bar">
          <p>Finished? Check your answers below.</p>
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
            ${parseInt(this._testData?.id || 1) > 1 ? `<a href="#/${this._testData?.exam}/listening/${(this._testData?.id || 1) - 1}" class="btn btn-secondary">${this._icon('arrow_back')} Previous</a>` : ''}
            <a href="#/${this._testData?.exam}/listening/${(this._testData?.id || 1) + 1}" class="btn btn-primary">
              Next Test ${this._icon('arrow_forward')}
            </a>
          </div>
        </div>

      </div>
    </div>`;
  },

  _buildAudioPlayer(test) {
    if (test.audioDriveEmbed) {
      return `
        <iframe src="${test.audioDriveEmbed}" class="audio-embed-frame"
          allow="autoplay" allowfullscreen style="height:80px;"></iframe>
        <p style="font-size:0.75rem;color:var(--color-muted);margin-top:8px;display:flex;align-items:center;gap:4px;">
          ${this._icon('folder_open', 'icon-xs')} Audio via Google Drive. If it doesn't play,
          <a href="${test.audioDriveEmbed}" target="_blank" style="color:var(--color-teal);">open in a new tab</a>.
        </p>`;
    }

    if (test.audioSrc) {
      return `
        <audio controls preload="none">
          <source src="${test.audioSrc}" type="audio/mpeg">
          Your browser does not support the audio element.
        </audio>`;
    }

    return `
      <div style="background:var(--color-bg);border:var(--border);border-radius:var(--border-radius-sm);padding:16px;text-align:center;margin-bottom:12px;">
        <span class="material-symbols-outlined icon-xl" style="color:var(--color-muted);display:block;margin-bottom:8px;">audio_file</span>
        <p style="font-size:0.9rem;color:var(--color-muted);margin-bottom:4px;">No audio loaded for this test yet.</p>
        <p style="font-size:0.8rem;color:var(--color-muted);">
          Open <code>models/listening.js</code> and add your Google Drive preview URL to <code>audioDriveEmbed</code>.
        </p>
      </div>
      <div class="audio-embed-url-input">
        <input type="text" id="drive-url-input"
          placeholder="Paste Google Drive embed URL: https://drive.google.com/file/d/ID/preview" />
        <button class="btn btn-teal btn-sm" id="btn-load-audio">
          ${this._icon('play_circle')} Load Audio
        </button>
      </div>
      <div id="audio-iframe-container"></div>`;
  },

  _buildSection(section) {
    return `
    <div class="exam-section" id="section-${section.id}">
      <div class="q-section-title">
        ${this._icon('folder_open')} ${section.title}
      </div>
      <p style="font-size:0.85rem;color:var(--color-muted);margin-bottom:8px;font-style:italic;">${section.context || ''}</p>
      <p style="font-size:0.88rem;font-weight:600;color:var(--color-text);margin-bottom:16px;">${section.instructions || ''}</p>
      ${(section.questions || []).map(q => q.type === 'mcq' ? this._buildMCQ(q) : this._buildInputQuestion(q)).join('')}
    </div>`;
  },

  _buildInputQuestion(q) {
    return `
    <div class="question-block" id="q-block-${q.num}">
      <div class="question-block__num">${q.num}</div>
      <p class="question-block__text">${this._highlightBlank(q.text)}</p>
      <input type="text" class="q-input" id="q-input-${q.num}"
        data-qnum="${q.num}" data-answer="${q.answer}"
        placeholder="Write your answer here" autocomplete="off" />
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
            <span class="q-option-letter">${letters[i]}</span>
            ${opt.replace(/^\s*[A-H][\.\)\-]?\s+/i, '')}
          </div>`).join('')}
      </div>
    </div>`;
  },

  _highlightBlank(text) {
    return text.replace(/_+/g, '<span style="display:inline-block;min-width:60px;border-bottom:2px solid var(--color-border);margin:0 4px;"></span>');
  },

  _startTimer() {
    clearInterval(this._timer);
    const display = document.getElementById('timer-display');
    const timerEl = document.getElementById('exam-timer');
    if (!display) return;

    this._timer = setInterval(() => {
      this._seconds--;
      if (display) display.textContent = this._formatTime(this._seconds);
      if (this._seconds <= 300 && this._seconds > 60) timerEl?.classList.add('warning');
      else if (this._seconds <= 60) { timerEl?.classList.remove('warning'); timerEl?.classList.add('danger'); }
      if (this._seconds <= 0) { clearInterval(this._timer); App.showToast('Time is up! Please review your answers.', 'info'); }
    }, 1000);
  },

  _formatTime(secs) {
    const m = Math.floor(Math.max(0, secs) / 60).toString().padStart(2, '0');
    const s = (Math.max(0, secs) % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  },

  _bindEvents(test) {
    document.querySelectorAll('.q-options').forEach(optGroup => {
      optGroup.addEventListener('click', (e) => {
        const option = e.target.closest('.q-option');
        if (!option) return;
        optGroup.querySelectorAll('.q-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        this._updateProgress(test);
      });
    });

    document.querySelectorAll('.q-input').forEach(input => {
      input.addEventListener('input', () => this._updateProgress(test));
    });

    document.getElementById('btn-show-answers')?.addEventListener('click', () => this._showAnswers(test));
    document.getElementById('btn-reset')?.addEventListener('click', () => this._reset());

    document.getElementById('btn-load-audio')?.addEventListener('click', () => {
      const urlInput = document.getElementById('drive-url-input');
      const url = urlInput?.value?.trim();
      if (!url) return App.showToast('Please paste a Google Drive URL first.', 'error');
      let embedUrl = url.includes('/view') ? url.replace('/view', '/preview') : url;
      const container = document.getElementById('audio-iframe-container');
      if (container) {
        container.innerHTML = `
          <iframe src="${embedUrl}" class="audio-embed-frame" allow="autoplay" style="height:80px;"></iframe>
          <p style="font-size:0.75rem;color:var(--color-muted);margin-top:8px;">Audio loaded from Google Drive.</p>`;
        App.showToast('Audio loaded successfully.', 'success');
      }
    });
  },

  _updateProgress(test) {
    const total = test.sections?.reduce((acc, s) => acc + (s.questions?.length || 0), 0) || 40;
    let answered = 0;
    document.querySelectorAll('.q-input').forEach(inp => { if (inp.value.trim().length > 0) answered++; });
    document.querySelectorAll('.q-options').forEach(grp => { if (grp.querySelector('.q-option.selected')) answered++; });
    const pct = Math.round((answered / total) * 100);
    const bar = document.getElementById('exam-progress');
    const txt = document.getElementById('progress-text');
    if (bar) bar.style.width = pct + '%';
    if (txt) txt.textContent = `${answered} of ${total} questions answered`;
  },

  _showAnswers(test) {
    document.querySelectorAll('.q-input').forEach(inp => {
      const correct = inp.dataset.answer?.toLowerCase().trim();
      const given   = inp.value.toLowerCase().trim();
      if (!given) { inp.classList.add('incorrect'); return; }
      inp.classList.add((given === correct || correct.includes(given) || given.includes(correct)) ? 'correct' : 'incorrect');
    });

    document.querySelectorAll('.q-options').forEach(grp => {
      const correct = grp.dataset.answer;
      grp.querySelectorAll('.q-option').forEach(opt => {
        if (opt.dataset.value === correct) opt.classList.add('correct');
        else if (opt.classList.contains('selected') && opt.dataset.value !== correct) opt.classList.add('incorrect');
      });
    });

    const allAnswers = [];
    test.sections?.forEach(sec => sec.questions?.forEach(q => allAnswers.push({ num: q.num, answer: q.answer })));
    const list = document.getElementById('answers-list');
    if (list) {
      list.innerHTML = allAnswers.map(a => `
        <div class="answers-reveal__item"><strong>${a.num}.</strong> ${a.answer}</div>`).join('');
    }
    document.getElementById('answers-reveal')?.classList.add('is-visible');
    document.getElementById('answers-reveal')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    App.showToast('Answer key revealed.', 'success');
  },

  _reset() {
    document.querySelectorAll('.q-input').forEach(inp => { inp.value = ''; inp.classList.remove('correct', 'incorrect'); });
    document.querySelectorAll('.q-option').forEach(opt => opt.classList.remove('selected', 'correct', 'incorrect'));
    document.getElementById('answers-reveal')?.classList.remove('is-visible');
    this._seconds = (this._testData?.duration || 30) * 60;
    const display = document.getElementById('timer-display');
    if (display) display.textContent = this._formatTime(this._seconds);
    document.getElementById('exam-timer')?.classList.remove('warning', 'danger');
    clearInterval(this._timer);
    this._startTimer();
    this._updateProgress(this._testData || { sections: [] });
  }
};
