"use client";
import { useEffect, useState } from "react";

type WaitlistEntry = {
  id: string;
  email: string;
  source: string;
  signed_up_at: string;
};

export default function AdminPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  async function login() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
        setAuthed(true);
        setError("");
      } else {
        setError("Wrong password");
      }
    } catch (err) {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!authed) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/admin/waitlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: pw }),
        });
        if (res.ok) {
          const data = await res.json();
          setEntries(data);
        }
      } catch (err) {
        console.error("Auto-refresh failed");
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [authed, pw]);

  function exportCSV() {
    const rows = [
      ["Email", "Source", "Signed Up"].join(","),
      ...entries.map((e) =>
        [e.email, e.source, new Date(e.signed_up_at).toLocaleString()].join(",")
      ),
    ].join("\n");
    const blob = new Blob([rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "atelier-waitlist.csv";
    a.click();
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="text-center w-full max-w-[360px] px-6">
          <div className="font-syne font-extrabold text-3xl tracking-widest mb-2">ATELIER</div>
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mb-10">Admin Access</div>
          <div className="flex border border-ink overflow-hidden">
            <input
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === "Enter" && login()}
              placeholder="Password"
              className="flex-1 px-4 py-3 bg-transparent border-none outline-none font-mono text-sm text-ink placeholder:opacity-50"
            />
            <button 
              onClick={login}
              className="px-5 py-3 bg-ink text-paper font-syne font-semibold text-[11px] tracking-widest uppercase transition-opacity hover:opacity-90 active:scale-95"
            >
              Enter
            </button>
          </div>
          {error && <div className="text-accent font-mono text-[11px] mt-3">{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper p-6 md:p-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end border-b border-rule pb-6 mb-12 gap-4">
        <div>
          <div className="font-syne font-extrabold text-2xl tracking-widest">ATELIER</div>
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mt-1">Waitlist Dashboard</div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="font-mono text-[11px] text-muted">
            {entries.length} signups
          </div>
          <button 
            onClick={exportCSV}
            className="px-5 py-2.5 border border-ink font-syne font-semibold text-[11px] tracking-widest uppercase text-ink transition-all hover:bg-ink hover:text-paper active:scale-95"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule border border-rule mb-12 overflow-hidden shadow-sm">
        {[
          { num: entries.length, label: "Total signups" },
          { num: entries.filter(e => e.source === "landing").length, label: "From landing page" },
          { num: entries.filter(e => {
            const d = new Date(e.signed_up_at);
            const now = new Date();
            return d.toDateString() === now.toDateString();
          }).length, label: "Today" },
        ].map((s, i) => (
          <div key={i} className="bg-paper p-8">
            <div className="text-5xl font-light tracking-tighter leading-none mb-2">{s.num}</div>
            <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="font-mono text-xs text-muted text-center py-20 animate-pulse">Synchronizing database...</div>
      ) : (
        <div className="border border-rule overflow-x-auto shadow-sm">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-[1fr_160px_200px] bg-ink text-paper px-6 py-3 font-mono text-[10px] tracking-widest uppercase">
              <div>Email</div>
              <div>Source</div>
              <div>Signed Up</div>
            </div>
            {entries.length === 0 && (
              <div className="py-20 text-center font-mono text-xs text-muted bg-paper">
                No signups yet. Share the landing page!
              </div>
            )}
            {entries.map((e, i) => (
              <div key={e.id} className={`grid grid-cols-[1fr_160px_200px] px-6 py-4 border-t border-rule transition-colors hover:bg-warm/50 ${i % 2 === 0 ? "bg-paper" : "bg-warm/30"}`}>
                <div className="text-base font-light truncate pr-4">{e.email}</div>
                <div className="font-mono text-[10px] text-accent tracking-widest uppercase pt-1">{e.source}</div>
                <div className="font-mono text-[11px] text-muted">
                  {new Date(e.signed_up_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
