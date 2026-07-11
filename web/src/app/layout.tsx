
import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./base.css";
import "./components.css";
import "./pages.css";

const lexend = Lexend({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IELTS & PTE Practice",
  description: "Free IELTS & PTE Practice Tests Platform",
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
        <nav className="navbar">
          <div className="navbar__inner">
            <a href="/" className="navbar__logo">
              <div className="navbar__logo-icon">
                <span className="material-symbols-outlined" style={{fontSize: 'inherit'}}>school</span>
              </div>
              PracticeHub
            </a>
            <div className="navbar__nav">
              <a href="/" className="nav-sticker active">Home</a>
              <a href="/ielts" className="nav-sticker">IELTS</a>
              <a href="/pte" className="nav-sticker">PTE</a>
            </div>
            <div className="navbar__actions">
              <a href="/admin" className="btn btn-primary btn-sm">Admin CMS</a>
            </div>
          </div>
        </nav>
        
        {/* Main Content */}
        <main id="app-container">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="footer">
          <div className="footer__inner">
            <div className="footer__grid">
              <div className="footer__brand-col">
                <h2 className="footer__brand-title">PracticeHub</h2>
                <p className="footer__brand-desc">Master your IELTS and PTE exams with hundreds of free practice tests. Listen to authentic audio, read passages, and instantly verify your answers.</p>
              </div>
              <div className="footer__links-wrapper">
                <div>
                  <h4 className="footer__col-title">Practice</h4>
                  <div className="footer__links">
                    <a href="/ielts">IELTS Academic</a>
                    <a href="/ielts">IELTS General</a>
                    <a href="/pte">PTE Academic</a>
                  </div>
                </div>
                <div>
                  <h4 className="footer__col-title">Admin</h4>
                  <div className="footer__links">
                    <a href="/admin">Dashboard</a>
                  </div>
                </div>
              </div>
            </div>
            <p style={{ textAlign: 'center', opacity: 0.5, fontSize: '0.85rem' }}>&copy; 2026 PracticeHub. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
