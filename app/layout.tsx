import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Rhythm & Soul Dance Academy — AI Assistant',
  description:
    "Chat with Aria, the AI assistant for Rhythm & Soul Dance Academy. Find classes, get pricing, and book your free trial.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={inter.variable}>
      <body className="h-full">{children}</body>
    </html>
  );
}
