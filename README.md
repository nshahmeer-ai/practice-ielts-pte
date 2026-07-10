# 🎓 Practice IELTS & PTE — Free Tests Platform

A premium, fully-structured IELTS and PTE Academic practice test website built with **pure MVC architecture** using Vanilla HTML, CSS, and JavaScript.

## 🚀 Quick Start

1. Open `index.html` in any modern browser — no server required!
2. For best results, use a local server:
   ```bash
   # Python
   python -m http.server 3000
   # Then open: http://localhost:3000
   ```

## 📁 Project Structure (MVC Architecture)

```
practice-ielts-pte/
│
├── index.html                  # App shell — navbar, footer, SPA container
├── app.js                      # Main bootstrap, route registration, global utilities
│
├── models/                     # DATA LAYER — Pure data, no rendering
│   ├── tests.js                # Exam metadata registry (IELTS + PTE)
│   ├── listening.js            # Listening test questions & audio config
│   ├── reading.js              # Reading passages & question sets
│   ├── writing.js              # Writing task prompts & sample answers
│   └── speaking.js             # Speaking part prompts & cue cards
│
├── controllers/                # BUSINESS LOGIC — Render views, handle events
│   ├── router.js               # Hash-based SPA router
│   ├── homeController.js       # Home page (hero, features, categories)
│   ├── testController.js       # Test listing pages (with difficulty filters)
│   ├── listeningController.js  # Listening exam (audio, questions, timer)
│   ├── readingController.js    # Reading exam (passage, TFNG, MCQ)
│   ├── writingController.js    # Writing exam (prompt, word counter, timer)
│   └── speakingController.js   # Speaking exam (cue cards, prep timers)
│
└── assets/
    └── css/
        ├── base.css            # Design tokens, reset, typography, utilities
        ├── components.css      # Navbar, buttons, cards, audio player, questions
        └── pages.css           # Page-specific layouts (hero, exam views, etc.)
```

## 🎧 Adding Audio Files (Google Drive)

**Step 1:** Upload your `.mp3` file to Google Drive  
**Step 2:** Right-click the file → Share → "Anyone with the link" → Copy link  
**Step 3:** Convert the link:
- Sharing URL: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
- Embed URL:   `https://drive.google.com/file/d/FILE_ID/preview`

**Step 4:** Open `models/listening.js` and set:
```js
audioDriveEmbed: 'https://drive.google.com/file/d/YOUR_FILE_ID/preview'
```

Alternatively, users can paste a Google Drive URL directly into the audio box on any listening test page.

## 🔗 URL Routes

| URL | Page |
|-----|------|
| `#/` | Home |
| `#/ielts` | IELTS Overview |
| `#/pte` | PTE Overview |
| `#/ielts/listening` | IELTS Listening test list |
| `#/ielts/reading` | IELTS Reading test list |
| `#/ielts/writing` | IELTS Writing test list |
| `#/ielts/speaking` | IELTS Speaking test list |
| `#/ielts/listening/1` | IELTS Listening Test 1 |
| `#/pte/reading/3` | PTE Reading Test 3 |

## ➕ Adding More Test Content

### Add a new Listening Test
In `models/listening.js`, extend the `tests` object:
```js
const tests = {
  1: { /* existing */ },
  2: {
    id: 2,
    title: 'IELTS Listening Test 2',
    audioDriveEmbed: 'https://drive.google.com/file/d/YOUR_ID/preview',
    sections: [ /* ... */ ]
  }
}
```

### Add a new Reading Passage
In `models/reading.js`, add to the `tests` object similarly.

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#6C5CE7` (purple) |
| Secondary | `#54A0FF` (teal) |
| Background | `#F0E6FF` (lavender) |
| Text | `#0F172A` |
| Font | Lexend (Google Fonts) |
| Borders | Neo-brutalist hard box shadows |

## 📊 Features

- ✅ **200+ practice tests** across 4 IELTS modules + PTE
- 🎧 **Google Drive audio embed** + direct .mp3 support
- ⏱️ **Timed exams** (30 min Listening / 60 min Reading & Writing)
- 📝 **Live word counter** for writing tasks
- ✅ **Instant answer reveal** with full answer key
- 📱 **Fully responsive** mobile-friendly design
- 🔄 **Reset function** to retake tests
- 🎤 **Speaking timers** (1-min prep + 2-min speaking)
- 🚫 **No login required** — open and use instantly

## 🛠️ Tech Stack

- **HTML5** — semantic, accessible markup
- **Vanilla CSS** — custom design system (no Tailwind/Bootstrap)
- **Vanilla JavaScript** — MVC architecture, no frameworks
- **Google Fonts** — Lexend typeface
- **Google Drive** — audio file hosting

## 📝 License

Free to use for educational purposes.
