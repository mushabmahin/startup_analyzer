export interface RiskItem {
  score: number;
  text: string;
}

export interface RiskProfile {
  financialRisk: RiskItem;
  marketRisk: RiskItem;
  competitionRisk: RiskItem;
  operationalRisk: RiskItem;
  scalabilityRisk: RiskItem;
}

export interface KeyMetrics {
  currentArr: string;
  netRetention: string;
  salesCycle: string;
  grossMargin: string;
}

export interface CompetitorRow {
  metric: string;
  nexPointAi: string;
  vertexFlow: string;
  cogniScale: string;
  autoCompute: string;
}

export interface Opinion {
  name: string;
  role: string;
  comment: string;
}

export interface CommitteeOpinions {
  vcPartner: Opinion;
  angelInvestor: Opinion;
  growthInvestor: Opinion;
  conservativeInvestor: Opinion;
}

export interface StartupAnalysis {
  id: string; // generated client-side
  name: string;
  industry: string;
  stage: string;
  description: string;
  overallScore: number;
  verdict: "INVEST" | "WATCHLIST" | "REJECT";
  verdictReason: string;
  executiveSummary: string;
  riskProfile: RiskProfile;
  metrics: KeyMetrics;
  competitorBenchmarking: CompetitorRow[];
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  opinions: CommitteeOpinions;
  analyzedAt: string; // date string
  usingFallback?: boolean;
  reportFile?: string;
}

export type ActiveTab = "landing" | "dashboard" | "upload" | "reports" | "insights" | "settings";
