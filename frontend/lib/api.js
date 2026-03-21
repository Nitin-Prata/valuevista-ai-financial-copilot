const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.detail || "Request failed");
  }
  return response.json();
}

export async function analyzePrice(payload) {
  return request("/analyze", { method: "POST", body: JSON.stringify(payload) });
}

export async function fetchInsights() {
  return request("/insights");
}

export async function fetchTransactions() {
  return request("/transactions");
}

export async function askCopilot(query, context = {}) {
  return request("/ai/copilot", { method: "POST", body: JSON.stringify({ query, context }) });
}

export async function fetchDateAnalysis(date) {
  return request(`/ai/date-analysis?date=${encodeURIComponent(date)}`);
}

export async function fetchMonthlySummary(month) {
  return request(`/ai/monthly-summary?month=${encodeURIComponent(month)}`);
}

export async function fetchMonthlyOverview(month, months = 6) {
  return request(`/ai/monthly-overview?month=${encodeURIComponent(month)}&months=${months}`);
}

export async function fetchWrappedSlides(year = new Date().getFullYear(), count = 13) {
  return request(`/ai/wrapped-slides?year=${year}&count=${count}`);
}

export { API_BASE };
