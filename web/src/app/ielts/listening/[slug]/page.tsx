import { client } from '../../../../sanity/client'
import InteractiveTestClient from './InteractiveTestClient'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function Page({ params }: { params: any }) {
  // Await the params object if it's a Promise (in Next.js 15+ async params are common, but here we can handle it)
  const resolvedParams = params instanceof Promise ? await params : params;
  const slug = resolvedParams?.slug;

  let testData = null;
  if (slug) {
    testData = await client.fetch(`*[_type == "ieltsListening" && slug.current == $slug][0]`, {
      slug: slug
    });
  }

  return <InteractiveTestClient initialTest={testData} />
}
