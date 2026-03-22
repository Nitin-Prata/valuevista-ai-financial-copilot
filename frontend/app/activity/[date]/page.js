"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { askCopilot, fetchDateAnalysis, fetchMonthlySummary } from "../../../lib/api";
import { useFxRate } from "../../../lib/useFxRate";
import { categoryIcon, formatCurrency } from "../../../lib/utils";

export default function ActivityDetailPage({ params }) {
  const { rate, ready, inrToUsd } = useFxRate();
  const [detail, setDetail] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [tip, setTip] = useState("");
  const [copilotAnswer, setCopilotAnswer] = useState("");

  useEffect(() => {
    fetchDateAnalysis(params.date).then(setDetail);
    fetchMonthlySummary(params.date.slice(0, 7)).then(setMonthly);
  }, [params.date]);

  const firstTx = detail?.transactions?.[0];
  const totalInr = detail?.total || 0;
  const totalUsd = ready ? inrToUsd(totalInr) : totalInr / 83.5;

  return (
    <main className="vv-dashboard-shell vv-layout">
      <section className="vv-detail-head">
        <p className="muted">ValueVista Copilot</p>
        <h2>
          Nitin — financial activity on {params.date}. {detail?.count || 0} transaction(s).
        </h2>
        <p className="muted">Financial Activity · {params.date}</p>
      </section>

      <section className="vv-alert">
        <strong>Spending alert</strong>
        <p>{detail?.analysis || "Loading analysis…"}</p>
      </section>

      <section className="vv-kpi-grid vv-kpi-colorful">
        <div className="vv-kpi-card vv-kpi-accent-blue">
          <p className="muted">Amount (INR)</p>
          <h3>{formatCurrency(totalInr, "INR")}</h3>
          <p className="muted">{firstTx?.category || "—"}</p>
        </div>
        <div className="vv-kpi-card vv-kpi-accent-violet">
          <p className="muted">Equivalent in USD</p>
          <h3>${totalUsd.toFixed(2)}</h3>
          <p className="muted">
            Live rate {ready ? `₹${rate.toFixed(2)} / $1` : "loading…"}
          </p>
        </div>
      </section>

      <section className="vv-calendar-wrap vv-calendar-rich">
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
        <div className="vv-note vv-note-gradient">
          <strong>Money Context</strong>
          <p>{monthly?.summary || "Loading monthly context…"}</p>
        </div>
        <div className="topbar">
          <Link className="pill pill-active" href="/monthly">
            View Monthly Spending
          </Link>
          <button
            type="button"
            className="pill"
            onClick={async () => {
              setTip("Loading housing guidance…");
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
            type="button"
            className="pill"
            onClick={async () => {
              setTip("Loading comparison guidance…");
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
            type="button"
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
