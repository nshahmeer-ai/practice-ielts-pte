// Only run extraction if we are on a specific test page (not the main listing)
if (window.location.href.includes("-test") && !window.location.href.includes("tests/")) {
  
  function extractData() {
    setTimeout(() => {
      // 1. Reveal answers
      const answerBtn = document.querySelector('[id^="bg-showmore-action-"]');
      if (answerBtn) answerBtn.click();
      
      // 2. Wait for answers to expand
      setTimeout(() => {
        const audioEl = document.querySelector('audio');
        // Smart DOM Parser to separate 3 passages
        const entryContent = document.querySelector('.entry-content') || document.body;
        let extractedPassages = [ { html: "" }, { html: "" }, { html: "" } ];
        let currentPassageIndex = 0;
        let inQuestions = false;

        if (entryContent && entryContent.children) {
           let children = Array.from(entryContent.children);
           for (let child of children) {
               if (['SCRIPT', 'IFRAME', 'STYLE'].includes(child.tagName)) continue;
               if (child.id && child.id.includes('bg-showmore')) continue;
               
               let text = child.innerText ? child.innerText.trim().toLowerCase() : "";
               let isQuestionMarker = text.includes('questions 1-') || text.includes('questions 14-') || text.includes('questions 27-') || text.match(/questions?\\s+\\d+\\s*-\\s*\\d+/i) || text.includes('choose the correct letter');
               
               if (isQuestionMarker) {
                   inQuestions = true;
               }
               
               let isHeading = child.tagName.startsWith('H');
               
               // If we were in questions, and see a new short heading, it's likely the next passage
               if (inQuestions && isHeading && text.length < 150 && !isQuestionMarker) {
                   if (currentPassageIndex < 2) {
                       currentPassageIndex++;
                   }
                   inQuestions = false;
               }
               
               extractedPassages[currentPassageIndex].html += child.outerHTML + '\\n';
           }
        }
        
        const answerTarget = document.querySelector('.bg-showmore-plg-target') || document.querySelector('[id^="bg-showmore-target-"]');
        
        const result = {
          title: document.title,
          url: window.location.href,
          audioSrc: audioEl ? audioEl.src : "NO_AUDIO",
          rawContentText: JSON.stringify(extractedPassages), // Store structured HTML!
          rawAnswers: answerTarget ? answerTarget.innerText : "NO_ANSWERS"
        };

        // Send data back to the background script
        chrome.runtime.sendMessage({ action: "test_data_extracted", data: result });
        
      }, 2500); // 2.5s wait to make sure answers are fully expanded
      
    }, 2000); // 2s wait to ensure dynamic scripts ran
  }

  // Fallback timeout in case load events never fire
  let hasRun = false;
  const runOnce = () => {
      if (!hasRun) {
          hasRun = true;
          extractData();
      }
  };

  if (document.readyState === "complete" || document.readyState === "interactive") {
      runOnce();
  } else {
      window.addEventListener('DOMContentLoaded', runOnce);
      window.addEventListener('load', runOnce);
      // Failsafe: run after 10 seconds no matter what
      setTimeout(runOnce, 10000);
  }
}
