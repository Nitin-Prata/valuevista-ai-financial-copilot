"use client";

import { useEffect, useMemo, useState } from "react";

import AppShell from "../../components/ui/AppShell";
import { fetchTransactions } from "../../lib/api";
import { categoryIcon, formatCurrency } from "../../lib/utils";

export default function TransactionsPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchTransactions().then((payload) => setRows(payload.transactions || []));
  }, []);

  const byDate = useMemo(() => {
    return rows.reduce((acc, tx) => {
      acc[tx.date] = (acc[tx.date] || 0) + 1;
      return acc;
    }, {});
  }, [rows]);

  return (
    <AppShell title="Transactions" subtitle="Calendar-style history with category tracking.">
      <div className="grid grid-2">
        <div className="card">
          <h3 className="title">Calendar View</h3>
          <div className="grid grid-3">
            {Object.entries(byDate).map(([date, count]) => (
              <div key={date} className="pill">
                <strong>{date}</strong>
                <div className="muted">{count} tx</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 className="title">Transaction List</h3>
          <ul className="list">
            {rows.map((tx) => (
              <li key={tx.id} className="row">
                <span>
                  {categoryIcon(tx.category)} {tx.merchant}
                  <div className="muted">{tx.category}</div>
                </span>
                <strong>{formatCurrency(tx.amount, tx.currency)}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
