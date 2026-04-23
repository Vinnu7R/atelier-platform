"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

<<<<<<< feat-landing-waitlist-admin-13611724740468442413
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
=======
  const ADMIN_PW = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "atelier2025";

  function login() {
    if (pw === ADMIN_PW) {
      setAuthed(true);
      setError("");
    } else {
      setError("Wrong password");
>>>>>>> main
    }
  }

  useEffect(() => {
    if (!authed) return;
<<<<<<< feat-landing-waitlist-admin-13611724740468442413
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
=======
    async function fetchEntries() {
      const { data, error } = await supabase
        .from("waitlist")
        .select("*")
        .order("signed_up_at", { ascending: false });
      if (!error && data) setEntries(data);
      setLoading(false);
    }
    fetchEntries();
  }, [authed]);
>>>>>>> main

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
      <div style={{ minHeight: "100vh", background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 360 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "0.1em", marginBottom: 8 }}>ATELIER</div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 40 }}>Admin Access</div>
          <div style={{ display: "flex", border: "1px solid var(--ink)", overflow: "hidden" }}>
            <input
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === "Enter" && login()}
              placeholder="Password"
              style={{ flex: 1, padding: "12px 16px", background: "transparent", border: "none", outline: "none", fontFamily: "'DM Mono',monospace", fontSize: 13, color: "var(--ink)" }}
            />
            <button onClick={login} style={{ padding: "12px 20px", background: "var(--ink)", color: "var(--paper)", border: "none", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Enter
            </button>
          </div>
          {error && <div style={{ color: "var(--accent)", fontFamily: "'DM Mono',monospace", fontSize: 11, marginTop: 12 }}>{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", padding: "48px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid var(--rule)", paddingBottom: 24, marginBottom: 48 }}>
        <div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 24, letterSpacing: "0.1em" }}>ATELIER</div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", marginTop: 4 }}>Waitlist Dashboard</div>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--muted)" }}>
            {entries.length} signups
          </div>
          <button onClick={exportCSV} style={{ padding: "10px 20px", background: "transparent", border: "1px solid var(--ink)", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink)", transition: "all 0.2s" }}>
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "var(--rule)", border: "1px solid var(--rule)", marginBottom: 48 }}>
        {[
          { num: entries.length, label: "Total signups" },
          { num: entries.filter(e => e.source === "landing").length, label: "From landing page" },
          { num: entries.filter(e => {
            const d = new Date(e.signed_up_at);
            const now = new Date();
            return d.toDateString() === now.toDateString();
          }).length, label: "Today" },
        ].map((s, i) => (
          <div key={i} style={{ background: "var(--paper)", padding: "32px 36px" }}>
            <div style={{ fontSize: 48, fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 8 }}>{s.num}</div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "var(--muted)", textAlign: "center", padding: 80 }}>Loading...</div>
      ) : (
        <div style={{ border: "1px solid var(--rule)", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 160px 200px", background: "var(--ink)", color: "var(--paper)", padding: "12px 24px" }}>
            {["Email", "Source", "Signed Up"].map(h => (
              <div key={h} style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>{h}</div>
            ))}
          </div>
          {entries.length === 0 && (
            <div style={{ padding: "48px 24px", textAlign: "center", fontFamily: "'DM Mono',monospace", fontSize: 12, color: "var(--muted)" }}>
              No signups yet. Share the landing page!
            </div>
          )}
          {entries.map((e, i) => (
            <div key={e.id} style={{ display: "grid", gridTemplateColumns: "1fr 160px 200px", padding: "16px 24px", borderTop: "1px solid var(--rule)", background: i % 2 === 0 ? "var(--paper)" : "var(--warm)", transition: "background 0.2s" }}>
              <div style={{ fontSize: 16, fontWeight: 300 }}>{e.email}</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase", paddingTop: 4 }}>{e.source}</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--muted)" }}>
                {new Date(e.signed_up_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
