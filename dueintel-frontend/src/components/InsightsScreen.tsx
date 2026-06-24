import React, { useState } from "react";
import { LineChart, BarChart3, HelpCircle, Activity, Globe, Scale, ArrowUpRight, ShieldCheck, Zap } from "lucide-react";

export default function InsightsScreen() {
  const [selectedSector, setSelectedSector] = useState("Gen AI / LLM");

  const sectors = [
    { name: "Gen AI / LLM", multiplier: "18.2x", flow: "+140% YoY", risk: "High", conviction: 92 },
    { name: "SaaS / Cloud Ops", multiplier: "8.4x", flow: "-10% YoY", risk: "Low", conviction: 74 },
    { name: "CleanTech / Smart Grid", multiplier: "11.1x", flow: "+45% YoY", risk: "Medium", conviction: 82 },
    { name: "Fintech / Payments", multiplier: "6.8x", flow: "+8% YoY", risk: "Medium", conviction: 65 },
    { name: "Biotech / HealthTech", multiplier: "12.4x", flow: "+24% YoY", risk: "High", conviction: 78 }
  ];

  return (
    <div className="space-y-8 text-on-surface animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-white tracking-tight">Market Insights</h1>
        <p className="font-sans text-sm text-on-surface-variant mt-1">
          Macro-economic venture indicators, valuation indices, and sector momentum metrics.
        </p>
      </div>

      {/* Grid Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="glass-card p-6 rounded-2xl flex justify-between items-start">
          <div className="space-y-3">
            <span className="text-[10px] font-bold font-mono tracking-widest text-on-surface-variant uppercase block">AVG. SaaS MULTIPLE</span>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-white">7.8x</span>
              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-0.5">
                +1.2x <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-[10px] text-on-surface-variant leading-relaxed">
              Based on top 100 private SaaS deals closed in trailing 90 days.
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="glass-card p-6 rounded-2xl flex justify-between items-start">
          <div className="space-y-3">
            <span className="text-[10px] font-bold font-mono tracking-widest text-on-surface-variant uppercase block">SERIES A CHECK SIZE</span>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-white">$12.4M</span>
              <span className="text-xs font-mono font-bold text-slate-400">Stable</span>
            </div>
            <p className="text-[10px] text-on-surface-variant leading-relaxed">
              Slight growth in deep-tech; standard SaaS checks compressing.
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-tertiary/10 border border-tertiary/20 flex items-center justify-center text-tertiary">
            <Scale className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="glass-card p-6 rounded-2xl flex justify-between items-start">
          <div className="space-y-3">
            <span className="text-[10px] font-bold font-mono tracking-widest text-on-surface-variant uppercase block">GLOBAL VC LIQUIDITY</span>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-white">$142B</span>
              <span className="text-xs font-mono font-bold text-red-400 flex items-center gap-0.5">
                -4.5% YoY
              </span>
            </div>
            <p className="text-[10px] text-on-surface-variant leading-relaxed">
              Dry powder remaining high but deploy rate remains conservative.
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
            <Globe className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Sector Multiples & AI Query Tool */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sectors Multiples Grid */}
        <div className="lg:col-span-8 glass-card p-6 md:p-8 rounded-2xl space-y-6">
          <h2 className="font-display text-lg font-bold text-white">Comparative Sector Matrix</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-mono tracking-wider text-on-surface-variant uppercase">
                  <th className="py-3 px-4">SECTOR NAME</th>
                  <th className="py-3 px-4">REVENUE MULTIPLE</th>
                  <th className="py-3 px-4">CAPITAL FLOW</th>
                  <th className="py-3 px-4">RISK PROFILE</th>
                  <th className="py-3 px-4">VC CONVICTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-mono font-medium">
                {sectors.map((sec, idx) => (
                  <tr
                    key={idx}
                    onClick={() => setSelectedSector(sec.name)}
                    className={`hover:bg-white/[0.01] cursor-pointer transition-colors ${
                      selectedSector === sec.name ? "bg-primary/5 font-bold" : ""
                    }`}
                  >
                    <td className="py-4 px-4 font-sans text-sm text-white font-semibold">
                      {sec.name}
                    </td>
                    <td className="py-4 px-4 text-white font-bold">{sec.multiplier}</td>
                    <td className={`py-4 px-4 ${sec.flow.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}>
                      {sec.flow}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sec.risk === "Low"
                            ? "bg-emerald-400/10 text-emerald-400"
                            : sec.risk === "Medium"
                            ? "bg-amber-400/10 text-amber-400"
                            : "bg-red-400/10 text-red-400"
                        }`}
                      >
                        {sec.risk}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${sec.conviction}%` }} />
                        </div>
                        <span className="text-white font-bold text-xs">{sec.conviction}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Insight generator sidebar */}
        <div className="lg:col-span-4 glass-card p-6 rounded-2xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-[10px] font-bold font-mono tracking-widest text-primary uppercase block">SECTOR HIGHLIGHTS</span>
            <h3 className="font-display text-base font-bold text-white">{selectedSector}</h3>
            
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {selectedSector === "Gen AI / LLM" &&
                "Extremely high valuation multiples driven by raw computing demands. Seed checks have increased to an average of $3.5M. Defensibility relies solely on proprietary fine-tuning pipelines and sovereign storage compliance."}
              {selectedSector === "SaaS / Cloud Ops" &&
                "Multiples remain compressed compared to the 2021 highs. Capital allocators are focusing heavily on dry unit economics and net dollar retention. Churn represents the highest current investment blocker."}
              {selectedSector === "CleanTech / Smart Grid" &&
                "Steady upward trajectory backed by federal incentives. Deals are capital intensive but offer long-term subscription-like stability. Grid integration remains the key technical bottleneck."}
              {selectedSector === "Fintech / Payments" &&
                "High regulatory compliance barriers. Multiples have compressed; however, B2B embedded finance platforms continue to exhibit strong customer backlogs."}
              {selectedSector === "Biotech / HealthTech" &&
                "Long FDA compliance cycles. Deep tech AI integration for molecular discovery has reinvigorated capital flow with average Series A check sizes touching $18M."}
            </p>
          </div>

          <div className="bg-[#131b2e]/60 p-4 rounded-xl border border-white/5 space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-12 h-12 bg-primary/20 rounded-full blur-lg pointer-events-none" />
            <div className="flex items-center gap-2 text-primary">
              <Zap className="w-4 h-4" />
              <span className="text-[10px] font-bold font-mono tracking-wider uppercase">DueIntel Advice</span>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              "We recommend allocating 15-20% of dry powder to early seed stage sovereign AI frameworks before incumbents deploy native APIs."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
