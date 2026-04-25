import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function ProfilePage({
  params,
}: {
  params: { username: string }
}) {
  const supabase = createClient()

  // Fetch the creator's profile information
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .single()

  if (!profile) {
    notFound()
  }

  // Fetch all posts (work updates) from this creator
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', profile.id)
    .order('created_at', { ascending: false })

  return (
    <div className="bg-paper min-h-screen">
      {/* Simple Navigation */}
      <nav className="p-8 flex justify-between items-center max-w-6xl mx-auto w-full">
         <Link href="/" className="font-syne font-extrabold text-xl tracking-tight uppercase">Atelier</Link>
         <Link href="/feed" className="font-mono text-xs uppercase tracking-widest text-muted hover:text-accent">Back to Feed</Link>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-[1fr_2fr] gap-12">
          {/* Profile Sidebar */}
          <aside>
            <div className="sticky top-12">
              <div className="w-32 h-32 bg-warm border border-rule rounded-full mb-6 overflow-hidden">
                 {profile.avatar_url ? (
                   <img src={profile.avatar_url} alt={profile.display_name} className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-3xl font-syne text-muted uppercase">
                     {profile.display_name?.[0]}
                   </div>
                 )}
              </div>
              <h1 className="text-4xl font-bold font-syne mb-2 tracking-tight uppercase">{profile.display_name}</h1>
              <p className="text-muted font-mono text-xs tracking-widest uppercase mb-8">@{profile.username}</p>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent mb-2">Role</h3>
                  <p className="font-medium text-lg">{profile.role}</p>
                </div>
                <div>
                  <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent mb-2">Currently Building</h3>
                  <p className="italic text-muted leading-relaxed">"{profile.current_work}"</p>
                </div>
                {profile.skills && profile.skills.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((s: string) => (
                        <span key={s} className="px-2 py-1 border border-rule text-[10px] font-mono uppercase tracking-wider">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.location && (
                  <div>
                    <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent mb-2">Location</h3>
                    <p className="text-sm font-mono uppercase">{profile.location}</p>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Activity Feed */}
          <main>
            <div className="mb-12 border-b border-rule pb-4 flex items-baseline justify-between">
               <h2 className="text-2xl font-bold font-syne uppercase tracking-tight">Recent Activity</h2>
               <span className="text-[10px] font-mono text-muted uppercase tracking-widest">{posts?.length || 0} Updates</span>
            </div>

            <div className="space-y-16">
              {posts && posts.length > 0 ? (
                posts.map((post) => (
                  <article key={post.id} className="group">
                    <div className="flex gap-4 items-baseline mb-6 opacity-40 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-mono text-muted uppercase tracking-[0.15em]">
                        {new Date(post.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <div className="h-px bg-rule flex-1" />
                    </div>
                    <p className="text-xl leading-relaxed font-light whitespace-pre-wrap text-ink">{post.content}</p>
                    <div className="mt-8 h-px bg-accent/20 w-12" />
                  </article>
                ))
              ) : (
                <div className="py-20 text-center border border-dashed border-rule">
                  <p className="text-muted font-mono text-xs uppercase tracking-widest">No work-in-public updates yet.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
