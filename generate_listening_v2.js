const fs = require('fs');
const path = require('path');

const downloadsDir = 'C:/Users/ZH TRADERS/Downloads';
const files = fs.readdirSync(downloadsDir).filter(f => f.startsWith('scraped_ielts_tests') && f.endsWith('.json'));

if (files.length === 0) {
  console.log("Could not find any scraped JSON files in Downloads.");
  process.exit(1);
}

let allTests = [];

files.forEach(f => {
  const jsonFilePath = path.join(downloadsDir, f);
  console.log(`Loading JSON from: ${jsonFilePath}...`);
  try {
    const rawData = fs.readFileSync(jsonFilePath, 'utf8');
    const parsed = JSON.parse(rawData);
    allTests = allTests.concat(parsed);
  } catch (e) {
    console.error(`Failed to parse JSON in ${f}:`, e.message);
  }
});

const listeningTests = [];
allTests.forEach(t => {
  if (t.title && t.title.toLowerCase().includes('listening')) listeningTests.push(t);
  else if (t.url && t.url.toLowerCase().includes('listening')) listeningTests.push(t);
});

// ─── UTILS ─────────────────────────────────────────────────────
function extractAnswers(rawAnsText) {
  const map = {};
  const regex = /\b(\d{1,2})\s*[\.\-\)]?\s*([A-Za-z0-9\s\,\-\']+?)(?=\s*\b\d{1,2}\s*[\.\-\)]?\s*|$)/g;
  let match;
  while ((match = regex.exec(rawAnsText)) !== null) {
    let qNum = parseInt(match[1]);
    let ans = match[2].trim();
    map[qNum] = ans;
  }
  return map;
}

function extractQuestions(rawContentText, answersMap, maxQ) {
  let rawText = rawContentText || "";
  let htmlText = "";
  
  try {
      let parsed = JSON.parse(rawText);
      if (Array.isArray(parsed)) {
         htmlText = parsed.map(p => p.html).join(' ');
      }
  } catch (e) {}

  const questions = [];
  const cleanHtml = htmlText.replace(/<[^>]*>?/gm, ' ').replace(/&nbsp;/g, ' '); // Strip HTML tags
  
  for (let i = 1; i <= maxQ; i++) {
    let qType = 'input';
    let ans = answersMap[i] || `[Answer ${i}]`;
    
    if (/^[A-E]$/i.test(ans) || /^(TRUE|FALSE|NOT GIVEN|YES|NO)$/i.test(ans) || ans.includes(' IN EITHER ORDER')) {
      qType = 'mcq';
    }

    let qObj = {
      num: i,
      text: `Question ${i}: Provide the answer.`, 
      type: qType,
      answer: ans
    };

    if (qType === 'mcq') {
      qObj.options = ['A', 'B', 'C', 'D'];
      if (/^(TRUE|FALSE|NOT GIVEN|YES|NO)$/i.test(ans)) {
         qObj.options = ['TRUE', 'FALSE', 'NOT GIVEN'];
         if(ans === 'YES' || ans === 'NO') qObj.options = ['YES', 'NO', 'NOT GIVEN'];
      } else {
         const qRegex = new RegExp(`\\b${i}\\b([^A]*?)\\bA\\s+([^B]+?)\\bB\\s+([^C]+?)\\bC\\s+([^D0-9]+)`, 'i');
         const m = cleanHtml.match(qRegex);
         if (m) {
             let txt = m[1].trim();
             // Clean up leading numbers or dots
             txt = txt.replace(/^[\.\)\-\s]+/, '');
             qObj.text = txt || `Question ${i}`;
             qObj.options = [m[2].trim(), m[3].trim(), m[4].trim()];
             
             const dMatch = cleanHtml.match(new RegExp(`\\b${i}\\b.*?\\bD\\s+([^E0-9]+)`, 'i'));
             if (dMatch) qObj.options.push(dMatch[1].trim());
         }
      }
    }

    questions.push(qObj);
  }
  
  if(questions[0]) {
     questions[0].raw_test_text = htmlText ? htmlText : rawContentText;
     questions[0].isHtml = htmlText ? true : false;
  }
  return questions;
}

function groupIntoListeningSections(questionsList) {
  const sections = [];
  for (let i = 0; i < 4; i++) {
    sections.push({
      id: i + 1,
      title: `Section ${i + 1} — Questions ${i * 10 + 1}–${(i + 1) * 10}`,
      context: i === 0 && questionsList[0] ? questionsList[0].raw_test_text || 'See test text.' : 'Listen to the audio.',
      questionType: 'mixed',
      instructions: 'Answer the questions.',
      questions: questionsList.slice(i * 10, (i + 1) * 10).map(q => { delete q.raw_test_text; return q; })
    });
  }
  return sections;
}

function generateListeningDatabaseJS(rawArray) {
  let jsCode = `/**\n * Auto-Generated Listening Database\n * Contains ${rawArray.length} Tests\n */\n\nconst ListeningModel = {\n  getIELTSTest(testNum) {\n    const tests = {\n`;

  rawArray.forEach((test, index) => {
    let testId = index + 1;
    let match = null;
    if (test.url) match = test.url.match(/test[-_]?(\d+)/i);
    if (!match && test.title) match = test.title.match(/test\s*(\d+)/i);
    if (match && match[1]) testId = parseInt(match[1]);
    
    const answersMap = extractAnswers(test.rawAnswers || "");
    const questionsList = extractQuestions(test.rawContentText || "", answersMap, 40);
    const sections = groupIntoListeningSections(questionsList);

    const testObj = {
      id: testId,
      title: test.title || `IELTS Listening Test ${testId}`,
      exam: 'ielts',
      module: 'listening',
      duration: 30,
      audioSrc: test.audioSrc !== "NO_AUDIO" ? test.audioSrc : "",
      audioDriveEmbed: "",
      audioLabel: `IELTS Listening Test ${testId} — Full Audio`,
      sections: sections
    };

    jsCode += `      ${testId}: ${JSON.stringify(testObj, null, 8).replace(/"([^"]+)":/g, '$1:')},\n`;
  });

  jsCode += `    };\n    if (!tests[testNum]) return this._generatePlaceholderTest(testNum, 'ielts');\n    return tests[testNum];\n  },\n\n`;
  jsCode += `  getAvailableIELTSTests() {\n    return [${rawArray.map((_, i) => i+1).join(',')}];\n  },\n\n`;
  jsCode += `  getPTETest(testNum) { return null; },\n\n`;
  jsCode += `  _generatePlaceholderTest(testNum, exam) {\n    return { id: testNum, title: 'Test ' + testNum + ' (Placeholder)', exam, module: 'listening', sections: [] };\n  }\n};\n`;
  return jsCode;
}

if (listeningTests.length > 0) {
  const listJs = generateListeningDatabaseJS(listeningTests);
  fs.writeFileSync(path.join(__dirname, 'models', 'listening.js'), listJs);
  console.log(`Wrote ${listeningTests.length} tests to models/listening.js!`);
} else {
  console.log('No listening tests found! Checked all files.');
}
