from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse
import fitz
import os

from app.services.due_diligence import analyze_startup
from app.services.investor_committee import generate_investor_opinions
from app.services.report_generator import generate_report

router = APIRouter(
    tags=["Reports"]
)


@router.post("/generate-report")
async def generate_pdf_report(
    file: UploadFile = File(...)
):

    contents = await file.read()

    pdf = fitz.open(
        stream=contents,
        filetype="pdf"
    )

    extracted_text = ""

    for page in pdf:
        extracted_text += page.get_text()

    # Startup Analysis
    analysis = analyze_startup(
        extracted_text
    )

    # Investor Committee
    opinions = generate_investor_opinions(
        analysis
    )

    # Create uploads folder if missing
    os.makedirs(
        "app/uploads",
        exist_ok=True
    )

    startup_name = analysis.get(
        "startup_name",
        "startup"
    )

    filename = (
        f"{startup_name}_report.pdf"
    )

    report_path = (
        f"app/uploads/{filename}"
    )

    # Generate PDF
    generate_report(
        analysis,
        opinions,
        report_path
    )

    return {
        "message": "Report Generated Successfully",
        "startup_name": startup_name,
        "report_file": filename,
        "report_path": report_path
    }


@router.get("/download-report/{filename}")
async def download_report(
    filename: str
):

    file_path = (
        f"app/uploads/{filename}"
    )

    if not os.path.exists(
        file_path
    ):
        return {
            "error": "Report not found"
        }

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=filename
    )


@router.get("/list-reports")
async def list_reports():

    upload_dir = "app/uploads"

    if not os.path.exists(
        upload_dir
    ):
        return {
            "reports": []
        }

    reports = []

    for file in os.listdir(
        upload_dir
    ):
        if file.endswith(".pdf"):
            reports.append(file)

    return {
        "total_reports": len(reports),
        "reports": reports
    }