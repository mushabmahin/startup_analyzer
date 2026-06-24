import React from "react";
import { TrendingUp, Play, Star, Sparkles, Database, ShieldAlert, BarChart3, LineChart, Globe, Layers, ArrowRight } from "lucide-react";

interface LandingScreenProps {
  onStart: () => void;
  onDemo: () => void;
}

export default function LandingScreen({ onStart, onDemo }: LandingScreenProps) {
  return (
    <div className="relative min-h-screen text-on-surface bg-background selection:bg-primary-container/30">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.18),transparent_65%)] pointer-events-none z-0" />
      <div className="absolute top-[800px] left-10 w-80 h-80 bg-primary/80 opacity-[0.04] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[1500px] right-10 w-96 h-96 bg-tertiary/80 opacity-[0.04] blur-[140px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold tracking-wider uppercase mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Institutional Grade AI
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-white leading-[1.1] max-w-4xl mb-6">
          AI-Powered Startup <br />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Due Diligence
          </span>
        </h1>

        <p className="font-sans text-lg md:text-xl text-on-surface-variant max-w-3xl mb-10 leading-relaxed">
          Analyze pitch decks, financial statements, and business plans in minutes. Our engine identifies signals, risks, and discrepancies that human analysts miss.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mb-20">
          <button
            onClick={onStart}
            className="flex-1 py-4 px-8 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-container to-[#8B5CF6] hover:brightness-110 shadow-lg shadow-primary-container/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            Analyze Startup <TrendingUp className="w-5 h-5" />
          </button>
          <button
            onClick={onDemo}
            className="flex-1 py-4 px-8 rounded-xl font-semibold text-white bg-surface-container border border-white/10 hover:bg-white/5 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            Watch Demo <Play className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Dashboard Mockup Container */}
        <div className="w-full max-w-5xl mx-auto glass-card p-4 rounded-t-3xl border-b-0 shadow-2xl relative group">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
          <div className="rounded-2xl overflow-hidden aspect-video relative border border-white/5 bg-[#0F172A]">
            <img
              className="w-full h-full object-cover opacity-90 group-hover:scale-[1.01] transition-transform duration-700"
              alt="Sophisticated Venture Capital due diligence dashboard with analytical charts"
              referrerPolicy="no-referrer"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkNDd4-1iuD1amOJ1Wd0t_Rt0y-HZncsKxFVPy_SqRiRCC_E1ktH1HmDfps9lLnkt4UgSy4n8ClbGG7658PULhSDPpMNtxNtt6KUJP1zngIC3A_biBQGn-Tyox1QIYXra5gHJsxYenzbcmWaOs7gja4ouhd-nyfix9y-8WPg_mwzATDqJIvzN0nocYAWBoyJousxIdMP4k-GHhXXFcn7d6WYvf1FAe5bi6ZUWP0XJnXNgEMG7vSWXZ6givhHxVgJKfC3IhCMxBoVM"
            />
          </div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section className="relative z-10 py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-white">
            Comprehensive Intelligence
          </h2>
          <p className="font-sans text-on-surface-variant mt-2 text-base md:text-lg">
            Deep-dive analysis across every critical startup metric.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Startup Analysis */}
          <div className="glass-card p-8 rounded-2xl flex flex-col gap-5 hover:border-primary/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-white">Startup Analysis</h3>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
              Semantic parsing of founder vision, product-market fit, and narrative consistency across all submitted documentation.
            </p>
          </div>

          {/* Financial Health (Col span 2) */}
          <div className="glass-card p-8 rounded-2xl flex flex-col justify-between gap-6 md:col-span-2 hover:border-primary/30 transition-all duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
              <div className="space-y-4 max-w-md">
                <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary border border-tertiary/20">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-white">Financial Health Assessment</h3>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                  Automated P&L analysis, burn rate projection, and unit economics validation using institutional-grade forensic models.
                </p>
              </div>

              {/* Small chart visualization */}
              <div className="w-full sm:w-52 h-28 bg-[#131b2e]/60 rounded-xl p-4 border border-white/5 flex flex-col justify-center gap-3">
                <div className="space-y-2.5">
                  <div className="flex justify-between text-[10px] text-on-surface-variant font-mono">
                    <span>ARR GROWTH</span>
                    <span className="text-primary font-bold">+120%</span>
                  </div>
                  <div className="h-2 w-full bg-primary/20 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[75%]" />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <div className="flex justify-between text-[10px] text-on-surface-variant font-mono">
                    <span>BURN RATE</span>
                    <span className="text-error font-bold">STABLE</span>
                  </div>
                  <div className="h-2 w-full bg-error/20 rounded-full overflow-hidden">
                    <div className="h-full bg-error w-[30%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Market Opportunity (Col span 2) */}
          <div className="glass-card p-8 rounded-2xl flex flex-col gap-5 md:col-span-2 hover:border-primary/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary-container border border-primary-container/30">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-white">Market Opportunity Analysis</h3>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
              TAM/SAM/SOM validation through real-time industry data scraping and comparative trend analysis across global markets.
            </p>
          </div>

          {/* Competitor Intelligence */}
          <div className="glass-card p-8 rounded-2xl flex flex-col gap-5 hover:border-primary/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-[#571bc1]/20 flex items-center justify-center text-secondary border border-secondary/20">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-white">Competitor Intelligence</h3>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
              Identify incumbents and dark horse competitors before they appear on standard industry reports.
            </p>
          </div>

          {/* Risk Detection */}
          <div className="glass-card p-8 rounded-2xl border-error/20 flex flex-col gap-5 hover:border-error/40 hover:bg-error/[0.02] transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center text-error border border-error/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-white">Risk Detection Engine</h3>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
              Flagging legal inconsistencies, IP vulnerabilities, and operational bottlenecks using advanced neural reasoning.
            </p>
          </div>

          {/* Investment Recommendation (Col span 2) */}
          <div className="glass-card p-8 rounded-2xl bg-primary-container/[0.05] border-primary-container/20 flex flex-col gap-5 md:col-span-2 hover:border-primary/40 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary-container border border-primary-container/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-white text-primary">Investment Recommendation System</h3>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
              A weighted conviction score synthesized from thousands of data points, tailored to your specific investment thesis and risk tolerance.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 bg-surface-container-lowest/30 border-y border-white/5 relative overflow-hidden">
        <div className="px-4 md:px-8 max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-white">Precision Workflow</h2>
            <p className="font-sans text-on-surface-variant mt-3 text-base md:text-lg">
              From raw pitch deck to actionable intelligence in four stages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-full bg-surface-container border border-white/10 flex items-center justify-center text-primary font-bold text-lg mb-6 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 shadow-md">
                1
              </div>
              <h4 className="font-display text-lg font-bold text-white mb-2">Upload Documents</h4>
              <p className="font-sans text-sm text-on-surface-variant leading-relaxed px-4">
                Securely drag and drop decks, financials, and legal papers.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-full bg-surface-container border border-white/10 flex items-center justify-center text-primary font-bold text-lg mb-6 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 shadow-md">
                2
              </div>
              <h4 className="font-display text-lg font-bold text-white mb-2">AI Analysis</h4>
              <p className="font-sans text-sm text-on-surface-variant leading-relaxed px-4">
                DueIntel parses and cross-references data against market benchmarks.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-full bg-surface-container border border-white/10 flex items-center justify-center text-primary font-bold text-lg mb-6 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 shadow-md">
                3
              </div>
              <h4 className="font-display text-lg font-bold text-white mb-2">Risk Assessment</h4>
              <p className="font-sans text-sm text-on-surface-variant leading-relaxed px-4">
                The engine identifies red flags and validates key assumptions.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-full bg-surface-container border border-white/10 flex items-center justify-center text-primary font-bold text-lg mb-6 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 shadow-md">
                4
              </div>
              <h4 className="font-display text-lg font-bold text-white mb-2">Investment Report</h4>
              <p className="font-sans text-sm text-on-surface-variant leading-relaxed px-4">
                Generate a final institutional-grade analysis and score in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-white text-center mb-16">
          Trusted by Capital Allocators
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Testimonial 1 */}
          <div className="glass-card p-8 rounded-2xl flex flex-col justify-between gap-6 hover:border-white/20 transition-all duration-200">
            <div className="space-y-4">
              <div className="flex gap-1 text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="font-sans text-on-surface-variant text-sm italic leading-relaxed">
                "DueIntel has fundamentally changed our deal-flow triage. What used to take an associate 20 hours now takes 20 minutes with significantly higher accuracy."
              </p>
            </div>
            <div className="flex items-center gap-4 border-t border-white/5 pt-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container border border-white/10">
                <img
                  className="w-full h-full object-cover"
                  alt="Marcus Thorne profile avatar"
                  referrerPolicy="no-referrer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAINtVvHnuAaSrhIT-x5X2WKeIHc5jhCu8BOgBNJ1BO2dWFATctsmtLwQGqSWop16f0zxG6HP0hYVhHsr2GrCiTELdtHvWXS6DvUlmC7y2_Qhb4nw7mvFqsXUumeh20sSGHzoA0PpWqMtrNFbnNF7qsXN8PPLgNN-t3GMmzOjcNcAIEvfKIobOC5qB8okwtWJUlLmRHFdY5szIv2EMjFl4gb2gPX0VTXNLMQPsFs3f9QTRxqrKkmwnYVSmUXypZfHDt6lJmstW2jDc"
                />
              </div>
              <div>
                <p className="font-display text-sm font-bold text-white">Marcus Thorne</p>
                <p className="font-sans text-xs text-on-surface-variant">Managing Partner, Nexus Ventures</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="glass-card p-8 rounded-2xl flex flex-col justify-between gap-6 hover:border-white/20 transition-all duration-200">
            <div className="space-y-4">
              <div className="flex gap-1 text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="font-sans text-on-surface-variant text-sm italic leading-relaxed">
                "The risk detection engine is uncanny. It flagged an IP discrepancy in a Series A deal that our legal team only caught three weeks later during deep audit."
              </p>
            </div>
            <div className="flex items-center gap-4 border-t border-white/5 pt-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container border border-white/10">
                <img
                  className="w-full h-full object-cover"
                  alt="Elena Rodriguez profile avatar"
                  referrerPolicy="no-referrer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4IM-XYFHLSEd3p3M8hWRqZX8Gs9gB86fmoqFKBnoASRAuJhZmOWH8nerhYg0uuZojAD238BG-zUUPEjQBSUtYAw0506w0tb13HOSTY6SVLh_R_XQywq3rWgz9CFvHWKtu8I_Ha4OvR3xqk49V16xEuLN0d89rXgftEsHwue7mOUQ7bBLjsE1B_GJ0LFTgVd5cuwBYqfhc6dJDlFde_sjL3Nx6QJ7g_BmHTKahQKOp2e6moOVc_fN3f4GMUxVbpLCgLnhu12CM0Wo"
                />
              </div>
              <div>
                <p className="font-display text-sm font-bold text-white">Elena Rodriguez</p>
                <p className="font-sans text-xs text-on-surface-variant">Principal, Athena Angels</p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="glass-card p-8 rounded-2xl flex flex-col justify-between gap-6 hover:border-white/20 transition-all duration-200">
            <div className="space-y-4">
              <div className="flex gap-1 text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="font-sans text-on-surface-variant text-sm italic leading-relaxed">
                "Finally, a tool that speaks the language of VCs. The output isn't just data; it's a strategic perspective on the market opportunity."
              </p>
            </div>
            <div className="flex items-center gap-4 border-t border-white/5 pt-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container border border-white/10">
                <img
                  className="w-full h-full object-cover"
                  alt="David Chen profile avatar"
                  referrerPolicy="no-referrer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBR2h-iz316emm8SZ0YevAI8Wob_ocsQwNlTHl9mYjwWit5Cqm5bT626x5vMZZdGdvC95abN6y4dYEZK3YC0BtMD0GxbBM0nASmoPJh_G9zDuqtIIQORs2aFeSOIpITzbESjZegAiOxUo26OuG7B1noDFdrS-sPSGfxe2VGbn1P8Mc0X7vu8deOZV-VN_XdWM-J9kf1ZL8DPb2hiFJ3o5leaNPpr9gHbZ5Ln6etjynriKAOpiQ6MgH8qIaW9aZJOLZkpvTy3O4R_r0"
                />
              </div>
              <div>
                <p className="font-display text-sm font-bold text-white">David Chen</p>
                <p className="font-sans text-xs text-on-surface-variant">Director of Analysis, Ironclad Capital</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Get Started Now */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="glass-card rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight">
              Ready to Institutionalize Your Analysis?
            </h2>
            <p className="font-sans text-base md:text-lg text-on-surface-variant leading-relaxed">
              Join the world's most sophisticated investment firms and start making data-driven decisions with DueIntel.
            </p>
            <div className="pt-4">
              <button
                onClick={onStart}
                className="inline-flex items-center gap-3 px-8 py-5 rounded-xl text-white bg-gradient-to-r from-primary-container to-[#8B5CF6] hover:brightness-110 shadow-xl transition-all cursor-pointer font-bold active:scale-[0.97]"
              >
                Get Started Now <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
