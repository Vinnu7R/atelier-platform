import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { updateProfile } from './actions'

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Check if profile already exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('user_id', user.id)
    .single()

  if (profile) {
    return redirect('/feed')
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-xl justify-center gap-2 min-h-screen mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-syne uppercase tracking-tight">Complete your profile</h1>
        <p className="text-muted mt-2">Atelier is built around what you're building.</p>
      </div>

      <form action={updateProfile} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-mono uppercase tracking-widest text-muted" htmlFor="username">Username</label>
          <input
            name="username"
            placeholder="johndoe"
            className="border-b border-rule bg-transparent py-2 outline-none focus:border-accent transition-colors"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-mono uppercase tracking-widest text-muted" htmlFor="display_name">Display Name</label>
          <input
            name="display_name"
            placeholder="John Doe"
            className="border-b border-rule bg-transparent py-2 outline-none focus:border-accent transition-colors"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-mono uppercase tracking-widest text-muted" htmlFor="role">What do you do?</label>
          <input
            name="role"
            placeholder="Product Designer / Indie Developer"
            className="border-b border-rule bg-transparent py-2 outline-none focus:border-accent transition-colors"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-mono uppercase tracking-widest text-muted" htmlFor="current_work">Current Project</label>
          <input
            name="current_work"
            placeholder="Building a community platform for creators"
            className="border-b border-rule bg-transparent py-2 outline-none focus:border-accent transition-colors"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-mono uppercase tracking-widest text-muted" htmlFor="skills">Skills (comma separated)</label>
          <input
            name="skills"
            placeholder="React, TypeScript, Design Systems"
            className="border-b border-rule bg-transparent py-2 outline-none focus:border-accent transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-mono uppercase tracking-widest text-muted" htmlFor="location">Location</label>
          <input
            name="location"
            placeholder="Hyderabad, India"
            className="border-b border-rule bg-transparent py-2 outline-none focus:border-accent transition-colors"
          />
        </div>

        <button className="mt-8 bg-ink text-paper py-4 font-syne uppercase font-bold tracking-widest hover:bg-accent transition-colors">
          Join the Community
        </button>

        {searchParams?.error && (
          <p className="p-4 bg-accent/10 text-accent text-center text-sm">
            {searchParams.error}
          </p>
        )}
      </form>
    </div>
  )
}
