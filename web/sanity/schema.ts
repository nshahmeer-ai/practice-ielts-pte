import { ieltsListening } from './schemaTypes/ieltsListening'
import { ieltsReading } from './schemaTypes/ieltsReading'
import { ieltsWriting } from './schemaTypes/ieltsWriting'
import { ieltsSpeaking } from './schemaTypes/ieltsSpeaking'
import { pteTest } from './schemaTypes/pte'
import { hubPage } from './schemaTypes/hubPage'
import { ieltsBook } from './schemaTypes/ieltsBook'
import { ieltsTest } from './schemaTypes/ieltsTest'

export const schema = {
  types: [
    ieltsBook,
    ieltsTest,
    ieltsListening,
    ieltsReading,
    ieltsWriting,
    ieltsSpeaking,
    pteTest,
    hubPage
  ],
}
