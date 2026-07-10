import { defineField, defineType } from 'sanity'

export const ieltsWriting = defineType({
  name: 'ieltsWriting',
  title: 'IELTS Writing',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Test Title (e.g., IELTS Writing Test 1)',
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
      name: 'task1',
      title: 'Task 1',
      type: 'object',
      fields: [
        { name: 'prompt', title: 'Task 1 Prompt', type: 'text' },
        { name: 'image', title: 'Task 1 Image / Graph', type: 'image', options: { hotspot: true } },
        { name: 'sampleAnswer', title: 'Sample Answer', type: 'array', of: [{ type: 'block' }] }
      ]
    }),
    defineField({
      name: 'task2',
      title: 'Task 2',
      type: 'object',
      fields: [
        { name: 'prompt', title: 'Task 2 Prompt', type: 'text' },
        { name: 'sampleAnswer', title: 'Sample Answer', type: 'array', of: [{ type: 'block' }] }
      ]
    })
  ],
})
