from fastapi import APIRouter, UploadFile, File
import fitz

from app.services.due_diligence import analyze_startup
from app.services.investor_committee import generate_investor_opinions

router = APIRouter(
    tags=["Investor Committee"]
)


@router.post("/investor-opinions")
async def investor_opinions(
    file: UploadFile = File(...)
):

    contents = await file.read()

    pdf = fitz.open(
        stream=contents,
        filetype="pdf"
    )

    text = ""

    for page in pdf:
        text += page.get_text()

    analysis = analyze_startup(text)

    opinions = generate_investor_opinions(
        analysis
    )

    return {
        "analysis": analysis,
        "investor_opinions": opinions
    }