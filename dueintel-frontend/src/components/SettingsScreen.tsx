import React from "react";
import { User, Shield, Key, Eye, HelpCircle, CheckCircle, Database } from "lucide-react";

export default function SettingsScreen() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 text-on-surface animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-white tracking-tight">System Settings</h1>
        <p className="font-sans text-sm text-on-surface-variant mt-1">
          Configure investment criteria, credentials, and institutional privacy permissions.
        </p>
      </div>

      {/* Profile & Enterprise Security */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Card */}
        <div className="glass-card p-6 md:p-8 rounded-2xl space-y-6">
          <h2 className="font-display text-base font-bold text-white flex items-center gap-2.5">
            <User className="w-5 h-5 text-primary" /> Investor Profile
          </h2>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-700 border border-white/10">
              <img
                className="w-full h-full object-cover"
                alt="Marcus Thorne profile card"
                referrerPolicy="no-referrer"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAINtVvHnuAaSrhIT-x5X2WKeIHc5jhCu8BOgBNJ1BO2dWFATctsmtLwQGqSWop16f0zxG6HP0hYVhHsr2GrCiTELdtHvWXS6DvUlmC7y2_Qhb4nw7mvFqsXUumeh20sSGHzoA0PpWqMtrNFbnNF7qsXN8PPLgNN-t3GMmzOjcNcAIEvfKIobOC5qB8okwtWJUlLmRHFdY5szIv2EMjFl4gb2gPX0VTXNLMQPsFs3f9QTRxqrKkmwnYVSmUXypZfHDt6lJmstW2jDc"
              />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">Marcus Thorne</h3>
              <p className="text-xs text-on-surface-variant font-medium">Managing Partner, Nexus Ventures</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5 text-xs">
            <div className="flex justify-between">
              <span className="text-on-surface-variant font-medium">Allocated Fund Size</span>
              <span className="font-mono text-white font-bold">$150M USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant font-medium">Primary Focus Sectors</span>
              <span className="font-sans text-white font-semibold">AI, SaaS, CleanTech</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant font-medium">Institutional Authority</span>
              <span className="font-sans text-primary font-bold">Investment Committee Lead</span>
            </div>
          </div>
        </div>

        {/* Credentials Card */}
        <div className="glass-card p-6 md:p-8 rounded-2xl space-y-6">
          <h2 className="font-display text-base font-bold text-white flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-primary" /> Credentials & Platform Security
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold font-mono tracking-widest text-on-surface-variant uppercase block">
                GEMINI API SECRET KEY
              </label>
              <div className="flex gap-2">
                <div className="bg-[#0B1120] border border-slate-700 rounded-lg py-3 px-4 outline-none flex-1 flex items-center justify-between text-xs text-slate-400">
                  <span>••••••••••••••••••••••••••••••••</span>
                  <Key className="w-4 h-4 text-slate-500" />
                </div>
              </div>
              <p className="text-[10px] text-on-surface-variant leading-relaxed">
                Automatically sourced from your secure AI Studio Secrets panel. This secret is locked and never exposed to browser diagnostics.
              </p>
            </div>
          </div>

          <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Shield className="w-4 h-4" /> Enterprise-Grade Privacy
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Your uploaded pitch decks and financials are encrypted at rest with AES-256 and are never used to train or refine public machine learning models.
            </p>
          </div>
        </div>
      </div>

      {/* Due Diligence Benchmarks defaults */}
      <section className="glass-card p-6 md:p-8 rounded-2xl space-y-6">
        <h2 className="font-display text-base font-bold text-white flex items-center gap-2.5">
          <Database className="w-5 h-5 text-primary" /> Default Analysis Targets
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div className="space-y-2 p-4 rounded-xl border border-white/5 bg-white/5">
            <p className="font-bold text-white">Baseline LTV/CAC Target</p>
            <p className="font-mono text-lg font-bold text-primary">&gt; 3.0x</p>
            <p className="text-[10px] text-on-surface-variant mt-1">Recommended baseline threshold for SaaS and software subscription models.</p>
          </div>

          <div className="space-y-2 p-4 rounded-xl border border-white/5 bg-white/5">
            <p className="font-bold text-white">Gross Margin Floor</p>
            <p className="font-mono text-lg font-bold text-primary">&gt; 70%</p>
            <p className="text-[10px] text-on-surface-variant mt-1">Target floor margin for software scaling efficiency and lower capital dilution.</p>
          </div>

          <div className="space-y-2 p-4 rounded-xl border border-white/5 bg-white/5">
            <p className="font-bold text-white">Net Revenue Retention</p>
            <p className="font-mono text-lg font-bold text-primary">&gt; 110%</p>
            <p className="text-[10px] text-on-surface-variant mt-1">Expansion momentum baseline indicating healthy customer satisfaction and landing expansions.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
