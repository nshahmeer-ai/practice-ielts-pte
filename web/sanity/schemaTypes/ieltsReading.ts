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
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'examTrack',
      title: 'Exam Track (Academic vs General)',
      type: 'string',
      options: { list: ['Academic', 'General Training'] },
      initialValue: 'Academic',
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
              name: 'passageText', 
              title: 'Reading Passage Content (Left Pane)', 
              type: 'text',
              description: 'Paste the main reading passage (HTML/Text) that appears on the left side of the screen.'
            },
            {
              name: 'questionsContent',
              title: 'Questions Content (Right Pane - HTML/Text with [[1]] tags)',
              type: 'text',
              description: 'Paste HTML tables or text here. Use [[1]], [[2]] to insert fill-in-the-blank boxes inline for the questions. This appears on the right side of the screen.'
            },
            {
              name: 'questions',
              title: 'Questions Data (For Grading)',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'questionNumber', title: 'Question Number (e.g., 1)', type: 'number' },
                    { name: 'questionText', title: 'Question Text', type: 'string' },
                    { 
                      name: 'questionType', 
                      title: 'Question Type', 
                      type: 'string', 
                      options: { list: ['Multiple Choice', 'Fill in the Blank', 'True / False / Not Given', 'Yes / No / Not Given', 'Matching', 'Multiple Select'] } 
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
            }
          ]
        }
      ]
    })
  ],
})
