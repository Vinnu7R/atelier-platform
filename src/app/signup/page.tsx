"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase-client";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const supabase = createClient();

  async function handleSignup() {
    if (!email.includes("@") || password.length < 8) {
      setError("Use a valid email and a password of at least 8 characters.");
      return;
    }
    setStatus("loading");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/onboarding` },
    });
    if (error) { setError(error.message); setStatus("error"); }
    else setStatus("done");
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
      {/* Left */}
      <div style={{ background: "var(--ink)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 80% 20%, rgba(42,76,138,0.25), transparent 60%)" }} />
        <Link href="/" style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--paper)", textDecoration: "none", position: "relative" }}>
          Atelier
        </Link>
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: "clamp(36px,4vw,60px)", fontWeight: 300, color: "var(--paper)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24 }}>
            Open your<br /><em style={{ fontStyle: "italic", color: "var(--accent)" }}>studio.</em>
          </div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "rgba(245,240,232,0.5)", lineHeight: 1.7 }}>
            Join a community where your identity is built by what you make, not what you've made.
          </div>
        </div>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "rgba(245,240,232,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", position: "relative" }}>
          Hyderabad · 2025
        </div>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 12 }}>✦ Join Atelier</div>
            <h1 style={{ fontSize: 36, fontWeight: 300, letterSpacing: "-0.02em" }}>Create account</h1>
          </div>

          {status === "done" ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>✉️</div>
              <div style={{ fontSize: 20, fontWeight: 300, marginBottom: 12 }}>Confirm your email</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
                We sent a confirmation to <strong>{email}</strong>.<br />Click the link to activate your account.
              </div>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>Email</div>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{ width: "100%", padding: "14px 16px", border: "1px solid var(--rule)", background: "transparent", outline: "none", fontFamily: "'DM Mono',monospace", fontSize: 13, color: "var(--ink)" }} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>Password</div>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSignup()}
                  placeholder="At least 8 characters"
                  style={{ width: "100%", padding: "14px 16px", border: "1px solid var(--rule)", background: "transparent", outline: "none", fontFamily: "'DM Mono',monospace", fontSize: 13, color: "var(--ink)" }} />
              </div>
              {error && <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--accent)", marginBottom: 16 }}>{error}</div>}
              <button onClick={handleSignup} disabled={status === "loading"}
                style={{ width: "100%", padding: "16px", background: "var(--ink)", color: "var(--paper)", border: "none", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", transition: "background 0.2s", opacity: status === "loading" ? 0.7 : 1 }}>
                {status === "loading" ? "…" : "Create Account →"}
              </button>
              <div style={{ marginTop: 16, fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", lineHeight: 1.6 }}>
                By signing up you agree to our terms. No spam, ever.
              </div>
            </>
          )}

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--rule)", fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--muted)", textAlign: "center" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--accent)", textDecoration: "none" }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
