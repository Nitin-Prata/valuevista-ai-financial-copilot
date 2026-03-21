"use client";

import { useState } from "react";

import AppShell from "../../components/ui/AppShell";
import { analyzePrice } from "../../lib/api";
import { formatCurrency } from "../../lib/utils";

const countries = ["India", "USA", "Germany", "UAE", "Japan"];

export default function AnalyzerPage() {
  const [form, setForm] = useState({
    price: 100,
    country: "USA",
    home_country: "India",
    category: "general",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await analyzePrice({ ...form, price: Number(form.price) });
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      title="Price Analyzer"
      subtitle="Check if a product is cheap, normal, or expensive in real purchasing power."
    >
      <div className="grid grid-2">
        <form className="card" onSubmit={onSubmit}>
          <label>
            Price
            <input
              className="input"
              type="number"
              min="1"
              value={form.price}
              onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
            />
          </label>
          <label>
            Country
            <select
              className="select"
              value={form.country}
              onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
            >
              {countries.map((country) => (
                <option key={country}>{country}</option>
              ))}
            </select>
          </label>
          <label>
            Home Country
            <select
              className="select"
              value={form.home_country}
              onChange={(e) => setForm((p) => ({ ...p, home_country: e.target.value }))}
            >
              {countries.map((country) => (
                <option key={country}>{country}</option>
              ))}
            </select>
          </label>
          <label>
            Category
            <select
              className="select"
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            >
              <option value="general">General</option>
              <option value="food">Food</option>
              <option value="rent">Rent</option>
              <option value="transport">Transport</option>
            </select>
          </label>
          <button className="btn" type="submit" style={{ marginTop: 14 }}>
            {loading ? "Analyzing..." : "Analyze Price"}
          </button>
          {error ? <p style={{ color: "#ffb3b3" }}>{error}</p> : null}
        </form>

        <div className="card">
          <h3 className="title">Result</h3>
          {!result ? (
            <p className="muted">Run analysis to see equivalent value and recommendation.</p>
          ) : (
            <div className="grid">
              <div className={`badge badge-${result.verdict}`}>{result.verdict}</div>
              <p className="muted">
                Converted value:{" "}
                {formatCurrency(result.converted_value.amount, result.converted_value.currency)}
              </p>
              <p className="muted">
                Equivalent value:{" "}
                {formatCurrency(result.equivalent_value.amount, result.equivalent_value.currency)}
              </p>
              <p>{result.explanation}</p>
              <p className="muted">{result.worth_it}</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
