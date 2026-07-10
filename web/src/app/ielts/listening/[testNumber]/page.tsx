import { client } from '../../../../sanity/client'
import ListeningExamUI from './ListeningExamUI'

export const revalidate = 60

export default async function IELTSListeningExamPage({ params }: { params: { testNumber: string } }) {
  const testNumber = parseInt(params.testNumber, 10)
  
  // Fetch the specific test from Sanity
  const test = await client.fetch(
    `*[_type == "test" && type == "ielts_listening" && testNumber == $testNumber][0]`,
    { testNumber }
  )

  if (!test) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2>Test Not Found</h2>
        <p>This test does not exist or has not been published yet.</p>
        <a href="/ielts/listening" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>Back to Listening Tests</a>
      </div>
    )
  }

  return <ListeningExamUI test={test} />
}
