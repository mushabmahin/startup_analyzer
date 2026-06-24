import { StartupAnalysis } from "./types";

export const initialAnalyses: StartupAnalysis[] = [
  {
    id: "nexpoint-ai",
    name: "NexPoint AI",
    industry: "Gen AI / Infra",
    stage: "Series A",
    description: "Proprietary hyper-scale LLM training infrastructure with localized data sovereign compliance and automated edge fine-tuning.",
    overallScore: 92,
    verdict: "INVEST",
    verdictReason: "Recommended based on outstanding technical moat and exceptional contract backlogs.",
    executiveSummary: "NexPoint AI demonstrates exceptional product-market fit within the hyper-scale enterprise ecosystem. By leveraging a proprietary transformer architecture optimized for localized data compliance, they have effectively mitigated the primary friction point for Fortune 500 adoption of generative tools. Current ARR stands at $4.2M with a 118% net dollar retention rate, indicating strong expansion dynamics and low customer churn.",
    riskProfile: {
      financialRisk: { score: 20, text: "Low (20%)" },
      marketRisk: { score: 45, text: "Medium (45%)" },
      competitionRisk: { score: 75, text: "High (75%)" },
      operationalRisk: { score: 15, text: "Low (15%)" },
      scalabilityRisk: { score: 10, text: "Minimal (10%)" }
    },
    metrics: {
      currentArr: "$4.2M",
      netRetention: "118%",
      salesCycle: "14mo",
      grossMargin: "82%"
    },
    competitorBenchmarking: [
      { metric: "Model Latency", nexPointAi: "45ms", vertexFlow: "112ms", cogniScale: "88ms", autoCompute: "140ms" },
      { metric: "Data Sovereignty", nexPointAi: "Full", vertexFlow: "Partial", cogniScale: "None", autoCompute: "Partial" },
      { metric: "Setup Complexity", nexPointAi: "Low (Plug-in)", vertexFlow: "High", cogniScale: "Medium", autoCompute: "Medium" },
      { metric: "Est. CAC", nexPointAi: "$12k", vertexFlow: "$18k", cogniScale: "$15k", autoCompute: "$22k" }
    ],
    strengths: [
      "Proprietary localized LLM framework with 4x latency gains over OpenAI API",
      "Exceptional technical pedigree with ex-Google Brain and Stanford researchers",
      "Extremely low customer churn rate (< 2% annual ARR attrition)"
    ],
    weaknesses: [
      "High concentration of contract revenue in five anchor enterprise customers",
      "Limited direct marketing presence; heavily reliant on product-led growth",
      "Longer initial integration setup times compared to standard cloud wrappers"
    ],
    opportunities: [
      "Geographic expansion into sovereign EU data regions with strict local storage rules",
      "Commercializing private API licensing model for third-party developer toolkits",
      "Favorable regulatory headwinds promoting air-gapped on-premise generative AI clusters"
    ],
    threats: [
      "Rapid commoditization of basic foundation model architectures",
      "Azure and AWS native on-premise private AI appliance updates",
      "Uncertainty around high-end GPU supply chains impacting infrastructure expansion"
    ],
    opinions: {
      vcPartner: {
        name: "Marcus Thorne",
        role: "Managing Partner, Nexus Ventures",
        comment: "Strong unit economics, but high competition. I'd like to see more aggressive expansion into untapped markets."
      },
      angelInvestor: {
        name: "Elena Rodriguez",
        role: "Principal, Athena Angels",
        comment: "Great founder pedigree. The technical defensibility is the clear winner here. Easy follow-on for me."
      },
      growthInvestor: {
        name: "David Chen",
        role: "Director of Analysis, Ironclad Capital",
        comment: "Scalability is proven by current ARR growth. Net retention indicates a product that becomes fundamental to the client."
      },
      conservativeInvestor: {
        name: "Arthur Pendelton",
        role: "General Partner, Sentinel Allocators",
        comment: "Need to see longer burn-way. Technical risk is low but geopolitical data risks might impact Series B valuation."
      }
    },
    analyzedAt: "Oct 24, 2024"
  },
  {
    id: "greengrid-energy",
    name: "GreenGrid Energy",
    industry: "CleanTech",
    stage: "Seed",
    description: "Next-generation smart micro-grid distributed storage and energy orchestration software powered by reinforcement learning.",
    overallScore: 78,
    verdict: "WATCHLIST",
    verdictReason: "Recommended for watchlist monitoring pending regulatory micro-grid approvals.",
    executiveSummary: "GreenGrid Energy addresses the growing inefficiency in distributed energy grids. Their software orchestrates battery storage discharge cycles with high precision, saving commercial facilities up to 35% in utility demand surcharges. While early pilot trials are promising, national scale is bottlenecked by state-level public utility regulations and capital-intensive commercial sales cycles.",
    riskProfile: {
      financialRisk: { score: 40, text: "Medium (40%)" },
      marketRisk: { score: 55, text: "Medium (55%)" },
      competitionRisk: { score: 35, text: "Moderate (35%)" },
      operationalRisk: { score: 60, text: "High (60%)" },
      scalabilityRisk: { score: 45, text: "Moderate (45%)" }
    },
    metrics: {
      currentArr: "$1.1M",
      netRetention: "104%",
      salesCycle: "18mo",
      grossMargin: "61%"
    },
    competitorBenchmarking: [
      { metric: "Grid Sync Speed", nexPointAi: "200ms", vertexFlow: "1.2s", cogniScale: "850ms", autoCompute: "3.1s" },
      { metric: "Battery Longevity Boost", nexPointAi: "+22%", vertexFlow: "+5%", cogniScale: "+12%", autoCompute: "+2%" },
      { metric: "Hardware Agnostic", nexPointAi: "Yes", vertexFlow: "No", cogniScale: "Yes", autoCompute: "No" },
      { metric: "Est. Deployment CAC", nexPointAi: "$45k", vertexFlow: "$90k", cogniScale: "$55k", autoCompute: "$110k" }
    ],
    strengths: [
      "Hardware-agnostic software framework supporting 90% of industrial batteries",
      "Highly efficient machine learning dispatch algorithm tuned for regional grid tariffs",
      "Strong letters of intent from 12 regional industrial manufacturing centers"
    ],
    weaknesses: [
      "Long regulatory cycles restricting rapid geographical expansion",
      "High upfront engineering customization needed for each individual facility hookup",
      "Capital-intensive business development requiring direct enterprise sales"
    ],
    opportunities: [
      "Federal green energy infrastructure credits backing distributed grid storage projects",
      "Direct software white-labeling with electrical equipment manufacturers",
      "Ancillary services bidding directly into regional wholesale electricity markets"
    ],
    threats: [
      "Changes in localized utility net-metering laws reducing savings margins",
      "Decreasing hardware costs of rival, fully-integrated industrial battery packs",
      "High competition from tier-1 energy conglomerates developing internal software"
    ],
    opinions: {
      vcPartner: {
        name: "Marcus Thorne",
        role: "Managing Partner, Nexus Ventures",
        comment: "Excellent technical capability, but grid hookups are notoriously slow. Watch list is appropriate for now."
      },
      angelInvestor: {
        name: "Elena Rodriguez",
        role: "Principal, Athena Angels",
        comment: "The team is deeply experienced in electrical engineering. Happy to invest if they close their next major municipal trial."
      },
      growthInvestor: {
        name: "David Chen",
        role: "Director of Analysis, Ironclad Capital",
        comment: "Great customer validation. If they can lower facility-specific customization times, scalability will double."
      },
      conservativeInvestor: {
        name: "Arthur Pendelton",
        role: "General Partner, Sentinel Allocators",
        comment: "Regulatory friction is the primary threat. It is a high-conviction product but a difficult, slow-rolling business."
      }
    },
    analyzedAt: "Nov 12, 2024"
  },
  {
    id: "cloudorbit",
    name: "CloudOrbit",
    industry: "SaaS / Cloud",
    stage: "Series B+",
    description: "Legacy relational-to-cloud multi-tenant database synchronization and schema auto-translation engine.",
    overallScore: 34,
    verdict: "REJECT",
    verdictReason: "Decline investment due to high technical debt and severe pricing pressure from native cloud tooling.",
    executiveSummary: "CloudOrbit provides migration tools for database schema translation. While historically lucrative, their product-market fit has been heavily eroded by modern serverless database solutions and AI auto-translation plugins integrated directly into AWS/GCP. High customer acquisition costs and falling gross margins signal severe long-term structural headwinds.",
    riskProfile: {
      financialRisk: { score: 85, text: "Critical (85%)" },
      marketRisk: { score: 70, text: "High (70%)" },
      competitionRisk: { score: 90, text: "Critical (90%)" },
      operationalRisk: { score: 50, text: "Medium (50%)" },
      scalabilityRisk: { score: 80, text: "High (80%)" }
    },
    metrics: {
      currentArr: "$3.5M",
      netRetention: "88%",
      salesCycle: "9mo",
      grossMargin: "44%"
    },
    competitorBenchmarking: [
      { metric: "Schema Accuracy", nexPointAi: "64%", vertexFlow: "98%", cogniScale: "92%", autoCompute: "85%" },
      { metric: "Translation Latency", nexPointAi: "34min", vertexFlow: "1.2min", cogniScale: "5min", autoCompute: "8min" },
      { metric: "Multi-Cloud Sync", nexPointAi: "Partial", vertexFlow: "Full", cogniScale: "Full", autoCompute: "Full" },
      { metric: "Subscription Cost", nexPointAi: "$48k/yr", vertexFlow: "$12k/yr", cogniScale: "$20k/yr", autoCompute: "$15k/yr" }
    ],
    strengths: [
      "Deep legacy Oracle and IBM database schema support built over 8 years",
      "Established brand name with solid traditional financial enterprises",
      "High average contract values (ACVs) under traditional license terms"
    ],
    weaknesses: [
      "Severe technical debt in the core engine, which is written in legacy C++",
      "Extremely long integration feedback loops and slow update cycles",
      "High churn rate (>12% annually) as clients migrate directly to native cloud services"
    ],
    opportunities: [
      "Refactoring the code engine to support modern vector database migrations",
      "Offering high-margin professional consulting services for migration architecture",
      "Consolidation exit with a traditional system integrator private equity firm"
    ],
    threats: [
      "Amazon DMS and Google Database Migration Service offering free migration tools",
      "AI code models migrating database code with near-perfect accuracy for pennies",
      "Drying up of classic relational database market within the next decade"
    ],
    opinions: {
      vcPartner: {
        name: "Marcus Thorne",
        role: "Managing Partner, Nexus Ventures",
        comment: "This is a classical value trap. Revenue looks solid but the forward-looking trajectory is clearly declining."
      },
      angelInvestor: {
        name: "Elena Rodriguez",
        role: "Principal, Athena Angels",
        comment: "Too much technical debt. It's a legacy tool fighting a losing battle against native serverless architectures."
      },
      growthInvestor: {
        name: "David Chen",
        role: "Director of Analysis, Ironclad Capital",
        comment: "CAC is unsustainable. They are spending more to acquire a customer than the contract is worth given high churn."
      },
      conservativeInvestor: {
        name: "Arthur Pendelton",
        role: "General Partner, Sentinel Allocators",
        comment: "Severe decline in margins is a massive red flag. Standard decline phase dynamics; decline to participate."
      }
    },
    analyzedAt: "Dec 05, 2024"
  }
];
