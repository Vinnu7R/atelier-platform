"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-client";
import type { Post, Profile } from "@/lib/types";
import Link from "next/link";

const POST_TYPES = {
  update: { label: "Update", color: "var(--accent2)" },
  question: { label: "Question", color: "#7a5c2a" },
  milestone: { label: "Milestone", color: "#2a7a4c" },
  reflection: { label: "Reflection", color: "var(--muted)" },
};

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState(false);
  const [newPost, setNewPost] = useState({ type: "update" as Post["type"], title: "", content: "", tags: "" });
  const [posting, setPosting] = useState(false);
  const [filter, setFilter] = useState<Post["type"] | "all">("all");

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: profileData }, { data: postsData }] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("posts").select("*, author:profiles(*)").order("created_at", { ascending: false }).limit(30),
      ]);

      if (profileData) setProfile(profileData);
      if (postsData) setPosts(postsData as Post[]);
      setLoading(false);
    }
    load();
  }, []);

  async function submitPost() {
    if (!newPost.content.trim() || !profile) return;
    setPosting(true);
    const tags = newPost.tags.split(",").map(t => t.trim()).filter(Boolean);
    const { data, error } = await supabase.from("posts").insert({
      author_id: profile.id,
      type: newPost.type,
      title: newPost.title || null,
      content: newPost.content,
      tags,
    }).select("*, author:profiles(*)").single();

    if (!error && data) {
      setPosts(prev => [data as Post, ...prev]);
      setNewPost({ type: "update", title: "", content: "", tags: "" });
      setComposing(false);
    }
    setPosting(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const filtered = filter === "all" ? posts : posts.filter(p => p.type === filter);

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, background: "var(--paper)", borderBottom: "1px solid var(--rule)", padding: "0 48px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 64, zIndex: 50 }}>
        <Link href="/" style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink)", textDecoration: "none" }}>Atelier</Link>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {profile && (
            <Link href={`/profile/${profile.username}`} style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--muted)", textDecoration: "none", letterSpacing: "0.08em" }}>
              @{profile.username}
            </Link>
          )}
          <button onClick={signOut} style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase" }}>Sign out</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 48px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 48 }}>
        {/* Main feed */}
        <div>
          {/* Compose */}
          {!composing ? (
            <button onClick={() => setComposing(true)}
              style={{ width: "100%", padding: "20px 24px", border: "1px solid var(--rule)", background: "var(--warm)", cursor: "pointer", textAlign: "left", marginBottom: 32, transition: "border-color 0.2s", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--rule)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono',monospace", fontSize: 12, color: "var(--muted)" }}>
                {profile?.display_name?.[0] || "?"}
              </div>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "var(--muted)", letterSpacing: "0.05em" }}>What are you working on today?</span>
            </button>
          ) : (
            <div style={{ border: "1px solid var(--ink)", padding: "24px", marginBottom: 32 }}>
              {/* Type selector */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {(Object.keys(POST_TYPES) as Post["type"][]).map(t => (
                  <button key={t} onClick={() => setNewPost(p => ({ ...p, type: t }))}
                    style={{ padding: "6px 14px", border: `1px solid ${newPost.type === t ? POST_TYPES[t].color : "var(--rule)"}`, background: newPost.type === t ? POST_TYPES[t].color : "transparent", color: newPost.type === t ? "white" : "var(--muted)", cursor: "pointer", fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", transition: "all 0.15s" }}>
                    {POST_TYPES[t].label}
                  </button>
                ))}
              </div>
              <input value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
                placeholder="Title (optional)"
                style={{ width: "100%", padding: "10px 0", border: "none", borderBottom: "1px solid var(--rule)", background: "transparent", outline: "none", fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: "var(--ink)", marginBottom: 16 }} />
              <textarea value={newPost.content} onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))}
                placeholder="Share what you're building, a question you're wrestling with, or a breakthrough you just had..."
                rows={5} style={{ width: "100%", padding: "0", border: "none", background: "transparent", outline: "none", fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: "var(--ink)", lineHeight: 1.7, resize: "none" }} />
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--rule)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <input value={newPost.tags} onChange={e => setNewPost(p => ({ ...p, tags: e.target.value }))}
                  placeholder="Tags: react, design, ai"
                  style={{ flex: 1, padding: "8px 0", border: "none", background: "transparent", outline: "none", fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--muted)" }} />
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setComposing(false)} style={{ padding: "10px 20px", background: "transparent", border: "1px solid var(--rule)", cursor: "pointer", fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Cancel</button>
                  <button onClick={submitPost} disabled={posting || !newPost.content.trim()}
                    style={{ padding: "10px 24px", background: "var(--ink)", color: "var(--paper)", border: "none", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", opacity: (!newPost.content.trim() || posting) ? 0.5 : 1 }}>
                    {posting ? "…" : "Post"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--rule)", marginBottom: 32 }}>
            {(["all", ...Object.keys(POST_TYPES)] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: "10px 20px", background: "transparent", border: "none", borderBottom: `2px solid ${filter === f ? "var(--accent)" : "transparent"}`, cursor: "pointer", fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: filter === f ? "var(--ink)" : "var(--muted)", transition: "all 0.2s", marginBottom: -1 }}>
                {f === "all" ? "All" : POST_TYPES[f as Post["type"]].label}
              </button>
            ))}
          </div>

          {/* Posts */}
          {loading ? (
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "var(--muted)", textAlign: "center", padding: 80 }}>Loading the studio…</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>◎</div>
              <div style={{ fontSize: 20, fontWeight: 300, marginBottom: 8 }}>No posts yet</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "var(--muted)" }}>Be the first to share what you're working on.</div>
            </div>
          ) : filtered.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Sidebar */}
        <div>
          {/* Your profile card */}
          {profile && (
            <div style={{ border: "1px solid var(--rule)", padding: "24px", marginBottom: 24 }}>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16 }}>Your Studio</div>
              <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>{profile.display_name}</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", marginBottom: 12 }}>@{profile.username} · {profile.role}</div>
              <div style={{ fontSize: 14, color: "var(--muted)", fontStyle: "italic", lineHeight: 1.5, marginBottom: 16, borderTop: "1px solid var(--rule)", paddingTop: 12 }}>{profile.current_work || "Add what you're working on →"}</div>
              <Link href={`/profile/${profile.username}`} style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--accent2)", textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase" }}>View Profile →</Link>
            </div>
          )}

          {/* Community pulse */}
          <div style={{ border: "1px solid var(--rule)", padding: "24px" }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 20 }}>Community Pulse</div>
            {Object.entries(POST_TYPES).map(([type, { label, color }]) => {
              const count = posts.filter(p => p.type === type).length;
              const pct = posts.length ? (count / posts.length) * 100 : 0;
              return (
                <div key={type} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>{label}</span>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)" }}>{count}</span>
                  </div>
                  <div style={{ height: 3, background: "var(--rule)", overflow: "hidden" }}>
                    <div style={{ height: "100%", background: color, width: `${pct}%`, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              );
            })}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--rule)", fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)" }}>
              {posts.length} posts in the studio
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  const type = POST_TYPES[post.type];
  const author = post.author as Profile | undefined;
  const timeAgo = getTimeAgo(post.created_at);

  return (
    <div style={{ border: "1px solid var(--rule)", padding: "28px", marginBottom: 16, background: "var(--paper)", transition: "border-color 0.2s" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--warm)", border: "1px solid var(--rule)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14 }}>
            {author?.display_name?.[0] || "?"}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1 }}>{author?.display_name || "Anonymous"}</div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", marginTop: 2 }}>@{author?.username} · {author?.role}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, padding: "3px 10px", border: `1px solid ${type.color}`, color: type.color, letterSpacing: "0.1em", textTransform: "uppercase" }}>{type.label}</span>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)" }}>{timeAgo}</span>
        </div>
      </div>

      {/* Content */}
      {post.title && <h3 style={{ fontSize: 22, fontWeight: 400, lineHeight: 1.2, marginBottom: 12 }}>{post.title}</h3>}
      <p style={{ fontSize: 17, fontWeight: 300, lineHeight: 1.7, color: "var(--ink)" }}>{post.content}</p>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 16 }}>
          {post.tags.map(t => (
            <span key={t} style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, padding: "3px 10px", border: "1px solid var(--rule)", color: "var(--muted)", letterSpacing: "0.08em" }}>
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function getTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
