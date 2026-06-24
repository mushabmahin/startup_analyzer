from fastapi import APIRouter, UploadFile, File
from app.services.llm_service import generate_summary
import fitz

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    
    contents = await file.read()

    pdf = fitz.open(stream=contents, filetype="pdf")

    extracted_text = ""

    for page in pdf:
        extracted_text += page.get_text()
    summary = generate_summary(extracted_text)

    return {
        "filename": file.filename,
        "summary": summary
    }