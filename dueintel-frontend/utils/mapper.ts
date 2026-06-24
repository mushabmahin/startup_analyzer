import { StartupAnalysis } from "../types";

export function mapApiResponse(data: any): StartupAnalysis {
  const analysis = data.analysis;
  const opinions = data.investor_opinions;

  return {
    id: Date.now().toString(),

    name: analysis.startup_name,

    industry: analysis.target_market || "Not Mentioned",

    stage: "Seed",

    description: analysis.solution,

    overallScore: analysis.overall_score,

    verdict: analysis.recommendation,

    verdictReason: analysis.risk_level,

    executiveSummary: `
Problem:
${analysis.problem}

Solution:
${analysis.solution}

Target Market:
${analysis.target_market}

Revenue Model:
${analysis.revenue_model}
`,

    strengths: analysis.key_strengths || [],

    weaknesses: analysis.key_risks || [],

    opportunities: [],

    threats: [],

    riskProfile: {
      financialRisk: {
        score: 10 - analysis.financial_score,
        text: "Financial Analysis"
      },

      marketRisk: {
        score: 10 - analysis.market_score,
        text: "Market Analysis"
      },

      competitionRisk: {
        score: 5,
        text: "Competition Analysis"
      },

      operationalRisk: {
        score: 10 - analysis.team_score,
        text: "Operational Analysis"
      },

      scalabilityRisk: {
        score: 10 - analysis.traction_score,
        text: "Scalability Analysis"
      }
    },

    metrics: {
      currentArr: "N/A",
      netRetention: "N/A",
      salesCycle: "N/A",
      grossMargin: "N/A"
    },

    competitorBenchmarking: [],

    opinions: {
      vcPartner: {
        name: "VC Partner",
        role: "Venture Capital",
        comment: opinions.vc_partner
      },

      angelInvestor: {
        name: "Angel Investor",
        role: "Angel",
        comment: opinions.angel_investor
      },

      growthInvestor: {
        name: "Growth Investor",
        role: "Growth",
        comment: opinions.growth_investor
      },

      conservativeInvestor: {
        name: "Conservative Investor",
        role: "Conservative",
        comment: opinions.conservative_investor
      }
    },

    analyzedAt: new Date().toISOString(),

    usingFallback: false
  };
}