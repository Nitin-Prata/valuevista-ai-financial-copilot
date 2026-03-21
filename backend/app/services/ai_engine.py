from collections import defaultdict
from datetime import datetime
import json
from typing import Any, Dict, List

from app.services.ai_client import GeminiClient
from app.services.insight_engine import calculate_spending_insights, load_transactions


ai_client = GeminiClient()


def _filter_by_date(transactions: List[Dict[str, Any]], target_date: str) -> List[Dict[str, Any]]:
    return [tx for tx in transactions if tx["date"] == target_date]


def _filter_by_month(transactions: List[Dict[str, Any]], month: str) -> List[Dict[str, Any]]:
    return [tx for tx in transactions if tx["date"].startswith(month)]


def _fallback_copilot(query: str, insights: Dict[str, Any]) -> str:
    q = query.lower()
    if "top" in q and "category" in q:
        return f"Your top spending category is {insights.get('top_category', 'unknown')} this period."
    if "save" in q:
        return "You can save more by reducing high-frequency non-essential purchases and planning weekly budgets."
    return "I can help with spending trends, top categories, date analysis, and monthly summaries."


def generate_copilot_response(query: str, context: Dict[str, Any] | None = None) -> Dict[str, Any]:
    transactions = load_transactions()
    insights = calculate_spending_insights(transactions)
    provided_context = context or {}
    context = {
        "top_category": insights.get("top_category"),
        "total_spent": insights.get("total_spent"),
        "insights": insights.get("insights", []),
        "tx_count": len(transactions),
        "provided_context": provided_context,
    }
    prompt = (
        "You are ValueVista Copilot, a concise finance assistant. "
        "Use this context only and do not invent unknown facts.\n"
        f"Context: {context}\n"
        f"User query: {query}\n"
        "Respond in 2-4 short sentences with practical advice and a clear next action."
    )
    ai_text = ai_client.generate_text(prompt)
    suggestions = [
        "Show top spending category",
        "How can I save more this month?",
        "Analyze this month in one minute",
    ]
    if provided_context.get("selected_date"):
        suggestions = [
            f"Analyze {provided_context['selected_date']} in detail",
            "Is this spending pattern risky?",
            "Give me one action for tomorrow",
        ]
    return {
        "query": query,
        "answer": ai_text or _fallback_copilot(query, insights),
        "suggestions": suggestions,
        "source": "gemini" if ai_text else "fallback",
    }


def generate_date_analysis(date: str) -> Dict[str, Any]:
    transactions = load_transactions()
    rows = _filter_by_date(transactions, date)
    total = round(sum(float(tx["amount"]) for tx in rows), 2)
    currency = rows[0]["currency"] if rows else "INR"
    prompt = (
        "You are a financial analyst. Analyze this single-day transaction activity.\n"
        f"Date: {date}\nTransactions: {rows}\n"
        "Provide: 1 risk/alert line, 1 summary line, 1 suggestion line."
    )
    ai_text = ai_client.generate_text(prompt)
    fallback = (
        "No transactions found for this date."
        if not rows
        else "This appears to be a focused spending day. Review necessity of major transactions."
    )
    return {
        "date": date,
        "currency": currency,
        "count": len(rows),
        "total": total,
        "transactions": rows,
        "analysis": ai_text or fallback,
        "source": "gemini" if ai_text else "fallback",
    }


def generate_monthly_summary(month: str) -> Dict[str, Any]:
    transactions = load_transactions()
    rows = _filter_by_month(transactions, month)
    totals = defaultdict(float)
    for tx in rows:
        totals[tx["category"]] += float(tx["amount"])
    total_spent = round(sum(totals.values()), 2)
    top_category = max(totals, key=totals.get) if totals else None

    prompt = (
        "You are a financial coach. Provide a monthly spending summary.\n"
        f"Month: {month}\n"
        f"Category totals: {dict(totals)}\n"
        f"Transaction count: {len(rows)}\n"
        "Output 3 concise bullets: trend, concern, action."
    )
    ai_text = ai_client.generate_text(prompt)
    fallback = (
        "No monthly data available."
        if not rows
        else f"Spending this month is {total_spent} INR, driven mostly by {top_category}. Focus on weekly caps."
    )
    return {
        "month": month,
        "total_spent": total_spent,
        "top_category": top_category,
        "category_totals": {k: round(v, 2) for k, v in totals.items()},
        "transaction_count": len(rows),
        "summary": ai_text or fallback,
        "source": "gemini" if ai_text else "fallback",
    }


def generate_monthly_overview(end_month: str, months: int = 6) -> Dict[str, Any]:
    transactions = load_transactions()
    end_year, end_m = [int(x) for x in end_month.split("-")]
    points: List[Dict[str, Any]] = []

    base_month_rows = _filter_by_month(transactions, end_month)
    base_total = sum(float(tx["amount"]) for tx in base_month_rows) or 3500
    base_categories = defaultdict(float)
    for tx in base_month_rows:
        base_categories[tx["category"]] += float(tx["amount"])

    for idx in range(months - 1, -1, -1):
        shifted = end_m - idx
        year_shift = end_year
        while shifted <= 0:
            shifted += 12
            year_shift -= 1
        month_key = f"{year_shift}-{str(shifted).zfill(2)}"
        factor = 1 + (idx * 0.08)
        spent = round(base_total * factor, 2)
        categories_sorted = sorted(base_categories.items(), key=lambda kv: kv[1], reverse=True)
        majors = ", ".join([name.title() for name, _ in categories_sorted[:3]]) or "Rent, Food, Utilities"
        points.append(
            {
                "month": month_key,
                "label": datetime(year_shift, shifted, 1).strftime("%B %Y"),
                "total_spent": spent,
                "major_categories": majors,
                "balance_end": round(15000 - spent * (months - idx) / months, 2),
            }
        )

    trend_pct = 0.0
    if len(points) > 1 and points[0]["total_spent"] > 0:
        trend_pct = round(((points[-1]["total_spent"] - points[0]["total_spent"]) / points[0]["total_spent"]) * 100, 1)

    alert_prompt = (
        "Write one concise spending alert sentence for this monthly series.\n"
        f"Series: {points}\n"
        "Make it practical and cautionary."
    )
    ai_alert = ai_client.generate_text(alert_prompt)
    fallback_alert = f"Spending trend changed by {trend_pct}% across the selected period. Monitor recurring categories."

    return {
        "end_month": end_month,
        "months": months,
        "trend_percent": trend_pct,
        "series": points,
        "alert": ai_alert or fallback_alert,
        "source": "gemini" if ai_alert else "fallback",
    }


def generate_wrapped_slides(year: int, slide_count: int = 13) -> Dict[str, Any]:
    transactions = load_transactions()
    rows = [tx for tx in transactions if datetime.fromisoformat(tx["date"]).year == year]
    insights = calculate_spending_insights(rows) if rows else calculate_spending_insights([])

    prompt = (
        "You are building a fintech 'Money Wrapped' deck.\n"
        f"Year: {year}\n"
        f"Insights: {insights}\n"
        f"Create exactly {slide_count} slides in strict JSON array format.\n"
        "Each item must include: title (short), body (1-3 lines), accent ('info'|'success'|'warning').\n"
        "No markdown. No extra keys. Keep copy energetic and data-grounded."
    )
    ai_text = ai_client.generate_text(prompt)

    if ai_text:
        try:
            raw = ai_text.strip()
            if "```" in raw:
                raw = raw.replace("```json", "").replace("```", "").strip()
            parsed = json.loads(raw)
            if isinstance(parsed, list):
                slides = []
                for index in range(slide_count):
                    item = parsed[index] if index < len(parsed) and isinstance(parsed[index], dict) else {}
                    slides.append(
                        {
                            "id": index + 1,
                            "title": str(item.get("title", f"Money Insight {index + 1}"))[:80],
                            "body": str(item.get("body", "Keep your goals visible and spend with intention."))[:320],
                            "accent": item.get("accent", "info"),
                        }
                    )
                return {"year": year, "count": slide_count, "slides": slides, "source": "gemini"}
        except Exception:
            pass

    fallback_slides = [
        {"id": 1, "title": "Welcome to Your Money Wrapped", "body": f"Your {year} spending story starts here.", "accent": "info"},
        {
            "id": 2,
            "title": "Top Category",
            "body": f"You spent the most on {insights.get('top_category', 'unknown')}.",
            "accent": "warning",
        },
        {"id": 3, "title": "Total Spent", "body": f"Total tracked spend: {insights.get('total_spent', 0)} INR.", "accent": "info"},
        {"id": 4, "title": "Weekend Pattern", "body": "Weekend spikes suggest leisure-heavy spending habits.", "accent": "warning"},
        {"id": 5, "title": "Daily Rhythm", "body": "Small daily spends are compounding faster than expected.", "accent": "info"},
        {"id": 6, "title": "Food Check", "body": "Food spend is meaningful. Planning meals can reduce leakage.", "accent": "warning"},
        {"id": 7, "title": "Transport Trend", "body": "Transport costs are manageable but worth optimizing.", "accent": "info"},
        {"id": 8, "title": "Largest Payment", "body": "Big-ticket spends dominate your monthly cash flow.", "accent": "warning"},
        {"id": 9, "title": "Consistency Score", "body": "You are consistent in tracking expenses. Great progress.", "accent": "success"},
        {"id": 10, "title": "Savings Potential", "body": "You can unlock more savings with weekly category caps.", "accent": "success"},
        {"id": 11, "title": "Banana Index Reality", "body": "PPP lens shows where each rupee creates more value.", "accent": "info"},
        {"id": 12, "title": "Money Personality", "body": "Confident spender with room for tighter control habits.", "accent": "info"},
        {"id": 13, "title": "Next Year Goal", "body": "Automate savings first, then spend from the remaining budget.", "accent": "success"},
    ]
    while len(fallback_slides) < slide_count:
        idx = len(fallback_slides) + 1
        fallback_slides.append({"id": idx, "title": f"Money Insight {idx}", "body": "Track, optimize, and grow.", "accent": "info"})
    return {"year": year, "count": slide_count, "slides": fallback_slides[:slide_count], "source": "fallback"}
