import { defineField, defineType } from 'sanity'

export const ieltsTest = defineType({
  name: 'ieltsTest',
  title: 'Full IELTS Test',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Test Title (e.g., Test 1)',
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
      name: 'book',
      title: 'IELTS Book',
      type: 'reference',
      to: [{ type: 'ieltsBook' }],
      validation: (rule) => rule.required(),
      description: 'Which book does this test belong to?',
    }),
    defineField({
      name: 'listening',
      title: 'Listening Module',
      type: 'reference',
      to: [{ type: 'ieltsListening' }],
      description: 'Select the Listening test for this full test.',
    }),
    defineField({
      name: 'reading',
      title: 'Reading Module',
      type: 'reference',
      to: [{ type: 'ieltsReading' }],
      description: 'Select the Reading test for this full test.',
    }),
    defineField({
      name: 'writing',
      title: 'Writing Module',
      type: 'reference',
      to: [{ type: 'ieltsWriting' }],
      description: 'Select the Writing test for this full test.',
    }),
    defineField({
      name: 'speaking',
      title: 'Speaking Module',
      type: 'reference',
      to: [{ type: 'ieltsSpeaking' }],
      description: 'Select the Speaking test for this full test.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      bookTitle: 'book.title',
    },
    prepare(selection) {
      const { title, bookTitle } = selection
      return {
        title: title,
        subtitle: bookTitle ? `Book: ${bookTitle}` : 'No Book Assigned',
      }
    }
  },
})
