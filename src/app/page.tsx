"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [email2, setEmail2] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [status2, setStatus2] = useState<"idle" | "loading" | "done" | "error">("idle");
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; if (cursorRef.current) { cursorRef.current.style.left = mx + "px"; cursorRef.current.style.top = my + "px"; } };
    document.addEventListener("mousemove", onMove);
    let raf: number;
    function animate() { rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12; if (ringRef.current) { ringRef.current.style.left = rx + "px"; ringRef.current.style.top = ry + "px"; } raf = requestAnimationFrame(animate); }
    animate();
    return () => { document.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  // Scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  async function submitWaitlist(emailVal: string, setter: typeof setStatus, source: string) {
    if (!emailVal || !emailVal.includes("@")) return;
    setter("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailVal, source }),
      });
      if (res.ok) setter("done");
      else setter("error");
    } catch { setter("error"); }
  }

  return (
    <>
      <style>{`
        :root { --ink:#0e0d0c;--paper:#f5f0e8;--warm:#f0e6d0;--accent:#c8502a;--accent2:#2a4c8a;--muted:#8a8070;--rule:rgba(14,13,12,0.12); }
        body { cursor: none; background: var(--paper); }
        .cursor { position:fixed;width:8px;height:8px;background:var(--accent);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:transform 0.15s; }
        .cursor-ring { position:fixed;width:36px;height:36px;border:1px solid var(--accent);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);opacity:0.5;transition:opacity 0.3s; }
        body::before { content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");pointer-events:none;z-index:100;opacity:0.6; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)} }
        @keyframes marquee { from{transform:translateX(0)}to{transform:translateX(-50%)} }
        @keyframes floatA { 0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-8px) rotate(-2deg)} }
        @keyframes floatB { 0%,100%{transform:translateY(0) rotate(1.5deg)}50%{transform:translateY(-10px) rotate(1.5deg)} }
        @keyframes floatC { 0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-6px) rotate(-1deg)} }
        @keyframes floatD { 0%,100%{transform:translateY(0) rotate(2deg)}50%{transform:translateY(-9px) rotate(2deg)} }
        .reveal { opacity:0;transform:translateY(20px);transition:opacity 0.7s ease,transform 0.7s ease; }
        .reveal.visible { opacity:1;transform:translateY(0); }
        .anim-hero-eyebrow { animation:fadeUp 0.8s 0.2s forwards;opacity:0; }
        .anim-hero-title { animation:fadeUp 0.8s 0.4s forwards;opacity:0; }
        .anim-hero-sub { animation:fadeUp 0.8s 0.6s forwards;opacity:0; }
        .anim-hero-form { animation:fadeUp 0.8s 0.8s forwards;opacity:0; }
        .card-a { animation:fadeUp 0.8s 1s forwards, floatA 6s 1s ease-in-out infinite;opacity:0; }
        .card-b { animation:fadeUp 0.8s 1.2s forwards, floatB 7s 1.2s ease-in-out infinite;opacity:0; }
        .card-c { animation:fadeUp 0.8s 1.4s forwards, floatC 8s 1.4s ease-in-out infinite;opacity:0; }
        .card-d { animation:fadeUp 0.8s 1.6s forwards, floatD 5s 1.6s ease-in-out infinite;opacity:0; }
        .form-btn:hover { background: var(--accent) !important; }
        .step:hover { background: var(--warm) !important; }
        .nav-link:hover { color: var(--ink) !important; }
      `}</style>

      <div ref={cursorRef} className="cursor" />
      <div ref={ringRef} className="cursor-ring" />

      {/* NAV */}
      <nav style={{ position:"fixed",top:0,left:0,right:0,padding:"24px 48px",display:"flex",justifyContent:"space-between",alignItems:"center",zIndex:50,mixBlendMode:"multiply" }}>
        <span style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,letterSpacing:"0.12em",textTransform:"uppercase" }}>Atelier</span>
        <div style={{ fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:"0.08em",color:"var(--muted)",display:"flex",gap:32 }}>
          {["#how","#values","#waitlist"].map((h, i) => (
            <a key={h} href={h} className="nav-link" style={{ color:"inherit",textDecoration:"none" }}>{["How it works","Manifesto","Join waitlist"][i]}</a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight:"100vh",display:"grid",gridTemplateColumns:"1fr 1fr" }}>
        <div style={{ padding:"160px 48px 80px",display:"flex",flexDirection:"column",justifyContent:"space-between",borderRight:"1px solid var(--rule)" }}>
          <div>
            <div className="anim-hero-eyebrow" style={{ fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--accent)",marginBottom:32 }}>✦ Creator community platform — Hyderabad · Est. 2025</div>
            <h1 className="anim-hero-title" style={{ fontSize:"clamp(64px,7vw,108px)",fontWeight:300,lineHeight:0.92,letterSpacing:"-0.02em" }}>
              Work<br/><em style={{ fontStyle:"italic",color:"var(--accent)" }}>in</em><br/>public.
            </h1>
            <p className="anim-hero-sub" style={{ fontSize:19,fontWeight:300,lineHeight:1.6,color:"var(--muted)",maxWidth:420,marginTop:40 }}>
              Atelier is where creators are known for what they build, not just what they've shipped. A community built around process, identity, and the craft of making.
            </p>
          </div>
          <div className="anim-hero-form" id="waitlist">
            {status !== "done" ? (
              <div style={{ maxWidth:400 }}>
                <div style={{ fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--muted)",marginBottom:12 }}>Join the waitlist — be first in</div>
                <div style={{ display:"flex",border:"1px solid var(--ink)",overflow:"hidden",marginBottom:10 }}>
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submitWaitlist(email,setStatus,"hero")} placeholder="your@email.com" style={{ flex:1,padding:"14px 20px",background:"transparent",border:"none",outline:"none",fontFamily:"'DM Mono',monospace",fontSize:13,color:"var(--ink)" }} />
                  <button className="form-btn" onClick={()=>submitWaitlist(email,setStatus,"hero")} style={{ padding:"14px 28px",background:"var(--ink)",color:"var(--paper)",border:"none",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",transition:"background 0.2s",whiteSpace:"nowrap" }}>
                    {status==="loading"?"…":"Request Access"}
                  </button>
                </div>
                <div style={{ fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--muted)" }}>No spam. No noise. Just your invite when we're ready.</div>
                {status==="error"&&<div style={{ color:"var(--accent)",fontFamily:"'DM Mono',monospace",fontSize:11,marginTop:8 }}>Something went wrong. Try again.</div>}
              </div>
            ) : (
              <div style={{ fontSize:18,color:"var(--accent2)",fontStyle:"italic",padding:"16px 0" }}>✦ You're on the list. We'll reach out personally.</div>
            )}
          </div>
        </div>

        {/* HERO RIGHT */}
        <div style={{ position:"relative",background:"var(--warm)",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <div style={{ position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(14,13,12,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(14,13,12,0.04) 1px,transparent 1px)",backgroundSize:"48px 48px" }} />
          <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.15,pointerEvents:"none" }} viewBox="0 0 600 700" fill="none">
            <path d="M160 200 C 280 280, 320 380, 450 320" stroke="#0e0d0c" strokeWidth="1" strokeDasharray="4 6"/>
            <path d="M160 200 C 200 350, 180 500, 200 540" stroke="#0e0d0c" strokeWidth="1" strokeDasharray="4 6"/>
            <path d="M450 320 C 420 430, 380 500, 430 560" stroke="#0e0d0c" strokeWidth="1" strokeDasharray="4 6"/>
            <circle cx="160" cy="200" r="4" fill="#c8502a"/><circle cx="450" cy="320" r="4" fill="#c8502a"/>
            <circle cx="200" cy="540" r="4" fill="#2a4c8a"/><circle cx="430" cy="560" r="4" fill="#2a4c8a"/>
          </svg>
          {[
            { cls:"card-a", style:{top:"18%",left:"8%"}, role:"Product Designer", name:"Meera Krishnan", work:"Currently: Redesigning onboarding for a fintech startup", tags:["Systems","Motion","Figma"] },
            { cls:"card-b", style:{top:"30%",right:"6%"}, role:"Indie Developer", name:"Arjun Mehta", work:"Building: Open source devtools for React", tags:["React","OSS","TypeScript"], badge:"94% match" },
            { cls:"card-c", style:{bottom:"24%",left:"8%"}, role:"Writer & Strategist", name:"Priya Nair", work:"Working on: Brand voice for creator-led businesses", tags:["Narrative","B2C"] },
            { cls:"card-d", style:{bottom:"16%",right:"8%"}, role:"Visual Artist", name:"Sai Reddy", work:"Exploring: Generative art meets traditional Kalamkari", tags:["Generative","Processing"] },
          ].map((c) => (
            <div key={c.name} className={c.cls} style={{ position:"absolute",background:"var(--paper)",border:"1px solid var(--rule)",padding:"20px 24px",width:220,boxShadow:"4px 4px 0 var(--rule)",...c.style }}>
              {c.badge && <div style={{ position:"absolute",top:-10,right:-10,background:"var(--accent)",color:"white",fontFamily:"'DM Mono',monospace",fontSize:9,padding:"4px 8px",letterSpacing:"0.08em" }}>{c.badge}</div>}
              <div style={{ fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--accent)",marginBottom:8 }}>{c.role}</div>
              <div style={{ fontSize:20,fontWeight:600,lineHeight:1.1,marginBottom:6 }}>{c.name}</div>
              <div style={{ fontSize:12,color:"var(--muted)",fontStyle:"italic",borderTop:"1px solid var(--rule)",paddingTop:8,marginTop:8 }}>{c.work}</div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:4,marginTop:10 }}>
                {c.tags.map(t=><span key={t} style={{ fontFamily:"'DM Mono',monospace",fontSize:9,padding:"2px 8px",border:"1px solid var(--rule)",color:"var(--muted)",letterSpacing:"0.08em" }}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ borderTop:"1px solid var(--rule)",borderBottom:"1px solid var(--rule)",padding:"14px 0",overflow:"hidden",background:"var(--ink)" }}>
        <div style={{ display:"flex",whiteSpace:"nowrap",animation:"marquee 28s linear infinite" }}>
          {Array(2).fill(["Work-based identity","Process-first culture","AI-powered matching","Community over clout","Show your work","Build in public","Find your collaborators"]).flat().map((item,i)=>(
            <span key={i} style={{ fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",padding:"0 40px",color:"rgba(245,240,232,0.7)" }}>
              <span style={{ color:"#c8502a",marginRight:40 }}>✦</span>{item}
            </span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:"var(--rule)",borderTop:"1px solid var(--rule)",borderBottom:"1px solid var(--rule)" }}>
        {[["1k","Waitlist goal"],["3×","Richer than LinkedIn profiles"],["AI+","Powered matching engine"],["0%","Vanity metrics"]].map(([n,l])=>(
          <div key={l} className="reveal" style={{ background:"var(--paper)",padding:"40px 48px" }}>
            <div style={{ fontSize:"clamp(36px,4vw,64px)",fontWeight:300,letterSpacing:"-0.03em",lineHeight:1,marginBottom:8 }}>{n}</div>
            <div style={{ fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--muted)" }}>{l}</div>
          </div>
        ))}
      </div>

      {/* HOW IT WORKS */}
      <div id="how" style={{ padding:"120px 48px",maxWidth:1400,margin:"0 auto" }}>
        <div className="reveal" style={{ display:"flex",alignItems:"baseline",gap:24,marginBottom:80,borderBottom:"1px solid var(--rule)",paddingBottom:24 }}>
          <span style={{ fontFamily:"'DM Mono',monospace",fontSize:11,color:"var(--muted)",letterSpacing:"0.1em" }}>01</span>
          <h2 style={{ fontSize:"clamp(32px,4vw,52px)",fontWeight:300,letterSpacing:"-0.02em" }}>How <em style={{ fontStyle:"italic",color:"var(--accent)" }}>Atelier</em> works</h2>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:"var(--rule)",border:"1px solid var(--rule)" }}>
          {[
            { icon:"◎",label:"Build your craft profile",h:"Show what you're actually working on",body:"Your profile isn't a resume. It's a live studio window — what you're building right now, how you think, what you're learning. Process over portfolio." },
            { icon:"⬡",label:"AI finds your people",h:"Get matched by work, not follows",body:"Our matching engine reads the texture of your work — not just your job title — and surfaces collaborators, mentors, and peers building in adjacent spaces." },
            { icon:"↗",label:"Grow through community",h:"Learn by watching others work",body:"The feed isn't about finished things. It's about the messy middle — decisions made, paths abandoned, breakthroughs shared. A culture of genuine craft." },
          ].map((s,i)=>(
            <div key={i} className="step reveal" style={{ background:"var(--paper)",padding:"48px 36px",position:"relative",overflow:"hidden",transition:"background 0.3s" }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:96,fontWeight:300,color:"rgba(14,13,12,0.05)",position:"absolute",top:-16,right:16,lineHeight:1,pointerEvents:"none" }}>{i+1}</div>
              <div style={{ fontSize:28,marginBottom:20 }}>{s.icon}</div>
              <div style={{ fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:"var(--accent)",marginBottom:12 }}>{s.label}</div>
              <h3 style={{ fontSize:26,fontWeight:400,lineHeight:1.2,marginBottom:16 }}>{s.h}</h3>
              <p style={{ fontSize:16,color:"var(--muted)",lineHeight:1.7,fontWeight:300 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MANIFESTO */}
      <div id="values" style={{ background:"var(--ink)",color:"var(--paper)",padding:"100px 48px",textAlign:"center",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 0%,rgba(200,80,42,0.15),transparent 70%)" }} />
        <div className="reveal" style={{ fontSize:"clamp(28px,4vw,60px)",fontWeight:300,lineHeight:1.3,letterSpacing:"-0.01em",maxWidth:900,margin:"0 auto",position:"relative" }}>
          "Most platforms ask you what you've <em style={{ fontStyle:"italic",color:"#c8502a" }}>done.</em> We ask what you're <em style={{ fontStyle:"italic",color:"#c8502a" }}>doing</em> — and who you're becoming in the process."
        </div>
        <div className="reveal" style={{ fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(245,240,232,0.4)",marginTop:40 }}>— The Atelier Manifesto</div>
      </div>

      {/* FOOTER CTA */}
      <div style={{ padding:"100px 48px",textAlign:"center" }}>
        <div className="reveal" style={{ maxWidth:600,margin:"0 auto" }}>
          <div style={{ fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--accent)",marginBottom:24 }}>✦ Early access</div>
          <h2 style={{ fontSize:"clamp(36px,5vw,72px)",fontWeight:300,letterSpacing:"-0.02em",lineHeight:1,marginBottom:32 }}>
            Join the<br/><em style={{ fontStyle:"italic",color:"var(--accent)" }}>first wave.</em>
          </h2>
          <p style={{ fontSize:18,color:"var(--muted)",fontWeight:300,marginBottom:40,lineHeight:1.6 }}>
            We're opening Atelier to a small group of creators first. Intentional community from day one.
          </p>
          {status2 !== "done" ? (
            <div style={{ maxWidth:420,margin:"0 auto" }}>
              <div style={{ display:"flex",border:"1px solid var(--ink)",overflow:"hidden",marginBottom:10 }}>
                <input type="email" value={email2} onChange={e=>setEmail2(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submitWaitlist(email2,setStatus2,"footer")} placeholder="your@email.com" style={{ flex:1,padding:"14px 20px",background:"transparent",border:"none",outline:"none",fontFamily:"'DM Mono',monospace",fontSize:13,color:"var(--ink)" }} />
                <button className="form-btn" onClick={()=>submitWaitlist(email2,setStatus2,"footer")} style={{ padding:"14px 28px",background:"var(--ink)",color:"var(--paper)",border:"none",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",transition:"background 0.2s",whiteSpace:"nowrap" }}>
                  {status2==="loading"?"…":"Get Early Access"}
                </button>
              </div>
              <div style={{ fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--muted)" }}>Hyderabad-based creators get priority access.</div>
            </div>
          ) : (
            <div style={{ fontSize:18,color:"var(--accent2)",fontStyle:"italic" }}>✦ You're on the list. We'll reach out personally.</div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ padding:"60px 48px 40px",borderTop:"1px solid var(--rule)",display:"flex",justifyContent:"space-between",alignItems:"flex-end" }}>
        <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:36,letterSpacing:"0.08em",opacity:0.08 }}>ATELIER</div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--muted)",marginBottom:4 }}>Hyderabad, India · 2025</div>
          <div style={{ fontSize:13,color:"var(--muted)" }}>© Atelier. All rights reserved.</div>
        </div>
      </footer>
    </>
  );
}
