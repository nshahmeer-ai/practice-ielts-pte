document.getElementById('startBtn').addEventListener('click', () => {
  document.getElementById('status').innerText = "Scraping started... Please wait.";
  chrome.runtime.sendMessage({ action: "start_scraping" });
});

document.getElementById('stopBtn').addEventListener('click', () => {
  document.getElementById('status').innerText = "Stopping and downloading data...";
  chrome.runtime.sendMessage({ action: "stop_scraping" });
});

// Listen for updates from background
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "update_status") {
    document.getElementById('status').innerText = msg.text;
  }
});
