import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Helper route to redirect the user to their own profile page.
 */
export default async function MyProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If not logged in, go to login
  if (!user) {
    return redirect('/login')
  }

  // Find the username associated with this user
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('user_id', user.id)
    .single()

  // If no profile yet, go to onboarding
  if (!profile) {
    return redirect('/onboarding')
  }

  // Redirect to the dynamic profile route
  return redirect(`/profile/${profile.username}`)
}
