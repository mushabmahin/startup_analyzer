from fastapi import APIRouter, UploadFile, File
import fitz

from app.services.due_diligence import analyze_startup

router = APIRouter(
    tags=["Startup Analysis"]
)


@router.post("/analyze")
async def analyze(file: UploadFile = File(...)):

    contents = await file.read()

    pdf = fitz.open(
        stream=contents,
        filetype="pdf"
    )

    extracted_text = ""

    for page in pdf:
        extracted_text += page.get_text()

    result = analyze_startup(extracted_text)

    return result