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
    const doc = {
      _type: 'ieltsListening',
      title: data.title,
      slug: {
        _type: 'slug',
        current: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      },
      passageContent: data.passageContent,
      transcript: data.transcript,
      googleDriveAudioUrl: data.googleDriveAudioUrl,
      rawAnswerKey: data.rawAnswerKey
    }

    const result = await writeClient.create(doc)
    return { success: true, id: result._id }
  } catch (error) {
    console.error('Failed to create listening test:', error)
    return { success: false, error: 'Failed to create test' }
  }
}

export async function deleteListeningTest(id: string) {
  try {
    await writeClient.delete(id)
    return { success: true }
  } catch (error) {
    console.error('Failed to delete listening test:', error)
    return { success: false, error: 'Failed to delete test' }
  }
}

export async function updateListeningTest(id: string, data: any) {
  try {
    const doc = {
      title: data.title,
      slug: {
        _type: 'slug',
        current: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      },
      passageContent: data.passageContent,
      transcript: data.transcript,
      googleDriveAudioUrl: data.googleDriveAudioUrl,
      rawAnswerKey: data.rawAnswerKey
    }

    await writeClient.patch(id).set(doc).commit()
    return { success: true }
  } catch (error) {
    console.error('Failed to update listening test:', error)
    return { success: false, error: 'Failed to update test' }
  }
}
