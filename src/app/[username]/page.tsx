import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'

export default async function ProfilePage({
  params,
}: {
  params: { username: string }
}) {
  const supabase = createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .single()

  if (!profile) {
    notFound()
  }

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', profile.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto px-8 py-20">
      <div className="grid md:grid-cols-[1fr_2fr] gap-12">
        <aside>
          <div className="sticky top-20">
            <div className="w-32 h-32 bg-warm border border-rule rounded-full mb-6 overflow-hidden">
               {profile.avatar_url ? (
                 <img src={profile.avatar_url} alt={profile.display_name} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-3xl font-syne text-muted uppercase">
                   {profile.display_name?.[0]}
                 </div>
               )}
            </div>
            <h1 className="text-4xl font-bold font-syne mb-2">{profile.display_name}</h1>
            <p className="text-muted font-mono text-sm tracking-widest uppercase mb-6">@{profile.username}</p>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-accent mb-2">Role</h3>
                <p className="font-medium">{profile.role}</p>
              </div>
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-accent mb-2">Currently Building</h3>
                <p className="italic">"{profile.current_work}"</p>
              </div>
              {profile.skills && profile.skills.length > 0 && (
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-accent mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((s: string) => (
                      <span key={s} className="px-2 py-1 border border-rule text-xs font-mono">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {profile.location && (
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-accent mb-2">Location</h3>
                  <p className="text-sm">{profile.location}</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        <main>
          <div className="mb-12 border-b border-rule pb-4">
             <h2 className="text-2xl font-bold font-syne uppercase tracking-tight">Recent Activity</h2>
          </div>

          <div className="space-y-12">
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <article key={post.id} className="reveal visible">
                  <div className="flex gap-4 items-baseline mb-4">
                    <span className="text-xs font-mono text-muted uppercase">
                      {new Date(post.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </span>
                    <div className="h-px bg-rule flex-1" />
                  </div>
                  <p className="text-lg leading-relaxed font-light whitespace-pre-wrap">{post.content}</p>
                </article>
              ))
            ) : (
              <p className="text-muted italic">No posts yet.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
