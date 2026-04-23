"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

const ROLES = ["Product Designer","Indie Developer","Founder","Writer","Visual Artist","Engineer","Researcher","Strategist","Filmmaker","Educator","Other"];
const SKILLS_OPTIONS = ["React","TypeScript","Python","Figma","Systems Thinking","Copywriting","Motion Design","Generative AI","Data","Product Strategy","Brand","Community","Hardware","No-Code","Blockchain"];

type Step = 1 | 2 | 3 | 4;

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState<Step>(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    display_name: "",
    username: "",
    role: "",
    tagline: "",
    current_work: "",
    about: "",
    skills: [] as string[],
    location: "Hyderabad, India",
    website: "",
    twitter: "",
    github: "",
  });

  function update(key: string, val: string | string[]) {
    setForm(f => ({ ...f, [key]: val }));
  }

  function toggleSkill(skill: string) {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(skill) ? f.skills.filter(s => s !== skill) : [...f.skills, skill],
    }));
  }

  async function finish() {
    setSaving(true);
    setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { error } = await supabase.from("profiles").upsert({
      user_id: user.id,
      ...form,
      is_onboarded: true,
      updated_at: new Date().toISOString(),
    });

    if (error) { setError(error.message); setSaving(false); return; }
    router.push("/feed");
  }

  const stepLabels = ["Who are you?", "Your craft", "Your work", "Your links"];
  const progress = (step / 4) * 100;

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{ padding: "24px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--rule)" }}>
        <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: "0.12em", textTransform: "uppercase" }}>Atelier</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {[1,2,3,4].map(n => (
            <div key={n} style={{ width: n === step ? 24 : 8, height: 8, borderRadius: 4, background: n <= step ? "var(--accent)" : "var(--rule)", transition: "all 0.3s" }} />
          ))}
        </div>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Step {step} of 4 — {stepLabels[step - 1]}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: "var(--rule)" }}>
        <div style={{ height: "100%", background: "var(--accent)", width: `${progress}%`, transition: "width 0.4s ease" }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 48px" }}>
        <div style={{ width: "100%", maxWidth: 560 }}>

          {/* STEP 1 — Identity */}
          {step === 1 && (
            <div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16 }}>✦ Step 1</div>
              <h2 style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 300, letterSpacing: "-0.02em", marginBottom: 8 }}>Who are you?</h2>
              <p style={{ fontSize: 16, color: "var(--muted)", fontWeight: 300, marginBottom: 40, lineHeight: 1.6 }}>Let's set up the basics. This is how the community will know you.</p>

              <Field label="Display name" placeholder="e.g. Meera Krishnan">
                <input value={form.display_name} onChange={e => update("display_name", e.target.value)} placeholder="e.g. Meera Krishnan" style={inputStyle} />
              </Field>
              <Field label="Username" placeholder="@yourname" hint="This is your @handle on Atelier">
                <div style={{ display: "flex", border: "1px solid var(--rule)", overflow: "hidden" }}>
                  <span style={{ padding: "14px 16px", fontFamily: "'DM Mono',monospace", fontSize: 13, color: "var(--muted)", borderRight: "1px solid var(--rule)", background: "var(--warm)" }}>@</span>
                  <input value={form.username} onChange={e => update("username", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,""))} placeholder="yourname" style={{ ...inputStyle, border: "none", flex: 1 }} />
                </div>
              </Field>
              <Field label="Your role">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {ROLES.map(r => (
                    <button key={r} onClick={() => update("role", r)}
                      style={{ padding: "8px 16px", border: `1px solid ${form.role === r ? "var(--accent)" : "var(--rule)"}`, background: form.role === r ? "var(--accent)" : "transparent", color: form.role === r ? "white" : "var(--ink)", cursor: "pointer", fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: "0.08em", transition: "all 0.15s" }}>
                      {r}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Location">
                <input value={form.location} onChange={e => update("location", e.target.value)} style={inputStyle} />
              </Field>
            </div>
          )}

          {/* STEP 2 — Craft */}
          {step === 2 && (
            <div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16 }}>✦ Step 2</div>
              <h2 style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 300, letterSpacing: "-0.02em", marginBottom: 8 }}>Your craft</h2>
              <p style={{ fontSize: 16, color: "var(--muted)", fontWeight: 300, marginBottom: 40, lineHeight: 1.6 }}>What do you do, in your own words? This isn't a job title — it's your identity.</p>

              <Field label="Tagline" hint="One sentence. What's your thing?">
                <input value={form.tagline} onChange={e => update("tagline", e.target.value)} placeholder="e.g. I design systems that feel inevitable" style={inputStyle} />
              </Field>
              <Field label="About" hint="Tell your story. What drives you?">
                <textarea value={form.about} onChange={e => update("about", e.target.value)}
                  placeholder="A bit about your background, what you care about, how you think..." rows={5}
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
              </Field>
              <Field label="Skills — pick what applies">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {SKILLS_OPTIONS.map(s => (
                    <button key={s} onClick={() => toggleSkill(s)}
                      style={{ padding: "8px 16px", border: `1px solid ${form.skills.includes(s) ? "var(--accent2)" : "var(--rule)"}`, background: form.skills.includes(s) ? "var(--accent2)" : "transparent", color: form.skills.includes(s) ? "white" : "var(--ink)", cursor: "pointer", fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: "0.08em", transition: "all 0.15s" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          )}

          {/* STEP 3 — Current Work */}
          {step === 3 && (
            <div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16 }}>✦ Step 3</div>
              <h2 style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 300, letterSpacing: "-0.02em", marginBottom: 8 }}>Your work</h2>
              <p style={{ fontSize: 16, color: "var(--muted)", fontWeight: 300, marginBottom: 40, lineHeight: 1.6 }}>
                This is the most important field on Atelier. Not what you've built — what you're <em style={{ fontStyle: "italic" }}>building right now.</em>
              </p>
              <Field label="What are you currently working on?" hint="Be specific. The more real, the better your matches.">
                <textarea value={form.current_work} onChange={e => update("current_work", e.target.value)}
                  placeholder="e.g. Building an open-source React devtools library that makes component debugging visual. Working through the state management layer right now — it's messy but exciting." rows={6}
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }} />
              </Field>
              <div style={{ marginTop: 16, padding: "16px 20px", background: "var(--warm)", border: "1px solid var(--rule)" }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 8 }}>✦ Pro tip</div>
                <div style={{ fontSize: 14, color: "var(--muted)", fontWeight: 300, lineHeight: 1.6 }}>
                  Don't edit yourself. The AI matching engine works best when you write how you think — messy, specific, honest. "Working on X" is weaker than "Struggling with Y while building X because Z."
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 — Links */}
          {step === 4 && (
            <div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16 }}>✦ Step 4</div>
              <h2 style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 300, letterSpacing: "-0.02em", marginBottom: 8 }}>Your links</h2>
              <p style={{ fontSize: 16, color: "var(--muted)", fontWeight: 300, marginBottom: 40, lineHeight: 1.6 }}>All optional. Add what's relevant.</p>

              <Field label="Website">
                <input value={form.website} onChange={e => update("website", e.target.value)} placeholder="https://yoursite.com" style={inputStyle} />
              </Field>
              <Field label="Twitter / X">
                <div style={{ display: "flex", border: "1px solid var(--rule)", overflow: "hidden" }}>
                  <span style={{ padding: "14px 16px", fontFamily: "'DM Mono',monospace", fontSize: 13, color: "var(--muted)", borderRight: "1px solid var(--rule)", background: "var(--warm)", whiteSpace: "nowrap" }}>x.com/</span>
                  <input value={form.twitter} onChange={e => update("twitter", e.target.value)} placeholder="handle" style={{ ...inputStyle, border: "none", flex: 1 }} />
                </div>
              </Field>
              <Field label="GitHub">
                <div style={{ display: "flex", border: "1px solid var(--rule)", overflow: "hidden" }}>
                  <span style={{ padding: "14px 16px", fontFamily: "'DM Mono',monospace", fontSize: 13, color: "var(--muted)", borderRight: "1px solid var(--rule)", background: "var(--warm)", whiteSpace: "nowrap" }}>github.com/</span>
                  <input value={form.github} onChange={e => update("github", e.target.value)} placeholder="username" style={{ ...inputStyle, border: "none", flex: 1 }} />
                </div>
              </Field>

              {error && <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--accent)", marginTop: 16 }}>{error}</div>}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--rule)" }}>
            {step > 1 ? (
              <button onClick={() => setStep((step - 1) as Step)}
                style={{ padding: "14px 28px", background: "transparent", border: "1px solid var(--rule)", cursor: "pointer", fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", transition: "all 0.2s" }}>
                ← Back
              </button>
            ) : <div />}

            {step < 4 ? (
              <button onClick={() => setStep((step + 1) as Step)}
                style={{ padding: "14px 32px", background: "var(--ink)", color: "var(--paper)", border: "none", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", transition: "background 0.2s" }}>
                Continue →
              </button>
            ) : (
              <button onClick={finish} disabled={saving}
                style={{ padding: "14px 32px", background: "var(--accent)", color: "white", border: "none", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Opening studio…" : "Open My Studio ✦"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helpers
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "14px 16px", border: "1px solid var(--rule)",
  background: "transparent", outline: "none",
  fontFamily: "'DM Mono',monospace", fontSize: 13, color: "var(--ink)",
};

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>{label}</div>
      {children}
      {hint && <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", marginTop: 6, opacity: 0.7 }}>{hint}</div>}
    </div>
  );
}
