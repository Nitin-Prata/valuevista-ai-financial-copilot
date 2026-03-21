from typing import Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.ppp_engine import analyze_price


router = APIRouter(tags=["analyze"])


class AnalyzeRequest(BaseModel):
    price: float = Field(..., gt=0, description="Price in local country currency")
    country: str = Field(..., min_length=2, description="Country of the input price")
    home_country: str = Field(default="India", min_length=2)
    category: Literal["food", "rent", "transport", "general"] = "general"


@router.post("/analyze")
def analyze(request: AnalyzeRequest) -> dict:
    try:
        return analyze_price(
            price=request.price,
            country=request.country,
            home_country=request.home_country,
            category=request.category,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
