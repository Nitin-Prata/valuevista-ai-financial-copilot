<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ValueVista — AI Financial Copilot</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&family=Cabinet+Grotesk:wght@400;500;700;800&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #060812;
    --surface: #0d1120;
    --surface2: #131829;
    --border: rgba(255,255,255,0.07);
    --accent: #7c6bff;
    --accent2: #ff6b9d;
    --accent3: #00e5c3;
    --text: #e8eaf6;
    --muted: #6b7280;
    --gold: #f5c542;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Cabinet Grotesk', sans-serif;
    line-height: 1.6;
    overflow-x: hidden;
  }

  /* Noise overlay */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 999;
    opacity: 0.5;
  }

  /* ─── HERO ─── */
  .hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 80px 8vw;
    position: relative;
    overflow: hidden;
  }

  .hero-glow {
    position: absolute;
    width: 700px; height: 700px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(124,107,255,0.18) 0%, transparent 70%);
    top: -200px; right: -200px;
    pointer-events: none;
    animation: pulse 6s ease-in-out infinite alternate;
  }
  .hero-glow2 {
    position: absolute;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,107,157,0.12) 0%, transparent 70%);
    bottom: -100px; left: 10%;
    pointer-events: none;
    animation: pulse 8s ease-in-out infinite alternate-reverse;
  }

  @keyframes pulse { from { transform: scale(1); } to { transform: scale(1.15); } }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(124,107,255,0.15);
    border: 1px solid rgba(124,107,255,0.3);
    border-radius: 999px;
    padding: 6px 16px;
    font-size: 12px;
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.08em;
    color: var(--accent);
    margin-bottom: 32px;
    animation: fadeUp 0.6s ease both;
  }
  .badge::before { content: '◆'; font-size: 8px; }

  .hero-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: clamp(56px, 9vw, 120px);
    line-height: 0.95;
    letter-spacing: -0.03em;
    animation: fadeUp 0.7s 0.1s ease both;
  }

  .hero-title span.grad {
    background: linear-gradient(135deg, #7c6bff 0%, #ff6b9d 50%, #00e5c3 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-tagline {
    margin-top: 28px;
    font-size: clamp(18px, 2.5vw, 26px);
    font-weight: 500;
    color: var(--muted);
    max-width: 600px;
    animation: fadeUp 0.7s 0.2s ease both;
  }

  .hero-tagline strong { color: var(--text); }

  .hero-cta {
    margin-top: 48px;
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    animation: fadeUp 0.7s 0.3s ease both;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s;
    border: none;
  }
  .btn-primary {
    background: var(--accent);
    color: #fff;
  }
  .btn-primary:hover { background: #6355e8; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(124,107,255,0.4); }
  .btn-outline {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text);
  }
  .btn-outline:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-2px); }

  /* ─── PROBLEM STATEMENT ─── */
  .section { padding: 80px 8vw; }

  .problem-banner {
    background: linear-gradient(135deg, var(--surface) 0%, rgba(255,107,157,0.08) 100%);
    border: 1px solid rgba(255,107,157,0.2);
    border-radius: 20px;
    padding: 60px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .problem-banner::before {
    content: '"';
    font-family: 'Syne', sans-serif;
    font-size: 300px;
    color: rgba(255,107,157,0.05);
    position: absolute;
    top: -80px; left: 20px;
    line-height: 1;
    pointer-events: none;
  }

  .problem-label {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.15em;
    color: var(--accent2);
    text-transform: uppercase;
    margin-bottom: 20px;
  }
  .problem-text {
    font-family: 'Syne', sans-serif;
    font-size: clamp(22px, 3.5vw, 42px);
    font-weight: 700;
    line-height: 1.2;
    max-width: 800px;
    margin: 0 auto;
  }
  .problem-text em {
    font-style: normal;
    color: var(--accent2);
  }

  /* ─── SECTION HEADER ─── */
  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.15em;
    color: var(--accent3);
    text-transform: uppercase;
    margin-bottom: 12px;
  }
  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(28px, 4vw, 48px);
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 16px;
  }
  .section-sub {
    color: var(--muted);
    font-size: 17px;
    max-width: 560px;
  }

  /* ─── FEATURES GRID ─── */
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 48px;
  }

  .feature-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 32px;
    transition: all 0.25s;
    position: relative;
    overflow: hidden;
  }
  .feature-card::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    opacity: 0;
    transition: opacity 0.25s;
  }
  .feature-card:hover { transform: translateY(-4px); border-color: rgba(124,107,255,0.3); }
  .feature-card:hover::after { opacity: 1; }

  .feature-icon {
    font-size: 32px;
    margin-bottom: 16px;
    display: block;
  }
  .feature-name {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  .feature-desc {
    color: var(--muted);
    font-size: 14px;
    line-height: 1.6;
  }
  .feature-tag {
    display: inline-block;
    margin-top: 16px;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-family: 'DM Mono', monospace;
    background: rgba(124,107,255,0.12);
    color: var(--accent);
    border: 1px solid rgba(124,107,255,0.2);
  }

  /* ─── SCREENSHOTS ─── */
  .screenshots { padding: 80px 8vw; }

  .screenshots-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
    margin-top: 48px;
  }

  .screenshot-item {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
    transition: transform 0.3s;
  }
  .screenshot-item:hover { transform: scale(1.01); }

  .screenshot-item img {
    width: 100%;
    display: block;
    border-bottom: 1px solid var(--border);
  }

  .screenshot-caption {
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .cap-title {
    font-weight: 700;
    font-size: 15px;
  }
  .cap-desc {
    color: var(--muted);
    font-size: 13px;
    margin-top: 2px;
  }
  .cap-badge {
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 11px;
    font-family: 'DM Mono', monospace;
    white-space: nowrap;
  }
  .cap-badge.purple { background: rgba(124,107,255,0.15); color: var(--accent); border: 1px solid rgba(124,107,255,0.25); }
  .cap-badge.pink { background: rgba(255,107,157,0.15); color: var(--accent2); border: 1px solid rgba(255,107,157,0.25); }
  .cap-badge.teal { background: rgba(0,229,195,0.1); color: var(--accent3); border: 1px solid rgba(0,229,195,0.2); }

  /* ─── FLOW ─── */
  .flow-steps {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-top: 48px;
    position: relative;
  }
  .flow-steps::before {
    content: '';
    position: absolute;
    left: 24px;
    top: 48px;
    bottom: 48px;
    width: 1px;
    background: linear-gradient(to bottom, var(--accent), var(--accent2), var(--accent3));
  }

  .flow-step {
    display: flex;
    gap: 32px;
    align-items: flex-start;
    padding: 24px 0;
  }
  .flow-num {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--surface2);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    font-weight: 500;
    color: var(--accent);
    flex-shrink: 0;
    position: relative;
    z-index: 1;
  }
  .flow-content h3 {
    font-family: 'Syne', sans-serif;
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 4px;
  }
  .flow-content p { color: var(--muted); font-size: 14px; }

  /* ─── TECH STACK ─── */
  .tech-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-top: 48px;
  }
  .tech-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px 24px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .tech-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }
  .tech-name { font-weight: 700; font-size: 14px; }
  .tech-role { color: var(--muted); font-size: 12px; }

  /* ─── SETUP ─── */
  .setup-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-top: 48px;
  }
  @media (max-width: 720px) { .setup-grid { grid-template-columns: 1fr; } }

  .setup-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
  }
  .setup-header {
    padding: 20px 24px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .setup-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
  }
  .setup-title { font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 500; }
  .setup-body { padding: 20px 24px; }

  pre {
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    line-height: 1.8;
    color: #a8b4d0;
    white-space: pre-wrap;
  }
  pre .cmd { color: var(--accent3); }
  pre .comment { color: var(--muted); }
  pre .key { color: var(--accent2); }
  pre .val { color: var(--gold); }

  .env-card {
    grid-column: 1 / -1;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
  }
  .env-grid { display: grid; grid-template-columns: 1fr 1fr; }
  @media (max-width: 720px) { .env-grid { grid-template-columns: 1fr; } }
  .env-section { padding: 24px; }
  .env-section + .env-section { border-left: 1px solid var(--border); }
  .env-label {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: var(--muted);
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  /* ─── FOOTER ─── */
  .footer {
    padding: 60px 8vw;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: gap;
    gap: 24px;
  }
  .footer-brand {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 800;
  }
  .footer-brand span { color: var(--accent); }
  .footer-note { color: var(--muted); font-size: 13px; }
  .footer-pills { display: flex; gap: 8px; flex-wrap: wrap; }
  .pill {
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 12px;
    border: 1px solid var(--border);
    color: var(--muted);
    font-family: 'DM Mono', monospace;
  }

  /* ─── DIVIDER ─── */
  .divider {
    height: 1px;
    background: linear-gradient(to right, transparent, var(--border), transparent);
    margin: 0 8vw;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Scroll animations */
  .reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  /* Horizontal stat strip */
  .stat-strip {
    display: flex;
    gap: 0;
    background: var(--surface);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    overflow: hidden;
  }
  .stat-item {
    flex: 1;
    padding: 36px 32px;
    border-right: 1px solid var(--border);
    text-align: center;
  }
  .stat-item:last-child { border-right: none; }
  .stat-num {
    font-family: 'Syne', sans-serif;
    font-size: clamp(28px, 4vw, 48px);
    font-weight: 800;
    background: linear-gradient(135deg, #7c6bff, #ff6b9d);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .stat-label { color: var(--muted); font-size: 13px; margin-top: 4px; }
</style>
</head>
<body>

<!-- ── HERO ── -->
<section class="hero">
  <div class="hero-glow"></div>
  <div class="hero-glow2"></div>

  <div class="badge">Hackathon 2026 · AI Financial Tooling</div>

  <h1 class="hero-title">
    Value<span class="grad">Vista</span>
  </h1>

  <p class="hero-tagline">
    <strong>Is ₹500 cheap or expensive?</strong> Depends on where you are.<br>
    ValueVista tells you in seconds — with AI-powered context.
  </p>

  <div class="hero-cta">
    <a href="#setup" class="btn btn-primary">🚀 Run It Locally</a>
    <a href="#features" class="btn btn-outline">Explore Features →</a>
  </div>
</section>

<!-- ── STAT STRIP ── -->
<div class="stat-strip">
  <div class="stat-item">
    <div class="stat-num">5s</div>
    <div class="stat-label">To understand any price anywhere</div>
  </div>
  <div class="stat-item">
    <div class="stat-num">13</div>
    <div class="stat-label">AI-generated yearly recap slides</div>
  </div>
  <div class="stat-item">
    <div class="stat-num">PPP</div>
    <div class="stat-label">Purchasing Power Parity engine</div>
  </div>
  <div class="stat-item">
    <div class="stat-num">∞</div>
    <div class="stat-label">Questions the Copilot can answer</div>
  </div>
</div>

<!-- ── PROBLEM ── -->
<section class="section">
  <div class="problem-banner reveal">
    <div class="problem-label">The Problem We Solve</div>
    <h2 class="problem-text">
      Currency conversion lies to you.<br>
      <em>$100 in San Francisco ≠ $100 in Mumbai.</em><br>
      Real value needs real context.
    </h2>
  </div>
</section>

<div class="divider"></div>

<!-- ── FEATURES ── -->
<section class="section" id="features">
  <div class="reveal">
    <div class="section-label">What It Does</div>
    <h2 class="section-title">Six tools.<br>One financial lens.</h2>
    <p class="section-sub">Every feature built around the same idea: money only makes sense with context.</p>
  </div>

  <div class="features-grid">
    <div class="feature-card reveal">
      <span class="feature-icon">🔍</span>
      <div class="feature-name">Price Analyzer</div>
      <div class="feature-desc">Enter any amount + country. Get converted value, purchasing power verdict, and whether it's actually "worth it" — instantly.</div>
      <span class="feature-tag">PPP Engine</span>
    </div>
    <div class="feature-card reveal">
      <span class="feature-icon">📊</span>
      <div class="feature-name">Live Dashboard</div>
      <div class="feature-desc">Your spending snapshot at a glance — current balance, daily averages, and a "Banana Index" as a fun real-world value gauge.</div>
      <span class="feature-tag">Real-time</span>
    </div>
    <div class="feature-card reveal">
      <span class="feature-icon">📅</span>
      <div class="feature-name">Transaction Calendar</div>
      <div class="feature-desc">Click any day on the calendar and get an AI-powered breakdown of what you spent and why it matters.</div>
      <span class="feature-tag">Daily Analysis</span>
    </div>
    <div class="feature-card reveal">
      <span class="feature-icon">📈</span>
      <div class="feature-name">Monthly Deep Dive</div>
      <div class="feature-desc">Trend charts, monthly tables, and intelligent risk/context alerts that spot patterns you'd miss on your own.</div>
      <span class="feature-tag">Pattern Recognition</span>
    </div>
    <div class="feature-card reveal">
      <span class="feature-icon">🎬</span>
      <div class="feature-name">Money Wrapped</div>
      <div class="feature-desc">Spotify Wrapped — but for your wallet. 13 AI-curated slides that tell the story of your entire year in money.</div>
      <span class="feature-tag">Gemini AI</span>
    </div>
    <div class="feature-card reveal">
      <span class="feature-icon">🤖</span>
      <div class="feature-name">Copilot Chat</div>
      <div class="feature-desc">Context-aware AI assistant that knows your spending data. Ask it anything: "Was February unusually bad?" It knows.</div>
      <span class="feature-tag">Gemini 2.5</span>
    </div>
  </div>
</section>

<div class="divider"></div>

<!-- ── SCREENSHOTS ── -->
<section class="screenshots" id="screenshots">
  <div class="reveal">
    <div class="section-label">In Action</div>
    <h2 class="section-title">See it, believe it.</h2>
    <p class="section-sub">Three views from a live demo session.</p>
  </div>

  <div class="screenshots-grid">

    <div class="screenshot-item reveal">
      <img src="/mnt/user-data/uploads/1774158701563_image.png" alt="ValueVista Dashboard" />
      <div class="screenshot-caption">
        <div>
          <div class="cap-title">Main Dashboard</div>
          <div class="cap-desc">Balance, spending summary, Banana Index, and the 2025 Wrapped banner — all above the fold.</div>
        </div>
        <span class="cap-badge purple">Screen 1</span>
      </div>
    </div>

    <div class="screenshot-item reveal">
      <img src="/mnt/user-data/uploads/1774158729884_image.png" alt="Transaction Calendar" />
      <div class="screenshot-caption">
        <div>
          <div class="cap-title">Transaction Calendar</div>
          <div class="cap-desc">Every spending day mapped visually. Click a date → instant AI breakdown of what happened and why.</div>
        </div>
        <span class="cap-badge pink">Screen 2</span>
      </div>
    </div>

    <div class="screenshot-item reveal">
      <img src="/mnt/user-data/uploads/1774158758292_image.png" alt="Money Wrapped Slides" />
      <div class="screenshot-caption">
        <div>
          <div class="cap-title">Money Wrapped — AI Slide Deck</div>
          <div class="cap-desc">13 curated slides generated by Gemini. Top categories, weekend patterns, daily rhythm — your financial year as a story.</div>
        </div>
        <span class="cap-badge teal">Screen 3</span>
      </div>
    </div>

  </div>
</section>

<div class="divider"></div>

<!-- ── USER FLOW ── -->
<section class="section">
  <div class="reveal">
    <div class="section-label">User Journey</div>
    <h2 class="section-title">From zero to insight<br>in five steps.</h2>
  </div>

  <div class="flow-steps">
    <div class="flow-step reveal">
      <div class="flow-num">01</div>
      <div class="flow-content">
        <h3>Open the Dashboard</h3>
        <p>Instant overview of balance, daily average spend, and a real-world value anchor (the Banana Index).</p>
      </div>
    </div>
    <div class="flow-step reveal">
      <div class="flow-num">02</div>
      <div class="flow-content">
        <h3>Click a Calendar Date</h3>
        <p>Any transaction day expands into a per-category breakdown, explained by AI in plain language.</p>
      </div>
    </div>
    <div class="flow-step reveal">
      <div class="flow-num">03</div>
      <div class="flow-content">
        <h3>Explore the Monthly View</h3>
        <p>Trend charts + anomaly detection reveal if your spending is creeping up and which category is the culprit.</p>
      </div>
    </div>
    <div class="flow-step reveal">
      <div class="flow-num">04</div>
      <div class="flow-content">
        <h3>Watch Your Money Wrapped</h3>
        <p>Hit play on 13 AI-generated slides. Your year's spending habits told as a narrative, not a spreadsheet.</p>
      </div>
    </div>
    <div class="flow-step reveal">
      <div class="flow-num">05</div>
      <div class="flow-content">
        <h3>Ask the Copilot Anything</h3>
        <p>The context-aware assistant has your full data. Ask it anything — it gives direct, specific answers.</p>
      </div>
    </div>
  </div>
</section>

<div class="divider"></div>

<!-- ── TECH STACK ── -->
<section class="section">
  <div class="reveal">
    <div class="section-label">Tech Stack</div>
    <h2 class="section-title">Modern. Fast. Extensible.</h2>
  </div>

  <div class="tech-grid">
    <div class="tech-card reveal">
      <div class="tech-icon" style="background:rgba(0,0,0,0.3);">⚡</div>
      <div>
        <div class="tech-name">Next.js</div>
        <div class="tech-role">Frontend · App Router</div>
      </div>
    </div>
    <div class="tech-card reveal">
      <div class="tech-icon" style="background:rgba(0,0,0,0.3);">🐍</div>
      <div>
        <div class="tech-name">FastAPI</div>
        <div class="tech-role">Backend · Python</div>
      </div>
    </div>
    <div class="tech-card reveal">
      <div class="tech-icon" style="background:rgba(0,0,0,0.3);">🧠</div>
      <div>
        <div class="tech-name">Gemini 2.5</div>
        <div class="tech-role">AI · Flash Lite model</div>
      </div>
    </div>
    <div class="tech-card reveal">
      <div class="tech-icon" style="background:rgba(0,0,0,0.3);">📉</div>
      <div>
        <div class="tech-name">Recharts</div>
        <div class="tech-role">Data Visualization</div>
      </div>
    </div>
    <div class="tech-card reveal">
      <div class="tech-icon" style="background:rgba(0,0,0,0.3);">🎞</div>
      <div>
        <div class="tech-name">Framer Motion</div>
        <div class="tech-role">Animations</div>
      </div>
    </div>
    <div class="tech-card reveal">
      <div class="tech-icon" style="background:rgba(0,0,0,0.3);">🛡</div>
      <div>
        <div class="tech-name">Rule Engine</div>
        <div class="tech-role">AI Fallback · Offline safe</div>
      </div>
    </div>
  </div>
</section>

<div class="divider"></div>

<!-- ── SETUP ── -->
<section class="section" id="setup">
  <div class="reveal">
    <div class="section-label">Quick Start</div>
    <h2 class="section-title">Running in &lt; 2 minutes.</h2>
    <p class="section-sub">Two terminals. That's it.</p>
  </div>

  <div class="setup-grid">
    <div class="setup-card reveal">
      <div class="setup-header">
        <div class="setup-dot" style="background:#ff6b9d;"></div>
        <div class="setup-title">backend/</div>
      </div>
      <div class="setup-body">
        <pre><span class="comment"># Python backend (FastAPI)</span>
<span class="cmd">cd</span> backend
<span class="cmd">pip install</span> -r requirements.txt
<span class="cmd">uvicorn</span> app.main:app --reload

<span class="comment">→ http://127.0.0.1:8000</span></pre>
      </div>
    </div>

    <div class="setup-card reveal">
      <div class="setup-header">
        <div class="setup-dot" style="background:#7c6bff;"></div>
        <div class="setup-title">frontend/</div>
      </div>
      <div class="setup-body">
        <pre><span class="comment"># Next.js frontend</span>
<span class="cmd">cd</span> frontend
<span class="cmd">npm install</span>
<span class="cmd">npm run dev</span>

<span class="comment">→ http://localhost:3000</span></pre>
      </div>
    </div>

    <div class="env-card reveal">
      <div class="setup-header" style="border-bottom:1px solid var(--border);">
        <div class="setup-dot" style="background:#00e5c3;"></div>
        <div class="setup-title">Environment Variables</div>
      </div>
      <div class="env-grid">
        <div class="env-section">
          <div class="env-label">backend/.env</div>
          <pre><span class="key">GEMINI_MODEL</span>=<span class="val">gemini-2.5-flash-lite</span>
<span class="key">GEMINI_API_KEY</span>=<span class="val">your_key_here</span></pre>
        </div>
        <div class="env-section">
          <div class="env-label">frontend/.env.local</div>
          <pre><span class="key">NEXT_PUBLIC_API_BASE</span>=<span class="val">http://127.0.0.1:8000/api</span></pre>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ── FOOTER ── -->
<footer class="footer">
  <div>
    <div class="footer-brand">Value<span>Vista</span></div>
    <div class="footer-note" style="margin-top:6px;">Built for hackathon impact — fast to understand, useful in real life.</div>
  </div>
  <div class="footer-pills">
    <span class="pill">Next.js</span>
    <span class="pill">FastAPI</span>
    <span class="pill">Gemini AI</span>
    <span class="pill">PPP Engine</span>
    <span class="pill">Open Source</span>
  </div>
</footer>

<script>
  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 60);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));
</script>

</body>
</html>