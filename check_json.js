const fs = require('fs');
try {
  const data = JSON.parse(fs.readFileSync('C:/Users/ZH TRADERS/Downloads/scraped_ielts_tests (1).json', 'utf8'));
  console.log('Total tests:', data.length);
  if (data.length > 0) {
    console.log('First test title:', data[0].title);
    console.log('First test exam:', data[0].exam);
    console.log('First test module:', data[0].module);
  }
} catch (e) {
  console.error(e);
}
