// ─── Auth ────────────────────────────────────────────────────────────────────
export type AuthUser = {
  id: string;
  email: string;
};

// ─── Profile ─────────────────────────────────────────────────────────────────
export type Profile = {
  id: string;
  user_id: string;
  display_name: string;
  username: string;
  role: string;              // e.g. "Product Designer", "Indie Developer"
  tagline: string;           // one-line description
  current_work: string;      // what they're building RIGHT NOW
  about: string;             // longer bio
  skills: string[];          // ["React", "Figma", "Systems Thinking"]
  location: string;
  avatar_url: string | null;
  website: string | null;
  twitter: string | null;
  github: string | null;
  is_onboarded: boolean;
  created_at: string;
  updated_at: string;
};

// ─── Post (Feed) ─────────────────────────────────────────────────────────────
export type PostType = "update" | "question" | "milestone" | "reflection";

export type Post = {
  id: string;
  author_id: string;
  author?: Profile;
  type: PostType;
  title: string | null;
  content: string;
  tags: string[];
  likes_count: number;
  replies_count: number;
  created_at: string;
};

// ─── Match ───────────────────────────────────────────────────────────────────
export type Match = {
  profile: Profile;
  score: number;             // 0–100
  reasons: string[];         // ["Similar stack", "Complementary skills"]
};

// ─── Waitlist ─────────────────────────────────────────────────────────────────
export type WaitlistEntry = {
  id: string;
  email: string;
  source: string;
  signed_up_at: string;
};
