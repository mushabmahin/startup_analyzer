from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def generate_summary(text):

    prompt = f"""
You are a Venture Capital Due Diligence Analyst.

Analyze the startup document provided below.

IMPORTANT:
- Use only information found in the document.
- Do not invent details.
- If information is missing, explicitly say "Not Mentioned".

Return your response in this format:

## Executive Summary

### Problem
...

### Solution
...

### Target Market
...

### Revenue Model
...

### Key Strengths
...

### Key Risks
...

### Investment Readiness
Low / Medium / High

Document:
{text[:8000]}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content