// src/app/layout.tsx
import React from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Importing custom fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Setting metadata for the application
export const metadata: Metadata = {
  title: "File Sharing App",
  description: "Upload, view, and delete files easily!",
};

// Root layout for all pages
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header style={{ padding: '20px', textAlign: 'center', background: '#f5f5f5' }}>
          <h1>File Sharing App</h1>
        </header>

        <main style={{ minHeight: '80vh', padding: '20px' }}>
          {children} {/* This renders the page content */}
        </main>

        <footer style={{ textAlign: 'center', padding: '20px', background: '#f5f5f5' }}>
          <p>© 2024 File Sharing App. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
