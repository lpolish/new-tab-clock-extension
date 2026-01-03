(function() {
  let prevTime = "00:00:00";
  let prevMinute = "00";
  let prevDate = "";
  let updateInterval;

  document.addEventListener('DOMContentLoaded', function() {
    function updateTimeAndDate() {
      const now = new Date();
      const hours24 = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const dateString = now.toLocaleDateString();

      const currentHour24 = hours24.toString().padStart(2, '0');
      const currentMinute = minutes.toString().padStart(2, '0');
      const currentSecond = seconds.toString().padStart(2, '0');

      const timeString = `${currentHour24}:${currentMinute}:${currentSecond}`;
      const timeDigits = [currentHour24[0], currentHour24[1], currentMinute[0], currentMinute[1], currentSecond[0], currentSecond[1]];

      if (timeString !== prevTime || dateString !== prevDate) {
        const idsToTransition = ['h1', 'h2', 'm1', 'm2'];
        if (currentMinute !== prevMinute || dateString !== prevDate) {
          idsToTransition.push('s1', 's2');
          document.title = `${currentHour24}:${currentMinute}`;
        }

        idsToTransition.forEach((id, index) => {
          const element = document.getElementById(id);
          if (element.innerText !== timeDigits[index]) {
            element.classList.add("digit-transition");
            setTimeout(() => {
              element.innerText = timeDigits[index];
              element.classList.remove("digit-transition");
            }, 300);
          }
        });

        if (currentMinute === prevMinute && dateString === prevDate) {
          document.getElementById('s1').innerText = timeDigits[4];
          document.getElementById('s2').innerText = timeDigits[5];
        }

        if (dateString !== prevDate) {
          const dateElement = document.getElementById('date-content');
          dateElement.classList.add("digit-transition");
          setTimeout(() => {
            dateElement.innerText = dateString;
            dateElement.classList.remove ("digit-transition");
          }, 300);
        } else {
          document.getElementById('date-content').innerText = dateString;
        }

        prevTime = timeString;
        prevMinute = currentMinute;
        prevDate = dateString;

        updateFavicon(currentHour24, currentMinute);
      }
    }

    clearInterval(updateInterval);
    updateInterval = setInterval(updateTimeAndDate, 1000);
    updateTimeAndDate();
  });

  function applySettings(settings) {
    if (settings.bgColor) {
      document.getElementById('background-layer').style.backgroundColor = settings.bgColor;
    }
    if (settings.font) {
      document.body.style.fontFamily = settings.font;
    }
    if (settings.fontColor) {
      document.getElementById('time-date-container').style.color = settings.fontColor;
      const urlLinks = document.querySelectorAll('#urlContainer a');
      urlLinks.forEach(url => {
        url.style.color = settings.fontColor;
      });
    }
    if (settings.bgImage) {
      document.getElementById('background-layer').style.backgroundImage = `url(${settings.bgImage})`;
    }
    if (settings.bgImageStyle) {
      const layer = document.getElementById('background-layer');
      const style = settings.bgImageStyle;
      layer.style.backgroundSize = style.size || 'cover';
      layer.style.backgroundRepeat = style.repeat || 'no-repeat';
      layer.style.filter = `brightness(${style.brightness || 1}) contrast(${style.contrast || 1})`;
      layer.style.opacity = style.opacity || 1;
    }
  }

  chrome.storage.local.get(['bgColor', 'font', 'fontColor', 'urls', 'bgImage', 'bgImageStyle'], function(items) {
    applySettings(items);

    const urls = items.urls || [];
    const urlContainer = document.getElementById('urlContainer');
    urlContainer.innerHTML = '';
    urls.forEach(function(urlObj) {
      const urlElement = document.createElement('a');
      urlElement.href = urlObj.url;
      urlElement.textContent = urlObj.title;
      urlContainer.appendChild(urlElement);
    });
  });

  chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (var key in changes) {
      const newValue = changes[key].newValue;
      if (key === 'bgColor') {
        document.getElementById('background-layer').style.backgroundColor = newValue;
      } else if (key === 'font') {
        document.body.style.fontFamily = newValue;
      } else if (key === 'fontColor') {
        document.getElementById('time-date-container').style.color = newValue;
        const urlLinks = document.querySelectorAll('#urlContainer a');
        urlLinks.forEach(url => {
          url.style.color = newValue;
        });
      } else if (key === 'bgImage') {
        document.getElementById('background-layer').style.backgroundImage = newValue ? `url(${newValue})` : '';
      } else if (key === 'bgImageStyle') {
        const layer = document.getElementById('background-layer');
        if (newValue) {
          layer.style.backgroundSize = newValue.size || 'cover';
          layer.style.backgroundRepeat = newValue.repeat || 'no-repeat';
          layer.style.filter = `brightness(${newValue.brightness || 1}) contrast(${newValue.contrast || 1})`;
          layer.style.opacity = newValue.opacity || 1;
        }
      } else if (key === 'urls') {
        const urlContainer = document.getElementById('urlContainer');
        if (urlContainer) {
          urlContainer.innerHTML = '';
          const urls = newValue || [];
          urls.forEach(function(urlObj) {
            const urlElement = document.createElement('a');
            urlElement.href = urlObj.url;
            urlElement.textContent = urlObj.title;
            // Apply current font color to match existing links
            const currentFontColor = document.getElementById('time-date-container').style.color;
            if (currentFontColor) {
              urlElement.style.color = currentFontColor;
            }
            urlContainer.appendChild(urlElement);
          });
        }
      }
    }
  });

  function applySize(size) {
    const timeElement = document.getElementById('current-time');
    const dateElement = document.getElementById('current-date');
    
    timeElement.style.fontSize = `${size}px`;
    dateElement.style.fontSize = `${size * 0.6}px`;
  }

  function updateFavicon(hour, minute) {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const bgColor = isDarkMode ? 'black' : 'white';
    const textColor = isDarkMode ? 'white' : 'black';

    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 16, 16);

    ctx.fillStyle = textColor;
    ctx.font = '10px Arial';

    ctx.fillText(hour, 2, 8);
    ctx.fillText(minute, 2, 16);

    const favicon = document.getElementById('dynamicFavicon');
    favicon.href = canvas.toDataURL('image/png');
  }

  chrome.storage.local.get(['size'], function(items) {
    if (items.size) {
      applySize(items.size);
    }
  });

  chrome.storage.onChanged.addListener(function(changes) {
    if (changes.size) {
      applySize(changes.size.newValue);
    }
  });

  // Welcome modal logic - show only once on first install
  chrome.storage.local.get(['hasSeenWelcome'], function(items) {
    if (!items.hasSeenWelcome) {
      const modal = document.getElementById('welcome-modal');
      const closeBtn = document.getElementById('welcome-close');
      
      // Show modal after a short delay
      setTimeout(() => {
        modal.classList.add('show');
        const closeBtn = modal.querySelector('.modal-button');
        if (closeBtn) closeBtn.focus();
      }, 800);

      // Keyboard accessibility
      const handleKeydown = function(e) {
        if (e.key === 'Escape') {
          modal.classList.remove('show');
          chrome.storage.local.set({ 'hasSeenWelcome': true });
          document.removeEventListener('keydown', handleKeydown);
        }
      };
      document.addEventListener('keydown', handleKeydown);

      closeBtn.addEventListener('click', function() {
        modal.classList.remove('show');
        chrome.storage.local.set({ 'hasSeenWelcome': true });
        document.removeEventListener('keydown', handleKeydown);
      });

      // Close on background click
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          modal.classList.remove('show');
          chrome.storage.local.set({ 'hasSeenWelcome': true });
          document.removeEventListener('keydown', handleKeydown);
        }
      });
    }
  });
})();
