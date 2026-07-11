
import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./base.css";
import "./components.css";
import "./pages.css";

const lexend = Lexend({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Insight English Institute | IELTS & PTE Prep",
  description: "Insight English Institute - Free IELTS & PTE Practice Tests Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={lexend.className}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
      </head>
      <body>
        {/* Navigation Bar Header */}
        <div className="navbar-wrapper">
          <nav className="navbar" role="navigation" aria-label="Main navigation">
            <div className="navbar__inner">
              {/* Logo */}
              <a href="/" className="navbar__logo" aria-label="Home" style={{ gap: '8px' }}>
                <div className="navbar__logo-icon" aria-hidden="true" style={{ width: '32px', height: '32px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>school</span>
                </div>
                <div className="navbar__logo-text" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '1.05rem' }}>
                  <span>Insight</span>
                  <span className="text-purple">English</span>
                  <span className="text-teal">Institute</span>
                </div>
              </a>

              {/* Desktop Navigation Stickers */}
              <nav className="navbar__nav" role="list" style={{ flex: 1, justifyContent: 'flex-end', gap: '8px' }}>
                <a href="/" className="nav-sticker">
                  <span className="material-symbols-outlined">home</span> Home
                </a>
                <a href="/ielts" className="nav-sticker">
                  <span className="material-symbols-outlined">school</span> IELTS
                </a>
                <a href="/pte" className="nav-sticker">
                  <span className="material-symbols-outlined">work</span> PTE
                </a>
                <a href="/toefl" className="nav-sticker">
                  <span className="material-symbols-outlined">language</span> TOEFL
                </a>
                <a href="/oet" className="nav-sticker">
                  <span className="material-symbols-outlined">public</span> OET
                </a>
                <a href="/duolingo" className="nav-sticker">
                  <span className="material-symbols-outlined">spellcheck</span> Duolingo
                </a>
              </nav>
            </div>
          </nav>
        </div>
        
        {/* Main Content */}
        <main id="app-container">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="footer" role="contentinfo">
          <div className="footer__inner">
            <div className="footer__grid">

              {/* Brand */}
              <div className="footer__brand-col">
                <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
                  <div className="footer__logo-icon">
                    <span className="material-symbols-outlined">school</span>
                  </div>
                  <span className="badge badge-purple" style={{fontSize: '0.75rem'}}>INSIGHT ENGLISH INSTITUTE</span>
                </div>
                <h2 className="footer__brand-title">Free, high-quality<br/>practice tests.</h2>
                <p className="footer__brand-desc">
                  Insight English Institute provides high-quality IELTS and PTE practice tests. 200+ tests across all modules. No registration. No subscription. Always free.
                </p>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px', flexWrap: 'wrap'}}>
                  <a href="/ielts/listening/1" className="btn btn-primary" style={{borderRadius: '30px', padding: '12px 24px'}}>Start Practising <span className="material-symbols-outlined icon-sm">arrow_right_alt</span></a>
                </div>
              </div>

              {/* Links Columns */}
              <div className="footer__links-wrapper">
                {/* IELTS Links */}
                <div>
                  <div className="footer__col-title">IELTS Practice</div>
                  <ul className="footer__links" style={{listStyle: 'none', padding: 0}}>
                    <li><a href="/ielts">IELTS Overview</a></li>
                    <li><a href="/ielts/listening">Listening Tests</a></li>
                    <li><a href="/ielts/reading">Reading Tests</a></li>
                    <li><a href="/ielts/writing">Writing Tests</a></li>
                    <li><a href="/ielts/speaking">Speaking Tests</a></li>
                  </ul>
                </div>

                {/* PTE Links */}
                <div>
                  <div className="footer__col-title">PTE Practice</div>
                  <ul className="footer__links" style={{listStyle: 'none', padding: 0}}>
                    <li><a href="/pte">PTE Overview</a></li>
                    <li><a href="/pte/listening">PTE Listening</a></li>
                    <li><a href="/pte/reading">PTE Reading</a></li>
                    <li><a href="/pte/speaking">PTE Speaking</a></li>
                  </ul>
                </div>

                {/* Resources */}
                <div>
                  <div className="footer__col-title">Resources</div>
                  <ul className="footer__links" style={{listStyle: 'none', padding: 0}}>
                    <li><a href="https://www.ielts.org" target="_blank" rel="noopener noreferrer">Official IELTS Website <span className="material-symbols-outlined" style={{fontSize: '0.9rem', verticalAlign: 'middle'}}>open_in_new</span></a></li>
                    <li><a href="https://pearsonpte.com" target="_blank" rel="noopener noreferrer">Official PTE Website <span className="material-symbols-outlined" style={{fontSize: '0.9rem', verticalAlign: 'middle'}}>open_in_new</span></a></li>
                    <li><a href="/ielts/listening/1">Band Score Guide</a></li>
                    <li><a href="/ielts/writing/1">Writing Strategies</a></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Socials Row */}
            <div className="footer__socials-row">
              <div className="footer__col-title" style={{marginBottom: 0}}>CONNECT WITH US</div>
              <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
                <a href="#" className="social-pill" style={{display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--color-text)', textDecoration: 'none'}}>
                  <span className="material-symbols-outlined">photo_camera</span> Instagram
                </a>
                <a href="#" className="social-pill" style={{display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--color-text)', textDecoration: 'none'}}>
                  <span className="material-symbols-outlined">forum</span> Discord
                </a>
                <a href="#" className="social-pill" style={{display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--color-text)', textDecoration: 'none'}}>
                  <span className="material-symbols-outlined">mail</span> Email
                </a>
              </div>
            </div>

            <div className="footer__bottom" style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px', marginTop: '30px', paddingTop: '30px', borderTop: '1px solid rgba(26,26,46,0.1)'}}>
              <div>
                <span style={{fontWeight: 600, color: 'var(--color-text)'}}>Made with <span className="material-symbols-outlined" style={{color: 'var(--color-purple)', fontSize: '0.9rem', verticalAlign: 'middle', fontVariationSettings: "'FILL' 1"}}>favorite</span> in London</span>
                <span style={{color: 'var(--color-muted)', marginLeft: '4px'}}>— by English learners for English learners.</span>
                <div style={{color: 'var(--color-muted)', fontSize: '0.75rem', marginTop: '6px'}}>&copy; 2026 Insight English Institute. All rights reserved.</div>
              </div>
              <div className="footer__legal" style={{display: 'flex', gap: '16px'}}>
                <a href="#" style={{color: 'var(--color-muted)', fontSize: '0.85rem'}}>Privacy</a>
                <a href="#" style={{color: 'var(--color-muted)', fontSize: '0.85rem'}}>Terms</a>
                <a href="#" style={{color: 'var(--color-muted)', fontSize: '0.85rem'}}>Cookie Settings</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
