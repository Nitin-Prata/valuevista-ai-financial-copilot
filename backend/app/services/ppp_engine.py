import json
from functools import lru_cache
from pathlib import Path
from typing import Any, Dict

from app.services.decision_engine import classify_price


DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "ppp_data.json"


@lru_cache(maxsize=1)
def load_ppp_data() -> Dict[str, Any]:
    with DATA_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


def _get_country(data: Dict[str, Any], country_name: str) -> Dict[str, Any]:
    countries = data.get("countries", {})
    if country_name not in countries:
        raise ValueError(f"Unsupported country: {country_name}")
    return countries[country_name]


def _safe_category(category: str) -> str:
    return category if category in {"food", "rent", "transport", "general"} else "general"


def analyze_price(
    price: float,
    country: str,
    home_country: str = "India",
    category: str = "general",
) -> Dict[str, Any]:
    if price <= 0:
        raise ValueError("Price must be greater than zero.")

    data = load_ppp_data()
    local = _get_country(data, country)
    home = _get_country(data, home_country)
    safe_category = _safe_category(category)

    local_usd_per_unit = float(local["usd_per_unit"])
    home_usd_per_unit = float(home["usd_per_unit"])

    # Standard currency conversion from local country to home country.
    price_in_usd = price * local_usd_per_unit
    nominal_home_value = price_in_usd / home_usd_per_unit

    local_index = float(local["cost_index"][safe_category])
    home_index = float(home["cost_index"][safe_category])

    # PPP adjustment: how expensive the same basket feels across countries.
    ppp_factor = local_index / home_index
    equivalent_home_value = nominal_home_value * ppp_factor
    ratio = equivalent_home_value / nominal_home_value if nominal_home_value else 1.0

    decision = classify_price(ratio)

    return {
        "input": {
            "price": round(price, 2),
            "country": country,
            "home_country": home_country,
            "category": safe_category,
        },
        "converted_value": {
            "amount": round(nominal_home_value, 2),
            "currency": home["currency"],
        },
        "equivalent_value": {
            "amount": round(equivalent_home_value, 2),
            "currency": home["currency"],
            "ppp_factor": round(ppp_factor, 3),
        },
        "verdict": decision.verdict,
        "worth_it": decision.worth_it,
        "explanation": (
            f"{decision.explanation} In {country}, {safe_category} costs are indexed at {int(local_index)} "
            f"vs {int(home_index)} in {home_country}."
        ),
    }
