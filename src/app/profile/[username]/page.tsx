"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-client";
import type { Profile, Post } from "@/lib/types";
import Link from "next/link";
import { use } from "react";

const POST_TYPES = {
  update: { label: "Update", color: "var(--accent2)" },
  question: { label: "Question", color: "#7a5c2a" },
  milestone: { label: "Milestone", color: "#2a7a4c" },
  reflection: { label: "Reflection", color: "var(--muted)" },
};

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const [{ data: profileData }, { data: { user } }] = await Promise.all([
        supabase.from("profiles").select("*").eq("username", username).single(),
        supabase.auth.getUser(),
      ]);

      if (profileData) {
        setProfile(profileData);
        setIsOwner(user?.id === profileData.user_id);

        const { data: postsData } = await supabase
          .from("posts")
          .select("*")
          .eq("author_id", profileData.id)
          .order("created_at", { ascending: false });

        if (postsData) setPosts(postsData);
      }
      setLoading(false);
    }
    load();
  }, [username]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "var(--muted)" }}>Loading studio…</div>
    </div>
  );

  if (!profile) return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 48, fontWeight: 300 }}>404</div>
      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "var(--muted)" }}>This studio doesn't exist.</div>
      <Link href="/feed" style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--accent)", textDecoration: "none" }}>← Back to feed</Link>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, background: "var(--paper)", borderBottom: "1px solid var(--rule)", padding: "0 48px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 64, zIndex: 50 }}>
        <Link href="/" style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink)", textDecoration: "none" }}>Atelier</Link>
        <Link href="/feed" style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--muted)", textDecoration: "none" }}>← Feed</Link>
      </nav>

      {/* Profile hero */}
      <div style={{ borderBottom: "1px solid var(--rule)", padding: "64px 48px 48px", background: "var(--warm)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
            <div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 12 }}>{profile.role}</div>
              <h1 style={{ fontSize: "clamp(36px,5vw,72px)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 8 }}>{profile.display_name}</h1>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>@{profile.username} · {profile.location}</div>
              {profile.tagline && <p style={{ fontSize: 20, fontWeight: 300, fontStyle: "italic", color: "var(--ink)", maxWidth: 560 }}>{profile.tagline}</p>}
            </div>
            {isOwner && (
              <Link href="/onboarding" style={{ padding: "10px 20px", border: "1px solid var(--rule)", fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", textDecoration: "none", background: "var(--paper)" }}>
                Edit Profile
              </Link>
            )}
          </div>

          {/* Currently working on — the star of the profile */}
          {profile.current_work && (
            <div style={{ padding: "24px", border: "1px solid var(--rule)", background: "var(--paper)", marginBottom: 24 }}>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 12 }}>✦ Currently working on</div>
              <p style={{ fontSize: 18, fontWeight: 300, lineHeight: 1.7, color: "var(--ink)" }}>{profile.current_work}</p>
            </div>
          )}

          {/* Skills + links row */}
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "center" }}>
            {profile.skills?.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {profile.skills.map(s => (
                  <span key={s} style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, padding: "4px 12px", border: "1px solid var(--rule)", color: "var(--muted)", letterSpacing: "0.08em", background: "var(--paper)" }}>{s}</span>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: 16, marginLeft: "auto" }}>
              {profile.website && <a href={profile.website} target="_blank" rel="noopener" style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--accent)", textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase" }}>Website ↗</a>}
              {profile.twitter && <a href={`https://x.com/${profile.twitter}`} target="_blank" rel="noopener" style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--accent)", textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase" }}>X ↗</a>}
              {profile.github && <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener" style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--accent)", textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase" }}>GitHub ↗</a>}
            </div>
          </div>
        </div>
      </div>

      {/* About + Posts */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px" }}>
        {profile.about && (
          <div style={{ marginBottom: 48, paddingBottom: 48, borderBottom: "1px solid var(--rule)" }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 20 }}>About</div>
            <p style={{ fontSize: 18, fontWeight: 300, lineHeight: 1.8, color: "var(--ink)", whiteSpace: "pre-wrap" }}>{profile.about}</p>
          </div>
        )}

        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 24 }}>
          From the studio — {posts.length} post{posts.length !== 1 ? "s" : ""}
        </div>

        {posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)", fontFamily: "'DM Mono',monospace", fontSize: 12 }}>
            {isOwner ? "You haven't posted yet. Go to the feed and share what you're working on." : "Nothing posted yet."}
          </div>
        ) : posts.map(post => {
          const type = POST_TYPES[post.type];
          return (
            <div key={post.id} style={{ border: "1px solid var(--rule)", padding: "28px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, padding: "3px 10px", border: `1px solid ${type.color}`, color: type.color, letterSpacing: "0.1em", textTransform: "uppercase" }}>{type.label}</span>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)" }}>
                  {new Date(post.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
              </div>
              {post.title && <h3 style={{ fontSize: 22, fontWeight: 400, marginBottom: 10 }}>{post.title}</h3>}
              <p style={{ fontSize: 17, fontWeight: 300, lineHeight: 1.7 }}>{post.content}</p>
              {post.tags?.length > 0 && (
                <div style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
                  {post.tags.map(t => <span key={t} style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, padding: "3px 10px", border: "1px solid var(--rule)", color: "var(--muted)" }}>{t}</span>)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
