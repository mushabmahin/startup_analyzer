import React, { useState } from "react";
import { Upload, X, CheckSquare, Square, Rocket, HelpCircle, FileText, CheckCircle2 } from "lucide-react";

interface UploadScreenProps {
  onAnalyze: (formData: {
    name: string;
    industry: string;
    stage: string;
    description: string;
    settings: {
      riskAnalysis: boolean;
      competitorAnalysis: boolean;
      marketAnalysis: boolean;
      investmentRec: boolean;
    };
    documents: (File | string)[];
  }) => Promise<void>;
  isAnalyzing: boolean;
}

export default function UploadScreen({ onAnalyze, isAnalyzing }: UploadScreenProps) {
  // Form State
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("SaaS / Enterprise");
  const [stage, setStage] = useState("Seed");
  const [description, setDescription] = useState("");

  // Analysis Settings State
  const [settings, setSettings] = useState({
    riskAnalysis: true,
    competitorAnalysis: true,
    marketAnalysis: true,
    investmentRec: true,
  });

  // Uploaded Files State
  const [pitchDeck, setPitchDeck] = useState<File | string | null>(null);
  const [financials, setFinancials] = useState<File | string | null>("financials_q3_24.pdf");
  const [businessPlan, setBusinessPlan] = useState<File | string | null>(null);

  // File Input References
  const pitchInputRef = React.useRef<HTMLInputElement>(null);
  const financialsInputRef = React.useRef<HTMLInputElement>(null);
  const businessPlanInputRef = React.useRef<HTMLInputElement>(null);

  // Analysis Animation Logs
  const [animationStep, setAnimationStep] = useState(0);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please provide a Startup Name.");
      return;
    }

    if (!pitchDeck || !(pitchDeck instanceof File)) {
      alert("Please upload a valid Pitch Deck PDF to start the due diligence analysis.");
      return;
    }

    const uploadedDocs: (File | string)[] = [];
    uploadedDocs.push(pitchDeck);
    if (financials) uploadedDocs.push(financials);
    if (businessPlan) uploadedDocs.push(businessPlan);

    // Trigger parent analysis handler
    onAnalyze({
      name,
      industry,
      stage,
      description,
      settings,
      documents: uploadedDocs,
    });
  };

  const simulateFileSelect = (target: "pitch" | "fin" | "biz") => {
    const mockNames = {
      pitch: "neuraldynamics_pitch_deck_2025.pdf",
      fin: "q4_balance_sheet_verified.pdf",
      biz: "strategic_expansion_roadmap_v1.pdf",
    };
    if (target === "pitch") setPitchDeck(mockNames.pitch);
    if (target === "fin") setFinancials(mockNames.fin);
    if (target === "biz") setBusinessPlan(mockNames.biz);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: "pitch" | "fin" | "biz") => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (target === "pitch") setPitchDeck(file);
      if (target === "fin") setFinancials(file);
      if (target === "biz") setBusinessPlan(file);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-on-surface">
      {/* Header */}
      <header className="mb-10">
        <h1 className="font-display text-3xl font-bold text-white tracking-tight">Analyze a Startup</h1>
        <p className="font-sans text-sm md:text-base text-on-surface-variant max-w-3xl mt-1 leading-relaxed">
          Initialize institutional-grade due diligence by providing startup details and core documentation. Our AI engines will process these files for deep risk, competitor, and market analysis.
        </p>
      </header>

      <form onSubmit={handleStartAnalysis} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Details & Configuration */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main profile section */}
          <section className="glass-card p-6 md:p-8 rounded-2xl space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold font-mono tracking-widest text-on-surface-variant uppercase">STARTUP NAME</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. NeuralDynamics AI"
                  className="bg-[#0B1120] border border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary text-sm text-white rounded-lg py-3 px-4 outline-none transition-all placeholder:text-slate-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold font-mono tracking-widest text-on-surface-variant uppercase">INDUSTRY</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="bg-[#0B1120] border border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary text-sm text-white rounded-lg py-3 px-4 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option>SaaS / Enterprise</option>
                  <option>Fintech</option>
                  <option>HealthTech</option>
                  <option>DeepTech / AI</option>
                  <option>Cleantech</option>
                </select>
              </div>
            </div>

            {/* Funding stage selector */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold font-mono tracking-widest text-on-surface-variant uppercase">FUNDING STAGE</label>
              <div className="flex flex-wrap gap-3">
                {["Pre-Seed", "Seed", "Series A", "Series B+"].map((stg) => {
                  const isActive = stage === stg;
                  return (
                    <button
                      type="button"
                      key={stg}
                      onClick={() => setStage(stg)}
                      className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-white/10 bg-white/5 hover:border-primary/50 text-on-surface"
                      }`}
                    >
                      {stg}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description value proposition */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold font-mono tracking-widest text-on-surface-variant uppercase">DESCRIPTION & VALUE PROPOSITION</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe the startup's core value proposition, targeted client sector, and underlying technical moat..."
                rows={5}
                className="bg-[#0B1120] border border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary text-sm text-white rounded-lg py-3 px-4 outline-none transition-all resize-none placeholder:text-slate-500"
              />
            </div>
          </section>

          {/* Analysis modules settings */}
          <section className="glass-card p-6 md:p-8 rounded-2xl">
            <h3 className="font-display text-base font-bold text-white mb-6 flex items-center gap-2">
              Analysis Settings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Risk Analysis Checkbox */}
              <button
                type="button"
                onClick={() => toggleSetting("riskAnalysis")}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors text-left"
              >
                {settings.riskAnalysis ? (
                  <CheckSquare className="w-5 h-5 text-primary flex-shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-slate-500 flex-shrink-0" />
                )}
                <div>
                  <p className="text-xs font-bold text-white">Risk Analysis</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">Legal, operational, & financial audit</p>
                </div>
              </button>

              {/* Competitor Analysis Checkbox */}
              <button
                type="button"
                onClick={() => toggleSetting("competitorAnalysis")}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors text-left"
              >
                {settings.competitorAnalysis ? (
                  <CheckSquare className="w-5 h-5 text-primary flex-shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-slate-500 flex-shrink-0" />
                )}
                <div>
                  <p className="text-xs font-bold text-white">Competitor Analysis</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">Market landscape, benchmark, & moats</p>
                </div>
              </button>

              {/* Market Analysis Checkbox */}
              <button
                type="button"
                onClick={() => toggleSetting("marketAnalysis")}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors text-left"
              >
                {settings.marketAnalysis ? (
                  <CheckSquare className="w-5 h-5 text-primary flex-shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-slate-500 flex-shrink-0" />
                )}
                <div>
                  <p className="text-xs font-bold text-white">Market Analysis</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">TAM/SAM validation & sector tailwinds</p>
                </div>
              </button>

              {/* Investment Recommendation Checkbox */}
              <button
                type="button"
                onClick={() => toggleSetting("investmentRec")}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors text-left"
              >
                {settings.investmentRec ? (
                  <CheckSquare className="w-5 h-5 text-primary flex-shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-slate-500 flex-shrink-0" />
                )}
                <div>
                  <p className="text-xs font-bold text-white">Investment Rec</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">AI-scored investment thesis verdict</p>
                </div>
              </button>
            </div>
          </section>
        </div>

        {/* Right Column: PDF Upload Zones & Action */}
        <div className="lg:col-span-5 space-y-6">
          {/* Pitch Deck Card */}
          <div className="glass-card p-6 rounded-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> Pitch Deck PDF
              </span>
              <span className="text-[10px] font-extrabold text-tertiary uppercase font-mono bg-tertiary/10 px-2 py-0.5 rounded-full">
                MANDATORY
              </span>
            </div>

            <input
              type="file"
              ref={pitchInputRef}
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e, "pitch")}
              accept="application/pdf"
            />

            {pitchDeck ? (
              <div className="flex items-center gap-4 p-4 rounded-xl border border-emerald-400/20 bg-emerald-400/5">
                <div className="w-10 h-10 rounded bg-emerald-400/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    {pitchDeck instanceof File ? pitchDeck.name : pitchDeck}
                  </p>
                  <p className="text-[10px] text-on-surface-variant">Selected successfully</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPitchDeck(null)}
                  className="text-on-surface-variant hover:text-error transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => pitchInputRef.current?.click()}
                className="border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/[0.02] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all active:scale-[0.99]"
              >
                <Upload className="w-8 h-8 text-on-surface-variant mb-2 group-hover:text-primary" />
                <p className="text-xs font-bold text-white">Drop file to upload</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">PDF max 25MB</p>
              </div>
            )}
          </div>

          {/* Financial Statement Card */}
          <div className="glass-card p-6 rounded-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> Financial Statement PDF
              </span>
              {financials && typeof financials === "string" && financials.includes("financials_q3") && (
                <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="progress-bar-fill h-full bg-tertiary w-[65%]" />
                </div>
              )}
            </div>

            <input
              type="file"
              ref={financialsInputRef}
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e, "fin")}
              accept="application/pdf"
            />

            {financials ? (
              <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5">
                <div className="w-10 h-10 rounded bg-red-400/10 flex items-center justify-center">
                  <span className="text-xs font-bold font-mono text-red-400">PDF</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    {financials instanceof File ? financials.name : financials}
                  </p>
                  <p className="text-[10px] text-on-surface-variant">
                    {typeof financials === "string" && financials.includes("financials_q3") ? "12.4 MB • 65% uploaded" : "File attached"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFinancials(null)}
                  className="text-on-surface-variant hover:text-error transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => financialsInputRef.current?.click()}
                className="border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/[0.02] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all active:scale-[0.99]"
              >
                <Upload className="w-8 h-8 text-on-surface-variant mb-2" />
                <p className="text-xs font-bold text-white">Select Financials Statement</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">Highly recommended for burn-rate scoring</p>
              </div>
            )}
          </div>

          {/* Business Plan Card */}
          <div className="glass-card p-6 rounded-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> Business Plan PDF
              </span>
            </div>

            <input
              type="file"
              ref={businessPlanInputRef}
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e, "biz")}
              accept="application/pdf"
            />

            {businessPlan ? (
              <div className="flex items-center gap-4 p-4 rounded-xl border border-emerald-400/20 bg-emerald-400/5">
                <div className="w-10 h-10 rounded bg-emerald-400/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    {businessPlan instanceof File ? businessPlan.name : businessPlan}
                  </p>
                  <p className="text-[10px] text-on-surface-variant">Attached successfully</p>
                </div>
                <button
                  type="button"
                  onClick={() => setBusinessPlan(null)}
                  className="text-on-surface-variant hover:text-error transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => businessPlanInputRef.current?.click()}
                className="border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/[0.02] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
              >
                <Upload className="w-8 h-8 text-on-surface-variant mb-2" />
                <p className="text-xs font-bold text-white">Select Document</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">Optional detailed roadmap</p>
              </div>
            )}
          </div>

          {/* Start CTA Button */}
          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full py-5 bg-gradient-to-r from-primary-container to-[#8B5CF6] text-white font-bold rounded-2xl shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Rocket className="w-5 h-5" />
            START DUE DILIGENCE
          </button>

          <p className="text-center text-[10px] text-on-surface-variant px-6 leading-relaxed">
            By starting analysis, you agree to our Enterprise Data Privacy Terms. Your documents are encrypted and only accessible to authorized investment analysts.
          </p>
        </div>
      </form>
    </div>
  );
}
