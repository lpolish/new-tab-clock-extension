document.addEventListener('DOMContentLoaded', function() {
  // Update slider value display
  const sizeSlider = document.getElementById('sizeSlider');
  const sizeValue = document.getElementById('sizeValue');
  
  sizeSlider.addEventListener('input', function() {
    const size = this.value;
    sizeValue.textContent = size;
    chrome.storage.local.set({ 'size': size });
  });

  chrome.storage.local.get(['bgColor', 'font', 'fontColor', 'timeFormat', 'dateFormat', 'size', 'bgImageStyle'], function(items) {
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
      sizeSlider.value = items.size;
      sizeValue.textContent = items.size;
    }
    if (items.bgImageStyle) {
      const style = items.bgImageStyle;
      document.getElementById('bgSize').value = style.size || 'cover';
      document.getElementById('bgRepeat').value = style.repeat || 'no-repeat';
      document.getElementById('brightness').value = style.brightness || 1;
      document.getElementById('brightnessValue').textContent = style.brightness || 1;
      document.getElementById('contrast').value = style.contrast || 1;
      document.getElementById('contrastValue').textContent = style.contrast || 1;
      document.getElementById('opacity').value = style.opacity || 1;
      document.getElementById('opacityValue').textContent = style.opacity || 1;
    }
    if (items.bgImage) {
      document.getElementById('preview-img').src = items.bgImage;
      document.getElementById('image-preview').style.display = 'block';
    }
  });

  // Move slider listener here after storage load
  sizeSlider.addEventListener('input', function() {
    const size = this.value;
    sizeValue.textContent = size;
    chrome.storage.local.set({ 'size': size });
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

  function updateBgImageStyle() {
    const style = {
      size: document.getElementById('bgSize').value,
      repeat: document.getElementById('bgRepeat').value,
      brightness: parseFloat(document.getElementById('brightness').value),
      contrast: parseFloat(document.getElementById('contrast').value),
      opacity: parseFloat(document.getElementById('opacity').value),
    };
    chrome.storage.local.set({ 'bgImageStyle': style });
    if (window.cropperInstance) {
      applyPreviewStyles();
    }
  }

  function applyPreviewStyles() {
    const brightness = parseFloat(document.getElementById('brightness').value);
    const contrast = parseFloat(document.getElementById('contrast').value);
    const opacity = parseFloat(document.getElementById('opacity').value);
    const img = document.getElementById('cropper-image');
    img.style.filter = `brightness(${brightness}) contrast(${contrast})`;
    img.style.opacity = opacity;
  }

  document.getElementById('bgSize').addEventListener('change', updateBgImageStyle);
  document.getElementById('bgRepeat').addEventListener('change', updateBgImageStyle);

  const brightnessSlider = document.getElementById('brightness');
  const brightnessValue = document.getElementById('brightnessValue');
  brightnessSlider.addEventListener('input', function() {
    brightnessValue.textContent = this.value;
    updateBgImageStyle();
  });

  const contrastSlider = document.getElementById('contrast');
  const contrastValue = document.getElementById('contrastValue');
  contrastSlider.addEventListener('input', function() {
    contrastValue.textContent = this.value;
    updateBgImageStyle();
  });

  const opacitySlider = document.getElementById('opacity');
  const opacityValue = document.getElementById('opacityValue');
  opacitySlider.addEventListener('input', function() {
    opacityValue.textContent = this.value;
    updateBgImageStyle();
  });

  document.getElementById('bgImageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        document.getElementById('cropper-image').src = e.target.result;
        applyPreviewStyles();
        const cropper = new Cropper(document.getElementById('cropper-image'), {
          aspectRatio: 16 / 9,
          viewMode: 1,
        });
        window.cropperInstance = cropper;
        document.getElementById('cropper-container').style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById('crop-save').addEventListener('click', function() {
    const canvas = window.cropperInstance.getCroppedCanvas();
    if (canvas) {
      canvas.toBlob(function(blob) {
        const reader = new FileReader();
        reader.onload = function(e) {
          chrome.storage.local.set({ 'bgImage': e.target.result });
          document.getElementById('preview-img').src = e.target.result;
          document.getElementById('image-preview').style.display = 'block';
          document.getElementById('cropper-container').style.display = 'none';
          window.cropperInstance.destroy();
          window.cropperInstance = null;
          const img = document.getElementById('cropper-image');
          img.style.filter = '';
          img.style.opacity = '';
        };
        reader.readAsDataURL(blob);
      });
    }
  });

  document.getElementById('crop-cancel').addEventListener('click', function() {
    document.getElementById('cropper-container').style.display = 'none';
    if (window.cropperInstance) {
      window.cropperInstance.destroy();
      window.cropperInstance = null;
    }
    const img = document.getElementById('cropper-image');
    img.style.filter = '';
    img.style.opacity = '';
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
