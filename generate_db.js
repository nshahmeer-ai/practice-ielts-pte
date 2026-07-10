const fs = require('fs');
const path = require('path');

const downloadsPath = 'C:/Users/ZH TRADERS/Downloads/scraped_ielts_tests (1).json';
const backupPath1 = 'C:/Users/ZH TRADERS/Downloads/scraped_ielts_tests.json';

let jsonFilePath = '';
if (fs.existsSync(downloadsPath)) {
  jsonFilePath = downloadsPath;
} else if (fs.existsSync(backupPath1)) {
  jsonFilePath = backupPath1;
} else {
  console.log("Could not find the scraped JSON file in Downloads.");
  process.exit(1);
}

console.log(`Loading JSON from: ${jsonFilePath}...`);
const rawData = fs.readFileSync(jsonFilePath, 'utf8');
let allTests = [];
try {
  allTests = JSON.parse(rawData);
} catch (e) {
  console.error("Failed to parse JSON:", e.message);
  process.exit(1);
}

// Split by module
const listeningTests = [];
const readingTests = [];

allTests.forEach(t => {
  if (t.title && t.title.toLowerCase().includes('listening')) {
    listeningTests.push(t);
  } else if (t.title && t.title.toLowerCase().includes('reading')) {
    readingTests.push(t);
  } else {
    // If unknown, default to reading just in case, or check url
    if (t.url && t.url.toLowerCase().includes('listening')) listeningTests.push(t);
    else readingTests.push(t);
  }
});

console.log(`Found ${listeningTests.length} Listening tests and ${readingTests.length} Reading tests.`);

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
  for (let i = 1; i <= maxQ; i++) {
    let qType = 'input';
    let ans = answersMap[i] || `[Answer ${i}]`;
    
    if (/^[A-E]$/i.test(ans) || /^(TRUE|FALSE|NOT GIVEN|YES|NO)$/i.test(ans)) {
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

// ─── LISTENING PARSER ──────────────────────────────────────────
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
  jsCode += `  _generatePlaceholderTest(testNum, exam) {\n    return { id: testNum, title: 'Test ' + testNum + ' (Placeholder)', exam, module: 'listening', sections: [] };\n  }\n};\n`;
  return jsCode;
}

// ─── READING PARSER ────────────────────────────────────────────
function groupIntoReadingPassages(questionsList, fullRawText) {
  const passages = [];
  let startQ = 1;
  let endQ = 13;

  let parsedPassages = null;
  try {
      parsedPassages = JSON.parse(fullRawText);
  } catch(e) {}

  for (let i = 0; i < 3; i++) {
    let pText = "";
    let currentQuestions = questionsList.slice(startQ - 1, endQ);
    
    if (parsedPassages && Array.isArray(parsedPassages) && parsedPassages[i]) {
        pText = parsedPassages[i].html;
    } else {
        pText = "**Note: This text box contains the entire reading test (all 3 passages). Simply scroll down to the passage relevant to the current questions!**\n\n---\n\n" + fullRawText;
    }
    
    passages.push({
      id: i + 1,
      title: `Reading Passage ${i + 1}`,
      text: pText,
      isHtml: parsedPassages ? true : false,
      questions: [
        {
          type: "input",
          title: `Questions ${startQ}-${endQ}`,
          instructions: "Answer the questions based on the passage.",
          items: currentQuestions.map(q => { delete q.raw_test_text; return q; })
        }
      ]
    });
    startQ = endQ + 1;
    endQ = i === 1 ? 40 : endQ + 13;
  }
  return passages;
}

function generateReadingDatabaseJS(rawArray) {
  let jsCode = `/**\n * Auto-Generated Reading Database\n * Contains ${rawArray.length} Tests\n */\n\nconst ReadingModel = {\n  getIELTSTest(testNum) {\n    const tests = {\n`;

  rawArray.forEach((test, index) => {
    let testId = index + 1;
    let match = null;
    if (test.url) match = test.url.match(/test[-_]?(\d+)/i);
    if (!match && test.title) match = test.title.match(/test\s*(\d+)/i);
    if (match && match[1]) testId = parseInt(match[1]);
    
    const answersMap = extractAnswers(test.rawAnswers || "");
    const questionsList = extractQuestions(test.rawContentText || "", answersMap, 40);
    const passages = groupIntoReadingPassages(questionsList, test.rawContentText || "No text found.");

    const testObj = {
      id: testId,
      title: test.title || `IELTS Academic Reading Test ${testId}`,
      exam: 'ielts',
      module: 'reading',
      type: 'Academic',
      duration: 60,
      passages: passages
    };

    jsCode += `      ${testId}: ${JSON.stringify(testObj, null, 8).replace(/"([^"]+)":/g, '$1:')},\n`;
  });

  jsCode += `    };\n    if (!tests[testNum]) return this._generatePlaceholder(testNum, 'ielts');\n    return tests[testNum];\n  },\n\n`;
  jsCode += `  getAvailableIELTSTests() {\n    return [${rawArray.map((_, i) => i+1).join(',')}];\n  },\n\n`;
  jsCode += `  getPTETest(testNum) { return this._generatePlaceholder(testNum, 'pte'); },\n\n`;
  jsCode += `  _generatePlaceholder(testNum, exam) {\n    return { id: testNum, title: exam + ' Reading Test ' + testNum + ' (Placeholder)', exam, module: 'reading', passages: [] };\n  }\n};\n`;
  return jsCode;
}

// Write the files
if (listeningTests.length > 0) {
  const listJs = generateListeningDatabaseJS(listeningTests);
  fs.writeFileSync(path.join(__dirname, 'models', 'listening.js'), listJs);
  console.log(`Wrote ${listeningTests.length} tests to models/listening.js!`);
}

if (readingTests.length > 0) {
  const readJs = generateReadingDatabaseJS(readingTests);
  fs.writeFileSync(path.join(__dirname, 'models', 'reading.js'), readJs);
  console.log(`Wrote ${readingTests.length} tests to models/reading.js!`);
}

// Update tests.js to dynamically use the available tests count
const testsJsPath = path.join(__dirname, 'models', 'tests.js');
let testsJs = fs.readFileSync(testsJsPath, 'utf8');

testsJs = testsJs.replace(/return Array\.from\(\{ length: 1 \}, \(\_, i\) => \(\{/g, 
    "let realCount = 1;" +
    "if (exam === 'ielts' && module === 'listening' && typeof ListeningModel !== 'undefined' && ListeningModel.getAvailableIELTSTests) {" +
    "  realCount = ListeningModel.getAvailableIELTSTests().length;" +
    "}" +
    "if (exam === 'ielts' && module === 'reading' && typeof ReadingModel !== 'undefined' && ReadingModel.getAvailableIELTSTests) {" +
    "  realCount = ReadingModel.getAvailableIELTSTests().length;" +
    "}" +
    "return Array.from({ length: realCount }, (_, i) => ({");
fs.writeFileSync(testsJsPath, testsJs);
console.log("Updated models/tests.js to dynamically show the correct number of tests!");
console.log("DONE!");
