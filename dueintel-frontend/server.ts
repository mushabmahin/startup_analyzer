import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();

const app = express();
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

const PORT = 3000;
const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

// Lazy initialize Gemini client if API key is present
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Dynamic fallback report generator to ensure 100% reliability and robust demo data
function generateDynamicMockReport(name: string, industry: string, stage: string, description: string) {
  const normalizedName = name || "NeuralDynamics AI";
  const normalizedIndustry = industry || "SaaS / Enterprise";
  const normalizedStage = stage || "Seed";
  const normalizedDesc = description || "Next-generation software for enterprise optimization.";

  // Generate some realistic seed data based on the startup name and industry
  const randomScore = Math.floor(65 + Math.random() * 25); // 65 to 90
  let verdict: "INVEST" | "WATCHLIST" | "REJECT" = "WATCHLIST";
  let verdictReason = "Recommended based on strong technical moat but high market crowding.";
  if (randomScore >= 80) {
    verdict = "INVEST";
    verdictReason = "Highly recommended based on outstanding team pedigree and fast-growing market.";
  } else if (randomScore < 70) {
    verdict = "REJECT";
    verdictReason = "High operational risk and unclear product-market fit under current burn rate.";
  }

  return {
    name: normalizedName,
    industry: normalizedIndustry,
    stage: normalizedStage,
    description: normalizedDesc,
    overallScore: randomScore,
    verdict,
    verdictReason,
    executiveSummary: `${normalizedName} demonstrates strong early evidence of product-market fit in the ${normalizedIndustry} sector. By utilizing a proprietary technical architecture optimized for scalability, they have successfully solved a core pain point for enterprise adopters. The leadership team, consisting of senior operators with deep domain experience, brings a rare combination of execution capability and strategic clarity. While competition from established incumbents remains a key hurdle, ${normalizedName}'s focus on capital efficiency and targeted customer acquisition provides a defensible 18-24 month window for market penetration and valuation appreciation.`,
    riskProfile: {
      financialRisk: { score: Math.floor(20 + Math.random() * 30), text: "Low (25%)" },
      marketRisk: { score: Math.floor(30 + Math.random() * 30), text: "Medium (45%)" },
      competitionRisk: { score: Math.floor(50 + Math.random() * 30), text: "High (75%)" },
      operationalRisk: { score: Math.floor(15 + Math.random() * 20), text: "Low (15%)" },
      scalabilityRisk: { score: Math.floor(40 + Math.random() * 40), text: "Moderate (35%)" }
    },
    metrics: {
      currentArr: `$${(1 + Math.random() * 4).toFixed(1)}M`,
      netRetention: `${Math.floor(105 + Math.random() * 25)}%`,
      salesCycle: `${Math.floor(6 + Math.random() * 10)}mo`,
      grossMargin: `${Math.floor(75 + Math.random() * 15)}%`
    },
    competitorBenchmarking: [
      { metric: "Model Latency", nexPointAi: "45ms", vertexFlow: "112ms", cogniScale: "88ms", autoCompute: "140ms" },
      { metric: "Data Sovereignty", nexPointAi: "Full", vertexFlow: "Partial", cogniScale: "None", autoCompute: "Partial" },
      { metric: "Setup Complexity", nexPointAi: "Low (Plug-in)", vertexFlow: "High", cogniScale: "Medium", autoCompute: "Medium" },
      { metric: "Est. CAC", nexPointAi: "$12k", vertexFlow: "$18k", cogniScale: "$15k", autoCompute: "$22k" }
    ],
    strengths: [
      "Proprietary technology stack with proven latency advantages",
      "Highly efficient customer acquisition cost compared to sector average",
      "Founders have previously exited software startups in adjacent sectors"
    ],
    weaknesses: [
      "Limited direct enterprise sales force, heavily reliant on founder-led sales",
      "High concentration of revenue in top three pilot accounts",
      "Integration cycles are longer than ideal for high-velocity growth"
    ],
    opportunities: [
      "Untapped expansion opportunities in European and Asia-Pacific markets",
      "White-label licensing partnerships with tier-1 global integrators",
      "New data compliance regulations create natural tailwinds for sovereign data model"
    ],
    threats: [
      "Rapidly evolving open-source alternatives threatening pricing margins",
      "Azure/AWS native feature updates could overlap with core utility",
      "Potential shifts in regulatory scrutiny regarding private database training"
    ],
    opinions: {
      vcPartner: {
        name: "Marcus Thorne",
        role: "Managing Partner, Nexus Ventures",
        comment: "Excellent core technology with a very high ceiling. If they can solve their early distribution bottlenecks, this is a clear category leader."
      },
      angelInvestor: {
        name: "Elena Rodriguez",
        role: "Principal, Athena Angels",
        comment: "Phenomenal founder-market fit. The technical demo is spectacular, and early pilot conversion metrics are highly encouraging."
      },
      growthInvestor: {
        name: "David Chen",
        role: "Director of Analysis, Ironclad Capital",
        comment: "Scalability is proven by current ARR trajectory. Their net retention numbers suggest exceptional customer satisfaction and land-and-expand potential."
      },
      conservativeInvestor: {
        name: "Arthur Pendelton",
        role: "General Partner, Sentinel Allocators",
        comment: "Valuation looks slightly high given the competitive intensity. I would want to see a clear path to reducing pilot installation times before investing."
      }
    },
    usingFallback: true
  };
}

// API: Analyze startup details and documents via Gemini API
app.post("/api/analyze-startup", upload.single("file"), async (req, res) => {
  if (req.file) {
    const { name, industry, stage, description } = req.body;
    try {
      console.log(`Forwarding uploaded PDF to FastAPI: ${req.file.originalname}`);
      const formData = new FormData();
      const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
      formData.append("file", blob, req.file.originalname);
      if (name) formData.append("name", name);
      if (industry) formData.append("industry", industry);
      if (stage) formData.append("stage", stage);
      if (description) formData.append("description", description);

      const response = await fetch(`${BACKEND_URL}/full-analysis`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData?.detail || `FastAPI responded with status: ${response.status}`;
        return res.status(response.status).json({ error: errMsg });
      }

      const reportData = await response.json();
      res.json(reportData);
    } catch (error) {
      console.error("Error proxying to FastAPI:", error);
      res.status(500).json({ error: "Failed to analyze startup via FastAPI backend." });
    }
  } else {
    const { name, industry, stage, description, settings, documents } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Startup Name is required." });
  }

  const ai = getGeminiClient();

  if (!ai) {
    console.log("Gemini API key is not configured or placeholder. Using high-fidelity dynamic generator.");
    const fallbackReport = generateDynamicMockReport(name, industry, stage, description);
    return res.json(fallbackReport);
  }

  try {
    const prompt = `Perform an institutional-grade venture capital due diligence analysis on the following startup:
- Startup Name: ${name}
- Industry: ${industry}
- Funding Stage: ${stage}
- Value Proposition / Description: ${description}
- Documents Uploaded: ${documents?.join(", ") || "Pitch Deck PDF, Financial Statement PDF, Business Plan PDF"}
- Requested Focus Elements: ${JSON.stringify(settings || {})}

Return a comprehensive, formal VC due diligence report in JSON format. Ensure all strings are professional and use authoritative investment analyst terminology.
You MUST strictly match the following JSON Schema:
{
  "name": "The startup name",
  "industry": "The startup industry",
  "stage": "The funding stage",
  "description": "Short description",
  "overallScore": 78, // a number from 0 to 100 representing suitability
  "verdict": "INVEST" | "WATCHLIST" | "REJECT",
  "verdictReason": "One short sentence explaining why",
  "executiveSummary": "A robust 3-4 sentence VC executive summary focusing on semantic market alignment, technical moats, and operational consistency.",
  "riskProfile": {
    "financialRisk": { "score": 25, "text": "Low (25%)" },
    "marketRisk": { "score": 45, "text": "Medium (45%)" },
    "competitionRisk": { "score": 75, "text": "High (75%)" },
    "operationalRisk": { "score": 15, "text": "Low (15%)" },
    "scalabilityRisk": { "score": 35, "text": "Moderate (35%)" }
  },
  "metrics": {
    "currentArr": "$4.2M", // estimate or calculate based on description
    "netRetention": "118%",
    "salesCycle": "14mo",
    "grossMargin": "82%"
  },
  "competitorBenchmarking": [
    { "metric": "Model Latency", "nexPointAi": "45ms", "vertexFlow": "112ms", "cogniScale": "88ms", "autoCompute": "140ms" },
    { "metric": "Data Sovereignty", "nexPointAi": "Full", "vertexFlow": "Partial", "cogniScale": "None", "autoCompute": "Partial" },
    { "metric": "Setup Complexity", "nexPointAi": "Low (Plug-in)", "vertexFlow": "High", "cogniScale": "Medium", "autoCompute": "Medium" },
    { "metric": "Est. CAC", "nexPointAi": "$12k", "vertexFlow": "$18k", "cogniScale": "$15k", "autoCompute": "$22k" }
  ],
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Weakness 1", "Weakness 2", "Weakness 3"],
  "opportunities": ["Opportunity 1", "Opportunity 2", "Opportunity 3"],
  "threats": ["Threat 1", "Threat 2", "Threat 3"],
  "opinions": {
    "vcPartner": { "name": "Marcus Thorne", "role": "Managing Partner, Nexus Ventures", "comment": "commentary" },
    "angelInvestor": { "name": "Elena Rodriguez", "role": "Principal, Athena Angels", "comment": "commentary" },
    "growthInvestor": { "name": "David Chen", "role": "Director of Analysis, Ironclad Capital", "comment": "commentary" },
    "conservativeInvestor": { "name": "Arthur Pendelton", "role": "General Partner, Sentinel Allocators", "comment": "commentary" }
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            industry: { type: Type.STRING },
            stage: { type: Type.STRING },
            description: { type: Type.STRING },
            overallScore: { type: Type.INTEGER },
            verdict: { type: Type.STRING },
            verdictReason: { type: Type.STRING },
            executiveSummary: { type: Type.STRING },
            riskProfile: {
              type: Type.OBJECT,
              properties: {
                financialRisk: {
                  type: Type.OBJECT,
                  properties: { score: { type: Type.INTEGER }, text: { type: Type.STRING } },
                },
                marketRisk: {
                  type: Type.OBJECT,
                  properties: { score: { type: Type.INTEGER }, text: { type: Type.STRING } },
                },
                competitionRisk: {
                  type: Type.OBJECT,
                  properties: { score: { type: Type.INTEGER }, text: { type: Type.STRING } },
                },
                operationalRisk: {
                  type: Type.OBJECT,
                  properties: { score: { type: Type.INTEGER }, text: { type: Type.STRING } },
                },
                scalabilityRisk: {
                  type: Type.OBJECT,
                  properties: { score: { type: Type.INTEGER }, text: { type: Type.STRING } },
                },
              },
            },
            metrics: {
              type: Type.OBJECT,
              properties: {
                currentArr: { type: Type.STRING },
                netRetention: { type: Type.STRING },
                salesCycle: { type: Type.STRING },
                grossMargin: { type: Type.STRING },
              },
            },
            competitorBenchmarking: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  metric: { type: Type.STRING },
                  nexPointAi: { type: Type.STRING },
                  vertexFlow: { type: Type.STRING },
                  cogniScale: { type: Type.STRING },
                  autoCompute: { type: Type.STRING },
                },
              },
            },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
            threats: { type: Type.ARRAY, items: { type: Type.STRING } },
            opinions: {
              type: Type.OBJECT,
              properties: {
                vcPartner: {
                  type: Type.OBJECT,
                  properties: { name: { type: Type.STRING }, role: { type: Type.STRING }, comment: { type: Type.STRING } },
                },
                angelInvestor: {
                  type: Type.OBJECT,
                  properties: { name: { type: Type.STRING }, role: { type: Type.STRING }, comment: { type: Type.STRING } },
                },
                growthInvestor: {
                  type: Type.OBJECT,
                  properties: { name: { type: Type.STRING }, role: { type: Type.STRING }, comment: { type: Type.STRING } },
                },
                conservativeInvestor: {
                  type: Type.OBJECT,
                  properties: { name: { type: Type.STRING }, role: { type: Type.STRING }, comment: { type: Type.STRING } },
                },
              },
            },
          },
          required: [
            "name",
            "industry",
            "stage",
            "description",
            "overallScore",
            "verdict",
            "verdictReason",
            "executiveSummary",
            "riskProfile",
            "metrics",
            "competitorBenchmarking",
            "strengths",
            "weaknesses",
            "opportunities",
            "threats",
            "opinions",
          ],
        },
      },
    });

    const reportText = response.text;
    if (!reportText) {
      throw new Error("No response from Gemini API");
    }

    const report = JSON.parse(reportText.trim());
    report.usingFallback = false;
    res.json(report);
  } catch (error: any) {
    console.error("Gemini analysis error:", error);
    // Fall back gracefully to make sure user gets a superb interactive experience
    const fallbackReport = generateDynamicMockReport(name, industry, stage, description);
    fallbackReport.usingFallback = true;
    res.json(fallbackReport);
  }
}
});

// Proxy list analyses to FastAPI database
app.get("/api/analyses", async (req, res) => {
  try {
    const response = await fetch(`${BACKEND_URL}/analyses`);
    if (!response.ok) {
      throw new Error(`FastAPI analyses list error: ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching analyses list from FastAPI:", error);
    res.status(500).json({ error: "Failed to fetch analyses list from database." });
  }
});

// Proxy download-report to FastAPI
app.get("/api/download-report/:filename", async (req, res) => {
  const { filename } = req.params;
  try {
    console.log(`Streaming PDF report from FastAPI: ${filename}`);
    const response = await fetch(`${BACKEND_URL}/download-report/${filename}`);
    if (!response.ok) {
      return res.status(response.status).json({ error: "Report not found on FastAPI backend." });
    }
    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    
    const reader = response.body?.getReader();
    if (!reader) {
      return res.status(500).json({ error: "Could not read report stream from backend." });
    }
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    res.end();
  } catch (error) {
    console.error("Error downloading report from FastAPI:", error);
    res.status(500).json({ error: "Failed to download report." });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[DueIntel Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
