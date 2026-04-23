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
           <h1 className="text-3xl font-bold font-syne uppercase tracking-tight">Atelier Feed</h1>
           <p className="text-muted text-sm font-mono mt-1 uppercase tracking-widest">Work in public</p>
        </div>
        <Link href={`/${profile.username}`} className="text-sm font-mono uppercase tracking-widest text-accent hover:underline">
          My Profile
        </Link>
      </header>

      {/* Post Creation */}
      <section className="mb-16">
        <form action={createPost} className="flex flex-col gap-4 border border-rule p-6 bg-paper shadow-[4px_4px_0_var(--rule)]">
          <textarea
            name="content"
            placeholder="What are you building today?"
            className="w-full h-32 bg-transparent outline-none resize-none font-light text-lg"
            required
          />
          <div className="flex justify-between items-center pt-4 border-t border-rule">
             <span className="text-xs font-mono text-muted uppercase">Status: Making</span>
             <button className="bg-ink text-paper px-6 py-2 font-syne uppercase font-bold text-xs tracking-widest hover:bg-accent transition-colors">
               Post Update
             </button>
          </div>
        </form>
      </section>

      {/* Feed */}
      <div className="space-y-16">
        {posts && posts.length > 0 ? (
          posts.map((post: any) => (
            <article key={post.id} className="reveal visible">
              <div className="flex justify-between items-baseline mb-4">
                <Link href={`/${post.profiles.username}`} className="group">
                  <div className="font-bold font-syne uppercase text-sm group-hover:text-accent transition-colors">
                    {post.profiles.display_name}
                  </div>
                  <div className="text-[10px] font-mono text-muted uppercase tracking-wider">
                    {post.profiles.role}
                  </div>
                </Link>
                <span className="text-[10px] font-mono text-muted uppercase">
                  {new Date(post.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </span>
              </div>
              <p className="text-lg leading-relaxed font-light whitespace-pre-wrap">{post.content}</p>
              <div className="mt-6 h-px bg-rule w-12" />
            </article>
          ))
        ) : (
          <p className="text-muted italic text-center">Nothing has been built yet.</p>
        )}
      </div>
    </div>
  )
}
