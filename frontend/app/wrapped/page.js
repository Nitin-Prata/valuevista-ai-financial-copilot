"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { fetchWrappedSlides } from "../../lib/api";

function WrappedContent() {
  const searchParams = useSearchParams();
  const viewMode = searchParams.get("view") === "1";
  const [slides, setSlides] = useState([]);
  const [active, setActive] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    fetchWrappedSlides(new Date().getFullYear(), 5).then((payload) => {
      setSlides(payload.slides || []);
    });
  }, []);

  useEffect(() => {
    if (!viewMode || !autoPlay || slides.length === 0) return undefined;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 2600);
    return () => clearInterval(timer);
  }, [autoPlay, viewMode, slides.length]);

  if (viewMode) {
    const accent = slides[active]?.accent || "info";
    return (
      <main className="vv-wrapped-view">
        <div className="vv-wrapped-top">
          <Link href="/wrapped" className="pill">
            Close
          </Link>
          <h4>Your 2025 Money Wrapped</h4>
          <button className="pill" onClick={() => setAutoPlay((v) => !v)}>
            {autoPlay ? "Pause" : "Play"}
          </button>
        </div>
        <aside className="vv-slide-rail">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              className={`vv-thumb ${active === index ? "vv-thumb-active" : ""}`}
              onClick={() => setActive(index)}
            >
              <small>Slide {index + 1}</small>
              <div>{slide.title}</div>
              <strong>{index + 1}</strong>
            </button>
          ))}
        </aside>
        <section className="vv-slide-main">
          <article className={`vv-accent-${accent}`}>
            <h2>{slides[active]?.title || "Slide"}</h2>
            <p>{slides[active]?.body || "Loading..."}</p>
          </article>
          <div className="row vv-slide-footer">
            <button className="pill" onClick={() => setActive((v) => Math.max(0, v - 1))}>
              Prev
            </button>
            <span className="pill">
              {active + 1} of {slides.length || 5}
            </span>
            <button className="pill" onClick={() => setActive((v) => Math.min(slides.length - 1, v + 1))}>
              Next
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="container vv-layout">
      <section className="vv-calendar-wrap">
        <h3>Your Spending Wrapped</h3>
        <p className="muted">Your 2025 Money Wrapped</p>
        <div className="topbar">
          <span className="pill">{slides.length || 5} Slides</span>
        </div>
        <Link href="/wrapped?view=1" className="vv-watch" style={{ width: "fit-content" }}>
          View
        </Link>
      </section>
    </main>
  );
}

export default function WrappedPage() {
  return (
    <Suspense fallback={<main className="container"><div className="card">Loading wrapped...</div></main>}>
      <WrappedContent />
    </Suspense>
  );
}
