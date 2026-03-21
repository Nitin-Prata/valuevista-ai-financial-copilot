"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { askCopilot, fetchDateAnalysis, fetchMonthlySummary } from "../../../lib/api";
import { categoryIcon, formatCurrency } from "../../../lib/utils";

export default function ActivityDetailPage({ params }) {
  const [detail, setDetail] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [tip, setTip] = useState("");
  const [copilotAnswer, setCopilotAnswer] = useState("");

  useEffect(() => {
    fetchDateAnalysis(params.date).then(setDetail);
    fetchMonthlySummary(params.date.slice(0, 7)).then(setMonthly);
  }, [params.date]);

  const firstTx = detail?.transactions?.[0];

  return (
    <main className="container vv-layout">
      <section className="vv-detail-head">
        <p className="muted">ForexFriend Copilot</p>
        <h2>
          Analyze my financial activity on {params.date}. I had {detail?.count || 0} transaction(s).
        </h2>
        <p className="muted">Financial Activity - {params.date}</p>
      </section>

      <section className="vv-alert">
        <strong>Major Rent Payment Alert</strong>
        <p>{detail?.analysis || "Loading analysis..."}</p>
      </section>

      <section className="vv-kpi-grid">
        <div className="vv-kpi-card">
          <p className="muted">Amount</p>
          <h3>{formatCurrency(detail?.total || 0, "USD")}</h3>
          <p className="muted">{firstTx?.category || "No category"}</p>
        </div>
        <div className="vv-kpi-card">
          <p className="muted">Equivalent in INR</p>
          <h3>{formatCurrency((detail?.total || 0) * 91.57, "INR")}</h3>
          <p className="muted">PPP-aligned rough equivalent</p>
        </div>
      </section>

      <section className="vv-calendar-wrap">
        <h3>Transaction Details</h3>
        <div className="vv-table">
          <div>Date</div>
          <div>Description</div>
          <div>Amount</div>
          <div>Category</div>
          {(detail?.transactions || []).map((tx) => (
            <Link key={tx.id} href="#" className="vv-table-row">
              <span>{tx.date}</span>
              <span>{tx.note ? `${tx.merchant} - ${tx.note}` : tx.merchant}</span>
              <span>{formatCurrency(tx.amount, tx.currency)}</span>
              <span>
                {categoryIcon(tx.category)} {tx.category}
              </span>
            </Link>
          ))}
        </div>
        <p>
          <strong>Analysis:</strong> {detail?.analysis}
        </p>
        <div className="vv-note">
          <strong>Money Context</strong>
          <p>{monthly?.summary || "Loading monthly context..."}</p>
        </div>
        <div className="topbar">
          <Link className="pill pill-active" href="/monthly">
            View Monthly Spending
          </Link>
          <button
            className="pill"
            onClick={async () => {
              setTip("Loading housing guidance...");
              const res = await askCopilot("Give me housing budget tips for this situation.", {
                page: "activity_detail",
                selected_date: params.date,
              });
              setTip(res.answer);
            }}
          >
            Housing Budget Tips
          </button>
          <button
            className="pill"
            onClick={async () => {
              setTip("Loading comparison guidance...");
              const res = await askCopilot("Compare this spending with previous months and tell me one action.", {
                page: "activity_detail",
                selected_date: params.date,
              });
              setTip(res.answer);
            }}
          >
            Compare Previous Months
          </button>
          <button
            className="pill"
            onClick={async () => {
              const res = await askCopilot("Summarize this date in one quick line.", {
                page: "activity_detail",
                selected_date: params.date,
              });
              setCopilotAnswer(res.answer);
            }}
          >
            Ask Copilot
          </button>
        </div>
        {tip ? <p className="muted">{tip}</p> : null}
        {copilotAnswer ? <p className="muted">{copilotAnswer}</p> : null}
      </section>
    </main>
  );
}
