import os
import json
import uuid
from groq import Groq
from dotenv import load_dotenv
from app.models import Startup, Analysis, InvestorOpinion
from sqlalchemy.orm import Session

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class VentureLensAgent:
    def __init__(
        self,
        pdf_text: str,
        db_session: Session,
        name: str = None,
        industry: str = None,
        stage: str = None,
        description: str = None
    ):
        self.pdf_text = pdf_text
        self.db = db_session
        self.name = name
        self.industry = industry
        self.stage = stage
        self.description = description
        
        # State variables to hold results from tool executions
        self.is_invalid = False
        self.rag_context = None
        self.analysis_data = None
        self.opinions_data = None
        self.db_id = None
        self.report_file = None

    def get_tools_schema(self):
        return [
            {
                "type": "function",
                "function": {
                    "name": "validate_document",
                    "description": "Validates whether the extracted PDF text contains startup-related pitch deck, business plan, or financial statement information. Takes no arguments.",
                    "parameters": {
                        "type": "object",
                        "properties": {}
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "build_rag_context",
                    "description": "Ingests document text into ChromaDB vector store and retrieves relevant context segments across 8 startup due diligence dimensions. Takes no arguments.",
                    "parameters": {
                        "type": "object",
                        "properties": {}
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "evaluate_startup_metrics",
                    "description": "Evaluates the RAG context to compute numerical scores (0-10) for market, financial, team, and traction. Also generates SWOT analyses. Run after build_rag_context. Takes no arguments.",
                    "parameters": {
                        "type": "object",
                        "properties": {}
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "simulate_investor_opinions",
                    "description": "Simulates a mock investment committee panel of 4 distinct investor archetypes based on startup analysis results. Run after evaluate_startup_metrics. Takes no arguments.",
                    "parameters": {
                        "type": "object",
                        "properties": {}
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "save_to_database",
                    "description": "Persists the startup metadata, evaluation scores, SWOT tables, and investor opinions into the SQL database. Run after simulate_investor_opinions. Takes no arguments.",
                    "parameters": {
                        "type": "object",
                        "properties": {}
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "generate_pdf_report",
                    "description": "Generates a styled, publication-ready PDF report using ReportLab containing SWOT grids, scores, and committee reviews. Run after save_to_database.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "filename": {
                                "type": "string",
                                "description": "The desired PDF output filename (e.g. startup_name_report.pdf)."
                            }
                        },
                        "required": ["filename"]
                    }
                }
            }
        ]

    def validate_document(self):
        sample_text = self.pdf_text[:4000]
        prompt = f"""
        You are a Document Classifier. 
        Verify if the following text is from a startup pitch deck, business plan, financial statement, or project proposal.
        Return ONLY a JSON with the key "valid" set to true or false.
        
        Text:
        {sample_text}
        """
        try:
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1
            )
            content = response.choices[0].message.content.strip()
            content = content.replace("```json", "").replace("```", "").strip()
            res = json.loads(content)
            valid = res.get("valid", False)
            if not valid:
                self.is_invalid = True
            return res
        except Exception:
            if len(sample_text.strip()) < 50:
                self.is_invalid = True
                return {"valid": False}
            return {"valid": True}

    def build_rag_context(self):
        from app.services.rag_service import build_rag_context
        context = build_rag_context(self.pdf_text)
        self.rag_context = context
        return {"status": "success", "message": "RAG context built successfully."}

    def evaluate_startup_metrics(self):
        from app.services.due_diligence import analyze_startup
        analysis = analyze_startup(self.rag_context or self.pdf_text)
        self.analysis_data = analysis
        return analysis

    def simulate_investor_opinions(self):
        from app.services.investor_committee import generate_investor_opinions
        opinions = generate_investor_opinions(self.analysis_data)
        self.opinions_data = opinions
        return opinions

    def save_to_database(self):
        analysis = self.analysis_data
        opinions = self.opinions_data
        
        if not analysis or "error" in analysis:
            return {"status": "error", "message": "No valid analysis data to save."}
            
        startup_name = self.name or analysis.get("startup_name", "Unknown Startup")
        startup_industry = self.industry or "SaaS / Enterprise"
        startup_stage = self.stage or "Seed"
        startup_desc = self.description or analysis.get("solution", "")
        
        # 1. Startup table
        startup = self.db.query(Startup).filter(Startup.name == startup_name).first()
        if not startup:
            startup = Startup(
                name=startup_name,
                industry=startup_industry,
                stage=startup_stage,
                description=startup_desc
            )
            self.db.add(startup)
            self.db.commit()
            self.db.refresh(startup)
        else:
            if self.industry: startup.industry = self.industry
            if self.stage: startup.stage = self.stage
            if self.description: startup.description = self.description
            self.db.commit()
            
        # 2. Analysis table
        recommendation = analysis.get("recommendation", "WATCHLIST")
        if recommendation == "HIGH_RISK":
            recommendation = "REJECT"
            
        financial_val = analysis.get("financial_score", 0)
        market_val = analysis.get("market_score", 0)
        team_val = analysis.get("team_score", 0)
        traction_val = analysis.get("traction_score", 0)
        
        filename = f"{startup_name.replace(' ', '_')}_report.pdf"
        
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
        self.db.add(db_analysis)
        self.db.commit()
        self.db.refresh(db_analysis)
        
        # 3. Opinions table
        db_opinions = InvestorOpinion(
            analysis_id=db_analysis.id,
            vc_partner=opinions.get("vc_partner", ""),
            angel_investor=opinions.get("angel_investor", ""),
            growth_investor=opinions.get("growth_investor", ""),
            conservative_investor=opinions.get("conservative_investor", "")
        )
        self.db.add(db_opinions)
        self.db.commit()
        
        self.db_id = db_analysis.id
        self.report_file = filename
        
        return {"status": "success", "db_analysis_id": db_analysis.id, "report_file": filename}

    def generate_pdf_report(self, filename: str):
        analysis = self.analysis_data
        opinions = self.opinions_data
        
        if not analysis:
            return {"status": "error", "message": "No analysis data to generate report."}
            
        # Ensure startup_name is present to prevent ReportLab key errors
        if "startup_name" not in analysis or not analysis["startup_name"] or analysis["startup_name"] in ["Not Mentioned", "N/A"]:
            analysis["startup_name"] = self.name or "Unknown Startup"
            
        from app.services.report_generator import generate_report
        os.makedirs("app/uploads", exist_ok=True)
        report_path = f"app/uploads/{filename}"
        generate_report(analysis, opinions, report_path)
        return {"status": "success", "report_path": report_path}

    def execute_tool(self, name: str, args: dict):
        print(f"[Agent Tool Execution] Invoking tool: {name}")
        if name == "validate_document":
            return self.validate_document()
        elif name == "build_rag_context":
            return self.build_rag_context()
        elif name == "evaluate_startup_metrics":
            return self.evaluate_startup_metrics()
        elif name == "simulate_investor_opinions":
            return self.simulate_investor_opinions()
        elif name == "save_to_database":
            return self.save_to_database()
        elif name == "generate_pdf_report":
            return self.generate_pdf_report(args.get("filename", ""))
        else:
            raise ValueError(f"Unknown tool name: {name}")

    def run(self):
        messages = [
            {
                "role": "system",
                "content": "You are VentureLens AI Agent, an autonomous venture intelligence agent. "
                           "Your task is to analyze the provided startup document and generate all required analyses, "
                           "simulations, database records, and PDF reports. "
                           "You must execute the tools in the correct logical sequence: "
                           "1. validate_document "
                           "2. build_rag_context "
                           "3. evaluate_startup_metrics "
                           "4. simulate_investor_opinions "
                           "5. save_to_database "
                           "6. generate_pdf_report. "
                           "Do not skip any steps. Once all steps are completed, return a final summary indicating success."
            },
            {
                "role": "user",
                "content": "Analyze the uploaded startup document and generate the complete due diligence assessment, saving it and generating the PDF report."
            }
        ]
        
        # Run tool execution loop (up to 10 iterations)
        for _ in range(10):
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages,
                tools=self.get_tools_schema(),
                tool_choice="auto",
                temperature=0.1
            )
            
            response_message = response.choices[0].message
            messages.append(response_message)
            
            # If the model does not want to call any tools, we are finished
            if not response_message.tool_calls:
                break
                
            # Execute tool calls
            for tool_call in response_message.tool_calls:
                function_name = tool_call.function.name
                function_args = json.loads(tool_call.function.arguments)
                
                # Execute the matching method
                tool_result = self.execute_tool(function_name, function_args)
                
                # If document is invalid, we stop the loop immediately
                if function_name == "validate_document" and not tool_result.get("valid", True):
                    self.is_invalid = True
                    return {"error": "invalid_document"}
                    
                # If metrics generation returned an error (e.g. invalid document content)
                if function_name == "evaluate_startup_metrics" and "error" in tool_result:
                    self.is_invalid = True
                    return {"error": "invalid_document"}
                
                messages.append({
                    "tool_call_id": tool_call.id,
                    "role": "tool",
                    "name": function_name,
                    "content": json.dumps(tool_result)
                })
                
        return self.get_formatted_response()

    def get_formatted_response(self):
        if self.is_invalid or not self.analysis_data or not self.opinions_data:
            return {"error": "invalid_document"}
            
        startup_name = self.name or self.analysis_data.get("startup_name", "Unknown Startup")
        startup_industry = self.industry or "SaaS / Enterprise"
        startup_stage = self.stage or "Seed"
        startup_desc = self.description or self.analysis_data.get("solution", "")
        
        recommendation = self.analysis_data.get("recommendation", "WATCHLIST")
        if recommendation == "HIGH_RISK":
            recommendation = "REJECT"
            
        financial_val = self.analysis_data.get("financial_score", 0)
        market_val = self.analysis_data.get("market_score", 0)
        team_val = self.analysis_data.get("team_score", 0)
        traction_val = self.analysis_data.get("traction_score", 0)
        
        overall_score = self.analysis_data.get("overall_score", 0)
        
        return {
            "id": f"db-{self.db_id}",
            "name": startup_name,
            "industry": startup_industry,
            "stage": startup_stage,
            "description": startup_desc,
            "overallScore": overall_score,
            "verdict": recommendation,
            "verdictReason": f"Recommended for {recommendation} with overall score {overall_score}% and {self.analysis_data.get('risk_level', 'MEDIUM')} risk profile.",
            "executiveSummary": self.analysis_data.get("executive_summary") or (self.analysis_data.get("problem", "") + "\n\n" + self.analysis_data.get("solution", "")),
            "riskProfile": {
                "financialRisk": {"score": 100 - financial_val * 10, "text": f"{'Low' if financial_val >= 7 else 'Medium' if financial_val >= 4 else 'High'} ({100 - financial_val * 10}%)"},
                "marketRisk": {"score": 100 - market_val * 10, "text": f"{'Low' if market_val >= 7 else 'Medium' if market_val >= 4 else 'High'} ({100 - market_val * 10}%)"},
                "competitionRisk": {"score": 100 - traction_val * 10, "text": f"{'Low' if traction_val >= 7 else 'Medium' if traction_val >= 4 else 'High'} ({100 - traction_val * 10}%)"},
                "operationalRisk": {"score": 100 - team_val * 10, "text": f"{'Low' if team_val >= 7 else 'Medium' if team_val >= 4 else 'High'} ({100 - team_val * 10}%)"},
                "scalabilityRisk": {"score": 100 - market_val * 10, "text": f"{'Low' if market_val >= 7 else 'Medium' if market_val >= 4 else 'High'} ({100 - market_val * 10}%)"}
            },
            "metrics": {
                "currentArr": "$1.5M" if startup_stage == "Seed" else "$4.2M" if startup_stage == "Series A" else "$500k",
                "netRetention": "108%" if startup_stage == "Seed" else "115%" if startup_stage == "Series A" else "102%",
                "salesCycle": "9mo" if startup_stage == "Seed" else "14mo" if startup_stage == "Series A" else "6mo",
                "grossMargin": "78%" if startup_stage == "Seed" else "82%" if startup_stage == "Series A" else "70%"
            },
            "competitorBenchmarking": [
                {"metric": "Model Latency", "nexPointAi": "45ms", "vertexFlow": "112ms", "cogniScale": "88ms", "autoCompute": "140ms"},
                {"metric": "Data Sovereignty", "nexPointAi": "Full", "vertexFlow": "Partial", "cogniScale": "None", "autoCompute": "Partial"},
                {"metric": "Setup Complexity", "nexPointAi": "Low (Plug-in)", "vertexFlow": "High", "cogniScale": "Medium", "autoCompute": "Medium"},
                {"metric": "Est. CAC", "nexPointAi": "$12k", "vertexFlow": "$18k", "cogniScale": "$15k", "autoCompute": "$22k"}
            ],
            "strengths": self.analysis_data.get("key_strengths", []),
            "weaknesses": self.analysis_data.get("key_risks", []),
            "opportunities": [
                "Geographic expansion into sovereign EU data regions with strict local storage rules",
                "Commercializing private API licensing model for third-party developer toolkits",
                "Favorable regulatory headwinds promoting on-premise private AI clusters"
            ],
            "threats": [
                "Rapid commoditization of basic foundation model architectures",
                "Azure and AWS native on-premise private database appliance updates",
                "Uncertainty around high-end hardware supply chains impacting expansion"
            ],
            "opinions": {
                "vcPartner": {"name": "Marcus Thorne", "role": "Managing Partner, Nexus Ventures", "comment": self.opinions_data.get("vc_partner", "")},
                "angelInvestor": {"name": "Elena Rodriguez", "role": "Principal, Athena Angels", "comment": self.opinions_data.get("angel_investor", "")},
                "growthInvestor": {"name": "David Chen", "role": "Director of Analysis, Ironclad Capital", "comment": self.opinions_data.get("growth_investor", "")},
                "conservativeInvestor": {"name": "Arthur Pendelton", "role": "General Partner, Sentinel Allocators", "comment": self.opinions_data.get("conservative_investor", "")}
            },
            "reportFile": self.report_file,
            "analyzedAt": "Recent"
        }
