(function() {
  let prevTime = "00:00:00";
  let prevMinute = "00";
  let prevDate = "";

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
            dateElement.classList.remove("digit-transition");
          }, 300);
        } else {
          document.getElementById('date-content').innerText = dateString;
        }

        prevTime = timeString;
        prevMinute = currentMinute;
        prevDate = dateString;
      }
    }

    setInterval(updateTimeAndDate, 1000);
    updateTimeAndDate();

    function updateFavicon() {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');

      // Draw background
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw time
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      ctx.font = '10px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText(hours, 2, 8);
      ctx.fillText(minutes, 2, 16);

      // Update favicon
      const favicon = document.getElementById('dynamicFavicon');
      favicon.href = canvas.toDataURL('image/png');
    }

    // Call the function every minute
    setInterval(updateFavicon, 30000);

    // Call it once immediately to set the initial favicon
    updateFavicon();
  });

  function applySettings(settings) {
    if (settings.bgColor) {
      document.body.style.backgroundColor = settings.bgColor;
    }
    if (settings.font) {
      document.body.style.fontFamily = settings.font;
    }
    if (settings.bgColor) {
      document.getElementById('background-layer').style.backgroundColor = `rgba(${settings.bgColor}, 0.5)`;
    }
    if (settings.fontColor) {
      const urlLinks = document.querySelectorAll('.url-link');
      urlLinks.forEach(url => {
        url.style.color = settings.fontColor;
      });
    }
  }

  chrome.storage.local.get(['bgColor', 'font', 'urls'], function(items) {
    applySettings(items);
  
    // Display saved URLs
    const urls = items.urls || [];
    const urlContainer = document.getElementById('urlContainer');
    urlContainer.innerHTML = ''; // Clear existing URLs
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
        document.body.style.backgroundColor = newValue;
      } else if (key === 'font') {
        document.body.style.fontFamily = newValue;
      }
    }
  });
})();
