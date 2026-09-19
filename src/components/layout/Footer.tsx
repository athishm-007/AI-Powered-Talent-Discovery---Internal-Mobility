import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-slate-950 text-xs">
                TL
              </div>
              <span className="font-bold text-lg text-white">TalentLens</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              AI-Powered Talent Discovery & Internal Mobility Web Platform. Empowering workforce agility with explainable matching and continuous skill profiling.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white text-sm mb-3">Platform Modules</h3>
            <ul className="space-y-2 text-xs">
              <li><a href="#profiling" className="hover:text-cyan-400 transition-colors">Skill Profiling & Evolution</a></li>
              <li><a href="#matching" className="hover:text-cyan-400 transition-colors">Explainable Role Matching</a></li>
              <li><a href="#roadmap" className="hover:text-cyan-400 transition-colors">Skill Gaps & Mobility Roadmap</a></li>
              <li><a href="#assistant" className="hover:text-cyan-400 transition-colors">AI Career Assistant</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white text-sm mb-3">Quick Navigation</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-cyan-400 transition-colors">Home Page</Link></li>
              <li><Link href="/login" className="hover:text-cyan-400 transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-cyan-400 transition-colors">Get Started (Register)</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white text-sm mb-3">Compliance & Standards</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Strict WCAG AA Accessibility, zero PII logging audit controls, and deterministic Fallback Provider execution.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>© {new Date().getFullYear()} TalentLens Enterprise Web Platform. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Accessibility Declaration</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
