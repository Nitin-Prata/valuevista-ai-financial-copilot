from datetime import datetime

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.services.ai_engine import (
    generate_copilot_response,
    generate_date_analysis,
    generate_monthly_overview,
    generate_monthly_summary,
    generate_wrapped_slides,
)


router = APIRouter(tags=["ai"])


class CopilotRequest(BaseModel):
    query: str = Field(..., min_length=2, max_length=500)
    context: dict = Field(default_factory=dict)


@router.post("/ai/copilot")
def copilot(request: CopilotRequest) -> dict:
    return generate_copilot_response(request.query, request.context)


@router.get("/ai/date-analysis")
def date_analysis(date: str) -> dict:
    return generate_date_analysis(date)


@router.get("/ai/monthly-summary")
def monthly_summary(month: str) -> dict:
    return generate_monthly_summary(month)


@router.get("/ai/monthly-overview")
def monthly_overview(month: str, months: int = 6) -> dict:
    safe_months = max(3, min(12, months))
    return generate_monthly_overview(end_month=month, months=safe_months)


@router.get("/ai/wrapped-slides")
def wrapped_slides(year: int = datetime.now().year, count: int = 13) -> dict:
    safe_count = max(3, min(20, count))
    return generate_wrapped_slides(year=year, slide_count=safe_count)
