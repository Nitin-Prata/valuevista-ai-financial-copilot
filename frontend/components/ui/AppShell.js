"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/analyzer", label: "Analyzer" },
  { href: "/transactions", label: "Transactions" },
  { href: "/wrapped", label: "Wrapped" },
  { href: "/copilot", label: "Copilot" },
];

export default function AppShell({ title, subtitle, children }) {
  const pathname = usePathname();

  return (
    <main className="container">
      <div className="topbar">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`pill ${pathname === item.href ? "pill-active" : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <section className="card" style={{ marginBottom: 16 }}>
        <h1 className="title">{title}</h1>
        {subtitle ? <p className="muted">{subtitle}</p> : null}
      </section>

      {children}
    </main>
  );
}
