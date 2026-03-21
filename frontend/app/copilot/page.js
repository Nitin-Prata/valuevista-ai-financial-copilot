"use client";

import { useState } from "react";

import AppShell from "../../components/ui/AppShell";
import { askCopilot } from "../../lib/api";

const quickPrompts = [
  "What is my top spending category?",
  "How can I save more this month?",
  "Give me one practical budget action for this week.",
  "Is my spending pattern risky?",
];

export default function CopilotPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi, I am your ValueVista Copilot. Ask me about your spending." },
  ]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState(quickPrompts);

  async function sendMessage(event) {
    event.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await askCopilot(userMessage.text, { page: "copilot_chat" });
      setMessages((prev) => [...prev, { role: "assistant", text: response.answer }]);
      setSuggestions(response.suggestions || quickPrompts);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "I could not reach backend APIs. Please make sure FastAPI is running." },
      ]);
    }

    setInput("");
  }

  return (
    <AppShell title="Copilot Chat" subtitle="Simple AI-style finance assistant powered by backend logic.">
      <div className="card" style={{ minHeight: 420 }}>
        <div className="topbar">
          {suggestions.map((prompt) => (
            <button key={prompt} className="pill" onClick={() => setInput(prompt)}>
              {prompt}
            </button>
          ))}
        </div>
        <ul className="list">
          {messages.map((m, idx) => (
            <li
              key={`${m.role}-${idx}`}
              className="pill"
              style={{ background: m.role === "assistant" ? "#0f2446" : "#11301f" }}
            >
              <strong>{m.role === "assistant" ? "Copilot" : "You"}:</strong> {m.text}
            </li>
          ))}
        </ul>
        <form onSubmit={sendMessage} style={{ marginTop: 12 }} className="row">
          <input
            className="input"
            placeholder="Ask about your spending..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="btn" type="submit">
            Send
          </button>
        </form>
      </div>
    </AppShell>
  );
}
