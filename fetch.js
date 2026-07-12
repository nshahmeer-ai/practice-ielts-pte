const fs = require('fs');

fetch('https://z2fjzj0g.api.sanity.io/v2024-07-10/data/query/production?query=*%5B_type+%3D%3D+%22ieltsListening%22+%26%26+slug.current+%3D%3D+%22test200%22%5D%5B0%5D')
  .then(r => r.json())
  .then(d => {
     fs.writeFileSync('output.html', d.result.passageContent, 'utf8');
     fs.writeFileSync('rawAnswerKey.txt', d.result.rawAnswerKey || '', 'utf8');
  });
