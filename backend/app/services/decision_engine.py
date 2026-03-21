from dataclasses import dataclass


@dataclass(frozen=True)
class DecisionResult:
    verdict: str
    worth_it: str
    explanation: str


def classify_price(value_ratio: float) -> DecisionResult:
    """
    value_ratio:
      PPP equivalent value / nominal converted value
    """
    if value_ratio < 0.85:
        return DecisionResult(
            verdict="cheap",
            worth_it="Yes - this looks like a good value for money.",
            explanation="This price is cheaper than expected for local purchasing power.",
        )

    if value_ratio <= 1.15:
        return DecisionResult(
            verdict="normal",
            worth_it="Maybe - price is fair, compare quality before buying.",
            explanation="This price is close to what we expect after purchasing power adjustment.",
        )

    return DecisionResult(
        verdict="expensive",
        worth_it="Probably not - consider alternatives or wait for better pricing.",
        explanation="This price is high compared to local purchasing power.",
    )
