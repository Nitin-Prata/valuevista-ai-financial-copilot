"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { askCopilot, fetchInsights, fetchTransactions, fetchWrappedSlides } from "../../lib/api";
import { useFxRate } from "../../lib/useFxRate";
import { buildCalendarMatrix, categoryIcon, formatCurrency, toMonthKey, toMonthLabel } from "../../lib/utils";

const WRAPPED_SLIDES = 5;

export default function DashboardPage() {
  const router = useRouter();
  const { rate, ready, usdToInr, inrToUsd } = useFxRate();
  const [insights, setInsights] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showSplash, setShowSplash] = useState(true);
  const [now, setNow] = useState(new Date());
  const [displayDate, setDisplayDate] = useState(new Date());
  const [copilotInput, setCopilotInput] = useState("");
  const [copilotResponse, setCopilotResponse] = useState("");
  const [copilotSuggestions, setCopilotSuggestions] = useState([]);
  const [error, setError] = useState("");

  const [wrappedGenerating, setWrappedGenerating] = useState(false);
  const [wrappedOpen, setWrappedOpen] = useState(false);
  const [wrappedSlides, setWrappedSlides] = useState([]);
  const [wrappedActive, setWrappedActive] = useState(0);
  const [wrappedPlaying, setWrappedPlaying] = useState(false);

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

  useEffect(() => {
    if (!wrappedOpen || !wrappedPlaying || wrappedSlides.length === 0) return undefined;
    const t = setInterval(() => {
      setWrappedActive((p) => (p + 1) % wrappedSlides.length);
    }, 3200);
    return () => clearInterval(t);
  }, [wrappedOpen, wrappedPlaying, wrappedSlides.length]);

  const txByDate = useMemo(() => {
    return transactions.reduce((acc, tx) => {
      const current = acc[tx.date] || [];
      acc[tx.date] = [...current, tx];
      return acc;
    }, {});
  }, [transactions]);

  const calendar = useMemo(() => buildCalendarMatrix(displayDate), [displayDate]);

  const monthTotalInr = useMemo(() => {
    const monthKey = toMonthKey(displayDate);
    return transactions
      .filter((tx) => tx.date.startsWith(monthKey))
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
  }, [displayDate, transactions]);

  const totalSpentInr = insights?.total_spent || 0;
  const demoBalanceUsd = 2366.79;
  const demoBalanceInr = ready ? usdToInr(demoBalanceUsd) : 196000;

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
    } catch {
      setCopilotResponse("Copilot is unavailable right now.");
    }
  }

  function handleWatchNow() {
    if (wrappedGenerating || wrappedOpen) return;
    setWrappedGenerating(true);
    setTimeout(async () => {
      try {
        const payload = await fetchWrappedSlides(new Date().getFullYear(), WRAPPED_SLIDES);
        setWrappedSlides(payload.slides || []);
        setWrappedActive(0);
        setWrappedOpen(true);
      } catch {
        setWrappedSlides([]);
        setWrappedOpen(true);
      } finally {
        setWrappedGenerating(false);
      }
    }, 1400);
  }

  function closeWrapped() {
    setWrappedOpen(false);
    setWrappedPlaying(false);
    setWrappedSlides([]);
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

  const accent = wrappedSlides[wrappedActive]?.accent || "info";

  return (
    <main className="vv-dashboard-shell vv-layout">
      <section className="vv-head">
        <div>
          <p className="muted">Welcome back,</p>
          <h1 className="vv-name vv-name-gradient">Nitin</h1>
        </div>
        <div className="vv-date">
          <h2>{now.toLocaleDateString("en-US", { weekday: "long" })}</h2>
          <p>{now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
          <p>{now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</p>
        </div>
      </section>

      <section className="vv-banner vv-banner-rich">
        <div>
          <p className="vv-pill vv-sparkle">✨ 2025 WRAPPED</p>
          <h3>Your Spending Year in Review</h3>
          <p>Discover your top cravings, wildest weekends, and where all that money actually went.</p>
        </div>
        <button
          type="button"
          className="vv-watch"
          onClick={handleWatchNow}
          disabled={wrappedGenerating}
        >
          {wrappedGenerating ? "Generating…" : "Watch Now"} →
        </button>
      </section>

      {wrappedOpen ? (
        <section className="vv-wrapped-inline card-animate">
          <div className="vv-wrapped-inline-head">
            <div>
              <h3 className="vv-wrapped-inline-title">Your Spending Wrapped</h3>
              <p className="muted">Your 2025 Money Wrapped — {WRAPPED_SLIDES} curated slides</p>
            </div>
            <div className="row" style={{ alignItems: "center", gap: 8 }}>
              <span className="pill pill-accent">{WRAPPED_SLIDES} Slides</span>
              <button type="button" className="pill" onClick={() => setWrappedPlaying((p) => !p)}>
                {wrappedPlaying ? "Pause" : "Play"}
              </button>
              <button type="button" className="pill pill-close" onClick={closeWrapped}>
                Close
              </button>
            </div>
          </div>
          <div className="vv-wrapped-inline-body">
            <aside className="vv-slide-rail-inline">
              {wrappedSlides.map((slide, index) => (
                <button
                  key={slide.id || index}
                  type="button"
                  className={`vv-thumb ${wrappedActive === index ? "vv-thumb-active" : ""}`}
                  onClick={() => setWrappedActive(index)}
                >
                  <small>Slide {index + 1}</small>
                  <div className="vv-thumb-title">{slide.title}</div>
                </button>
              ))}
            </aside>
            <div className="vv-slide-main-inline">
              <article className={`vv-accent-${accent} vv-slide-article-inline`}>
                <h2>{wrappedSlides[wrappedActive]?.title || "…"}</h2>
                <p>{wrappedSlides[wrappedActive]?.body || "Loading your story…"}</p>
              </article>
              <div className="row vv-slide-footer-inline">
                <button type="button" className="pill" onClick={() => setWrappedActive((v) => Math.max(0, v - 1))}>
                  Prev
                </button>
                <span className="pill">
                  {wrappedActive + 1} of {wrappedSlides.length || WRAPPED_SLIDES}
                </span>
                <button
                  type="button"
                  className="pill"
                  onClick={() => setWrappedActive((v) => Math.min(wrappedSlides.length - 1, v + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {error ? <section className="card">Error: {error}</section> : null}

      <section className="vv-kpi-grid vv-kpi-colorful">
        <div className="vv-kpi-card vv-kpi-accent-blue">
          <p className="muted">Current Balance</p>
          <h3>{formatCurrency(demoBalanceInr, "INR")}</h3>
          <p className="muted">
            ≈ ${demoBalanceUsd.toFixed(2)} USD {ready ? <span className="vv-fx-hint">@ ₹{rate.toFixed(2)}/$</span> : null}
          </p>
        </div>
        <div className="vv-kpi-card vv-kpi-accent-rose">
          <p className="muted">Total Spending (sample)</p>
          <h3>{formatCurrency(totalSpentInr, "INR")}</h3>
          <p className="muted">≈ ${inrToUsd(totalSpentInr).toFixed(2)} USD</p>
        </div>
        <div className="vv-kpi-card vv-kpi-accent-violet">
          <p className="muted">Daily Average</p>
          <h3>{formatCurrency(totalSpentInr / Math.max(transactions.length, 1), "INR")}</h3>
          <p className="muted">Per transaction avg</p>
        </div>
        <div className="vv-kpi-card vv-kpi-accent-amber">
          <p className="muted">Banana Index (PPP)</p>
          <h3>{Math.max(1, Math.round(totalSpentInr / 2300))} units</h3>
          <p className="muted">Relative cost lens (demo)</p>
        </div>
      </section>

      <section className="vv-calendar-wrap vv-calendar-rich">
        <div className="vv-calendar-head">
          <div>
            <h3>Transaction Calendar</h3>
            <p className="muted">Review your daily spending habits</p>
          </div>
          <div className="row" style={{ alignItems: "center" }}>
            <button
              type="button"
              className="pill"
              onClick={() => setDisplayDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
            >
              ‹
            </button>
            <strong>{toMonthLabel(displayDate)}</strong>
            <button
              type="button"
              className="pill"
              onClick={() => setDisplayDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
            >
              ›
            </button>
          </div>
        </div>

        <div className="vv-weekdays">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        <div className="vv-calendar-grid vv-calendar-grid-large">
          {calendar.flat().map((cell) => {
            const rows = txByDate[cell.key] || [];
            const dayTotalInr = rows.reduce((sum, tx) => sum + Number(tx.amount), 0);
            return (
              <button
                key={cell.key}
                type="button"
                className={`vv-day ${cell.inMonth ? "" : "vv-day-dim"}`}
                onClick={() => router.push(`/activity/${cell.key}`)}
              >
                <div className="vv-day-num">{cell.date.getDate()}</div>
                {rows.length > 0 ? (
                  <>
                    <div className="vv-day-amt">{formatCurrency(dayTotalInr, "INR")}</div>
                    <div>{categoryIcon(rows[0].category)}</div>
                  </>
                ) : null}
              </button>
            );
          })}
        </div>
        <p className="muted vv-month-total">
          Month spend: <strong>{formatCurrency(monthTotalInr, "INR")}</strong>
          {ready ? <span> · ≈ ${inrToUsd(monthTotalInr).toFixed(2)} USD</span> : null}
        </p>

        <div className="vv-copilot-bar">
          <div className="vv-copilot-icon" aria-hidden>
            ✦
          </div>
          <div className="vv-copilot-text">
            <strong>Ask Copilot</strong>
            <span>Ask whatever you need help with…</span>
          </div>
          <input
            className="vv-copilot-input"
            placeholder="Type a question…"
            value={copilotInput}
            onChange={(e) => setCopilotInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onAskCopilot()}
          />
          <button type="button" className="btn vv-copilot-send" onClick={onAskCopilot}>
            Ask
          </button>
        </div>
        {copilotResponse ? <p className="vv-copilot-reply">{copilotResponse}</p> : null}
        {copilotSuggestions.length > 0 ? (
          <div className="vv-suggestion-row">
            {copilotSuggestions.map((text) => (
              <button key={text} type="button" className="pill pill-suggestion" onClick={() => setCopilotInput(text)}>
                {text}
              </button>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
