import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'CAPACITY CONNECT — Intelligent Organizational Capacity Building Platform',
  description: 'AI-driven organizational capacity building connecting Competency Gaps, Course Recommendations, Explainable Trainer Matching, Assessments, and Enterprise Analytics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full bg-[#0b0f19] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
