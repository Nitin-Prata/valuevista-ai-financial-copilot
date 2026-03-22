from fastapi import APIRouter

from app.services.insight_engine import load_transactions


router = APIRouter(tags=["transactions"])


@router.get("/transactions")
def get_transactions() -> dict:
    transactions = load_transactions()
    return {"count": len(transactions), "transactions": transactions}