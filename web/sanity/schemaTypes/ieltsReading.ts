import { defineField, defineType } from 'sanity'

export const ieltsReading = defineType({
  name: 'ieltsReading',
  title: 'IELTS Reading',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Test Title (e.g., IELTS Reading Test 1)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration (minutes)',
      type: 'number',
      initialValue: 60,
    }),
    defineField({
      name: 'passages',
      title: 'Reading Passages',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'passageTitle', title: 'Passage Title', type: 'string' },
            { 
              name: 'passageContent', 
              title: 'Passage Text Content', 
              type: 'array',
              of: [{ type: 'block' }] 
            },
            {
              name: 'questions',
              title: 'Questions for this Passage',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'questionNumber', title: 'Question Number', type: 'number' },
                    { name: 'questionText', title: 'Question Text / Instructions', type: 'string' },
                    { 
                      name: 'questionType', 
                      title: 'Question Type', 
                      type: 'string', 
                      options: { list: ['Multiple Choice', 'True / False / Not Given', 'Yes / No / Not Given', 'Matching Headings', 'Matching Paragraph Information', 'Fill in the Blank'] } 
                    },
                    { 
                      name: 'options', 
                      title: 'Options (if applicable)', 
                      type: 'array', 
                      of: [{ type: 'string' }]
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
