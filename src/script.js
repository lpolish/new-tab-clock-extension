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
          document.title = `${currentHour24}:${currentMinute}`;  // 24-hour format without seconds
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
  });
})();
