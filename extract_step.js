const fs = require('fs');
const readline = require('readline');

async function extractStep() {
  const fileStream = fs.createReadStream('C:\\Users\\ZH TRADERS\\.gemini\\antigravity-ide\\brain\\565e02e3-b250-445c-b4d8-b3ad2ac137f7\\.system_generated\\logs\\transcript_full.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (line.includes('"step_index":1015')) {
      const parsed = JSON.parse(line);
      fs.writeFileSync('d:\\practice-ielts-pte\\user_paste.txt', parsed.content, 'utf8');
      console.log('Extracted to user_paste.txt');
      break;
    }
  }
}

extractStep();
