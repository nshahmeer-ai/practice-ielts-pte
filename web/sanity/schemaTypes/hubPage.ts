import { defineField, defineType } from 'sanity'

export const hubPage = defineType({
  name: 'hubPage',
  title: 'Test Hub Pages',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Name (e.g., TOEFL Hub)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'The URL path (e.g., "toefl" for /toefl)',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'The large text at the top (e.g., "Master the TOEFL")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      description: 'The description below the hero title.',
    }),
    defineField({
      name: 'heroIcon',
      title: 'Hero Icon (Material Symbol Name)',
      type: 'string',
      description: 'e.g., "language", "public", "school"',
      initialValue: 'school',
    }),
    defineField({
      name: 'themeColor',
      title: 'Page Theme Color',
      type: 'string',
      options: {
        list: [
          { title: 'Purple', value: 'purple' },
          { title: 'Teal', value: 'teal' },
          { title: 'Orange', value: 'orange' },
          { title: 'Green', value: 'green' },
          { title: 'Pink', value: 'pink' },
        ],
      },
      initialValue: 'purple',
    }),
    defineField({
      name: 'modules',
      title: 'Practice Modules',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Module Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text' }),
            defineField({ name: 'icon', title: 'Icon (Material Symbol)', type: 'string' }),
            defineField({
              name: 'themeColor',
              title: 'Card Theme Color',
              type: 'string',
              options: {
                list: [
                  { title: 'Purple', value: 'purple' },
                  { title: 'Teal', value: 'teal' },
                  { title: 'Orange', value: 'orange' },
                  { title: 'Green', value: 'green' },
                ],
              },
            }),
            defineField({ name: 'link', title: 'Link (e.g., /toefl/listening)', type: 'string' }),
            defineField({ name: 'status', title: 'Status Text (e.g., Coming Soon)', type: 'string' }),
          ],
        },
      ],
    }),
  ],
})
