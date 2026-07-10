export const test = {
  name: 'test',
  title: 'Test',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g., IELTS Listening Test 1',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'type',
      title: 'Test Type',
      type: 'string',
      options: {
        list: [
          { title: 'IELTS Listening', value: 'ielts_listening' },
          { title: 'IELTS Reading', value: 'ielts_reading' },
          { title: 'IELTS Writing', value: 'ielts_writing' },
          { title: 'IELTS Speaking', value: 'ielts_speaking' },
          { title: 'PTE', value: 'pte' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'testNumber',
      title: 'Test Number',
      type: 'number',
      description: 'e.g. 1',
    },
    {
      name: 'difficulty',
      title: 'Difficulty',
      type: 'string',
      options: {
        list: ['Beginner', 'Intermediate', 'Advanced']
      }
    },
    {
      name: 'audioDriveEmbed',
      title: 'Google Drive Audio Embed URL',
      type: 'url',
      description: 'Optional. Paste the Google Drive preview link here for Listening tests.',
      hidden: ({ document }: any) => document?.type !== 'ielts_listening',
    },
    {
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'content', title: 'Content / Passage', type: 'text' },
        { name: 'questions', title: 'Questions', type: 'array', of: [{ type: 'object', fields: [
          { name: 'questionText', title: 'Question', type: 'string' },
          { name: 'questionType', title: 'Question Type', type: 'string', options: { list: ['MCQ', 'Fill in blanks', 'True/False/Not Given'] } },
          { name: 'options', title: 'Options (For MCQ)', type: 'array', of: [{ type: 'string' }] },
          { name: 'correctAnswer', title: 'Correct Answer', type: 'string' }
        ]}]}
      ]}],
    },
  ],
}
