from fastapi import APIRouter

from app.services.insight_engine import calculate_spending_insights, load_transactions


router = APIRouter(tags=["insights"])


@router.get("/insights")
def get_insights() -> dict:
    transactions = load_transactions()
    analysis = calculate_spending_insights(transactions)
    return analysis
