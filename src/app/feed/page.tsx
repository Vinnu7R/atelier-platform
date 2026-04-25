import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createPost } from './actions'

export default async function FeedPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!profile) {
    return redirect('/onboarding')
  }

  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id (
        username,
        display_name,
        role
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-2xl mx-auto px-8 py-12">
      <header className="mb-12 flex justify-between items-end">
        <div>
           <h1 className="text-3xl font-bold font-syne uppercase tracking-tight text-ink">Atelier Feed</h1>
           <p className="text-muted text-[10px] font-mono mt-1 uppercase tracking-[0.2em]">Work in public</p>
        </div>
        <Link href={`/profile/${profile.username}`} className="text-[10px] font-mono uppercase tracking-widest text-accent hover:underline transition-all">
          My Profile
        </Link>
      </header>

      {/* Post Creation */}
      <section className="mb-16">
        <form action={createPost} className="flex flex-col gap-4 border border-rule p-6 bg-paper shadow-[4px_4px_0_var(--rule)]">
          <textarea
            name="content"
            placeholder="What are you building today?"
            className="w-full h-32 bg-transparent outline-none resize-none font-light text-lg placeholder:opacity-40"
            required
          />
          <div className="flex justify-between items-center pt-4 border-t border-rule">
             <span className="text-[10px] font-mono text-muted uppercase tracking-widest">Status: Making</span>
             <button className="bg-ink text-paper px-6 py-2 font-syne uppercase font-bold text-[10px] tracking-widest hover:bg-accent transition-colors active:scale-95">
               Post Update
             </button>
          </div>
        </form>
      </section>

      {/* Feed */}
      <div className="space-y-20">
        {posts && posts.length > 0 ? (
          posts.map((post: any) => (
            <article key={post.id} className="group">
              <div className="flex justify-between items-baseline mb-6">
                <Link href={`/profile/${post.profiles.username}`} className="group/author">
                  <div className="font-bold font-syne uppercase text-sm group-hover/author:text-accent transition-colors tracking-tight">
                    {post.profiles.display_name}
                  </div>
                  <div className="text-[9px] font-mono text-muted uppercase tracking-[0.1em] mt-0.5">
                    {post.profiles.role}
                  </div>
                </Link>
                <span className="text-[9px] font-mono text-muted uppercase tracking-widest">
                  {new Date(post.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </span>
              </div>
              <p className="text-lg leading-relaxed font-light whitespace-pre-wrap text-ink">{post.content}</p>
              <div className="mt-8 h-px bg-rule/50 w-12 group-hover:w-20 group-hover:bg-accent/40 transition-all" />
            </article>
          ))
        ) : (
          <div className="text-center py-20 border border-dashed border-rule">
            <p className="text-muted font-mono text-[10px] uppercase tracking-widest">Nothing has been built yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
