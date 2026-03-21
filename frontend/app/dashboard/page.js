"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { askCopilot, fetchInsights, fetchTransactions } from "../../lib/api";
import { buildCalendarMatrix, categoryIcon, formatCurrency, toMonthKey, toMonthLabel } from "../../lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const [insights, setInsights] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showSplash, setShowSplash] = useState(true);
  const [now, setNow] = useState(new Date());
  const [displayDate, setDisplayDate] = useState(new Date());
  const [copilotInput, setCopilotInput] = useState("");
  const [copilotResponse, setCopilotResponse] = useState("");
  const [copilotSuggestions, setCopilotSuggestions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const clock = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    Promise.all([fetchInsights(), fetchTransactions()])
      .then(([insightPayload, txPayload]) => {
        setInsights(insightPayload);
        setTransactions(txPayload.transactions || []);
      })
      .catch((err) => setError(err.message));
  }, []);

  const txByDate = useMemo(() => {
    return transactions.reduce((acc, tx) => {
      const current = acc[tx.date] || [];
      acc[tx.date] = [...current, tx];
      return acc;
    }, {});
  }, [transactions]);

  const calendar = useMemo(() => buildCalendarMatrix(displayDate), [displayDate]);

  const monthTotal = useMemo(() => {
    const monthKey = toMonthKey(displayDate);
    return transactions
      .filter((tx) => tx.date.startsWith(monthKey))
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
  }, [displayDate, transactions]);

  async function onAskCopilot() {
    if (!copilotInput.trim()) return;
    try {
      const response = await askCopilot(copilotInput, {
        page: "dashboard",
        visible_month: toMonthKey(displayDate),
        transaction_count: transactions.length,
      });
      setCopilotResponse(response.answer);
      setCopilotSuggestions(response.suggestions || []);
    } catch (apiError) {
      setCopilotResponse("Copilot is unavailable right now.");
    }
  }

  if (showSplash) {
    return (
      <main className="vv-splash">
        <div className="vv-splash-logo">V</div>
        <div className="vv-progress">
          <span />
        </div>
      </main>
    );
  }

  return (
    <main className="container vv-layout">
      <section className="vv-head">
        <div>
          <p className="muted">Welcome back,</p>
          <h1 className="vv-name">Athanth</h1>
        </div>
        <div className="vv-date">
          <h2>{now.toLocaleDateString("en-US", { weekday: "long" })}</h2>
          <p>{now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
          <p>{now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</p>
        </div>
      </section>

      <section className="vv-banner">
        <div>
          <p className="vv-pill">2025 WRAPPED</p>
          <h3>Your Spending Year in Review</h3>
          <p>Discover your top cravings, wildest weekends, and where all that money actually went.</p>
        </div>
        <Link href="/wrapped" className="vv-watch">
          Watch Now
        </Link>
      </section>

      {error ? <section className="card">Error: {error}</section> : null}

      <section className="vv-kpi-grid">
        <div className="vv-kpi-card">
          <p className="muted">Current Balance</p>
          <h3>{formatCurrency(2366.79, "USD")}</h3>
          <p className="muted">{formatCurrency(216561.29, "INR")}</p>
        </div>
        <div className="vv-kpi-card">
          <p className="muted">Total Spending</p>
          <h3>{formatCurrency(insights?.total_spent || 0, "USD")}</h3>
          <p className="muted">{formatCurrency(insights?.total_spent || 0, "INR")}</p>
        </div>
        <div className="vv-kpi-card">
          <p className="muted">Daily Average</p>
          <h3>
            {formatCurrency((insights?.total_spent || 0) / Math.max(transactions.length, 1), "USD")}
          </h3>
          <p className="muted">{formatCurrency((insights?.total_spent || 0) / 30, "INR")}</p>
        </div>
        <div className="vv-kpi-card">
          <p className="muted">Banana Index (PPP)</p>
          <h3>{Math.max(1, Math.round((insights?.total_spent || 0) / 2300))} bananas in India</h3>
          <p className="muted">equals 1 banana in USA</p>
        </div>
      </section>

      <section className="vv-calendar-wrap">
        <div className="vv-calendar-head">
          <div>
            <h3>Transaction Calendar</h3>
            <p className="muted">Review your daily spending habits</p>
          </div>
          <div className="row" style={{ alignItems: "center" }}>
            <button className="pill" onClick={() => setDisplayDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}>
              {"<"}
            </button>
            <strong>{toMonthLabel(displayDate)}</strong>
            <button className="pill" onClick={() => setDisplayDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}>
              {">"}
            </button>
          </div>
        </div>

        <div className="vv-copilot-inline">
          <input
            className="input"
            placeholder="Ask Copilot"
            value={copilotInput}
            onChange={(event) => setCopilotInput(event.target.value)}
          />
          <button className="btn" onClick={onAskCopilot}>
            Ask
          </button>
        </div>
        {copilotResponse ? <p className="muted">{copilotResponse}</p> : null}
        {copilotSuggestions.length > 0 ? (
          <div className="topbar" style={{ marginBottom: 12 }}>
            {copilotSuggestions.map((text) => (
              <button key={text} className="pill" onClick={() => setCopilotInput(text)}>
                {text}
              </button>
            ))}
          </div>
        ) : null}

        <div className="vv-weekdays">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        <div className="vv-calendar-grid">
          {calendar.flat().map((cell) => {
            const rows = txByDate[cell.key] || [];
            const dayTotal = rows.reduce((sum, tx) => sum + Number(tx.amount), 0);
            return (
              <button
                key={cell.key}
                className={`vv-day ${cell.inMonth ? "" : "vv-day-dim"}`}
                onClick={() => router.push(`/activity/${cell.key}`)}
              >
                <div className="vv-day-num">{cell.date.getDate()}</div>
                {rows.length > 0 ? (
                  <>
                    <div className="vv-day-amt">{formatCurrency(dayTotal, "USD")}</div>
                    <div>{categoryIcon(rows[0].category)}</div>
                  </>
                ) : null}
              </button>
            );
          })}
        </div>
        <div className="muted">Month spend: {formatCurrency(monthTotal, "INR")}</div>
      </section>
    </main>
  );
}
