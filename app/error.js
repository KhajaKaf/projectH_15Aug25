"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body style={{ padding: 24, color: "#e2e8f0", background: "#0f172a" }}>
        <h1>Something went wrong</h1>
        <pre style={{ whiteSpace: "pre-wrap" }}>{String(error?.message || "")}</pre>
        <button
          onClick={() => reset()}
          style={{ marginTop: 12, padding: "8px 12px", border: "1px solid #d4af37" }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}