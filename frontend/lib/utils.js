export function formatCurrency(amount, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export function categoryIcon(category) {
  const map = {
    food: "🍜",
    rent: "🏠",
    transport: "🚌",
    entertainment: "🎬",
    health: "💊",
    utilities: "💡",
    shopping: "🛍️",
    travel: "✈️",
  };
  return map[category] || "💸";
}

export function toMonthLabel(date) {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function toMonthKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${date.getFullYear()}-${month}`;
}

export function buildCalendarMatrix(displayDate) {
  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const startDate = new Date(year, month, 1 - startWeekday);

  return Array.from({ length: 6 }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + week * 7 + day);
      return {
        date: d,
        key: d.toISOString().slice(0, 10),
        inMonth: d.getMonth() === month,
      };
    })
  );
}
