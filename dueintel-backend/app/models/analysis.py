from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startups.id", ondelete="CASCADE"), nullable=False)
    overall_score = Column(Integer)
    verdict = Column(String)
    verdict_reason = Column(Text)
    executive_summary = Column(Text)
    
    # Store SWOT and metrics as JSON objects for flexibility
    risk_profile = Column(JSON)
    metrics = Column(JSON)
    competitor_benchmarking = Column(JSON)
    strengths = Column(JSON)
    weaknesses = Column(JSON)
    opportunities = Column(JSON)
    threats = Column(JSON)
    report_file = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    startup = relationship("Startup", back_populates="analyses")
    opinions = relationship("InvestorOpinion", back_populates="analysis", uselist=False, cascade="all, delete-orphan")

class InvestorOpinion(Base):
    __tablename__ = "investor_opinions"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False, unique=True)
    vc_partner = Column(Text)
    angel_investor = Column(Text)
    growth_investor = Column(Text)
    conservative_investor = Column(Text)

    analysis = relationship("Analysis", back_populates="opinions")
