"use client";

import { useEffect, useState } from "react";

export function useFxRate() {
  const [rate, setRate] = useState(83.5);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/fx")
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.rate === "number" && data.rate > 0) setRate(data.rate);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const usdToInr = (usd) => usd * rate;
  const inrToUsd = (inr) => inr / rate;

  return { rate, ready, usdToInr, inrToUsd };
}
