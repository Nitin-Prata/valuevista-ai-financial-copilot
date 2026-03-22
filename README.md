<div align="center">

<br/>

# 💸 ValueVista
### AI Financial Copilot — Understand the *real* value of money, anywhere.

<br/>

> **Is ₹500 cheap or expensive?**
> Depends on where you are. ValueVista tells you in **5 seconds** — with AI-powered purchasing power context.

<br/>

[![Made with Next.js](https://img.shields.io/badge/Frontend-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini%202.5-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![PPP Engine](https://img.shields.io/badge/Engine-PPP%20Logic-7c6bff?style=for-the-badge)]()
[![Hackathon](https://img.shields.io/badge/Built%20For-Hackathon%202026-ff6b9d?style=for-the-badge)]()

<br/>

| ⚡ 5 seconds | 🎬 13 AI Slides | 🌍 PPP Engine | 🤖 Copilot |
|:---:|:---:|:---:|:---:|
| To understand any price | Yearly money recap | Real purchasing power | Ask it anything |

</div>

---

## 🔥 The Problem

Currency conversion is **broken as a concept**.

```
$100 in San Francisco  ≠  $100 in Mumbai  ≠  $100 in Berlin
```

Apps tell you the *converted* number. Nobody tells you if it's **cheap, fair, or a rip-off** in context.

**ValueVista fixes this** — combining Purchasing Power Parity (PPP) logic with Gemini AI to give you verdict-level clarity: *cheap / normal / expensive.*

---

## 🖥️ Screenshots

### 1 · Main Dashboard
> Balance, daily average, Banana Index, and the 2025 Wrapped banner — all above the fold.

![Dashboard](screenshots\image.png)

---

### 2 · Transaction Calendar
> Click any date → AI-powered breakdown of exactly what you spent and why it matters.

![Calendar](./screenshots/calendar.png)

---

### 3 · Money Wrapped — AI Slide Deck
> 13 Gemini-generated slides. Top categories, weekend patterns, daily rhythm — your year as a story.

![Wrapped](./screenshots/wrapped.png)

---

## ✨ Features

| Feature | What It Does |
|---|---|
| 🔍 **Price Analyzer** | Enter amount + country → get PPP verdict + "worth it?" guidance instantly |
| 📊 **Live Dashboard** | Balance, daily avg spend, Banana Index (fun real-world value gauge) |
| 📅 **Transaction Calendar** | Click any day → AI explains your spending in plain language |
| 📈 **Monthly Deep Dive** | Trend charts + anomaly detection + risk/context alerts |
| 🎬 **Money Wrapped** | Spotify Wrapped for your wallet — 13 AI-curated slides of your year |
| 🤖 **Copilot Chat** | Ask *"Was February unusually bad?"* — it knows. Context-aware via Gemini |

---

## 🗺️ User Flow

```
1. Open Dashboard      →  Balance + daily avg + Banana Index at a glance
2. Click Calendar Day  →  AI explains per-category breakdown for that date
3. Monthly Deep Dive   →  Trend charts + anomaly detection, month by month
4. Watch Wrapped       →  13-slide AI narrative of your full spending year
5. Ask Copilot         →  Context-aware chat with your full financial data
```

---

## 🛠️ Tech Stack

```
Frontend   →  Next.js (App Router) + Recharts + Framer Motion + Swiper
Backend    →  FastAPI (Python)
AI         →  Gemini API (gemini-2.5-flash-lite) + rule-based fallback engine
Data       →  Local JSON — PPP reference data + transaction history
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- A [Gemini API key](https://aistudio.google.com/)

---

### Step 1 — Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

> Runs at: `http://127.0.0.1:8000`

---

### Step 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

> Runs at: `http://localhost:3000`

---

### Step 3 — Environment Variables

**`backend/.env`**
```env
GEMINI_MODEL=gemini-2.5-flash-lite
GEMINI_API_KEY=your_gemini_api_key_here
```

**`frontend/.env.local`**
```env
NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000/api
```

---

## 📁 Project Structure

```
backend/app/
├── main.py
├── routes/
├── services/
├── data/
└── utils/

frontend/
├── app/
├── components/
├── lib/
└── styles/
```

---

## 💡 Why This Wins

- ✅ **Real user pain** — cross-country money confusion affects millions of travelers, expats, remote workers
- ✅ **Working AI** — Gemini integrated with practical, verdict-level outputs (not just chatbot fluff)
- ✅ **Delight factor** — Money Wrapped turns dry data into a story people *want* to share
- ✅ **Resilient** — Rule-based fallback means it works even without AI API access
- ✅ **Demo-ready** — Clean UI, live data, zero setup friction for judges

---

<div align="center">

**Built for hackathon impact** · Fast to understand · Useful in real life · Easy to extend

*ValueVista — because the number on the screen is never the whole story.*

</div>