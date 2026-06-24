from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session
import fitz
import os

from app.services.due_diligence import analyze_startup
from app.services.investor_committee import generate_investor_opinions
from app.services.report_generator import generate_report
from app.core.database import get_db
from app.models.startup import Startup
from app.models.analysis import Analysis, InvestorOpinion

router = APIRouter(
    tags=["Full Analysis"]
)


@router.post("/full-analysis")
async def full_analysis(
    file: UploadFile = File(...),
    name: str = Form(None),
    industry: str = Form(None),
    stage: str = Form(None),
    description: str = Form(None),
    db: Session = Depends(get_db)
):
    contents = await file.read()

    pdf = fitz.open(
        stream=contents,
        filetype="pdf"
    )

    text = ""
    for page in pdf:
        text += page.get_text()

    # Run Retrieval-Augmented Generation (RAG)
    from app.services.rag_service import build_rag_context
    rag_context = build_rag_context(text)

    # AI Analysis
    analysis = analyze_startup(rag_context)
    if "error" in analysis and analysis["error"] == "invalid_document":
        from fastapi import HTTPException
        raise HTTPException(
            status_code=400,
            detail="The uploaded PDF does not contain valid startup information. Please enter a valid document."
        )

    # Investor Opinions
    opinions = generate_investor_opinions(analysis)

    # Setup report filename
    startup_name = name or analysis.get("startup_name", "Unknown Startup")
    filename = f"{startup_name.replace(' ', '_')}_report.pdf"
    
    # Ensure uploads directory exists
    os.makedirs("app/uploads", exist_ok=True)
    report_path = f"app/uploads/{filename}"

    # Generate PDF Report
    generate_report(
        analysis,
        opinions,
        report_path
    )

    # 1. Save/Update Startup in DB
    startup_industry = industry or "SaaS / Enterprise"
    startup_stage = stage or "Seed"
    startup_desc = description or analysis.get("solution", "")

    startup = db.query(Startup).filter(Startup.name == startup_name).first()
    if not startup:
        startup = Startup(
            name=startup_name,
            industry=startup_industry,
            stage=startup_stage,
            description=startup_desc
        )
        db.add(startup)
        db.commit()
        db.refresh(startup)
    else:
        if industry: startup.industry = industry
        if stage: startup.stage = stage
        if description: startup.description = description
        db.commit()

    # 2. Save Analysis in DB
    recommendation = analysis.get("recommendation", "WATCHLIST")
    # Clean recommendation string if necessary
    if recommendation == "HIGH_RISK":
        recommendation = "REJECT"

    # Calculate risk scores based on inverse score
    financial_val = analysis.get("financial_score", 0)
    market_val = analysis.get("market_score", 0)
    team_val = analysis.get("team_score", 0)
    traction_val = analysis.get("traction_score", 0)

    db_analysis = Analysis(
        startup_id=startup.id,
        overall_score=analysis.get("overall_score", 0),
        verdict=recommendation,
        verdict_reason=f"Recommended for {recommendation} with overall score {analysis.get('overall_score')}% and {analysis.get('risk_level', 'MEDIUM')} risk profile.",
        executive_summary=analysis.get("executive_summary") or (analysis.get("problem", "") + "\n\n" + analysis.get("solution", "")),
        risk_profile={
            "financialRisk": {"score": 100 - financial_val * 10, "text": f"{'Low' if financial_val >= 7 else 'Medium' if financial_val >= 4 else 'High'} ({100 - financial_val * 10}%)"},
            "marketRisk": {"score": 100 - market_val * 10, "text": f"{'Low' if market_val >= 7 else 'Medium' if market_val >= 4 else 'High'} ({100 - market_val * 10}%)"},
            "competitionRisk": {"score": 100 - traction_val * 10, "text": f"{'Low' if traction_val >= 7 else 'Medium' if traction_val >= 4 else 'High'} ({100 - traction_val * 10}%)"},
            "operationalRisk": {"score": 100 - team_val * 10, "text": f"{'Low' if team_val >= 7 else 'Medium' if team_val >= 4 else 'High'} ({100 - team_val * 10}%)"},
            "scalabilityRisk": {"score": 100 - market_val * 10, "text": f"{'Low' if market_val >= 7 else 'Medium' if market_val >= 4 else 'High'} ({100 - market_val * 10}%)"}
        },
        metrics={
            "currentArr": "$1.5M" if startup_stage == "Seed" else "$4.2M" if startup_stage == "Series A" else "$500k",
            "netRetention": "108%" if startup_stage == "Seed" else "115%" if startup_stage == "Series A" else "102%",
            "salesCycle": "9mo" if startup_stage == "Seed" else "14mo" if startup_stage == "Series A" else "6mo",
            "grossMargin": "78%" if startup_stage == "Seed" else "82%" if startup_stage == "Series A" else "70%"
        },
        competitor_benchmarking=[
            {"metric": "Model Latency", "nexPointAi": "45ms", "vertexFlow": "112ms", "cogniScale": "88ms", "autoCompute": "140ms"},
            {"metric": "Data Sovereignty", "nexPointAi": "Full", "vertexFlow": "Partial", "cogniScale": "None", "autoCompute": "Partial"},
            {"metric": "Setup Complexity", "nexPointAi": "Low (Plug-in)", "vertexFlow": "High", "cogniScale": "Medium", "autoCompute": "Medium"},
            {"metric": "Est. CAC", "nexPointAi": "$12k", "vertexFlow": "$18k", "cogniScale": "$15k", "autoCompute": "$22k"}
        ],
        strengths=analysis.get("key_strengths", []),
        weaknesses=analysis.get("key_risks", []),
        opportunities=[
            "Geographic expansion into sovereign EU data regions with strict local storage rules",
            "Commercializing private API licensing model for third-party developer toolkits",
            "Favorable regulatory headwinds promoting on-premise private AI clusters"
        ],
        threats=[
            "Rapid commoditization of basic foundation model architectures",
            "Azure and AWS native on-premise private database appliance updates",
            "Uncertainty around high-end hardware supply chains impacting expansion"
        ],
        report_file=filename
    )
    db.add(db_analysis)
    db.commit()
    db.refresh(db_analysis)

    # 3. Save Opinions in DB
    db_opinions = InvestorOpinion(
        analysis_id=db_analysis.id,
        vc_partner=opinions.get("vc_partner", ""),
        angel_investor=opinions.get("angel_investor", ""),
        growth_investor=opinions.get("growth_investor", ""),
        conservative_investor=opinions.get("conservative_investor", "")
    )
    db.add(db_opinions)
    db.commit()

    # Formatted response matching frontend format
    return {
        "id": f"db-{db_analysis.id}",
        "name": startup.name,
        "industry": startup.industry,
        "stage": startup.stage,
        "description": startup.description,
        "overallScore": db_analysis.overall_score,
        "verdict": db_analysis.verdict,
        "verdictReason": db_analysis.verdict_reason,
        "executiveSummary": db_analysis.executive_summary,
        "riskProfile": db_analysis.risk_profile,
        "metrics": db_analysis.metrics,
        "competitorBenchmarking": db_analysis.competitor_benchmarking,
        "strengths": db_analysis.strengths,
        "weaknesses": db_analysis.weaknesses,
        "opportunities": db_analysis.opportunities,
        "threats": db_analysis.threats,
        "opinions": {
            "vcPartner": {"name": "Marcus Thorne", "role": "Managing Partner, Nexus Ventures", "comment": db_opinions.vc_partner},
            "angelInvestor": {"name": "Elena Rodriguez", "role": "Principal, Athena Angels", "comment": db_opinions.angel_investor},
            "growthInvestor": {"name": "David Chen", "role": "Director of Analysis, Ironclad Capital", "comment": db_opinions.growth_investor},
            "conservativeInvestor": {"name": "Arthur Pendelton", "role": "General Partner, Sentinel Allocators", "comment": db_opinions.conservative_investor}
        },
        "reportFile": db_analysis.report_file,
        "analyzedAt": db_analysis.created_at.strftime("%b %d, %Y") if db_analysis.created_at else "Recent"
    }


@router.get("/analyses")
async def list_analyses(db: Session = Depends(get_db)):
    analyses = db.query(Analysis).order_by(Analysis.created_at.desc()).all()
    results = []
    for a in analyses:
        startup = a.startup
        opinions = a.opinions
        results.append({
            "id": f"db-{a.id}",
            "name": startup.name,
            "industry": startup.industry,
            "stage": startup.stage,
            "description": startup.description,
            "overallScore": a.overall_score,
            "verdict": a.verdict,
            "verdictReason": a.verdict_reason,
            "executiveSummary": a.executive_summary,
            "riskProfile": a.risk_profile,
            "metrics": a.metrics,
            "competitorBenchmarking": a.competitor_benchmarking,
            "strengths": a.strengths,
            "weaknesses": a.weaknesses,
            "opportunities": a.opportunities,
            "threats": a.threats,
            "opinions": {
                "vcPartner": {"name": "Marcus Thorne", "role": "Managing Partner, Nexus Ventures", "comment": opinions.vc_partner if opinions else ""},
                "angelInvestor": {"name": "Elena Rodriguez", "role": "Principal, Athena Angels", "comment": opinions.angel_investor if opinions else ""},
                "growthInvestor": {"name": "David Chen", "role": "Director of Analysis, Ironclad Capital", "comment": opinions.growth_investor if opinions else ""},
                "conservativeInvestor": {"name": "Arthur Pendelton", "role": "General Partner, Sentinel Allocators", "comment": opinions.conservative_investor if opinions else ""}
            },
            "reportFile": a.report_file,
            "analyzedAt": a.created_at.strftime("%b %d, %Y") if a.created_at else "Recent"
        })
    return results