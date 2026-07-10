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
      <body>
        {/* Navigation Bar Header */}
        <nav className="navbar">
          <div className="container nav-content">
            <a href="/" className="logo">Practice<span>Hub</span></a>
            <div className="nav-links">
              <a href="/">Home</a>
              <a href="/ielts">IELTS</a>
              <a href="/pte">PTE</a>
            </div>
          </div>
        </nav>
        
        {/* Main Content */}
        <main id="app-container">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <p>&copy; 2026 PracticeHub. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
