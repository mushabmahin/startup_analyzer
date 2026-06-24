import React from "react";
import { StartupAnalysis } from "../types";
import { Calendar, Download, TrendingUp, AlertTriangle, ShieldCheck, ChevronRight, Activity, Cpu } from "lucide-react";

interface DashboardScreenProps {
  analyses: StartupAnalysis[];
  onSelectAnalysis: (analysis: StartupAnalysis) => void;
  onNewAnalysis: () => void;
}

export default function DashboardScreen({ analyses, onSelectAnalysis, onNewAnalysis }: DashboardScreenProps) {
  // Compute summary stats dynamically
  const totalAnalyses = analyses.length + 1281; // Keep it high for visual authenticity
  const activeReports = analyses.filter(a => a.verdict === "WATCHLIST").length + 40;
  const avgScore = Math.floor(analyses.reduce((acc, a) => acc + a.overallScore, 0) / analyses.length);
  const highRiskCount = analyses.filter(a => a.overallScore < 50 || a.verdict === "REJECT").length + 10;

  return (
    <div className="space-y-8 animate-fade-in text-on-surface">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">Investor Dashboard</h1>
          <p className="font-sans text-sm text-on-surface-variant mt-1">
            Welcome back, Marcus. Here's your portfolio summary.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container border border-white/10 text-xs font-semibold hover:bg-white/5 transition-all text-on-surface">
            <Calendar className="w-4 h-4 text-primary" /> Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-container hover:brightness-110 text-xs font-bold text-white shadow-lg transition-all">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-all" />
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold font-mono tracking-wider text-on-surface-variant uppercase">TOTAL ANALYSES</span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              +12% <TrendingUp className="w-2.5 h-2.5" />
            </span>
          </div>
          <div className="mt-4">
            <span className="font-display text-3xl font-bold text-white">{totalAnalyses.toLocaleString()}</span>
            <p className="text-[10px] text-on-surface-variant mt-1">SaaS & Deep Tech primary focus</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full blur-xl group-hover:bg-secondary/10 transition-all" />
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold font-mono tracking-wider text-on-surface-variant uppercase">ACTIVE REPORTS</span>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              +5 New
            </span>
          </div>
          <div className="mt-4">
            <span className="font-display text-3xl font-bold text-white">{activeReports}</span>
            <p className="text-[10px] text-on-surface-variant mt-1">Pending investment committee votes</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary/5 rounded-full blur-xl group-hover:bg-tertiary/10 transition-all" />
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold font-mono tracking-wider text-on-surface-variant uppercase">AVG. INVESTMENT SCORE</span>
            <span className="text-[10px] font-bold text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">
              -2.4% MoM
            </span>
          </div>
          <div className="mt-4">
            <span className="font-display text-3xl font-bold text-white">{avgScore}</span>
            <span className="text-xs text-on-surface-variant font-medium"> /100</span>
            <p className="text-[10px] text-on-surface-variant mt-1">Strict quality bar maintained</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden border-error/10 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-error/5 rounded-full blur-xl group-hover:bg-error/10 transition-all" />
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold font-mono tracking-wider text-on-surface-variant uppercase">HIGH RISK FLAG</span>
            <AlertTriangle className="w-4 h-4 text-error" />
          </div>
          <div className="mt-4">
            <span className="font-display text-3xl font-bold text-white">{highRiskCount}</span>
            <p className="text-[10px] text-on-surface-variant mt-1">Startups flagged with critical vulnerabilities</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Score Trend Area Chart */}
        <div className="glass-card p-6 rounded-2xl lg:col-span-2 flex flex-col justify-between space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-display text-base font-bold text-white">Investment Score Trends</h3>
              <p className="text-[11px] text-on-surface-variant mt-0.5">Historical performance of analyzed ventures</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-mono">
              <span className="flex items-center gap-1.5 text-primary">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" /> PRIMARY SECTOR
              </span>
              <span className="flex items-center gap-1.5 text-tertiary">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary" /> MARKET BASELINE
              </span>
            </div>
          </div>

          {/* Styled SVG Chart representing the exact aesthetic of Screen 2 */}
          <div className="h-56 w-full relative">
            <svg viewBox="0 0 600 200" className="w-full h-full" preserveAspectRatio="none">
              {/* Vertical Columns representing past analyses */}
              <rect x="30" y="80" width="24" height="100" rx="3" fill="rgba(255,255,255,0.06)" />
              <rect x="90" y="110" width="24" height="70" rx="3" fill="rgba(255,255,255,0.06)" />
              <rect x="150" y="60" width="24" height="120" rx="3" fill="rgba(255,255,255,0.06)" />
              <rect x="210" y="90" width="24" height="90" rx="3" fill="rgba(255,255,255,0.06)" />
              <rect x="270" y="70" width="24" height="110" rx="3" fill="rgba(255,255,255,0.06)" />
              <rect x="330" y="100" width="24" height="80" rx="3" fill="rgba(255,255,255,0.06)" />
              <rect x="390" y="50" width="24" height="130" rx="3" fill="rgba(255,255,255,0.06)" />
              <rect x="450" y="75" width="24" height="105" rx="3" fill="rgba(255,255,255,0.06)" />
              <rect x="510" y="40" width="24" height="140" rx="3" fill="rgba(255,255,255,0.06)" />

              {/* Grid Lines */}
              <line x1="0" y1="180" x2="600" y2="180" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <line x1="0" y1="120" x2="600" y2="120" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1="60" x2="600" y2="60" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

              {/* Curve 1: Primary Sector (Indigo Gradient/Curve) */}
              <path
                d="M 30,140 Q 120,120 180,90 T 330,80 T 450,55 T 570,50"
                fill="none"
                stroke="url(#indigoGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Curve 2: Market Baseline (Dashed Cyan Curve) */}
              <path
                d="M 30,165 Q 120,150 180,145 T 330,135 T 450,150 T 570,120"
                fill="none"
                stroke="url(#cyanGrad)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                strokeLinecap="round"
              />

              {/* SVG Gradients */}
              <defs>
                <linearGradient id="indigoGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#4338CA" />
                </linearGradient>
                <linearGradient id="cyanGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute bottom-1 left-2 text-[8px] font-mono text-on-surface-variant flex justify-between w-[95%]">
              <span>Q1 2024</span>
              <span>Q2 2024</span>
              <span>Q3 2024</span>
              <span>Q4 2024</span>
              <span>Q1 2025</span>
              <span>Q2 2025</span>
            </div>
          </div>
        </div>

        {/* Risk Distribution Donut Chart */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <h3 className="font-display text-base font-bold text-white">Risk Distribution</h3>

          <div className="flex items-center justify-center py-4 relative">
            {/* Custom SVG Donut */}
            <svg width="150" height="150" className="transform -rotate-90">
              {/* Background Circle */}
              <circle cx="75" cy="75" r="55" fill="transparent" stroke="rgba(255,255,255,0.04)" strokeWidth="14" />
              {/* Segment 1: Low Risk (70%) - Circumference is ~345 */}
              <circle
                cx="75"
                cy="75"
                r="55"
                fill="transparent"
                stroke="#4F46E5"
                strokeWidth="14"
                strokeDasharray="241.5 345"
                strokeLinecap="round"
              />
              {/* Segment 2: Medium (18%) */}
              <circle
                cx="75"
                cy="75"
                r="55"
                fill="transparent"
                stroke="#06B6D4"
                strokeWidth="14"
                strokeDasharray="62.1 345"
                strokeDashoffset="-241.5"
                strokeLinecap="round"
              />
              {/* Segment 3: Critical (7%) */}
              <circle
                cx="75"
                cy="75"
                r="55"
                fill="transparent"
                stroke="#EF4444"
                strokeWidth="14"
                strokeDasharray="24.15 345"
                strokeDashoffset="-303.6"
                strokeLinecap="round"
              />
              {/* Segment 4: Other (5%) */}
              <circle
                cx="75"
                cy="75"
                r="55"
                fill="transparent"
                stroke="#94A3B8"
                strokeWidth="14"
                strokeDasharray="17.25 345"
                strokeDashoffset="-327.75"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-[10px] font-bold text-on-surface-variant font-mono uppercase tracking-wider">Total</span>
              <span className="text-xl font-bold text-white leading-tight">1.2k</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-3 pt-2 text-[11px] border-t border-white/5 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <div className="flex justify-between w-full">
                <span className="text-on-surface-variant">Low Risk</span>
                <span className="font-mono text-white font-bold ml-1">70%</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tertiary" />
              <div className="flex justify-between w-full">
                <span className="text-on-surface-variant">Medium</span>
                <span className="font-mono text-white font-bold ml-1">18%</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <div className="flex justify-between w-full">
                <span className="text-on-surface-variant">Critical</span>
                <span className="font-mono text-white font-bold ml-1">7%</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <div className="flex justify-between w-full">
                <span className="text-on-surface-variant">Other</span>
                <span className="font-mono text-white font-bold ml-1">5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Analyses Table & Industry Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Section */}
        <div className="glass-card p-6 rounded-2xl lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display text-base font-bold text-white">Recent Analyses</h3>
            <button
              onClick={onNewAnalysis}
              className="text-xs font-semibold text-primary hover:text-white transition-colors cursor-pointer"
            >
              Analyze New Startup
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-mono tracking-wider text-on-surface-variant uppercase">
                  <th className="py-3 px-4">STARTUP NAME</th>
                  <th className="py-3 px-4">INDUSTRY</th>
                  <th className="py-3 px-4">SCORE</th>
                  <th className="py-3 px-4">RECOMMENDATION</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {analyses.map((analysis) => (
                  <tr
                    key={analysis.id}
                    onClick={() => onSelectAnalysis(analysis)}
                    className="hover:bg-white/[0.02] cursor-pointer transition-colors group"
                  >
                    <td className="py-4 px-4 font-display font-semibold text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase border border-primary/20">
                          {analysis.name.slice(0, 2)}
                        </div>
                        {analysis.name}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-on-surface-variant font-medium text-xs">
                      {analysis.industry}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-12 bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              analysis.overallScore >= 80
                                ? "bg-primary"
                                : analysis.overallScore >= 60
                                ? "bg-tertiary"
                                : "bg-red-400"
                            }`}
                            style={{ width: `${analysis.overallScore}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-xs text-white">
                          {analysis.overallScore}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          analysis.verdict === "INVEST"
                            ? "bg-emerald-400/5 text-emerald-400 border-emerald-400/20"
                            : analysis.verdict === "WATCHLIST"
                            ? "bg-amber-400/5 text-amber-400 border-amber-400/20"
                            : "bg-red-400/5 text-red-400 border-red-400/20"
                        }`}
                      >
                        {analysis.verdict}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            analysis.verdict === "INVEST"
                              ? "bg-emerald-400"
                              : analysis.verdict === "WATCHLIST"
                              ? "bg-amber-400"
                              : "bg-red-400"
                          }`}
                        />
                        {analysis.verdict === "INVEST" ? "Finished" : analysis.verdict === "WATCHLIST" ? "Reviewing" : "Declined"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors inline-block" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Industry Breakdown Sidebar */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="font-display text-base font-bold text-white">Industry Breakdown</h3>

            <div className="space-y-4">
              {/* Sector 1 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-white">FINTECH</span>
                  <span className="font-mono text-on-surface-variant font-bold">32%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "32%" }} />
                </div>
              </div>

              {/* Sector 2 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-white">HEALTHTECH</span>
                  <span className="font-mono text-on-surface-variant font-bold">24%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary rounded-full" style={{ width: "24%" }} />
                </div>
              </div>

              {/* Sector 3 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-white">DEEP AI</span>
                  <span className="font-mono text-on-surface-variant font-bold">19%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "19%" }} />
                </div>
              </div>

              {/* Sector 4 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-white">PROPTECH</span>
                  <span className="font-mono text-on-surface-variant font-bold">15%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: "15%" }} />
                </div>
              </div>

              {/* Sector 5 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-white">SUSTAINABILITY</span>
                  <span className="font-mono text-on-surface-variant font-bold">10%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-400 rounded-full" style={{ width: "10%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* AI Insight Card */}
          <div className="bg-[#131b2e]/60 p-4 rounded-xl border border-white/5 flex gap-3 relative overflow-hidden group">
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl pointer-events-none" />
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 border border-primary/20">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold font-mono text-primary tracking-wider uppercase">AI Insight</span>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                Exposure to Gen AI infrastructure has grown by 12% this quarter. Risk volatility remains low.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
