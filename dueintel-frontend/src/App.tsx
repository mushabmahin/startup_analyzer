import React, { useState, useEffect } from "react";
import { initialAnalyses } from "./data";
import { StartupAnalysis, ActiveTab } from "./types";
import LandingScreen from "./components/LandingScreen";
import DashboardScreen from "./components/DashboardScreen";
import UploadScreen from "./components/UploadScreen";
import ReportsScreen from "./components/ReportsScreen";
import InsightsScreen from "./components/InsightsScreen";
import SettingsScreen from "./components/SettingsScreen";
import { Shield, Sparkles, LayoutDashboard, Cpu, TrendingUp, Settings, BarChart, FileText, Loader2, Play } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("landing");
  const [analyses, setAnalyses] = useState<StartupAnalysis[]>([]);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Loading logs during compilation simulation
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingLogs, setLoadingLogs] = useState<string[]>([]);

  // Load from database on startup, fall back to localStorage/seed if empty
  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const response = await fetch("/api/analyses");
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setAnalyses(data);
            setSelectedAnalysisId(data[0].id);
            return;
          }
        }
      } catch (e) {
        console.error("Error loading analyses from database:", e);
      }

      const saved = localStorage.getItem("due_intel_analyses");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.length > 0) {
            setAnalyses(parsed);
            setSelectedAnalysisId(parsed[0].id);
            return;
          }
        } catch (e) {
          console.error("Error reading from localstorage", e);
        }
      }
      setAnalyses(initialAnalyses);
      setSelectedAnalysisId(initialAnalyses[0].id);
      localStorage.setItem("due_intel_analyses", JSON.stringify(initialAnalyses));
    };

    fetchAnalyses();
  }, []);

  // Save to LocalStorage helper (keeps local backup)
  const saveAnalyses = (newAnalyses: StartupAnalysis[]) => {
    setAnalyses(newAnalyses);
    localStorage.setItem("due_intel_analyses", JSON.stringify(newAnalyses));
  };

  // Run the multi-step loading log simulation in parallel with the API call
  const startLoadingLogs = () => {
    setLoadingStep(0);
    setLoadingLogs(["[SYSTEM] Initializing due diligence pipeline..."]);

    const steps = [
      { delay: 1200, log: "[DECK] Successfully extracted 16 semantic slides from Pitch Deck PDF." },
      { delay: 2400, log: "[DECK] Verified founder bio: 2x exited founder in Adjacent deep tech." },
      { delay: 3600, log: "[FIN] Parsing financial statement. Balance sheet indicates $120k average burn." },
      { delay: 4800, log: "[FIN] Projecting 18-month runway based on current cash reserves." },
      { delay: 6000, log: "[MARKET] Correlating TAM validation against global sector indicators." },
      { delay: 7200, log: "[MARKET] Identified VertexFlow and CogniScale as primary core competitors." },
      { delay: 8400, log: "[CONSENSUS] Compiling consensus opinions from the 4 investor archetypes..." },
      { delay: 9600, log: "[SYSTEM] final scores generated. Launching Investment Committee deck." }
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        setLoadingStep(i + 1);
        setLoadingLogs((prev) => [...prev, step.log]);
      }, step.delay);
    });
  };

  // Trigger analysis pipeline
  const handleAnalyzeStartup = async (formData: {
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
  }) => {
    setIsAnalyzing(true);
    startLoadingLogs();

    try {
      const primaryFile = formData.documents.find(doc => doc instanceof File) as File | undefined;
      let response;

      if (primaryFile) {
        // Send as FormData multipart/form-data
        const data = new FormData();
        data.append("file", primaryFile);
        data.append("name", formData.name);
        data.append("industry", formData.industry);
        data.append("stage", formData.stage);
        data.append("description", formData.description);

        response = await fetch("/api/analyze-startup", {
          method: "POST",
          body: data
        });
      } else {
        // Send as JSON
        response = await fetch("/api/analyze-startup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || "Analysis failed");
      }

      const report: StartupAnalysis = await response.json();
      
      // Inject local client attributes if not returned by backend
      const newId = report.id || report.name.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Date.now();
      const finalReport: StartupAnalysis = {
        ...report,
        id: newId,
        analyzedAt: report.analyzedAt || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      };

      // Push and transition after log simulation finishes
      setTimeout(() => {
        const updated = [finalReport, ...analyses];
        saveAnalyses(updated);
        setSelectedAnalysisId(newId);
        setActiveTab("reports");
        setIsAnalyzing(false);
      }, 10000);

    } catch (error: any) {
      console.error("API error:", error);
      setIsAnalyzing(false);
      alert(error.message || "Due diligence analysis failed. Please verify connection and retry.");
    }
  };

  return (
    <div className="min-h-screen bg-[#070b16] text-on-surface font-sans antialiased relative">
      {/* Universal header banner representing Screen 1 / 2 header style */}
      <nav className="sticky top-0 z-50 glass-card border-x-0 border-t-0 border-b border-white/5 px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Custom logo & branding supporting VentureLens AI and DueIntel names */}
          <div
            onClick={() => setActiveTab("landing")}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-95 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shadow-md shadow-primary/20">
              DI
            </div>
            <div>
              <span className="font-display font-black text-base text-white tracking-tight leading-none block">DueIntel</span>
              <span className="text-[9px] font-bold font-mono text-primary tracking-wider uppercase leading-none mt-1 block">VentureLens AI</span>
            </div>
          </div>

          {/* Desktop tabs */}
          {activeTab !== "landing" && (
            <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "dashboard" ? "bg-white/5 text-primary border border-primary/25" : "text-on-surface-variant hover:text-white border border-transparent"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </button>
              <button
                onClick={() => setActiveTab("upload")}
                className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "upload" ? "bg-white/5 text-primary border border-primary/25" : "text-on-surface-variant hover:text-white border border-transparent"
                }`}
              >
                <Cpu className="w-4 h-4" /> Analyze Startup
              </button>
              <button
                onClick={() => {
                  if (analyses.length > 0 && !selectedAnalysisId) {
                    setSelectedAnalysisId(analyses[0].id);
                  }
                  setActiveTab("reports");
                }}
                className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "reports" ? "bg-white/5 text-primary border border-primary/25" : "text-on-surface-variant hover:text-white border border-transparent"
                }`}
              >
                <FileText className="w-4 h-4" /> Investor Reports
              </button>
              <button
                onClick={() => setActiveTab("insights")}
                className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "insights" ? "bg-white/5 text-primary border border-primary/25" : "text-on-surface-variant hover:text-white border border-transparent"
                }`}
              >
                <TrendingUp className="w-4 h-4" /> Market Insights
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {activeTab === "landing" ? (
            <>
              <button
                onClick={() => setActiveTab("dashboard")}
                className="text-xs font-bold text-on-surface-variant hover:text-white transition-colors px-3 py-1.5 cursor-pointer"
              >
                Enter Platform
              </button>
              <button
                onClick={() => setActiveTab("upload")}
                className="text-xs font-bold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-lg shadow-lg shadow-primary/20 transition-all cursor-pointer active:scale-95"
              >
                Get Started
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab("settings")}
                className={`p-2 rounded-lg border hover:bg-white/5 transition-all cursor-pointer ${
                  activeTab === "settings" ? "border-primary text-primary" : "border-white/10 text-on-surface-variant"
                }`}
              >
                <Settings className="w-4.5 h-4.5" />
              </button>
              <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-white/5">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-700 border border-white/10">
                  <img
                    className="w-full h-full object-cover"
                    alt="Marcus Thorne navigation icon"
                    referrerPolicy="no-referrer"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAINtVvHnuAaSrhIT-x5X2WKeIHc5jhCu8BOgBNJ1BO2dWFATctsmtLwQGqSWop16f0zxG6HP0hYVhHsr2GrCiTELdtHvWXS6DvUlmC7y2_Qhb4nw7mvFqsXUumeh20sSGHzoA0PpWqMtrNFbnNF7qsXN8PPLgNN-t3GMmzOjcNcAIEvfKIobOC5qB8okwtWJUlLmRHFdY5szIv2EMjFl4gb2gPX0VTXNLMQPsFs3f9QTRxqrKkmwnYVSmUXypZfHDt6lJmstW2jDc"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white leading-none">Marcus Thorne</p>
                  <p className="text-[8px] font-bold text-primary font-mono uppercase tracking-wider leading-none mt-1">NEXUS PARTNER</p>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Mobile navigation tabs layout */}
      {activeTab !== "landing" && (
        <div className="md:hidden flex items-center justify-around bg-[#0c1222] border-b border-white/5 py-3 text-[10px] font-bold font-mono tracking-wider uppercase">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex flex-col items-center gap-1 ${activeTab === "dashboard" ? "text-primary font-black" : "text-on-surface-variant"}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Overview
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex flex-col items-center gap-1 ${activeTab === "upload" ? "text-primary font-black" : "text-on-surface-variant"}`}
          >
            <Cpu className="w-4 h-4" /> Analyze
          </button>
          <button
            onClick={() => {
              if (analyses.length > 0 && !selectedAnalysisId) {
                setSelectedAnalysisId(analyses[0].id);
              }
              setActiveTab("reports");
            }}
            className={`flex flex-col items-center gap-1 ${activeTab === "reports" ? "text-primary font-black" : "text-on-surface-variant"}`}
          >
            <FileText className="w-4 h-4" /> Reports
          </button>
          <button
            onClick={() => setActiveTab("insights")}
            className={`flex flex-col items-center gap-1 ${activeTab === "insights" ? "text-primary font-black" : "text-on-surface-variant"}`}
          >
            <TrendingUp className="w-4 h-4" /> Insights
          </button>
        </div>
      )}

      {/* Main Screen Router */}
      <div className={`${activeTab === "landing" ? "" : "max-w-7xl mx-auto px-4 md:px-8 py-10"}`}>
        {activeTab === "landing" && (
          <LandingScreen
            onStart={() => setActiveTab("upload")}
            onDemo={() => setActiveTab("dashboard")}
          />
        )}

        {activeTab === "dashboard" && (
          <DashboardScreen
            analyses={analyses}
            onSelectAnalysis={(analysis) => {
              setSelectedAnalysisId(analysis.id);
              setActiveTab("reports");
            }}
            onNewAnalysis={() => setActiveTab("upload")}
          />
        )}

        {activeTab === "upload" && (
          <UploadScreen
            onAnalyze={handleAnalyzeStartup}
            isAnalyzing={isAnalyzing}
          />
        )}

        {activeTab === "reports" && (
          <ReportsScreen
            analyses={analyses}
            selectedId={selectedAnalysisId}
            onSelectId={setSelectedAnalysisId}
            onBackToDashboard={() => setActiveTab("dashboard")}
          />
        )}

        {activeTab === "insights" && <InsightsScreen />}

        {activeTab === "settings" && <SettingsScreen />}
      </div>

      {/* Immersive Loading Portal overlay matching Screen 3 compilation flow */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-[#070b16]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-on-surface">
          <div className="w-full max-w-xl glass-card p-8 rounded-3xl space-y-8 border-primary/20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-white/5 border-t-primary animate-spin" />
                <Sparkles className="w-6 h-6 text-primary absolute inset-0 m-auto animate-pulse" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-white">Synthesizing Due Diligence</h3>
                <p className="text-xs text-on-surface-variant mt-1">DueIntel neural networks are reading uploaded PDFs</p>
              </div>
            </div>

            {/* Simulated log stream terminal */}
            <div className="bg-[#040812] border border-white/5 rounded-xl p-4 font-mono text-[11px] leading-relaxed text-emerald-400 h-44 overflow-y-auto space-y-1 select-none">
              {loadingLogs.map((log, index) => (
                <div key={index} className="animate-fade-in flex gap-2">
                  <span className="text-primary font-bold">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>

            {/* Progression bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono font-bold text-on-surface-variant">
                <span>ANALYZING DEAL FLOW</span>
                <span>{Math.round((loadingStep / 8) * 100)}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 rounded-full"
                  style={{ width: `${(loadingStep / 8) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Footer conforming to simple margins and literal styling guidelines */}
      <footer className="border-t border-white/5 py-8 text-center text-[10px] font-mono tracking-wider text-on-surface-variant">
        <p>© 2026 DUEINTEL SYSTEM • VENTURELENS AI AGENT TECHNOLOGY</p>
        <p className="mt-1 flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-primary" /> SECURE DECK ENCRYPTION ENABLED
        </p>
      </footer>
    </div>
  );
}
