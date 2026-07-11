import { ieltsListening } from './schemaTypes/ieltsListening'
import { ieltsReading } from './schemaTypes/ieltsReading'
import { ieltsWriting } from './schemaTypes/ieltsWriting'
import { ieltsSpeaking } from './schemaTypes/ieltsSpeaking'
import { pteTest } from './schemaTypes/pte'
import { hubPage } from './schemaTypes/hubPage'

export const schema = {
  types: [
    ieltsListening,
    ieltsReading,
    ieltsWriting,
    ieltsSpeaking,
    pteTest,
    hubPage
  ],
}
