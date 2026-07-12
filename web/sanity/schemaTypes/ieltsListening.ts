import { defineField, defineType } from 'sanity'

export const ieltsListening = defineType({
  name: 'ieltsListening',
  title: 'IELTS Listening',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Test Title (e.g., IELTS Listening Test 1)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'audioUrl',
      title: 'Audio File (Google Drive URL or MP3 Link)',
      type: 'string',
      description: 'The link to the main audio track for the entire test.',
    }),
    defineField({
      name: 'duration',
      title: 'Duration (Minutes)',
      type: 'number',
    }),
    defineField({
      name: 'passageContent',
      title: 'Passage / Table Content (HTML/Text with [[1]] tags)',
      type: 'text',
      description: 'Paste HTML tables or text here. Use [[1]], [[2]] to insert fill-in-the-blank boxes inline for the questions.',
    }),
    defineField({
      name: 'transcript',
      title: 'Full Audio Transcript',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'The complete transcript of the audio recording.',
    }),
    defineField({
      name: 'googleDriveAudioUrl',
      title: 'Google Drive Audio URL',
      type: 'string',
      description: 'Paste the shareable Google Drive link for the audio track.',
    }),
    defineField({
      name: 'rawAnswerKey',
      title: 'Raw Answer Key',
      type: 'text',
      description: 'Paste the list of correct answers here, e.g., 1. Answer 2. Answer. This generates the answer sheet.',
    }),
    defineField({
      name: 'questions',
      title: 'Questions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'questionNumber', title: 'Question Number (e.g., 1)', type: 'number' },
            { name: 'questionText', title: 'Question Text', type: 'string' },
            { 
              name: 'googleDriveImageContext', 
              title: 'Context Image (Google Drive URL)', 
              type: 'string',
              description: 'Optional: Paste a Google Drive image link for Maps, Diagrams, or Tables related to this question.'
            },
            { 
              name: 'questionType', 
              title: 'Question Type', 
              type: 'string', 
              options: { list: ['Multiple Choice', 'Fill in the Blank', 'Matching', 'Map Labeling', 'Multiple Select'] } 
            },
            { 
              name: 'options', 
              title: 'Options (comma separated)', 
              type: 'string',
              description: 'e.g. A, B, C (Leave blank for Fill in the Blank)'
            },
            { name: 'correctAnswer', title: 'Correct Answer', type: 'string' },
            { name: 'explanation', title: 'Explanation', type: 'text', description: 'Explain why this is the correct answer.' }
          ],
          preview: {
            select: {
              title: 'questionNumber',
              subtitle: 'questionType',
            },
            prepare(selection) {
              const { title, subtitle } = selection
              return {
                title: title ? `Question ${title}` : 'New Question',
                subtitle: subtitle
              }
            }
          }
        }
      ]
    })
  ],
})
