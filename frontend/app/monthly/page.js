"use client";

import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { fetchMonthlyOverview } from "../../lib/api";
import { formatCurrency } from "../../lib/utils";

export default function MonthlyPage() {
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

  return (
    <main className="container vv-layout">
      <section className="vv-detail-head">
        <p className="muted">ForexFriend Copilot</p>
        <h2>View Monthly Spending</h2>
        <p className="muted">Your financial journey from August 2025 to January 2026</p>
      </section>

      <section className="vv-alert">
        <strong>Spending Alert</strong>
        <p>{data?.alert || "Loading alert..."}</p>
      </section>

      <section className="vv-calendar-wrap">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8c6cff" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8c6cff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="spent" stroke="#8c6cff" fill="url(#fill)" />
          </AreaChart>
        </ResponsiveContainer>
      </section>

      <section className="vv-calendar-wrap" style={{ marginTop: 12 }}>
        <h3>Monthly Breakdown Details</h3>
        <div className="vv-table">
          <div>Month</div>
          <div>Total Spent</div>
          <div>Major Categories</div>
          <div>Balance End</div>
          {(data?.series || []).map((row) => (
            <div className="vv-table-row" key={row.month}>
              <span>{row.label}</span>
              <span>{formatCurrency(row.total_spent, "USD")}</span>
              <span>{row.major_categories}</span>
              <span>{formatCurrency(row.balance_end, "USD")}</span>
            </div>
          ))}
        </div>
        <div className="vv-note">
          <strong>Banana Index Reality Check</strong>
          <p>
            Your {formatCurrency(average, "USD")} average monthly spending equals about{" "}
            {Math.round((average * 82) / 7)} bananas in India - that is serious money back home.
          </p>
        </div>
      </section>
    </main>
  );
}
