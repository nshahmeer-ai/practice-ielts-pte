import { defineField, defineType } from 'sanity'

export const ieltsSpeaking = defineType({
  name: 'ieltsSpeaking',
  title: 'IELTS Speaking',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Test Title (e.g., IELTS Speaking Test 1)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration (minutes)',
      type: 'number',
      initialValue: 15,
    }),
    defineField({
      name: 'part1',
      title: 'Part 1: Introduction and Interview',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'topic', title: 'Topic', type: 'string' },
            { name: 'questions', title: 'Questions', type: 'array', of: [{ type: 'string' }] }
          ]
        }
      ]
    }),
    defineField({
      name: 'part2',
      title: 'Part 2: Long Turn (Cue Card)',
      type: 'object',
      fields: [
        { name: 'prompt', title: 'Cue Card Prompt', type: 'text' },
        { name: 'bulletPoints', title: 'Bullet Points', type: 'array', of: [{ type: 'string' }] }
      ]
    }),
    defineField({
      name: 'part3',
      title: 'Part 3: Discussion',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'topic', title: 'Discussion Topic', type: 'string' },
            { name: 'questions', title: 'Questions', type: 'array', of: [{ type: 'string' }] }
          ]
        }
      ]
    })
  ],
})
