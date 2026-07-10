import { defineField, defineType } from 'sanity'

export const pteTest = defineType({
  name: 'pteTest',
  title: 'PTE Academic',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Test Title (e.g., PTE Practice Test A)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration (minutes)',
      type: 'number',
      initialValue: 120,
    }),
    defineField({
      name: 'speakingWriting',
      title: 'Speaking & Writing Section',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'questionType', title: 'Question Type', type: 'string', options: { list: ['Read Aloud', 'Repeat Sentence', 'Describe Image', 'Re-tell Lecture', 'Answer Short Question', 'Summarize Written Text', 'Essay'] } },
            { name: 'prompt', title: 'Prompt Text', type: 'text' },
            { name: 'audioUrl', title: 'Audio Link (if applicable)', type: 'string' },
            { name: 'image', title: 'Image (if applicable)', type: 'image' },
            { name: 'sampleAnswer', title: 'Sample Answer', type: 'text' }
          ]
        }
      ]
    }),
    defineField({
      name: 'reading',
      title: 'Reading Section',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'questionType', title: 'Question Type', type: 'string', options: { list: ['Reading & Writing: Fill in the Blanks', 'Multiple Choice, Multiple Answer', 'Re-order Paragraphs', 'Reading: Fill in the Blanks', 'Multiple Choice, Single Answer'] } },
            { name: 'passage', title: 'Passage / Text', type: 'text' },
            { name: 'question', title: 'Question', type: 'string' },
            { name: 'options', title: 'Options', type: 'array', of: [{ type: 'string' }] },
            { name: 'correctAnswer', title: 'Correct Answer', type: 'string' }
          ]
        }
      ]
    }),
    defineField({
      name: 'listening',
      title: 'Listening Section',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'questionType', title: 'Question Type', type: 'string', options: { list: ['Summarize Spoken Text', 'Multiple Choice, Multiple Answer', 'Fill in the Blanks', 'Highlight Correct Summary', 'Multiple Choice, Single Answer', 'Select Missing Word', 'Highlight Incorrect Words', 'Write from Dictation'] } },
            { name: 'audioUrl', title: 'Audio Link', type: 'string' },
            { name: 'prompt', title: 'Prompt Text', type: 'text' },
            { name: 'options', title: 'Options', type: 'array', of: [{ type: 'string' }] },
            { name: 'correctAnswer', title: 'Correct Answer', type: 'string' }
          ]
        }
      ]
    })
  ],
})
