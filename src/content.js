
// Fetch settings from chrome.storage.local and send them to the background script
chrome.storage.local.get(['bgColor', 'font', 'timeFormat', 'dateFormat'], function(items) {
  chrome.runtime.sendMessage({action: 'applySettings', data: items});
});
