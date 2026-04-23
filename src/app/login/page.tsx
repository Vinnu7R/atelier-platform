"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase-client";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "magic">("idle");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"password" | "magic">("magic");

  const supabase = createClient();

  async function handleMagicLink() {
    if (!email.includes("@")) return;
    setStatus("loading");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/feed` },
    });
    if (error) { setError(error.message); setStatus("error"); }
    else setStatus("magic");
  }

  async function handlePassword() {
    if (!email.includes("@") || !password) return;
    setStatus("loading");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setStatus("error"); }
    else window.location.href = "/feed";
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
      {/* Left — branding */}
      <div style={{ background: "var(--ink)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 80%, rgba(200,80,42,0.2), transparent 60%)" }} />
        <Link href="/" style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--paper)", textDecoration: "none", position: "relative" }}>
          Atelier
        </Link>
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: "clamp(36px,4vw,60px)", fontWeight: 300, color: "var(--paper)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24 }}>
            Your studio<br />awaits.
          </div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "rgba(245,240,232,0.5)", lineHeight: 1.7 }}>
            Sign in to your Atelier account and get back to what you're building.
          </div>
        </div>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "rgba(245,240,232,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", position: "relative" }}>
          Hyderabad · 2025
        </div>
      </div>

      {/* Right — form */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 12 }}>Welcome back</div>
            <h1 style={{ fontSize: 36, fontWeight: 300, letterSpacing: "-0.02em" }}>Sign in</h1>
          </div>

          {/* Mode toggle */}
          <div style={{ display: "flex", gap: 0, border: "1px solid var(--rule)", marginBottom: 32, overflow: "hidden" }}>
            {(["magic", "password"] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setStatus("idle"); setError(""); }}
                style={{ flex: 1, padding: "10px", background: mode === m ? "var(--ink)" : "transparent", color: mode === m ? "var(--paper)" : "var(--muted)", border: "none", cursor: "pointer", fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", transition: "all 0.2s" }}>
                {m === "magic" ? "Magic Link" : "Password"}
              </button>
            ))}
          </div>

          {status === "magic" ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>✉️</div>
              <div style={{ fontSize: 20, fontWeight: 300, marginBottom: 12 }}>Check your email</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
                We sent a magic link to <strong>{email}</strong>.<br />Click it to sign in instantly.
              </div>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>Email</div>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && (mode === "magic" ? handleMagicLink() : handlePassword())}
                  placeholder="your@email.com"
                  style={{ width: "100%", padding: "14px 16px", border: "1px solid var(--rule)", background: "transparent", outline: "none", fontFamily: "'DM Mono',monospace", fontSize: 13, color: "var(--ink)", transition: "border-color 0.2s" }} />
              </div>

              {mode === "password" && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>Password</div>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handlePassword()}
                    placeholder="••••••••"
                    style={{ width: "100%", padding: "14px 16px", border: "1px solid var(--rule)", background: "transparent", outline: "none", fontFamily: "'DM Mono',monospace", fontSize: 13, color: "var(--ink)" }} />
                </div>
              )}

              {error && (
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--accent)", marginBottom: 16 }}>{error}</div>
              )}

              <button onClick={mode === "magic" ? handleMagicLink : handlePassword} disabled={status === "loading"}
                style={{ width: "100%", padding: "16px", background: "var(--ink)", color: "var(--paper)", border: "none", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", transition: "background 0.2s", opacity: status === "loading" ? 0.7 : 1 }}>
                {status === "loading" ? "…" : mode === "magic" ? "Send Magic Link" : "Sign In"}
              </button>
            </>
          )}

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--rule)", fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--muted)", textAlign: "center" }}>
            Don't have an account?{" "}
            <Link href="/signup" style={{ color: "var(--accent)", textDecoration: "none" }}>Join Atelier</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
