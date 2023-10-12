
// Listen for a message from the content script to apply settings
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'applySettings') {
    // Logic to apply settings goes here.
    // For now, we will just log the settings to the console.
    console.log(request.data);
  }
});
