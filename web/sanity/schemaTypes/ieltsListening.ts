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
      name: 'audioUrl',
      title: 'Audio File (Google Drive URL or MP3 Link)',
      type: 'string',
      description: 'The link to the main audio track for the entire test.',
    }),
    defineField({
      name: 'duration',
      title: 'Duration (minutes)',
      type: 'number',
      initialValue: 30,
    }),
    defineField({
      name: 'sections',
      title: 'Listening Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'sectionTitle', title: 'Section Title (e.g., Section 1 — Questions 1-10)', type: 'string' },
            { 
              name: 'context', 
              title: 'Context / Instructions', 
              type: 'array', 
              of: [{ type: 'block' }],
              description: 'Instructions, maps, or diagrams for this section.' 
            },
            {
              name: 'questions',
              title: 'Questions',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'questionNumber', title: 'Question Number', type: 'number' },
                    { name: 'questionText', title: 'Question Text', type: 'string' },
                    { 
                      name: 'questionType', 
                      title: 'Question Type', 
                      type: 'string', 
                      options: { list: ['Multiple Choice', 'Fill in the Blank', 'Matching', 'Map Labeling'] } 
                    },
                    { 
                      name: 'options', 
                      title: 'Options (for Multiple Choice / Matching)', 
                      type: 'array', 
                      of: [{ type: 'string' }],
                      description: 'Leave empty for Fill in the Blank.'
                    },
                    { name: 'correctAnswer', title: 'Correct Answer', type: 'string' },
                  ]
                }
              ]
            }
          ]
        }
      ]
    })
  ],
})
