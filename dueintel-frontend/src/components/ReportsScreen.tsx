import React from "react";
import { StartupAnalysis } from "../types";
import { ChevronLeft, Download, ShieldCheck, AlertCircle, TrendingUp, Sparkles, Flame, CheckCircle, Info } from "lucide-react";

interface ReportsScreenProps {
  analyses: StartupAnalysis[];
  selectedId: string | null;
  onSelectId: (id: string) => void;
  onBackToDashboard: () => void;
}

export default function ReportsScreen({
  analyses,
  selectedId,
  onSelectId,
  onBackToDashboard,
}: ReportsScreenProps) {
  const activeReport = analyses.find((a) => a.id === selectedId) || analyses[0];

  if (!activeReport) {
    return (
      <div className="text-center py-20 text-on-surface">
        <p>No reports found. Analyze a startup to create one!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-on-surface animate-fade-in">
      {/* Left Column: Report Navigation List */}
      <aside className="lg:col-span-3 space-y-4">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 text-xs font-bold text-primary hover:text-white cursor-pointer transition-colors px-1"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="glass-card p-4 rounded-2xl space-y-3">
          <h3 className="font-display text-xs font-bold font-mono text-on-surface-variant uppercase tracking-widest px-2">
            Available Reports
          </h3>
          <div className="space-y-1.5">
            {analyses.map((analysis) => {
              const isSelected = analysis.id === activeReport.id;
              return (
                <button
                  key={analysis.id}
                  onClick={() => onSelectId(analysis.id)}
                  className={`w-full text-left p-3.5 rounded-xl border flex flex-col gap-1 transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary/10 text-white"
                      : "border-transparent hover:bg-white/5 text-on-surface-variant"
                  }`}
                >
                  <span className="font-display font-semibold text-sm text-white">
                    {analysis.name}
                  </span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-mono">{analysis.stage}</span>
                    <span
                      className={`font-bold px-1.5 py-0.5 rounded ${
                        analysis.verdict === "INVEST"
                          ? "bg-emerald-400/10 text-emerald-400"
                          : analysis.verdict === "WATCHLIST"
                          ? "bg-amber-400/10 text-amber-400"
                          : "bg-red-400/10 text-red-400"
                      }`}
                    >
                      {analysis.verdict}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Right Column: Full Report Details */}
      <main className="lg:col-span-9 space-y-8">
        {/* Banner with fallback warning if API key was missing */}
        {activeReport.usingFallback && (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-primary/30 bg-primary/5 text-xs text-on-surface-variant">
            <Info className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
              <span className="font-bold text-white">Dynamic AI Sandbox Active:</span> DueIntel generated this comprehensive analysis using dynamic local intelligence. Insert your <code className="bg-white/5 px-1 rounded text-primary">GEMINI_API_KEY</code> in Secrets for real-time live parsing.
            </div>
          </div>
        )}

        {/* Report Heading */}
        <section className="glass-card p-6 md:p-8 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-container to-[#8B5CF6] text-white font-display font-bold text-2xl flex items-center justify-center border border-white/10 shadow-lg">
              {activeReport.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-3xl font-bold text-white tracking-tight">
                  {activeReport.name}
                </h1>
                <span className="text-xs font-semibold px-2.5 py-1 bg-white/5 border border-white/10 rounded-full font-mono">
                  {activeReport.stage}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1 font-medium font-mono">
                {activeReport.industry} • Analyzed on {activeReport.analyzedAt || "Current Turn"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
            {activeReport.reportFile && (
              <button
                onClick={() => {
                  window.open(`/api/download-report/${activeReport.reportFile}`, "_blank");
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-primary/20 transition-all cursor-pointer mr-2 active:scale-95"
              >
                <Download className="w-4 h-4" /> Download PDF Report
              </button>
            )}
            
            {/* Verdict Card */}
            <div className="text-right">
              <span className="text-[10px] font-bold font-mono tracking-widest text-on-surface-variant block uppercase">
                COMMITTEE DECISION
              </span>
              <div className="flex items-center gap-2 mt-1 justify-end">
                <span
                  className={`text-sm font-extrabold px-3 py-1 rounded border ${
                    activeReport.verdict === "INVEST"
                      ? "bg-emerald-400/5 text-emerald-400 border-emerald-400/20"
                      : activeReport.verdict === "WATCHLIST"
                      ? "bg-amber-400/5 text-amber-400 border-amber-400/20"
                      : "bg-red-400/5 text-red-400 border-red-400/20"
                  }`}
                >
                  {activeReport.verdict}
                </span>
                <span className="font-display text-3xl font-bold text-white">
                  {activeReport.overallScore}
                </span>
                <span className="text-xs text-on-surface-variant">/100</span>
              </div>
            </div>
          </div>
        </section>

        {/* Verdict Details Callout */}
        <div className="p-4 rounded-xl border border-white/5 bg-surface-container flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
          <p className="text-xs text-on-surface-variant">
            <span className="font-bold text-white">Decision Justification:</span> {activeReport.verdictReason}
          </p>
        </div>

        {/* Executive Summary */}
        <section className="glass-card p-6 md:p-8 rounded-2xl space-y-4">
          <h2 className="font-display text-lg font-bold text-white">Executive Summary</h2>
          <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
            {activeReport.executiveSummary}
          </p>
        </section>

        {/* Risk Profile (Progress Indicators) */}
        <section className="glass-card p-6 md:p-8 rounded-2xl">
          <h2 className="font-display text-lg font-bold text-white mb-6">Due Diligence Risk Profile</h2>
          <div className="space-y-5">
            {/* Fin risk */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-white">Financial Risk Assessment</span>
                <span className="font-mono text-on-surface-variant font-bold">
                  {activeReport.riskProfile.financialRisk.text}
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${activeReport.riskProfile.financialRisk.score}%` }}
                />
              </div>
            </div>

            {/* Market risk */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-white">Market Demand & TAM Volatility</span>
                <span className="font-mono text-on-surface-variant font-bold">
                  {activeReport.riskProfile.marketRisk.text}
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-tertiary rounded-full"
                  style={{ width: `${activeReport.riskProfile.marketRisk.score}%` }}
                />
              </div>
            </div>

            {/* Comp risk */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-white">Incumbent & Alternative Competition</span>
                <span className="font-mono text-on-surface-variant font-bold">
                  {activeReport.riskProfile.competitionRisk.text}
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-400 rounded-full"
                  style={{ width: `${activeReport.riskProfile.competitionRisk.score}%` }}
                />
              </div>
            </div>

            {/* Operational risk */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-white">Operational Execution risk</span>
                <span className="font-mono text-on-surface-variant font-bold">
                  {activeReport.riskProfile.operationalRisk.text}
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${activeReport.riskProfile.operationalRisk.score}%` }}
                />
              </div>
            </div>

            {/* Scalability risk */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-white">Technical & Infrastructure Scalability</span>
                <span className="font-mono text-on-surface-variant font-bold">
                  {activeReport.riskProfile.scalabilityRisk.text}
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-tertiary rounded-full"
                  style={{ width: `${activeReport.riskProfile.scalabilityRisk.score}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Competitor Benchmarking */}
        <section className="glass-card p-6 md:p-8 rounded-2xl overflow-hidden">
          <h2 className="font-display text-lg font-bold text-white mb-6">Competitor Benchmarking</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-mono tracking-wider text-on-surface-variant uppercase">
                  <th className="py-3 px-4">METRIC</th>
                  <th className="py-3 px-4 text-primary font-bold">{activeReport.name}</th>
                  <th className="py-3 px-4">VertexFlow</th>
                  <th className="py-3 px-4">CogniScale</th>
                  <th className="py-3 px-4">AutoCompute</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-mono font-medium">
                {activeReport.competitorBenchmarking.map((row, index) => (
                  <tr key={index} className="hover:bg-white/[0.01]">
                    <td className="py-3.5 px-4 font-sans text-xs font-semibold text-white">
                      {row.metric}
                    </td>
                    <td className="py-3.5 px-4 text-primary font-bold bg-primary/5">
                      {row.nexPointAi}
                    </td>
                    <td className="py-3.5 px-4 text-on-surface-variant">{row.vertexFlow}</td>
                    <td className="py-3.5 px-4 text-on-surface-variant">{row.cogniScale}</td>
                    <td className="py-3.5 px-4 text-on-surface-variant">{row.autoCompute}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SWOT Matrix Grid */}
        <section className="space-y-4">
          <h2 className="font-display text-lg font-bold text-white">SWOT Matrix</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="glass-card p-6 rounded-2xl border-emerald-400/10 hover:bg-emerald-400/[0.01] transition-colors flex flex-col gap-3">
              <span className="text-[10px] font-bold font-mono text-emerald-400 tracking-wider uppercase flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> STRENGTHS
              </span>
              <ul className="space-y-2.5 text-xs text-on-surface-variant leading-relaxed">
                {activeReport.strengths.map((str, idx) => (
                  <li key={idx} className="list-disc ml-4">{str}</li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="glass-card p-6 rounded-2xl border-amber-400/10 hover:bg-amber-400/[0.01] transition-colors flex flex-col gap-3">
              <span className="text-[10px] font-bold font-mono text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400" /> WEAKNESSES
              </span>
              <ul className="space-y-2.5 text-xs text-on-surface-variant leading-relaxed">
                {activeReport.weaknesses.map((wk, idx) => (
                  <li key={idx} className="list-disc ml-4">{wk}</li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="glass-card p-6 rounded-2xl border-primary/10 hover:bg-primary/[0.01] transition-colors flex flex-col gap-3">
              <span className="text-[10px] font-bold font-mono text-primary tracking-wider uppercase flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-primary" /> OPPORTUNITIES
              </span>
              <ul className="space-y-2.5 text-xs text-on-surface-variant leading-relaxed">
                {activeReport.opportunities.map((op, idx) => (
                  <li key={idx} className="list-disc ml-4">{op}</li>
                ))}
              </ul>
            </div>

            {/* Threats */}
            <div className="glass-card p-6 rounded-2xl border-error/10 hover:bg-error/[0.01] transition-colors flex flex-col gap-3">
              <span className="text-[10px] font-bold font-mono text-error tracking-wider uppercase flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-error" /> THREATS
              </span>
              <ul className="space-y-2.5 text-xs text-on-surface-variant leading-relaxed">
                {activeReport.threats.map((thr, idx) => (
                  <li key={idx} className="list-disc ml-4">{thr}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Committee Opinions Feedback bubble panel */}
        <section className="glass-card p-6 md:p-8 rounded-2xl space-y-6">
          <h2 className="font-display text-lg font-bold text-white">Investment Committee Opinions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Op 1 */}
            <div className="bg-[#111827]/40 p-5 rounded-xl border border-white/5 flex flex-col justify-between gap-4">
              <p className="text-xs text-on-surface-variant italic leading-relaxed">
                "{activeReport.opinions.vcPartner.comment}"
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                <div className="w-9 h-9 rounded-full bg-slate-700 overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    alt="Marcus Thorne VC opinion card"
                    referrerPolicy="no-referrer"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAINtVvHnuAaSrhIT-x5X2WKeIHc5jhCu8BOgBNJ1BO2dWFATctsmtLwQGqSWop16f0zxG6HP0hYVhHsr2GrCiTELdtHvWXS6DvUlmC7y2_Qhb4nw7mvFqsXUumeh20sSGHzoA0PpWqMtrNFbnNF7qsXN8PPLgNN-t3GMmzOjcNcAIEvfKIobOC5qB8okwtWJUlLmRHFdY5szIv2EMjFl4gb2gPX0VTXNLMQPsFs3f9QTRxqrKkmwnYVSmUXypZfHDt6lJmstW2jDc"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{activeReport.opinions.vcPartner.name}</h4>
                  <p className="text-[10px] text-on-surface-variant">{activeReport.opinions.vcPartner.role}</p>
                </div>
              </div>
            </div>

            {/* Op 2 */}
            <div className="bg-[#111827]/40 p-5 rounded-xl border border-white/5 flex flex-col justify-between gap-4">
              <p className="text-xs text-on-surface-variant italic leading-relaxed">
                "{activeReport.opinions.angelInvestor.comment}"
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                <div className="w-9 h-9 rounded-full bg-slate-700 overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    alt="Elena Rodriguez Angel investor card"
                    referrerPolicy="no-referrer"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4IM-XYFHLSEd3p3M8hWRqZX8Gs9gB86fmoqFKBnoASRAuJhZmOWH8nerhYg0uuZojAD238BG-zUUPEjQBSUtYAw0506w0tb13HOSTY6SVLh_R_XQywq3rWgz9CFvHWKtu8I_Ha4OvR3xqk49V16xEuLN0d89rXgftEsHwue7mOUQ7bBLjsE1B_GJ0LFTgVd5cuwBYqfhc6dJDlFde_sjL3Nx6QJ7g_BmHTKahQKOp2e6moOVc_fN3f4GMUxVbpLCgLnhu12CM0Wo"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{activeReport.opinions.angelInvestor.name}</h4>
                  <p className="text-[10px] text-on-surface-variant">{activeReport.opinions.angelInvestor.role}</p>
                </div>
              </div>
            </div>

            {/* Op 3 */}
            <div className="bg-[#111827]/40 p-5 rounded-xl border border-white/5 flex flex-col justify-between gap-4">
              <p className="text-xs text-on-surface-variant italic leading-relaxed">
                "{activeReport.opinions.growthInvestor.comment}"
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                <div className="w-9 h-9 rounded-full bg-slate-700 overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    alt="David Chen Growth VC card"
                    referrerPolicy="no-referrer"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBR2h-iz316emm8SZ0YevAI8Wob_ocsQwNlTHl9mYjwWit5Cqm5bT626x5vMZZdGdvC95abN6y4dYEZK3YC0BtMD0GxbBM0nASmoPJh_G9zDuqtIIQORs2aFeSOIpITzbESjZegAiOxUo26OuG7B1noDFdrS-sPSGfxe2VGbn1P8Mc0X7vu8deOZV-VN_XdWM-J9kf1ZL8DPb2hiFJ3o5leaNPpr9gHbZ5Ln6etjynriKAOpiQ6MgH8qIaW9aZJOLZkpvTy3O4R_r0"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{activeReport.opinions.growthInvestor.name}</h4>
                  <p className="text-[10px] text-on-surface-variant">{activeReport.opinions.growthInvestor.role}</p>
                </div>
              </div>
            </div>

            {/* Op 4 */}
            <div className="bg-[#111827]/40 p-5 rounded-xl border border-white/5 flex flex-col justify-between gap-4">
              <p className="text-xs text-on-surface-variant italic leading-relaxed">
                "{activeReport.opinions.conservativeInvestor.comment}"
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                <div className="w-9 h-9 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center bg-slate-600 text-white font-bold text-xs uppercase">
                  {activeReport.opinions.conservativeInvestor.name.slice(0, 2)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{activeReport.opinions.conservativeInvestor.name}</h4>
                  <p className="text-[10px] text-on-surface-variant">{activeReport.opinions.conservativeInvestor.role}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
