import React from 'react';
import Link from 'next/link';
import { constructMetadata } from '@/lib/seo';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Sparkles, ArrowRight, ShieldCheck, User, Briefcase, GitCompare, Map, Bot, CheckCircle2 } from 'lucide-react';

export const metadata = constructMetadata({
  title: 'TalentLens | AI-Powered Talent Discovery & Internal Mobility Web Platform',
  description: 'Discover explicit and hidden skills, match employees with internal opportunities using explainable AI, and eliminate skill gaps.',
});

export default function LandingPage() {
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-16 pb-12 sm:pt-24 sm:pb-16 text-center max-w-5xl mx-auto px-4">
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-[600px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full" />
        </div>

        <Badge variant="cyan" className="mb-6 px-3 py-1 text-xs">
          <Sparkles className="w-3.5 h-3.5" /> Next-Generation Workforce Mobility
        </Badge>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
          Unlock Enterprise Talent Discovery with{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
            Explainable AI
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
          TalentLens continuously analyzes employee experience to uncover explicit and hidden transferable skills, matching internal candidates to emerging roles with zero hallucination.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/register">
            <Button variant="primary" size="lg" className="gap-2">
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </Link>
          {isDemo && (
            <Link href="/login">
              <Button variant="secondary" size="lg" className="gap-2 border-cyan-500/30 text-cyan-300">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Try Demo Platform</span>
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Module Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Four Core Enterprise Modules</h2>
          <p className="text-slate-400 text-sm">
            Everything your organization needs for AI-driven skill profiling, role matching, gap roadmapping, and workforce analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Module 1 */}
          <Card id="profiling" className="space-y-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <User className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">Module 1: AI Talent Profiling & Skill Discovery</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Extract explicit stated skills and inferred transferable capabilities from resumes, project histories, and learning activities into dynamic evolving profiles.
            </p>
            <ul className="space-y-2 text-xs text-slate-400 pt-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> Explicit vs Inferred skill classification</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> Versioned profile snapshot history</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> Future Potential capability forecasting</li>
            </ul>
          </Card>

          {/* Module 2 */}
          <Card id="matching" className="space-y-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">Module 2: Explainable Internal Role Matching</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Hybrid matching algorithm combining proficiency skill coverage, 1536-dim vector similarity, transferable graph credit, and experience relevance.
            </p>
            <ul className="space-y-2 text-xs text-slate-400 pt-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" /> Evidence-cited match reasoning (no hallucination)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" /> Reverse candidate search for HR admins</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" /> "Express Interest" candidate action</li>
            </ul>
          </Card>

          {/* Module 3 */}
          <Card id="roadmap" className="space-y-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Map className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">Module 3: Skill Gap Matrix & Mobility Roadmap</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Target role gap analysis with severity categorization (Critical, Moderate, Minor), time-to-close metrics, and 0-3, 3-6, 6-12 month phased roadmaps.
            </p>
            <ul className="space-y-2 text-xs text-slate-400 pt-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Curated learning catalog across 4 resource types</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Strategic initiative skill demand forecasting</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Interactive milestone completion tracking</li>
            </ul>
          </Card>

          {/* Module 4 */}
          <Card id="assistant" className="space-y-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">Module 4: AI Career Assistant & HR Insights</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Grounded streaming AI career chat assistant with cited source chips, feedback re-weighting loop, and executive workforce analytics.
            </p>
            <ul className="space-y-2 text-xs text-slate-400 pt-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> Grounded streaming RAG assistant with source chips</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> Recommendation Quality & feedback loop re-weighting</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> Dynamic talent readiness pipeline (Ready Now / 6 Mos)</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Match Explanation Preview */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <Card className="p-8 border border-cyan-500/30 bg-slate-900/90 space-y-6">
          <div className="flex items-center justify-between">
            <Badge variant="cyan">Sample Match Explanation Preview</Badge>
            <span className="text-xs text-slate-400">Match Compatibility: <strong className="text-cyan-400">88%</strong></span>
          </div>

          <h3 className="text-2xl font-bold text-white">Staff AI Systems Architect</h3>

          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
            "Candidate demonstrates strong technical alignment across core requirements, backed by verified experience in frontend architecture, component systems, and backend data infrastructure. Retrieved Evidence: <strong className="text-cyan-300">[EXPERIENCE #exp-1]</strong> Enterprise Platform Modernization."
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div className="text-slate-400 mb-1">Coverage</div>
              <div className="font-bold text-cyan-400">92%</div>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div className="text-slate-400 mb-1">Vector Sim</div>
              <div className="font-bold text-indigo-400">88%</div>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div className="text-slate-400 mb-1">Transfer Credit</div>
              <div className="font-bold text-emerald-400">75%</div>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div className="text-slate-400 mb-1">Relevance</div>
              <div className="font-bold text-amber-400">85%</div>
            </div>
          </div>
        </Card>
      </section>

      {/* 4-Step How It Works Flow */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-12">
        <h2 className="text-3xl font-bold text-white">How TalentLens Works in 4 Steps</h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-left">
          <div className="glass-panel p-6 rounded-xl border border-slate-800 relative">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center mb-4 text-sm">1</div>
            <h4 className="font-semibold text-white text-base mb-2">Build Profile</h4>
            <p className="text-xs text-slate-400">Upload resume or add experiences to evolve your skill snapshot.</p>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-slate-800 relative">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center mb-4 text-sm">2</div>
            <h4 className="font-semibold text-white text-base mb-2">Match Opportunities</h4>
            <p className="text-xs text-slate-400">Discover jobs, projects, and team roles with explainable scores.</p>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-slate-800 relative">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center mb-4 text-sm">3</div>
            <h4 className="font-semibold text-white text-base mb-2">Close Skill Gaps</h4>
            <p className="text-xs text-slate-400">Follow phased mobility roadmaps with linked learning resources.</p>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-slate-800 relative">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center mb-4 text-sm">4</div>
            <h4 className="font-semibold text-white text-base mb-2">Express Interest</h4>
            <p className="text-xs text-slate-400">Log mobility outcomes and signal readiness directly to HR admins.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
