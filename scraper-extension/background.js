chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "start_scraping") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab.url.includes("practicepteonline.com")) {
        chrome.runtime.sendMessage({ action: "update_status", text: "Error: Not on practicepteonline.com" });
        return;
      }
      
      chrome.runtime.sendMessage({ action: "update_status", text: "Extracting test URLs..." });
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: () => {
          const links = Array.from(document.querySelectorAll('a'));
          return links.map(a => a.href).filter(href => href.includes('-test') && !href.includes('tests/'));
        }
      }, (results) => {
        if (results && results[0] && results[0].result) {
          const testUrls = [...new Set(results[0].result)]; // Remove duplicates
          chrome.storage.local.set({
            isScraping: true,
            testUrls: testUrls,
            currentTestIndex: 0,
            scrapedData: [],
            scraperTabId: activeTab.id
          }, () => {
            chrome.runtime.sendMessage({ action: "update_status", text: `Found ${testUrls.length} tests. Starting...` });
            processNextTest();
          });
        }
      });
    });
  } else if (request.action === "stop_scraping") {
    chrome.storage.local.set({ isScraping: false }, () => {
      downloadData();
    });
  } else if (request.action === "test_data_extracted") {
    chrome.storage.local.get(['isScraping', 'scrapedData', 'testUrls', 'currentTestIndex', 'scraperTabId'], (data) => {
      if (!data.isScraping) return;
      
      const payload = request.data;
      payload.url = data.testUrls[data.currentTestIndex];
      const updatedData = data.scrapedData || [];
      updatedData.push(payload);
      
      const nextIndex = data.currentTestIndex + 1;
      
      chrome.storage.local.set({
        scrapedData: updatedData,
        currentTestIndex: nextIndex
      }, () => {
        if (watchdogTimer) clearTimeout(watchdogTimer);
        chrome.runtime.sendMessage({ action: "update_status", text: `Scraped ${nextIndex} of ${data.testUrls.length} tests...` });
        
        setTimeout(() => {
          processNextTest();
        }, 500); // 0.5-second delay between tests to be fast
      });
    });
  }
});

let watchdogTimer = null;

function processNextTest() {
  chrome.storage.local.get(['isScraping', 'testUrls', 'currentTestIndex', 'scraperTabId'], (data) => {
    if (!data.isScraping) return;
    
    if (data.currentTestIndex < data.testUrls.length) {
      const nextUrl = data.testUrls[data.currentTestIndex];
      chrome.tabs.update(data.scraperTabId, { url: nextUrl });
      
      // Watchdog: If the page takes more than 10 seconds to load and extract, force skip to next!
      if (watchdogTimer) clearTimeout(watchdogTimer);
      watchdogTimer = setTimeout(() => {
          chrome.storage.local.get(['isScraping', 'currentTestIndex'], (wData) => {
              if (wData.isScraping && wData.currentTestIndex === data.currentTestIndex) {
                  // It's stuck! Force proceed to next.
                  chrome.storage.local.set({ currentTestIndex: wData.currentTestIndex + 1 }, () => {
                      chrome.runtime.sendMessage({ action: "update_status", text: `Skipped test ${wData.currentTestIndex + 1} (Timeout)` });
                      processNextTest();
                  });
              }
          });
      }, 10000);
      
    } else {
      if (watchdogTimer) clearTimeout(watchdogTimer);
      chrome.storage.local.set({ isScraping: false }, () => {
        chrome.runtime.sendMessage({ action: "update_status", text: "Finished scraping!" });
        downloadData();
      });
    }
  });
}

function downloadData() {
  chrome.storage.local.get(['scrapedData', 'scraperTabId'], (data) => {
    const scrapedData = data.scrapedData || [];
    if (scrapedData.length === 0) {
      chrome.runtime.sendMessage({ action: "update_status", text: "No data to download." });
      return;
    }
    
    // Inject a download script into the active tab to safely download huge blobs
    chrome.scripting.executeScript({
      target: { tabId: data.scraperTabId },
      func: (jsonString) => {
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'scraped_ielts_tests.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert("Scraping finished! File downloaded.");
      },
      args: [JSON.stringify(scrapedData, null, 2)]
    });
  });
}
