import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-48 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-400 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-indigo-500/20">
              CC
            </div>
            <div>
              <span className="text-sm font-black tracking-wider text-white">CAPACITY CONNECT</span>
              <span className="hidden sm:inline-block text-[10px] text-indigo-400 font-semibold uppercase ml-2 px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/60">
                Enterprise AI Engine
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">
                Get Started Free →
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-6 max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-indigo-300 mb-6 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Production-Ready Hackathon MVP</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Not a Generic LMS</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight mb-6">
          Intelligent Organizational{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
            Capacity Building
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
          Bridge the talent divide with continuous, explainable AI intelligence connecting:
          <br className="hidden sm:inline" />
          <strong className="text-white font-semibold">
            Competency Gap → Course Recommendation → Trainer Matching → Learning → Assessment → Competency Improvement → Org Analytics
          </strong>
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link href="/trainee">
            <Button variant="primary" size="lg" className="px-8 shadow-xl shadow-blue-500/25">
              Launch Trainee Portal 🧑‍🎓
            </Button>
          </Link>
          <Link href="/trainer">
            <Button variant="secondary" size="lg" className="px-8">
              Launch Trainer Studio 🎓
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="outline" size="lg" className="px-8 border-rose-500/40 text-rose-300 hover:bg-rose-950/20">
              Admin & Analytics ⚡
            </Button>
          </Link>
        </div>

        {/* The 6-Step Workflow Visualizer */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl text-left">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Core End-to-End Intelligence Pipeline
            </h3>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Fully Automated
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { step: '01', title: 'Identify Gaps', desc: 'Weighted scoring across 5 tiers (Beginner to Expert)', icon: '🎯', color: 'border-rose-500/30' },
              { step: '02', title: 'Recommend Courses', desc: 'Relevance fit based on skill deficiency & pace', icon: '📚', color: 'border-blue-500/30' },
              { step: '03', title: 'Match Trainer', desc: 'Explainable AI scoring across 6 transparent factors', icon: '✨', color: 'border-indigo-500/30' },
              { step: '04', title: 'Interactive Learn', desc: 'Videos, PDF guides, presentations, study materials', icon: '💻', color: 'border-amber-500/30' },
              { step: '05', title: 'MCQ Assessment', desc: 'Timed quizzes with instant algorithmic evaluation', icon: '📝', color: 'border-purple-500/30' },
              { step: '06', title: 'Grow & Certify', desc: 'Auto-updated competency levels & verified certificates', icon: '🏆', color: 'border-emerald-500/30' },
            ].map((card, i) => (
              <div key={i} className={`p-4 rounded-xl bg-slate-950/80 border ${card.color} flex flex-col justify-between`}>
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-2">
                    <span>{card.step}</span>
                    <span className="text-lg">{card.icon}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">{card.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-snug">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Credentials Box */}
      <section className="py-8 px-6 max-w-4xl mx-auto w-full">
        <div className="p-5 rounded-xl bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-900 border border-indigo-800/40">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-indigo-300 mb-1">
                🎯 Ready for Hackathon Evaluation
              </h4>
              <p className="text-xs text-slate-400">
                10 Trainees, 5 Trainers, 10 Courses, 10 Competencies, MCQs, and Analytics pre-seeded.
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="primary" size="sm">
                  Sign In with Demo Credentials →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>CAPACITY CONNECT — Intelligent Organizational Capacity Building Platform &copy; 2024</p>
      </footer>
    </div>
  );
}
