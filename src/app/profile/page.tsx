import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function MyProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('user_id', user.id)
    .single()

  if (!profile) {
    return redirect('/onboarding')
  }

  return redirect(`/${profile.username}`)
}
