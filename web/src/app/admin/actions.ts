'use server'

import { revalidatePath } from 'next/cache'

// Note: To make this work, the user needs a SANITY_API_TOKEN with 'Editor' permissions in Vercel Env Vars.
export async function createIELTSListeningTest(formData: any) {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const token = process.env.SANITY_API_TOKEN

  if (!token) {
    throw new Error('SANITY_API_TOKEN is missing. Please add it to your Vercel Environment Variables.')
  }

  // Structure the document for Sanity
  const doc = {
    _type: 'ieltsListening',
    title: formData.title,
    audioUrl: formData.audioUrl,
    duration: parseInt(formData.duration) || 30,
    sections: formData.sections.map((section: any, sIndex: number) => ({
      _key: `section-${sIndex}`,
      sectionTitle: section.title,
      context: [
        {
          _key: `block-${sIndex}`,
          _type: 'block',
          children: [{ _type: 'span', _key: `span-${sIndex}`, text: section.context || '' }],
          markDefs: [],
          style: 'normal'
        }
      ],
      questions: section.questions.map((q: any, qIndex: number) => ({
        _key: `question-${sIndex}-${qIndex}`,
        questionNumber: parseInt(q.questionNumber),
        questionText: q.questionText,
        questionType: q.questionType,
        options: q.options ? q.options.split(',').map((o: string) => o.trim()) : [],
        correctAnswer: q.correctAnswer
      }))
    }))
  }

  // Send to Sanity Mutate API
  const response = await fetch(`https://${projectId}.api.sanity.io/v2024-07-10/data/mutate/${dataset}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      mutations: [{ create: doc }]
    })
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Failed to create test in Sanity')
  }

  revalidatePath('/admin')
  revalidatePath('/ielts/listening')
  
  return { success: true, id: result.results[0].id }
}
