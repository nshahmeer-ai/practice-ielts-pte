import { defineField, defineType } from 'sanity'

export const ieltsBook = defineType({
  name: 'ieltsBook',
  title: 'IELTS Book',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Book Title (e.g., Cambridge IELTS 15)',
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
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Optional short description of the book.',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Used to sort books (e.g., 15 for Cambridge 15). Higher numbers appear first.',
    })
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
    },
  },
})
