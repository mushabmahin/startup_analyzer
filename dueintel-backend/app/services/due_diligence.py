from groq import Groq
import os
import json
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def analyze_startup(text: str):

    prompt = f"""
You are a senior Venture Capital Due Diligence Analyst.

Analyze the startup document.

IMPORTANT RULES:

- Use ONLY information present in the document.
- Do NOT hallucinate.
- If information is missing return "Not Mentioned".
- Return ONLY valid JSON.
- Do NOT wrap JSON in markdown.
- CRITICAL: If the document is not a startup pitch deck, business plan, or financial statement, or does not contain startup-related information, you MUST return a JSON with a single key "error" set to "invalid_document".

VERY IMPORTANT:

For these fields return ONLY integers from 0 to 10:

market_score
financial_score
team_score
traction_score

If information is missing:
return 0

Never return:
"Not Mentioned"
"N/A"
"Unknown"

JSON Schema:

{{
    "startup_name": "",
    "problem": "",
    "solution": "",
    "target_market": "",
    "revenue_model": "",

    "key_strengths": [],
    "key_risks": [],

    "market_score": 0,
    "financial_score": 0,
    "team_score": 0,
    "traction_score": 0
}}

Document:

{text}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    result = response.choices[0].message.content

    # Remove markdown wrappers
    result = result.replace("```json", "")
    result = result.replace("```", "")
    result = result.strip()

    try:
        data = json.loads(result)

        if "error" in data or data.get("startup_name") in ["Not Mentioned", "N/A", "", None]:
            return {"error": "invalid_document"}

        # Force numeric scores
        score_fields = [
            "market_score",
            "financial_score",
            "team_score",
            "traction_score"
        ]

        for field in score_fields:
            try:
                data[field] = int(data.get(field, 0))
            except:
                data[field] = 0

        # Calculate overall score in Python
        overall_score = round(
            (
                data["market_score"]
                + data["financial_score"]
                + data["team_score"]
                + data["traction_score"]
            ) / 40 * 100
        )

        data["overall_score"] = overall_score

        # Risk Level
        if overall_score >= 81:
            risk_level = "LOW"
            recommendation = "INVEST"

        elif overall_score >= 61:
            risk_level = "MEDIUM"
            recommendation = "WATCHLIST"

        elif overall_score >= 41:
            risk_level = "HIGH"
            recommendation = "HIGH_RISK"

        else:
            risk_level = "VERY HIGH"
            recommendation = "REJECT"

        data["risk_level"] = risk_level
        data["recommendation"] = recommendation

        return data

    except Exception as e:

        return {
            "error": "Failed to parse JSON",
            "exception": str(e),
            "raw_response": result
        }