"use client";

import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { fetchMonthlyOverview } from "../../lib/api";
import { useFxRate } from "../../lib/useFxRate";
import { formatCurrency } from "../../lib/utils";

export default function MonthlyPage() {
  const { rate, ready, inrToUsd } = useFxRate();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchMonthlyOverview("2026-01", 6).then(setData);
  }, []);

  const chartData = useMemo(() => {
    if (!data?.series) return [];
    return data.series.map((row) => ({ month: row.label.slice(0, 3), spent: row.total_spent }));
  }, [data]);

  const average = useMemo(() => {
    if (!data?.series?.length) return 0;
    const total = data.series.reduce((acc, row) => acc + Number(row.total_spent), 0);
    return total / data.series.length;
  }, [data]);

  const averageUsd = ready ? inrToUsd(average) : average / 83.5;

  return (
    <main className="vv-dashboard-shell vv-layout">
      <section className="vv-detail-head">
        <p className="muted">ValueVista Copilot</p>
        <h2>View Monthly Spending</h2>
        <p className="muted">Your financial journey from August 2025 to January 2026</p>
      </section>

      <section className="vv-alert">
        <strong>Spending Alert</strong>
        <p>{data?.alert || "Loading alert…"}</p>
      </section>

      <section className="vv-calendar-wrap vv-calendar-rich">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillMonthly" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.85} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12 }}
              labelStyle={{ color: "#e2e8f0" }}
            />
            <Area type="monotone" dataKey="spent" stroke="#c084fc" strokeWidth={2} fill="url(#fillMonthly)" />
          </AreaChart>
        </ResponsiveContainer>
      </section>

      <section className="vv-calendar-wrap vv-calendar-rich" style={{ marginTop: 12 }}>
        <h3>Monthly Breakdown Details</h3>
        <div className="vv-table">
          <div>Month</div>
          <div>Total Spent (INR)</div>
          <div>Major Categories</div>
          <div>Balance End (INR)</div>
          {(data?.series || []).map((row) => (
            <div className="vv-table-row" key={row.month}>
              <span>{row.label}</span>
              <span>{formatCurrency(row.total_spent, "INR")}</span>
              <span>{row.major_categories}</span>
              <span>{formatCurrency(row.balance_end, "INR")}</span>
            </div>
          ))}
        </div>
        <div className="vv-note vv-note-gradient">
          <strong>Banana Index Reality Check</strong>
          <p>
            Your {formatCurrency(average, "INR")} average monthly spend (≈ ${averageUsd.toFixed(2)} USD
            {ready ? ` @ ₹${rate.toFixed(2)}/$` : ""}) — compare to everyday costs back home to feel the real
            weight.
          </p>
        </div>
      </section>
    </main>
  );
}
