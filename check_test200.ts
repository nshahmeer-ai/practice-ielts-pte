import { client } from './web/src/sanity/client';

async function fetchTest() {
  const data = await client.fetch(`*[_type == "ieltsListening" && slug.current == "test200"][0]`);
  console.log(JSON.stringify(data.passageContent, null, 2));
}

fetchTest();
