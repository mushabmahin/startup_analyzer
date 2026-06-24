from groq import Groq
import os
import json
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def generate_investor_opinions(startup_analysis):

    prompt = f"""
You are simulating an investment committee.

Startup Analysis:

{json.dumps(startup_analysis, indent=2)}

Generate opinions from:

1. VC Partner
2. Angel Investor
3. Growth Investor
4. Conservative Investor

Return ONLY valid JSON.

Schema:

{{
    "vc_partner":"",
    "angel_investor":"",
    "growth_investor":"",
    "conservative_investor":""
}}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.5
    )

    result = response.choices[0].message.content

    result = result.replace("```json", "")
    result = result.replace("```", "")
    result = result.strip()

    return json.loads(result)