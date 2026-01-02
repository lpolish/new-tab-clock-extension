document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.local.get(['bgColor', 'font', 'fontColor', 'timeFormat', 'dateFormat', 'size'], function(items) {
    if (items.bgColor) {
      document.getElementById('bgColor').value = items.bgColor;
    }
    if (items.fontColor) {
      document.getElementById('fontColor').value = items.fontColor;
    }
    if (items.font) {
      document.getElementById('fontSelector').value = items.font;
    }
    if (items.timeFormat) {
      document.getElementById('timeFormat').value = items.timeFormat;
    }
    if (items.dateFormat) {
      document.getElementById('dateFormat').value = items.dateFormat;
    }
    if (items.size) {
      document.getElementById('sizeSlider').value = items.size;
    }
  });

  document.getElementById('bgColor').addEventListener('change', function() {
    const color = this.value;
    chrome.storage.local.set({ 'bgColor': color });
  });

  document.getElementById('fontColor').addEventListener('change', function() {
    const color = this.value;
    chrome.storage.local.set({ 'fontColor': color });
  });

  document.getElementById('fontSelector').addEventListener('change', function() {
    const font = this.value;
    chrome.storage.local.set({ 'font': font });
  });

  document.getElementById('timeFormat').addEventListener('change', function() {
    const format = this.value;
    chrome.storage.local.set({ 'timeFormat': format });
  });

  document.getElementById('dateFormat').addEventListener('change', function() {
    const format = this.value;
    chrome.storage.local.set({ 'dateFormat': format });
  });

  document.getElementById('sizeSlider').addEventListener('input', function() {
    const size = this.value;
    chrome.storage.local.set({ 'size': size });
  });
});

// Function to render URLs
function renderUrls(urls) {
  const urlList = document.getElementById('urlList');
  urlList.innerHTML = ''; // Clear existing list
  urls.forEach((urlObj, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${urlObj.title} (${urlObj.url})`;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
      urls.splice(index, 1);
      chrome.storage.local.set({ 'urls': urls }, function() {
        renderUrls(urls); // Refresh list
      });
    });
    listItem.appendChild(deleteButton);
    urlList.appendChild(listItem);
  });
}

// Populate saved URLs
chrome.storage.local.get(['urls'], function(items) {
  const urls = items.urls || [];
  renderUrls(urls);
});

// Event listener to save a new URL and title
document.getElementById('saveUrl').addEventListener('click', function() {
  const urlInput = document.getElementById('urlInput').value;
  const titleInput = document.getElementById('urlTitle').value;
  chrome.storage.local.get(['urls'], function(items) {
    const urls = items.urls || [];
    if (urlInput && titleInput) { // Only push if both fields are filled
      urls.push({ url: urlInput, title: titleInput });
      chrome.storage.local.set({ 'urls': urls }, function() {
        renderUrls(urls); // Refresh list
      });
    }
  });
  document.getElementById('urlInput').value = '';  // Clear the input fields
  document.getElementById('urlTitle').value = '';
});

// Function to append URL to list
function appendUrlToList(url, listElement) {
  const listItem = document.createElement('li');
  listItem.textContent = url;
  listItem.addEventListener('click', function() {
    // Remove URL logic here
  });
  listElement.appendChild(listItem);
}
