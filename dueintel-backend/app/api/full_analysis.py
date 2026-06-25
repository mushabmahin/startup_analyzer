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

    # Initialize and execute the VentureLensAgent
    from app.services.agent_orchestrator import VentureLensAgent
    agent = VentureLensAgent(
        pdf_text=text,
        db_session=db,
        name=name,
        industry=industry,
        stage=stage,
        description=description
    )

    result = agent.run()

    if isinstance(result, dict) and result.get("error") == "invalid_document":
        from fastapi import HTTPException
        raise HTTPException(
            status_code=400,
            detail="The uploaded PDF does not contain valid startup information. Please enter a valid document."
        )

    return result


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