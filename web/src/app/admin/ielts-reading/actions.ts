'use server'

import { client } from '../../../sanity/client'
import { revalidatePath } from 'next/cache'

// Helper to parse answer key into structured array
function parseAnswerKey(rawText: string) {
  if (!rawText) return []
  
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean)
  const questions = []
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    // Expect format: "1. Answer" or "1 Answer"
    const match = line.match(/^(\d+)[\.\)\-]?\s*(.*)$/)
    if (match) {
      const qNum = parseInt(match[1])
      const ans = match[2].trim()
      
      let type = 'Fill in the Blank'
      if (ans.length === 1 && /[A-Z]/.test(ans)) {
        type = 'Multiple Choice'
      } else if (ans.toLowerCase() === 'true' || ans.toLowerCase() === 'false' || ans.toLowerCase() === 'not given') {
        type = 'True / False / Not Given'
      } else if (ans.toLowerCase() === 'yes' || ans.toLowerCase() === 'no') {
        type = 'Yes / No / Not Given'
      }

      questions.push({
        _key: `q_${qNum}_${Date.now()}`,
        questionNumber: qNum,
        questionText: `Question ${qNum}`,
        questionType: type,
        correctAnswer: ans
      })
    }
  }
  
  return questions
}

export async function createReadingTest(data: any) {
  try {
    const doc = {
      _type: 'ieltsReading',
      title: data.title,
      slug: {
        _type: 'slug',
        current: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      },
      examTrack: data.examTrack,
      duration: parseInt(data.duration) || 60,
      passages: data.passages.map((p: any, index: number) => ({
        _key: `passage_${index}_${Date.now()}`,
        passageTitle: p.passageTitle,
        passageText: p.passageText,
        questionsContent: p.questionsContent,
        questions: parseAnswerKey(p.rawAnswerKey)
      }))
    }

    await client.create(doc)
    revalidatePath('/admin/ielts-reading')
    revalidatePath('/ielts/reading')
    return { success: true }
  } catch (error: any) {
    console.error('Create Reading Test Error:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteReadingTest(id: string) {
  try {
    await client.delete(id)
    revalidatePath('/admin/ielts-reading')
    revalidatePath('/ielts/reading')
    return { success: true }
  } catch (error: any) {
    console.error('Delete Reading Test Error:', error)
    return { success: false, error: error.message }
  }
}
