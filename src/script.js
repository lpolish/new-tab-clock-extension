(function() {
  document.addEventListener('DOMContentLoaded', function() {
    function updateTimeAndDate() {
      const now = new Date();
      const timeString = now.toLocaleTimeString();
      const dateString = now.toLocaleDateString();
      document.getElementById('current-time').innerText = timeString;
      document.getElementById('current-date').innerText = dateString;
    }
    setInterval(updateTimeAndDate, 1000);
    updateTimeAndDate();
  });
})();
