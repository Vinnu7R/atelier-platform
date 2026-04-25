'use server'

import { createClient, createAdminClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Action to handle onboarding a new creator.
 * Saves the initial profile details and redirects to the feed.
 */
export async function updateProfile(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Ensure the user is logged in
  if (!user) {
    return redirect('/login')
  }

  const username = formData.get('username') as string
  const display_name = formData.get('display_name') as string
  const role = formData.get('role') as string
  const current_work = formData.get('current_work') as string
  const location = formData.get('location') as string
  const skillsStr = formData.get('skills') as string
  const skills = skillsStr ? skillsStr.split(',').map(s => s.trim()) : []

  // Use Admin Client for critical database writes (Rule 2)
  const adminSupabase = createAdminClient()
  
  const { error } = await adminSupabase
    .from('profiles')
    .upsert({
      user_id: user.id,
      username: username.toLowerCase().replace(/[^a-z0-9_-]/g, ''),
      display_name,
      role,
      current_work,
      location,
      skills,
      updated_at: new Date().toISOString(),
    })

  if (error) {
    console.error('Profile update error:', error)
    return redirect('/onboarding?error=Could not update profile. Try a different username.')
  }

  return redirect('/feed')
}
