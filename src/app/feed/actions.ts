'use server'

import { createClient, createAdminClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!profile) {
    throw new Error('Profile not found')
  }

  const content = formData.get('content') as string

  // Use Admin Client for writes (Rule 2)
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
    throw new Error('Could not create post')
  }

  revalidatePath('/feed')
  revalidatePath('/[username]')
}
