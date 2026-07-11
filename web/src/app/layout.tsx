
import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./base.css";
import "./components.css";
import "./pages.css";
import ClientLayoutWrapper from "./ClientLayoutWrapper";

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
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
