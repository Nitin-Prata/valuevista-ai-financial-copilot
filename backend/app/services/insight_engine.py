from collections import defaultdict
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List

from app.utils.helpers import load_json_file


TX_DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "sample_transactions.json"


def load_transactions() -> List[Dict[str, Any]]:
    rows = load_json_file(TX_DATA_PATH)
    return sorted(rows, key=lambda x: x["date"])


def calculate_spending_insights(transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not transactions:
        return {
            "total_spent": 0.0,
            "currency": "INR",
            "category_breakdown": {},
            "top_category": None,
            "insights": ["No transactions yet. Add spending data to unlock insights."],
            "money_wrapped": {},
        }

    totals = defaultdict(float)
    currency = transactions[0]["currency"]
    total_spent = 0.0

    for tx in transactions:
        amount = float(tx["amount"])
        totals[tx["category"]] += amount
        total_spent += amount

    category_breakdown = {
        category: {
            "amount": round(amount, 2),
            "percentage": round((amount / total_spent) * 100, 1) if total_spent else 0.0,
        }
        for category, amount in sorted(totals.items(), key=lambda item: item[1], reverse=True)
    }

    top_category = max(totals, key=totals.get)
    average_spend = total_spent / len(transactions)
    food_share = category_breakdown.get("food", {}).get("percentage", 0.0)
    transport_share = category_breakdown.get("transport", {}).get("percentage", 0.0)

    generated_insights = [
        f"You spent {round(total_spent, 2)} {currency} across {len(transactions)} transactions this period.",
        f"Your highest spending category is {top_category}, taking {category_breakdown[top_category]['percentage']}% of your budget.",
    ]

    if food_share >= 18:
        generated_insights.append("You are spending more on food than a balanced budget target. Meal planning may help.")
    if transport_share >= 10:
        generated_insights.append("Transport costs are rising. Consider route bundling or monthly travel passes.")
    if average_spend > 2500:
        generated_insights.append("Your average transaction size is high. Track non-essential spends to improve savings.")

    by_day = defaultdict(float)
    for tx in transactions:
        day_key = datetime.fromisoformat(tx["date"]).strftime("%a")
        by_day[day_key] += float(tx["amount"])

    highest_day = max(by_day, key=by_day.get)
    estimated_savings = round(total_spent * 0.08, 2)

    money_wrapped = {
        "top_spending_category": top_category,
        "highest_spending_day": highest_day,
        "largest_transaction": max(transactions, key=lambda tx: float(tx["amount"])),
        "estimated_monthly_savings_if_optimized": {
            "amount": estimated_savings,
            "currency": currency,
        },
    }

    return {
        "total_spent": round(total_spent, 2),
        "currency": currency,
        "category_breakdown": category_breakdown,
        "top_category": top_category,
        "insights": generated_insights,
        "money_wrapped": money_wrapped,
    }
