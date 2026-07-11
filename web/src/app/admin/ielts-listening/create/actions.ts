'use server'

import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, useCdn } from '../../../../../sanity/env'

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // The user must set this in their Vercel/local .env
})

export async function createListeningTest(data: any) {
  if (!process.env.SANITY_API_TOKEN) {
    return { success: false, error: 'SANITY_API_TOKEN is not configured in your environment variables. Please create an API token in Sanity Manage and add it to your Vercel project.' }
  }

  try {
    // Generate a unique slug from the title
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    const doc = {
      _type: 'ieltsListening',
      title: data.title,
      slug: {
        _type: 'slug',
        current: slug,
      },
      duration: data.duration,
      passageContent: data.passageContent,
      googleDriveAudioUrl: data.googleDriveAudioUrl,
      questions: data.questions.map((q: any, i: number) => ({
        ...q,
        _key: `q-${Date.now()}-${i}`,
      }))
    }

    const result = await writeClient.create(doc)
    return { success: true, id: result._id }
  } catch (error: any) {
    console.error('Error creating document:', error)
    return { success: false, error: error.message }
  }
}
