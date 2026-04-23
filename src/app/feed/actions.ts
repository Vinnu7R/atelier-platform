'use server'

import { createClient, createAdminClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Action to create a new work-in-public post.
 */
export async function createPost(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to post.')
  }

  // Get the profile ID for the current user
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username')
    .eq('user_id', user.id)
    .single()

  if (!profile) {
    throw new Error('Please complete your onboarding first.')
  }

  const content = formData.get('content') as string

  // Use Admin Client for database writes (Rule 2)
  const adminSupabase = createAdminClient()

  const { error } = await adminSupabase
    .from('posts')
    .insert({
      author_id: profile.id,
      content,
      type: 'text',
    })

  if (error) {
    console.error('Post creation error:', error)
    throw new Error('Failed to share your update. Please try again.')
  }

  // Refresh the data on the feed and profile pages
  revalidatePath('/feed')
  revalidatePath(`/${profile.username}`)
}
