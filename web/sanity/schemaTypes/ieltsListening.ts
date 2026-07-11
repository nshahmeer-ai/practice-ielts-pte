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
      name: 'testPaperImages',
      title: 'Test Paper Screenshots (Parts 1 to 4)',
      type: 'array',
      of: [{ 
        type: 'image', 
        options: { hotspot: true },
        fields: [
          {
            name: 'caption',
            type: 'string',
            title: 'Caption (e.g., Part 1)',
          }
        ]
      }],
      description: 'Upload screenshots of the actual test questions (Part 1, 2, 3, 4).'
    }),
    defineField({
      name: 'answers',
      title: 'Rapid Answers Entry',
      type: 'text',
      description: 'Paste the 40 correct answers here, ONE PER LINE. Line 1 will be Question 1, Line 40 will be Question 40.',
      validation: (rule) => rule.required(),
    })
  ],
})
