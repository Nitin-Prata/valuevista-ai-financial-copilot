/**
 * Server-side FX so the client gets a consistent USD→INR rate (Frankfurter ECB data).
 */
export async function GET() {
  try {
    const res = await fetch("https://api.frankfurter.app/latest?from=USD&to=INR", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("fx fetch failed");
    const data = await res.json();
    const rate = data?.rates?.INR;
    return Response.json({
      rate: typeof rate === "number" && rate > 0 ? rate : 83.5,
      date: data?.date || null,
      source: "frankfurter.app",
    });
  } catch {
    return Response.json({ rate: 83.5, date: null, source: "fallback" });
  }
}
